import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import axios from 'axios'
import { FaCheck, FaEdit, FaTimes } from 'react-icons/fa'
import { LuGift } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Confirmation from '../Components/Confirmation';


const StudentInfo = () => {

    const location = useLocation()
    const { state } = location
    const params = useParams()
    const grade = Number(params.grade)
    const section = params.section

    const [found, setFound] = useState(false)
    const [month, setMonth] = useState('')
    const [attendance, setAttendance] = useState([])
    const [editMode, setEditMode] = useState('')
    const [updatedDate, setUpdatedDate] = useState('')
    const [updatedAttendance, setUpdatedAttendance] = useState(null)

    const [quizzesFound, setQuizzesFound] = useState(false)
    const [scores, setScores] = useState([])
    const [totalMarks, setTotalMarks] = useState('')

    const [addingBonus, setAddingBonus] = useState(false)
    const [bonus, setBonus] = useState('')
    const [invalideBonus, setInvalidBonus] = useState(false)

    const [confirm, setConfirm] = useState(false)

    const navigate = useNavigate()

    const requestAttendance = () => {
        const response = axios.post("https://e-scholars.com/teacher/student_page/retrieve_attendance.php", { grade: grade, section: section, student_name: state.student_name }, { withCredentials: true })
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    setFound(data.found)
                    setAttendance(data.attendance)
                    setMonth(data.month)
                }
            })
            .catch((err) => {
                if (!err.response.data.authenticated) {
                    navigate('/login')
                }
            })
    }
    const updateAttendance = (id, date, attendance) => {
        axios.post("https://e-scholars.com/teacher/student_page/update_attendance.php", { grade: grade, section: section, id: id, session_date: date, attendance: attendance }, { withCredentials: true })
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    setEditMode('')
                    setUpdatedAttendance(null)
                    setUpdatedDate('')
                    requestAttendance()
                }
            })
            .catch((err) => {
                if (!err.response.data.authenticated) {
                    navigate('/login')
                }
            })
    }

    const requestQuizzes = () => {
        const response = axios.post("https://e-scholars.com/teacher/student_page/student_marks.php", { grade: grade, section: section, student_name: state.student_name }, { withCredentials: true })
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    setQuizzesFound(data.found)
                    setScores(data.scores)
                    setTotalMarks(data.total_marks)
                }
            })
            .catch((err) => {
                if (!err.response.data.authenticated) {
                    navigate('/login')
                }
            })
    }
    const addBonus = () => {
        if (!isNaN(bonus)) {
            const response = axios.post("https://e-scholars.com/teacher/student_page/give_bonus.php", { grade: grade, section: section, student_name: state.student_name, bonus: bonus}, { withCredentials: true })
                .then((res) => res.data)
                .then((data) => {
                    if (data.status == 'OK') {
                        setAddingBonus(false)
                        setBonus('')
                        setInvalidBonus(false)
                        requestQuizzes()
                    }
                })
                .catch((err) => {
                    if (!err.response.data.authenticated) {
                        navigate('/login')
                    }
                })
        }
        else {
            setInvalidBonus(true)
        }
    }

    const ResetSession = (g, s, n) => {
        const response = axios.post("https://e-scholars.com/teacher/student_page/fuck_student.php", { grade: g, section: s, student_name: n }, { withCredentials: true })
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    setConfirm(false)
                }
            })
            .catch((err) => {
                if (!err.response.data.authenticated) {
                    navigate('/login')
                }
            })
    }


    useEffect(() => {
        requestAttendance()
        requestQuizzes()
    }, [])

    return (
        <>
        {confirm && <Confirmation type={'studentSession'} data={[grade, section, state.student_name]} handler={ResetSession} cancelHandler={setConfirm}/>}
        <div className='w-full min-h-screen flex flex-col gap-10 items-center bg-cover relative bg-[#658cc2] max-sm:bg-white'>
            <div className='container w-full flex justify-center max-sm:pt-[50px] sm:pt-[90px] pb-[50px] gap-8 z-10'>
                <div className='md:w-4/5 max-md:w-full bg-white rounded-md p-5 flex flex-col gap-4'>
                    <p className='text-3xl font-semibold text-[#054bb4]'>Student info</p>
                    <p className='font-bold text-lg text-[#054bb4]'>Name: <span className='font-normal text-black'>{state.student_name}</span></p>
                    <div className='flex gap-6'>
                        <p className='font-bold text-lg text-[#054bb4]'>Grade: <span className='font-normal text-black'>{grade}</span></p>
                        <p className='font-bold text-lg text-[#054bb4]'>Section: <span className='font-normal text-black capitalize'>{section}</span></p>
                    </div>
                    <p className='font-bold text-lg text-[#054bb4]'>Status: <span className='font-normal text-black'>{state.status}</span></p>
                    <p className='font-bold text-lg text-[#054bb4]'>Total Marks: <span className='font-normal text-black'>{totalMarks}</span></p>
                    <div className='flex justify-center'>
                        <div className='w-full flex flex-col items-center gap-4'>
                            {addingBonus && (
                                <input type='text' placeholder='Bonus Marks' className='bg-slate-200 px-2 py-1 rounded-md border-2 border-[#054bb4] outline-none'
                                    onChange={(e) => setBonus(e.target.value)}
                                />
                            )}
                            {invalideBonus && <p className='text-sm text-red-500 text-center'>Please enter a number</p>}
                            {addingBonus ? (
                                <div className='flex gap-3'>
                                    <button className='bg-slate-400 text-white px-4 py-1 rounded-md flex gap-2 items-center cursor-pointer'
                                        onClick={() => setAddingBonus(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button className='bg-[#054bb4] text-white px-4 py-1 rounded-md flex gap-2 items-center cursor-pointer'
                                        onClick={() => addBonus()}
                                    >
                                        Add
                                    </button>
                                </div>
                            ) : (<button className='bg-[#054bb4] text-white px-4 py-1 rounded-md flex gap-2 items-center cursor-pointer'
                                onClick={() => setAddingBonus(true)}
                            >
                                <LuGift />
                                Bonus
                            </button>)}
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='font-bold text-lg text-[#054bb4]'>Attendance: </p>
                        <div className='flex flex-col items-center'>
                            <p className='font-semibold text-lg text-slate-600'>{month}</p>
                        </div>
                        {found && attendance && attendance.length > 0 ? (
                            <table className='w-full border-collapse mt-4  max-sm:text-[14px]'>
                                <thead>
                                    <tr className='bg-[#054bb4] text-white'>
                                        <th className='border border-slate-300 px-4 py-2'>Date</th>
                                        <th className='border border-slate-300 border-r-0 px-4 py-2'>Attendance</th>
                                        <th className='border border-slate-300 border-l-0 py-2 max-sm:w-[40px] w-[100px]'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.map((session, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>

                                            <td className='border border-slate-300 max-sm:px-1 px-4 py-2 text-center'>
                                                {
                                                    editMode == session[0] ? (
                                                        <>
                                                            <input type="date"
                                                                value={updatedDate != '' ? updatedDate : session[1]}
                                                                onChange={(e) => setUpdatedDate(e.target.value)}
                                                            />
                                                        </>
                                                    ) :
                                                        (session[1])
                                                }
                                            </td>
                                            <td className='border border-slate-300 border-r-0  px-4 py-2 text-center'>
                                                {
                                                    editMode == session[0] ? (
                                                        <>
                                                            <input type="checkbox"
                                                                checked={updatedAttendance != null ? updatedAttendance : (session[2] == 1 ? true : false)}
                                                                onChange={(e) => setUpdatedAttendance(Number(e.target.checked))}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {session[2] == 1 ? (
                                                                <FaCheck className='text-green-500 inline-block' />
                                                            ) : (
                                                                <FaTimes className='text-red-500 inline-block' />
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </td>
                                            <td className='text-[#054bb4] border border-slate-300 border-l-0 py-1 text-center'>
                                                {
                                                    editMode == session[0] ? (
                                                        <button className='bg-[#054bb4] text-white px-4 py-1 rounded-md'
                                                            onClick={() => {
                                                                if (updatedAttendance != null && updatedDate != '') {
                                                                    updateAttendance(session[0], updatedDate, updatedAttendance)
                                                                }
                                                                else {
                                                                    if (updatedAttendance != null && updatedDate == '') {
                                                                        updateAttendance(session[0], session[1], updatedAttendance)
                                                                    }
                                                                    else if (updatedAttendance == null && updatedDate != '') {
                                                                        updateAttendance(session[0], updatedDate, session[2])
                                                                    }
                                                                    else {
                                                                        setEditMode('')
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Save
                                                        </button>
                                                    ) : (
                                                        <div className='w-full flex justify-center'>
                                                            <FaEdit
                                                                size={20}
                                                                onClick={() => setEditMode(session[0])}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className='font-bold text-lg text-center text-slate-600'>No attendance recorded yet</p>
                        )}
                    </div>
                    <div className='flex flex-col gap-3'>
                        <p className='font-bold text-lg text-[#054bb4]'>Quizzes: </p>
                        {quizzesFound && scores && scores.length > 0 ? (
                            <table className='w-full border-collapse mt-4  max-sm:text-[14px]'>
                                <thead>
                                    <tr className='bg-[#054bb4] text-white'>
                                        <th className='border border-slate-300 px-4 py-2'>Quiz</th>
                                        <th className='border border-slate-300 px-4 py-2'>Submittion Date</th>
                                        <th className='border border-slate-300 px-4  py-2'> Mark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scores.map((quiz, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
                                            <td className='border border-slate-300 px-4 py-2 text-center'>{quiz[0]}</td>
                                            <td className='border border-slate-300 border-r-0   max-sm:px-1 px-4 py-2 text-center'>{quiz[1].slice(0, 16)}</td>
                                            <td className='text-[#054bb4] border border-slate-300 border-l-0 py-1 text-center'>{quiz[2]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className='font-bold text-lg text-center text-slate-600'>No quizzes yet</p>
                        )
                        }
                    </div>
                    <div className='w-full flex justify-end mt-4'>
                        <button className='w-fit bg-white px-2 py-1 text-red-500 border-2 border-red-500 rounded-md'
                            onClick={() => setConfirm(true)}
                        >Reset Student Session</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default StudentInfo