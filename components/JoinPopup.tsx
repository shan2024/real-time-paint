import React from 'react'
const inputCssClass: string = `relative block w-[50%] appearance-none rounded-none rounded-t-md rounded-b-md
 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#239a8f] 
 focus:outline-none focus:ring-[#239a8f] sm:text-sm`;

export const JoinPopup = ({setPopup, joinRoom}: {setPopup: ()=>void, joinRoom: (e:Event) =>void}) => {
  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start md:items-center justify-center">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 text-center" id="modal-title">Enter Room Code</h3>
                  </div>
                </div>
              </div>
              <form className='mt-4  flex flex-col justify-center items-center' onSubmit={(e:any)=>joinRoom(e)}>
                  <input id="code" name="code" type="text" required 
                  className={inputCssClass} placeholder="Code"/>
                  <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="submit" className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#49beb7] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#239a8f] focus:outline-none focus:ring-2 focus:ring-[#239a8f] focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Enter</button>
                    <button type="button" onClick ={setPopup} className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#239a8f] focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                  </div>
              </form>
          
            </div>
          </div>
  </div>
</div>
  )
}
