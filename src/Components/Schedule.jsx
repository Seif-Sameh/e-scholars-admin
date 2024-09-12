import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import Confirmation from './Confirmation';
import axios from 'axios';

const Schedule = ({ grade, section }) => {

    const [schedule, setSchedule] = useState([])
    const [found, setFound] = useState(false)

    const [deletingData, setDeletingData] = useState([])
    const [confirm, setConfirm] = useState(false)

    const [toggleOptions, setToggleOptions] = useState(false)
    const [selected, setSelected] = useState('')

    const requestSchedule = () => {
        const response = axios.post("https://e-scholars.com/teacher/classes/class_schedule.php", { grade, section })
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    setSchedule(data.schedule)
                    setFound(data.found)
                }
            })
    }
    const deleteSchedule = (id) => {
        const response = axios.post("https://e-scholars.com/teacher/classes/remove_schedule.php", { id })
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    setConfirm(false)
                    requestSchedule()
                }
            })
    }

    useEffect(() => {
        requestSchedule()
    }, [])

    return (
        <>
            {confirm && <Confirmation type={'session'} data={deletingData} handler={deleteSchedule} cancelHandler={setConfirm} />}
            <div className='w-full flex flex-col gap-6'>
                <div className='flex w-full justify-between items-center'>
                    <p className='text-[#054bb4] text-3xl font-bold'>Schedule</p>
                    <Link to={`/class/${grade}/${section}/add_session`}>
                        <button title='add class' className='text-[#054bb4] ml-5 max-md:ml-1 w-[40px] h-[40px] rounded-full hover:bg-slate-200 flex gap-2 items-center justify-center'>
                            <FaPlus size={20} />
                        </button>
                    </Link>
                </div>
                {
                    found ? (
                        <div className='flex flex-col gap-4'>
                            {
                                schedule && schedule.map((item, index) => (
                                    <div key={item.id} className='w-full px-3 py-2 flex justify-between rounded-r-full border-[6px] border-white border-l-[#054bb4] relative'>
                                        <div className='flex flex-col gap-1'>
                                            <span className='text-xl font-bold text-[#054bb4] capitalize'>{item.day}</span>
                                            <div>
                                                <span> {item.from}</span>
                                                <span> - </span>
                                                <span>{item.to}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <BsThreeDotsVertical size={35} className='z-[80] text-[#054bb4] cursor-pointer hover:bg-slate-200 p-2 rounded-full'
                                                onClick={(e) => {
                                                    setToggleOptions(!toggleOptions)
                                                    setSelected(index)
                                                }} />
                                        </div>
                                        <button className={`absolute w-[180px] right-[-5px] top-[50px] z-[90] drop-shadow-md  items-center gap-2 p-3 bg-white hover:bg-slate-200 text-red-600 text-lg rounded-md ${(toggleOptions && selected == index) ? 'flex' : 'hidden'}`}
                                            onClick={() => {
                                                setDeletingData([item.id])
                                                setConfirm(true)
                                                setToggleOptions(false)
                                            }}
                                        >
                                            <FaTrashAlt />
                                            <span >Delete</span>
                                        </button>
                                    </div>
                                ))
                            }


                        </div>
                    ) : (
                        <p className='text-center font-bold text-2xl text-slate-600'>No schedule yet</p>
                    )
                }
            </div>
        </>
    )
}

export default Schedule