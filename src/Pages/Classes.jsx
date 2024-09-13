import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Link } from 'react-router-dom'
import image2 from '../assets/image-3.jpg'
import Confirmation from '../Components/Confirmation';


const Classes = () => {
    const [classes, setClasses] = useState([])
    const [found, setFound] = useState(false)
    const [deletingData, setDeletingData] = useState([])
    const [confirm, setConfirm] = useState(false)

    const [toggleOptions, setToggleOptions] = useState(false)
    const [selected, setSelected] = useState('')

    const requestGrades = () => {
        const response = axios.post("https://e-scholars.com/teacher/classes/current_classes.php", {}, {withCredentials: true})
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    setFound(data.found)
                    const classes = data.classes
                    setClasses(classes.sort())
                }
            })
    }
    const deleteGrade = (grade, section) => {
        const response = axios.post("https://e-scholars.com/teacher/classes/remove_grade.php", { grade, section }, {withCredentials: true})
            .then((res) => {
                if (res.data.status == 'OK') {
                    requestGrades()
                    setConfirm(false)
                }
            })
    }

    useEffect(() => {
        requestGrades()
    }, [])

    return (
        <div className='w-full h-screen flex flex-col gap-5 items-center bg-cover relative bg-gradient-to-t from-black to-transparent'>
            <img src={image2} alt="" className='z-0 fixed w-full h-screen object-cover' />
            {confirm && <Confirmation type={'class'} data={deletingData} handler={deleteGrade} cancelHandler={setConfirm} />}
            <div className='grid grid-cols-2 justify-center gap-5 mt-[80px] z-20 container px-6'>
                <Link to={'/'}>
                    <button className='bg-[#054bb4] hover:bg-[#065ad9] text-white   w-full py-3 rounded-full  text-2xl font-bold cursor-pointer'>
                        Classes
                    </button>
                </Link>
                <Link to={'/quizzes'}>
                    <button className='bg-white hover:bg-slate-100 text-[#054bb4] w-full py-3 rounded-full text-2xl font-bold cursor-pointer'>
                        Quizzes
                    </button>
                </Link>
            </div>
            <div className='z-10 container w-full h-screen flex flex-col  pb-[90px] px-6 gap-4 items-center'>
                <div className='flex w-full justify-end items-center'>
                    <Link to={'/add_class'}>
                        <button className='text-[#054bb4] ml-5 max-md:ml-1 w-[50px] h-[50px] rounded-full bg-white flex gap-2 items-center justify-center'>
                            <FaPlus size={20} />
                        </button>
                    </Link>
                </div>

                <div className='w-full grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 gap-6 select-none p-4 '>
                    {
                        found && classes.map((item, index) => (
                            <div key={index} className='relative group lg:transition lg:ease-in-out lg:delay-150 lg:hover:-translate-y-1 lg:hover:scale-110 lg:duration-300'>
                                <Link to={`/class/${item[0]}/${item[1]}`}>
                                    <div className='w-full h-[200px] flex justify-center items-center bg-white rounded-md cursor-pointer '>
                                        <p className='text-[80px] font-black text-[#054bb4] uppercase'>{item[0]} {item[1]}</p>
                                    </div>
                                </Link>
                                <BsThreeDotsVertical size={35} className='absolute z-[80] text-[#054bb4] top-2 right-2 cursor-pointer hover:bg-slate-200 p-2 rounded-full'
                                    onClick={(e) => {
                                        setToggleOptions(!toggleOptions)
                                        setSelected(index)
                                    }}
                                />
                                <button className={`absolute right-[-10px] top-[50px] z-[90] drop-shadow-md  items-center gap-2 w-[180px] px-3 py-1 bg-white text-lg text-red-600 font-medium rounded-md ${(toggleOptions && selected == index) ? 'flex' : 'hidden'}`}
                                    onClick={() => {
                                        setDeletingData([item[0], item[1]])
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
            </div>
        </div>
    )
}

export default Classes