import React from 'react'

const Confirmation = ({ type, data, handler, cancelHandler }) => {
    return (
        <div className={`fixed top-0 left-0 bg-black bg-opacity-75 w-full h-full flex justify-center items-center z-[90] ${type == 'message' && 'rounded-t-md'}`}>
            <div className={`bg-white ${type == 'message' ? 'w-[90%]' : 'md:w-1/3 max-md:w-[90%]'} flex flex-col gap-8 justify-between rounded-md p-4`}>
                <div className='flex flex-col gap-3'>
                    {type == 'class' && <p className='font-bold text-[#054bb4] text-2xl'>Delete grade {data[0]} section {data[1]}? </p>}
                    {type == 'class' && <p className='text-slate-600'>All data including students, tasks, materials, sessions, and quizes will be permanently deleted </p>}
                    {type == 'student' && <p className='font-bold text-[#054bb4] text-2xl'>Delete student {data[0]} grade {data[1]} section {data[2]}? </p>}
                    {type == 'student' && <p className='text-slate-600'>All data related to this student will be permanently deleted </p>}
                    {type == 'message' && <p className='font-bold text-[#054bb4] text-md'>Do you want to delete this message? </p>}
                    {type == 'quiz' && <p className='font-bold text-[#054bb4] text-2xl'>Delete {data[1]}?  </p>}
                    {type == 'quiz' && <p className='text-slate-600' >All data related to this quiz will be permanently deleted </p>}
                    {type == 'task' && <p className='font-bold text-[#054bb4] text-2xl'>Delete {data[1]} task?  </p>}
                    {type == 'task' && <p className='text-slate-600' >All data related to this task will be permanently deleted </p>}
                    {type == 'session' && <p className='font-bold text-[#054bb4] text-2xl'>Delete this session date?  </p>}
                    {type == 'session' && <p className='text-slate-600' >This session date will be permanently deleted </p>}
                    {type == 'material' && <p className='font-bold text-[#054bb4] text-2xl'>Delete {data[1]}?  </p>}
                    {type == 'material' && <p className='text-slate-600' >This material will be permanently deleted </p>}
                </div>

                <div className={`flex justify-end gap-6 font-medium ${type == 'message' ? 'text-base' : 'text-lg'}`}>
                    <button
                        onClick={() => {
                            cancelHandler(false)
                        }}
                    >
                        Cancel
                    </button>
                    <button className='text-red-500'
                        onClick={() => {
                            type == 'class' && handler(data[0], data[1])
                            type == 'student' && handler(data[0], data[1], data[2])
                            type == 'message' && handler(data[0], data[1], data[2])
                            type == 'quiz' && handler(data[0], data[1])
                            type == 'task' && handler(data[0])
                            type == 'session' && handler(data[0])
                            type == 'material' && handler(data[0])
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Confirmation