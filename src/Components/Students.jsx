import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaPlus } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { Link, useNavigate } from 'react-router-dom'
import { SlOptions } from "react-icons/sl";
import { FaClipboardCheck } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import Confirmation from './Confirmation';

const Students = ({ grade, section }) => {

    const [found, setFound] = useState(false)
    const [students, setStudents] = useState([])
    const [toggleOptions, setToggleOptions] = useState(false)
    const [selected, setSelected] = useState(0)
    const [attendanceMode, setAttendanceMode] = useState(false)
    const [attendance, setAttendance] = useState([])
    const [showAttendanceSuccess, setShowAttendanceSuccess] = useState(false);

    const navigate = useNavigate()

    const requestStudents = () => {
        const response = axios.post("https://e-scholars.com/teacher/students/retrieve_students.php", { grade: grade, section: section }, {withCredentials: true})
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    setFound(data.found)
                    setStudents(data.students)
                }
            })
            .catch((err)=> {
                if(!err.response.data.authenticated){
                    navigate('/login')
                }
            })
    }

    useEffect(() => {
        requestStudents()
    }, [])

    const activateStudent = (name) => {
        const response = axios.post("https://e-scholars.com/teacher/students/activate_student.php", { name: name, grade: grade, section: section }, {withCredentials: true})
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    requestStudents()
                }
            })
            .catch((err)=> {
                if(!err.response.data.authenticated){
                    navigate('/login')
                }
            })
    }
    const deactivateStudent = (name) => {
        const response = axios.post("https://e-scholars.com/teacher/students/deactivate_student.php", { name: name, grade: grade, section: section }, {withCredentials: true})
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    ResetSession(name)
                }
            })
            .catch((err)=> {
                if(!err.response.data.authenticated){
                    navigate('/login')
                }
            })
    }

    const deleteStudent = (name) => {
        const response = axios.post("https://e-scholars.com/teacher/students/remove_student.php", { name: name, grade: grade, section: section }, {withCredentials: true})
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    ResetSession(name)
                    setConfirm(false)
                }
            })
            .catch((err)=> {
                if(!err.response.data.authenticated){
                    navigate('/login')
                }
            })
    }

    const ResetSession = (name) => {
        const response = axios.post("https://e-scholars.com/teacher/student_page/fuck_student.php", { grade: grade, section: section, student_name: name }, { withCredentials: true })
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    requestStudents()
                }
            })
            .catch((err) => {
                if (!err.response.data.authenticated) {
                    navigate('/login')
                }
            })
    }

    const [deletingData, setDeletingData] = useState([])
    const [confirm, setConfirm] = useState(false)

    const submitAttendance = () => {
        axios.post("https://e-scholars.com/teacher/attendance/push_attendance.php", {
            grade: grade,
            section: section,
            attendance: attendance
        }, {withCredentials: true})
            .then((res) => res.data)
            .then((data) => {
                if (data.status === 'OK') {
                    setShowAttendanceSuccess(true);
                    setTimeout(() => setShowAttendanceSuccess(false), 3000);
                    setAttendanceMode(false);
                    setAttendance([]);
                } else {
                    console.error("Failed to submit attendance:", data.message);
                }
            })
            .catch((err) => {
                if(!err.response.data.authenticated){
                    navigate('/login')
                }
                else{   
                    console.error("Error submitting attendance:", err);
                }
            });
    };

    const toggleAttendance = () => {
        setAttendanceMode(!attendanceMode)
        if (attendanceMode) {
            submitAttendance();
        } else {
            const initialAttendance = students.map(student => ({
                student_name: student[0],
                attendance: 0
            }))
            setAttendance(initialAttendance)
        }
    }

    const handleAttendanceChange = (studentName) => {
        setAttendance(prev => prev.map(item =>
            item.student_name === studentName
                ? { ...item, attendance: item.attendance === 0 ? 1 : 0 }
                : item
        ))
    }

    return (
        <>
            {confirm && <Confirmation type={'student'} data={deletingData} handler={deleteStudent} cancelHandler={setConfirm} />}
            <div className='w-full flex flex-col gap-6'>
                <div className='flex w-full justify-between items-center'>
                    <p className='text-[#054bb4] text-3xl font-bold'>Students</p>
                    <Link to={`/class/${grade}/${section}/add_student`}>
                        <button title='add class' className='text-[#054bb4] ml-5 max-md:ml-1 w-[40px] h-[40px] rounded-full hover:bg-slate-200 flex gap-2 items-center justify-center'>
                            <FaPlus size={20} />
                        </button>
                    </Link>
                </div>
                <div className='flex flex-col items-center'>
                    {
                        found ? (
                            <>
                                <table className='table-auto w-full '>
                                    <thead>
                                        <tr>
                                            <th className='text-center max-sm:max-w-[40px] sm:max-w-[25px]  p-0 text-xl border-r-[6px] sm:h-[44px] max-sm:h-[30px] border-white max-md:text-base text-white rounded-lg max-sm:text-sm'> <div className='bg-[#054bb4] py-2 px-1 w-full h-full rounded-tl-lg'>No.</div></th>
                                            <th className='text-start  p-0 text-xl max-md:text-base h-[44px] max-sm:h-[30px] text-white rounded-md max-sm:text-sm'> <div className='bg-[#054bb4] py-2 pl-4 w-full h-full '>Name</div></th>
                                            <th className='text-center p-0 text-xl max-md:text-base h-[44px] max-sm:h-[30px] text-white rounded-md max-sm:text-sm'> <div className='bg-[#054bb4] py-2 px-1 w-full h-full '>Marks</div></th>
                                            <th className='max-sm:max-w-[40px] sm:max-w-[25px] p-0'><div className='bg-[#054bb4] py-2 w-full h-[44px] max-sm:h-[36px] rounded-tr-md '></div></th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {
                                            found && students.map((item, index) => (
                                                    <tr key={index} className={`relative rounded-lg ${index % 2 == 0 ? 'bg-slate-100' : 'bg-gray-300'}`}>
                                                        <td className='text-center border-y-[6px] border-r-[6px] border-white bg-[#054bb4] rounded-l-lg text-white font-bold  py-2 text-lg max-md:text-base max-sm:text-sm'>
                                                            {index + 1}
                                                        </td>
                                                        <td className='text-start border-y-[6px] border-white pl-4 py-2 text-lg max-md:text-base max-sm:text-sm'>
                                                            <Link to={`student_info`} state={{student_name: item[0], status: item[1]}}>
                                                                <div className='flex items-center gap-2'>
                                                                    <div className={`${item[1] == 'active' ? 'text-green-600' : 'text-slate-400'}`}>
                                                                        <GrStatusGoodSmall size={12} />
                                                                    </div>
                                                                    {item[0]}
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td className='text-center border-y-[6px] border-white  px-2 py-2 text-lg max-md:text-base  max-sm:text-sm'>{item[2]}</td>
                                                        <td className='text-end border-y-[6px] border-white rounded-r-lg px-2 text-lg max-md:text-base max-sm:text-sm'>
                                                            <div className='flex justify-end pr-2'>
                                                                {attendanceMode ? (
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={attendance.find(a => a.student_name === item[0])?.attendance === 1}
                                                                        onChange={() => handleAttendanceChange(item[0])}
                                                                        className="w-5 h-5"
                                                                    />
                                                                ) : (
                                                                    <button className={`w-[20px] h-[30px] flex justify-center items-center rounded-full`}
                                                                        onClick={() => {
                                                                            setSelected(index)
                                                                            setToggleOptions(!toggleOptions)
                                                                        }}
                                                                    >
                                                                        <SlOptions />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {
                                                                (toggleOptions && selected == index) && (
                                                                    <div className={`absolute w-[180px] z-[90]  bg-white right-12 top-4 p-3 flex-col gap-2 divide-y-2 text-lg rounded-md shadow-md`}>
                                                                        {
                                                                            item[1] == 'active' ?
                                                                                (
                                                                                    <div className='flex gap-1 items-center p-2 pl-1 text-red-500 cursor-pointer'
                                                                                        onClick={() => {
                                                                                            deactivateStudent(item[0])
                                                                                            setToggleOptions(false)
                                                                                        }}
                                                                                    >
                                                                                        <TiCancel size={25} />
                                                                                        <span>Deactivate</span>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className='flex gap-2 items-center p-2 text-green-600 cursor-pointer'
                                                                                        onClick={() => {
                                                                                            activateStudent(item[0])
                                                                                            setToggleOptions(false)
                                                                                        }}
                                                                                    >
                                                                                        <FaCheck />
                                                                                        <span>Activate</span>
                                                                                    </div>
                                                                                )
                                                                        }
                                                                        <div className='flex gap-2 items-center text-red-500 p-2 cursor-pointer'
                                                                            onClick={() => {
                                                                                setConfirm(true)
                                                                                setDeletingData([item[0], grade, section])
                                                                                setToggleOptions(false)
                                                                            }}
                                                                        >
                                                                            <FaTrashAlt />
                                                                            <span>Delete</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </td>
                                                    </tr>
                                            )

                                            )
                                        }
                                    </tbody>
                                </table>
                                <div className='flex sm:gap-2 max-sm:flex-col'>
                                    <button
                                        onClick={toggleAttendance}
                                        className='mt-4 bg-[#054bb4] text-lg text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#0366d6]'
                                    >
                                        <FaClipboardCheck />
                                        {attendanceMode ? 'Submit Attendance' : 'Take Attendance'}
                                    </button>
                                    {attendanceMode && (
                                        <button
                                            onClick={() => {
                                                setAttendanceMode(false);
                                                setAttendance([]);
                                            }}
                                            className='mt-4 bg-slate-100 text-lg text-[#054bb4] font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white'
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </>) : (
                            <p className='font-bold text-2xl text-slate-600'>No students yet</p>
                        )
                    }
                </div>
            </div>
            {showAttendanceSuccess && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-lg flex items-center gap-2">
                    <div className='flex flex-col justify-center items-center gap-2 w-full'>
                        <FaCheckCircle className="text-green-500" size={30} />
                        <span className="text-lg font-semibold">Attendance pushed successfully</span>
                    </div>
                </div>
            )}
        </>
    )
}

export default Students