import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus } from "react-icons/fa";
import { PiDiamondsFourLight } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import Confirmation from './Confirmation';

const Tasks = ({ grade, section }) => {

    const [tasks, setTasks] = useState([])
    const [found, setFound] = useState(false)
    const [toggleOptions, setToggleOptions] = useState(false)
    const [selected, setSelected] = useState(null)
    const [editing, setEditing] = useState(false)
    const [task, setTask] = useState('')
    const [expireDate, setExpireDate] = useState('')
    const types = ['vocab', 'homework', 'paragraph', 'listening']
    const [deletingData, setDeletingData] = useState([])
    const [confirm, setConfirm] = useState(false)

    const navigate = useNavigate()

    const requestTasks = () => {
        const response = axios.post("https://e-scholars.com/teacher/tasks/class_tasks.php", { grade, section }, {withCredentials: true})
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    setFound(data.found)
                    setTasks(data.task)
                }
            })
            .catch((err)=> {
                if(!err.response.data.authenticated){
                    navigate('/login')
                }
            })
    }
    const deleteTasks = (id) => {
        const response = axios.post("https://e-scholars.com/teacher/tasks/remove_task.php", { grade, section, id }, {withCredentials: true})
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    setConfirm(false)
                    requestTasks()
                }
            })
            .catch((err)=> {
                if(!err.response.data.authenticated){
                    navigate('/login')
                }
            })
    }
    const editTask = (id, expire_date, task) => {
        const response = axios.post("https://e-scholars.com/teacher/tasks/update_task.php", { grade, section, id, expire_date, task }, {withCredentials: true})
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    requestTasks()
                }
            })
            .catch((err)=> {
                if(!err.response.data.authenticated){
                    navigate('/login')
                }
            })
    }

    useEffect(() => {
        requestTasks()
    }, [])


    return (
        <>
        {confirm && <Confirmation type={'task'} data={deletingData} handler={deleteTasks} cancelHandler={setConfirm}/>}
        <div className='w-full flex flex-col gap-6'>
            <div className='flex w-full justify-between items-center'>
                <p className='text-[#054bb4] text-3xl font-bold'>Tasks</p>
                <Link to={`/class/${grade}/${section}/add_task`}>
                    <button title='add class' className='text-[#054bb4] ml-5 max-md:ml-1 w-[40px] h-[40px] rounded-full hover:bg-slate-200 flex gap-2 items-center justify-center'>
                        <FaPlus size={20} />
                    </button>
                </Link>
            </div>
            {!found && <div className='w-full flex justify-center'>
                <p className='font-bold text-2xl text-slate-600 text-center'> No tasks yet</p>
            </div>}
            <div className='grid sm:grid-cols-2 grid-cols-1 gap-5 justify-around'>
                {
                    found && types.map((type) => (

                        tasks.filter((item) => item.category == type).length != 0 && (
                            <div key={type} className='flex flex-col w-full bg-white border-2 border-[#054bb4] p-4  gap-4 rounded-md'>
                                <p className='text-center text-2xl text-[#054bb4] font-bold capitalize'>{type}</p>
                                {
                                    tasks.map((item) => {
                                        const date = new Date(item.Expire_date * 1000)
                                        return (
                                            item.category == type && (
                                                <div key={item.id} className='flex justify-between gap-3 relative '>
                                                    <div className='flex flex-1 flex-col gap-1'>
                                                        <div className='w-full flex gap-2'>
                                                            <div className='w-[20px] pt-[5px]'>
                                                            <PiDiamondsFourLight size={20} className='text-[#054bb4]' />
                                                            </div>
                                                            {selected == item.id && editing ? (
                                                                <input type='text' defaultValue={item.task} className='border-2 text-xl w-full border-b-[#054bb4] outline-none border-white rounded-md '
                                                                    onChange={(e) => setTask(e.target.value)}
                                                                />
                                                            ) : (
                                                                <p className='text-xl font-semibold break-words'>{item.task}</p>
                                                            )}
                                                        </div> 
                                                        <div className='flex w-full flex-col text-slate-600 pl-7'>
                                                            {selected == item.id && editing ?
                                                                <div className=' flex gap-2 text-sm mt-1'>
                                                                    <span>Expires on </span>
                                                                    <input type='date' defaultValue={`${date.getFullYear()}-${date.getMonth() <=9 ? `0${date.getMonth()+1}` : date.getMonth()}-${date.getDate()}`}
                                                                        onChange={(e) => {
                                                                            const newDate = new Date(e.target.value).getTime() / 1000
                                                                            setExpireDate(newDate)
                                                                        }}
                                                                    />
                                                                </div>
                                                                :
                                                                <p className='text-sm'>Expires on {date.getDate()}-{date.getMonth()+1}-{date.getFullYear()}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        editing && selected == item.id ? (
                                                            <div className='justify-center flex cursor-pointer select-none'
                                                                onClick={() => {
                                                                    if (task != '' && expireDate != '') {
                                                                        editTask(item.id, expireDate, task)
                                                                    }
                                                                    else {
                                                                        if (task == '' && expireDate != '') {
                                                                            editTask(item.id, expireDate, item.task)
                                                                        }
                                                                        else if (task != '' && expireDate == '') {
                                                                            editTask(item.id, date.getTime()/1000, task)
                                                                        }
                                                                        else {
                                                                            editTask(item.id, date.getTime()/1000, item.task)
                                                                        }
                                                                    }
                                                                    setExpireDate('')
                                                                    setTask('')
                                                                    setEditing(false)
                                                                }}
                                                            >
                                                                <FaRegCircleCheck size={25} className='text-[#054bb4]' />
                                                            </div>
                                                        ) : (
                                                            <div className='justify-center h-fit hover:bg-slate-200 p-2 rounded-full flex cursor-pointer select-none'
                                                                onClick={() => {
                                                                    setSelected(item.id)
                                                                    setToggleOptions(!toggleOptions)
                                                                }}
                                                            >
                                                                <BsThreeDotsVertical />
                                                            </div>
                                                        )
                                                    }
                                                    <div className={`absolute w-[180px] right-10 flex-col bg-white shadow-md p-3  divide-y-2 z-[90] rounded-md select-none ${toggleOptions && item.id == selected ? 'flex' : 'hidden'}`}>
                                                        <div className='flex gap-2 items-center cursor-pointer p-2 text-lg'
                                                            onClick={() => {
                                                                setToggleOptions(false)
                                                                setSelected(item.id)
                                                                setEditing(true)
                                                                setTask(item.task)
                                                            }}
                                                        >
                                                            <MdEdit />
                                                            Edit
                                                        </div>
                                                        <div className='flex gap-2 items-center text-red-500 cursor-pointer p-2 text-lg'
                                                            onClick={() => {
                                                                setToggleOptions(false)
                                                                setDeletingData([item.id, item.task])
                                                                setConfirm(true)
                                                            }}
                                                        >
                                                            <FaTrashAlt />
                                                            Delete
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    })
                                }
                            </div>
                        )
                    ))}
            </div>
        </div>
        </>
    )
}

export default Tasks