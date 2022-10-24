import React, {useState, useEffect, useRef} from 'react'
import { CanvasMenu } from './CanvasMenu';
import { io, Socket } from "socket.io-client";
import cryptoRandomString from 'crypto-random-string';
import { useRouter } from 'next/router';

interface CanvasState {
  clientCode: string
  lineWidth: number,
  strokeStyle: string | CanvasGradient | CanvasPattern,
  globalAlpha: number,
  path: CanvasPos[]
}

interface CanvasPos {
  xPos: number,
  yPos: number
}

var currPos : CanvasPos = {xPos:0, yPos:0};

// This component defines a guest canvas for guest users
const Canvas = ({roomCode}:{roomCode:string}) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const router = useRouter();

  const [drawing, setDrawing] = useState(false);
  const [width, setWidth] = useState(50);
  const [color, setColor] = useState<string | CanvasGradient | CanvasPattern>('black');
  const [opacity, setOpacity] = useState(1);
  const [socket, setSocket] = useState<Socket>();
  const [canvasState, setCanvasState] = useState<CanvasState>({
    clientCode: cryptoRandomString({length: 10, type: 'url-safe'}),
    lineWidth: 10,
    strokeStyle: 'black',
    globalAlpha: 1,
    path: []
  })

  //const [currPos, setCurrPos] = useState<CanvasPos>({xPos: 0, yPos:0});
  //const [currY, setCurrY] = useState(0);

  // On load of canvas, we need to connect to the external canvas and 
  // start recieving information about the canvas, we also need to 
  // send the server data about the current state of our canvas
  useEffect(()=> {
    // Connect to canvas server
    var connection = io(`${process.env.NEXT_PUBLIC_SERVER_NAME}`);
    connection.on('server_canvas_state', drawPacket)
    connection.on('server_clear', clearCanvas);
    connection.on('server_canvas_default', initCanvas);
    connection.emit("join_room", router.asPath.substring(8));
    setSocket(connection);
  },[])

  // Set parameters for the canvas
  useEffect(() => {
    const canvasContext = canvas.current?.getContext("2d");
    if (canvasContext !== null && canvasContext !== undefined) {
      canvasContext.lineCap = "round";
      canvasContext.lineJoin = "round";
      canvasContext.globalAlpha = opacity;
	    canvasContext.strokeStyle = color;
	    canvasContext.lineWidth = width;    
      context.current = canvasContext;
    }
  }, [width, color, opacity]) 

  // Start drawing on the canvas
  function startDraw(e: any) {
    // canvasState.globalAlpha = opacity;
    // canvasState.lineWidth = width;
    // canvasState.strokeStyle = color;
    // canvasState.path.push({xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY});
    setCanvasState(prevState => ({...prevState, globalAlpha: opacity}));
    setCanvasState(prevState => ({...prevState, strokeStyle: color}));
    setCanvasState(prevState => ({...prevState, lineWidth: width}));
    setCanvasState(prevState => ({...prevState, path: [...prevState.path, {xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY}] }));

    context.current?.beginPath();
    context.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
    //setCurrPos({xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY});
    //currPos = {xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY}

  }

  // Stop drawing on the canvas
  function stopDraw(e: any) {
    // Send packet to server
    //canvasState.path = [];
    setCanvasState(prevState => ({...prevState, path: [] }));
    socket?.emit("client_canvas_state", canvasState);
    context.current?.closePath();

    setDrawing(false);
    //setCurrPos({xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY});
    //currPos = {xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY}

  }

  function draw(e:any) {
    if (!drawing) {
      return;
    }
    //canvasState.path.push({xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY});

    setCanvasState(prevState => ({...prevState, path: [...prevState.path, {xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY}] }));
    context.current?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    context.current?.stroke();
    //currPos = {xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY}
    //setCurrPos({xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY});
    //console.log(currPos)
    //setCurrY(e.nativeEvent.offsetY);
  }


  // Draw the packet given by the server
  function drawPacket(arg: CanvasState) {
    // Check that we do not recieve our own message
    if (arg.clientCode === canvasState.clientCode) {
      return;
    }

    // Need to save state of current drawing, then draw the packet, then resume
    // execution of current drawing
    if (context.current !== undefined && context.current !== null) {
      // Save state
      const oldWidth = context.current.lineWidth;
      const oldColor = context.current.strokeStyle;
      const oldAlpha = context.current.globalAlpha;

      // Set new state
      context.current.globalAlpha = arg.globalAlpha;
      context.current.strokeStyle = arg.strokeStyle;
      context.current.lineWidth = arg.lineWidth;

      context.current.closePath();
      context.current.beginPath();
      // Draw line
      if (arg.path.length > 0) {
        context.current.moveTo(arg.path[0].xPos, arg.path[0].yPos);
        arg.path.forEach((value: CanvasPos) => {
          context.current?.lineTo(value.xPos, value.yPos);
        })
        context.current.stroke();
      }
      context.current.closePath();
      context.current.beginPath();

      // Restore state
      context.current.globalAlpha = oldAlpha;
      context.current.strokeStyle = oldColor;
      context.current.lineWidth = oldWidth;
    }    
  }


  
  function initCanvas(arg: CanvasState[]) {
    arg.forEach((state:CanvasState) => {
      drawPacket(state);
    });
  }

  // Clears the entire canvas
  function clearCanvas() {
    if (context.current !== null && canvas.current !== null) {
      context.current.clearRect(0, 0, canvas.current.width, canvas.current.height)
    }
  }

  function sendClearMessage() {
    socket?.emit("client_clear");
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <CanvasMenu setColor={setColor} setWidth={setWidth} setOpacity={setOpacity} width ={width} setClear = {() => sendClearMessage()}/>
      <canvas onMouseDown={startDraw} onMouseUp={stopDraw} onMouseMove={draw} ref ={canvas} width='1000px' height='600px' className='bg-white mb-6 ml-6'>
      </canvas>
    </div>
  )
}

export default Canvas;
