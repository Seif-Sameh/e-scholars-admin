import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { FaTrashAlt } from 'react-icons/fa'
import { IoMdStopwatch } from "react-icons/io"
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseFill } from "react-icons/ri";
import { ImCheckboxUnchecked } from "react-icons/im";
import { ImCheckboxChecked } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { GrStatusGoodSmall } from "react-icons/gr";
import axios from 'axios'

const Quizzes = () => {

    const params = useParams()
    const grade = Number(params['grade'])
    const section = params['section']

    const [found, setFound] = useState(false)
    const [classQuizzes, setClassQuizzes] = useState([])
    const [toggleOptions, setToggleOptions] = useState(false)
    const [selected, setSelected] = useState('')
    const [allQuizzes, setAllQuizzes] = useState([])
    const [includeMode, setIncludeMode] = useState(false)

    const requestQuizes = () => {
        axios.post('http://localhost/academic/admin/quizzes/class_quizzes.php', { grade, section })
            .then((res) => {
                if (res.data.status === 'OK') {
                    setFound(res.data.found)
                    res.data.found && setClassQuizzes(res.data.class_quizzes)
                }
                console.log(res.data)
            })
    }
    const requestAllQuizzes = () => {
        const response = axios.post("http://localhost/academic/admin/quizzes/retrieve_quizzes.php")
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    console.log(data)
                    setAllQuizzes(data.quizzes)
                    setIncludeMode(true)
                }
            })
    }
    const includeQuizzes = () => {
        const response = axios.post("http://localhost/academic/admin/quizzes/include_quizzes.php", { grade, section, quizzes: classQuizzes.map((q) => q.quiz_id) })
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    requestQuizes()
                }
            })
    }
    const activateQuiz = (quiz_id) => {
        const response = axios.post("http://localhost/academic/admin/quizzes/activate_quiz.php", { grade, section, quiz_id })
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    requestQuizes()
                }
            })
    }
    const deactivateQuiz = (quiz_id) => {
        const response = axios.post("http://localhost/academic/admin/quizzes/deactivate_quiz.php", { grade, section, quiz_id })
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    requestQuizes()
                }
            })
    }


    useEffect(() => {
        requestQuizes()
    }, [])

    console.log(classQuizzes)

    return (
        <>
            <div className='w-full flex flex-col gap-6'>
                <div className='flex w-full justify-between items-center'>
                    <p className='text-[#054bb4] text-3xl font-bold'>Quizes</p>
                    {!includeMode ? (<button title='add quiz' className='text-[#054bb4] ml-5 max-md:ml-1 w-[40px] h-[40px] rounded-full hover:bg-slate-200 flex gap-2 items-center justify-center'
                        onClick={() => {
                            requestAllQuizzes()
                        }}
                    >
                        <FaPlus size={20} />
                    </button>)
                        :
                        (
                            <button title='cancel' className='text-[#054bb4] ml-5 max-md:ml-1 w-[40px] h-[40px] rounded-full bg-white flex gap-2 items-center justify-center'
                                onClick={() => {
                                    setIncludeMode(false)
                                }}
                            >
                                <RiCloseFill size={25} />
                            </button>
                        )}
                </div>

                {
                    (found || includeMode) ? (
                        <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 '>
                            {
                                (!includeMode && found) && classQuizzes.map((item, index) => (
                                    <div key={item.quiz_id} className='flex flex-col bg-slate-200 rounded-md p-4 gap-3 cursor-pointer relative transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300'>
                                        <Link to={`/quizzes/quiz/${item.quiz_id}`} state={{grade: grade, section: section}} className=' w-full flex flex-col gap-2 cursor-pointer'>
                                            <div className='relative w-full flex justify-center'>
                                                <div className='relative'>
                                                <IoMdStopwatch size={60} className='text-[#054bb4]' />
                                                <div className={`${item.status == 'active' ? 'text-green-600' : 'text-slate-400'} absolute right-[-4px] top-0`}>
                                                    <GrStatusGoodSmall size={12} />
                                                </div>
                                                </div>
                                            </div>
                                            <p className='text-center text-lg font-bold'>{item.title}</p>
                                            <p className='text-start text-slate-600 text-sm font-medium'>{item.description} asgas sgdsag sgsdg sgasdg sgasg sgsag</p>

                                        </Link>
                                        <BsThreeDotsVertical size={35} className='absolute z-[80] text-slate-700 top-2 right-2 cursor-pointer hover:bg-slate-200 p-2 rounded-full'
                                            onClick={() => {
                                                setToggleOptions(!toggleOptions)
                                                setSelected(index)
                                            }} />
                                        <div className={`absolute right-[-5px] top-[50px] z-[90] drop-shadow-md flex-col  items-center  w-[180px] p-2 bg-white select-none  font-medium rounded-md ${(toggleOptions && selected == index) ? 'flex' : 'hidden'}`}>
                                            {item.status == 'active' ? (<button className='flex w-full gap-1 items-center p-2 text-red-500 text-lg hover:bg-slate-200'
                                                onClick={() => {
                                                    setToggleOptions(false)
                                                    deactivateQuiz(item.quiz_id)
                                                }}
                                            >
                                                <TiCancel size={25} />
                                                <span >Deactivate</span>
                                            </button>)
                                                : (
                                                    <button className='flex w-full gap-2 items-center px-3 py-2 text-lg text-green-600 hover:bg-slate-200'
                                                        onClick={() => {
                                                            setToggleOptions(false)
                                                            activateQuiz(item.quiz_id)
                                                        }}
                                                    >
                                                        <FaCheck />
                                                        <span >Activate</span>
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                includeMode && allQuizzes.map((item) => (
                                    <div key={item.quiz_id} className='flex flex-col items-center bg-slate-200 rounded-md p-4 gap-3 cursor-pointer relative '>
                                        <Link to={`/quizzes/quiz/${item.quiz_id}`} className=' w-full flex flex-col gap-2 cursor-pointer'>
                                            <div className='relative w-full flex justify-center'>
                                                <div className='relative'>
                                                <IoMdStopwatch size={60} className='text-[#054bb4]' />
                                                </div>
                                            </div>
                                            <p className='text-center text-lg font-bold'>{item.title}</p>
                                            <p className='text-start text-slate-500 text-sm font-medium'>{item.description} asgas sgdsag sgsdg sgasdg sgasg sgsag</p>

                                        </Link>

                                        {classQuizzes.find((q) => q.quiz_id == item.quiz_id) ?
                                            (<ImCheckboxChecked size={35} className='absolute z-[80] text-[#054bb4] top-2 right-2 cursor-pointer p-2'
                                                onClick={() => {
                                                    setClassQuizzes((prev) => prev.filter((q) => q.quiz_id != item.quiz_id))
                                                }}
                                            />)
                                            :
                                            (<ImCheckboxUnchecked size={35} className='absolute z-[80] text-[#054bb4] top-2 right-2 cursor-pointer p-2'
                                                onClick={() => {
                                                    setClassQuizzes((prev) => [...prev, item])
                                                }}
                                            />)}
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className='font-bold text-2xl text-slate-600 text-center'> No Quizzes yet</p>
                    )
                }
                {includeMode &&
                    <div className='w-full flex justify-center'>
                        <button
                            className='w-[150px] mt-4 bg-[#054bb4] text-lg text-white px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:bg-[#0366d6]'
                            onClick={() => {
                                includeQuizzes()
                                setIncludeMode(false)
                            }}
                        >
                            Save
                        </button>
                    </div>}
            </div>
        </>
    )
}

export default Quizzes