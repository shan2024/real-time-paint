import React, {useState, useEffect, useRef} from 'react'
import { CanvasMenu } from './CanvasMenu';
import { io, Socket } from "socket.io-client";
import cryptoRandomString from 'crypto-random-string';
import { useRouter } from 'next/router';

interface CanvasState {
  clientCode: string
  lineWidth: number,
  strokeStyle: string,
  globalAlpha: number,
  path: CanvasPos[]
}

interface CanvasPos {
  xPos: number,
  yPos: number
}

// This component defines a guest canvas for guest users
const Canvas = ({roomCode}:{roomCode:string}) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const router = useRouter();

  const [drawing, setDrawing] = useState(false);
  const [width, setWidth] = useState(10);
  const [color, setColor] = useState('black');
  const [opacity, setOpacity] = useState(1);
  const [socket, setSocket] = useState<Socket>();
  const [canvasState, setCanvasState] = useState<CanvasState>({
    clientCode: cryptoRandomString({length: 10, type: 'url-safe'}),
    lineWidth: 10,
    strokeStyle: 'black',
    globalAlpha: 1,
    path: []
  })

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
  }, [])

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
    setCanvasState(prevState => ({...prevState, globalAlpha: opacity}));
    setCanvasState(prevState => ({...prevState, strokeStyle: color}));
    setCanvasState(prevState => ({...prevState, lineWidth: width}));
    setCanvasState(prevState => ({...prevState, path: [...prevState.path, {xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY}] }));

    context.current?.beginPath();
    context.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  }

  // Stop drawing on the canvas
  function stopDraw(e: any) {
    // Send packet to server
    socket?.emit("client_canvas_state", canvasState);
    setCanvasState(prevState => ({...prevState, path: [] }));

    context.current?.closePath();
    setDrawing(false);
  }

  function draw(e:any) {
    if (!drawing) {
      return;
    }
    setCanvasState(prevState => ({...prevState, path: [...prevState.path, {xPos: e.nativeEvent.offsetX, yPos: e.nativeEvent.offsetY}] }));
    context.current?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    context.current?.stroke();

  }


  // Draw the packet given by the server
  function drawPacket(arg: CanvasState) {
    // Check that we do not recieve our own message
    if (arg.clientCode === canvasState.clientCode) {
      return;
    }
    // Need to save state of current drawing, then draw the packet, then resume
    // execution of current drawing

    // Save state
    const oldWidth = width;
    const oldColor = color;
    const oldAlpha = opacity;
    // context.current?.closePath();

    // Set new state
    if (context.current !== undefined && context.current !== null) {
      context.current.globalAlpha = arg.globalAlpha;
      context.current.strokeStyle = arg.strokeStyle;
      context.current.lineWidth = arg.lineWidth;    
    } 
    context.current?.beginPath();

    // Draw line
    if (arg.path.length > 0) {
      context.current?.moveTo(arg.path[0].xPos, arg.path[0].yPos);
      arg.path.forEach((value:CanvasPos) => {
        context.current?.lineTo(value.xPos, value.yPos);
      })
      context.current?.stroke();
    }
    context.current?.closePath();

    // Restore state
    if (context.current !== undefined && context.current !== null) {
      setWidth(oldWidth);
      setColor(oldColor);
      setOpacity(oldAlpha);
    }    
  }

  
  function initCanvas(arg: CanvasState[]) {
    arg.forEach((state:CanvasState) => {
      drawPacket(state);
    });
  }

  // Clears the entire canvas
  function clearCanvas() {
    console.log("clearning canvas")
    if (context.current !== null && canvas.current !== null) {
      context.current.clearRect(0, 0, canvas.current.width, canvas.current.height)
    }
  }

  function sendClearMessage() {
    console.log("sent clearning canvas")

    socket?.emit("client_clear");
  }

  return (
    <div>
      <CanvasMenu setColor={setColor} setWidth={setWidth} setOpacity={setOpacity} setClear = {() => sendClearMessage()}/>
      <canvas onMouseDown={startDraw} onMouseUp={stopDraw} onMouseMove={draw} ref ={canvas} width='1280px' height='720px' className='bg-white'>
      </canvas>
    </div>
  )
}

export default Canvas;
