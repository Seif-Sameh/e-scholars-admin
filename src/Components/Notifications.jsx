import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { HiUserGroup } from "react-icons/hi2";
import { PiClockCountdownFill } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import Chat from './Chat';

const Notifications = () => {
    const [classes, setClasses] = useState([])
    const [found, setFound] = useState(false)
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



    const [toggleNotifications, setToggleNotifications] = useState(false)
    const [selectDate, setSelectDate] = useState(false)
    const [expirationDate, setExpirationDate] = useState('')
    const [selectingGrades, setSelectingGrades] = useState(false)
    const [selectingAll, setSelectingAll] = useState(false)
    const [sendTo, setSendTo] = useState([])
    const [message, setMessage] = useState('')
    const messageRef = useRef()
    const dateRef = useRef()


    const [displayChat, setDisplayChat] = useState(false)
    const [chatParams, setChatParams] = useState([])
    const [editing, setEditing] = useState(false)
    const [edited, setEdited] = useState(false)

    const [invalidrecipient, setInvalidRecipient] = useState(false)
    const [emptyMessage, setEmptyMessage] = useState(false)

    const handleSelection = (e) => {
        const { checked, value } = e.target
        const parsedValue = { grade: value.split(",")[0], section: value.split(',')[1] }
        if (checked) {
            setSendTo([...sendTo, parsedValue])
        }
        else {
            setSendTo(sendTo.filter((e) => (e['grade'] != parsedValue['grade'] || e['section'] != parsedValue['section'])));
        }
    }

    const pushNotification = () => {
        if (selectingAll) {
            const response = axios.post("https://e-scholars.com/teacher/notifications/push_notification.php", { request_data: [{ message: message, grade: 'all', section: 'all', expire_date: expirationDate }] }, {withCredentials: true})
                .then((res) => (res.data))
                .then((data) => {
                    if (data.status == 'OK') {
                        setExpirationDate('')
                        setSelectDate(false)
                        setSelectingGrades(false)
                        setSelectingAll(false)
                        setSendTo([])
                        setMessage('')
                        messageRef.current.value = ''
                        dateRef.current.value = ''
                    }
                })
        }
        else {
            let requestData = []
            if (chatParams.length == 0) {
                requestData = sendTo.map((ele) => ({ message: message, grade: Number(ele['grade']), section: ele['section'], expire_date: expirationDate }))
            }
            else {
                requestData = [{ message: message, grade: chatParams[0], section: chatParams[1], expire_date: expirationDate }]
            }

            const response = axios.post("https://e-scholars.com/teacher/notifications/push_notification.php", { request_data: requestData }, {withCredentials: true})
                .then((res) => {
                    setExpirationDate('')
                    setSelectDate(false)
                    setSelectingGrades(false)
                    setSelectingAll(false)
                    setSendTo([])
                    setMessage('')
                    messageRef.current.value = ''
                    dateRef.current.value = ''
                })
        }
    }

    const [New, setNew] = useState(false)

    useEffect(() => {
        requestGrades()
    }, [, toggleNotifications])

    return (
        <>
            {
                !toggleNotifications ? (
                    <div className='w-[300px] max-sm:w-[250px]  h-[45px] fixed z-[200] bottom-0 right-5 bg-[#054bb4]  rounded-t-md'>
                        <div className='py-2 px-4 flex justify-between items-center' onClick={() => setToggleNotifications(!toggleNotifications)}>
                            <p className='text-white font-semibold text-lg'>
                                Notifications
                            </p>
                            <div className='text-white w-[28px] h-[28px] rounded-full flex justify-center items-center cursor-pointer'>
                                <IoIosArrowUp size={25} />
                            </div>
                        </div>
                    </div>

                ) : (
                    <div className='w-[300px] sm:h-[500px] max-sm:h-dvh max-sm:max-h-[400px] fixed z-[200] bottom-0 right-5 bg-white rounded-t-md flex flex-col justify-between shadow-lg'>
                        <div className='h-[45px] py-2 px-4 flex justify-between items-center' onClick={() => setToggleNotifications(!toggleNotifications)}>
                            <p className='text-[#054bb4] font-semibold text-lg'>
                                Notifications
                            </p>
                            <div className='text-slate-700 w-[28px] h-[28px] rounded-full flex justify-center items-center cursor-pointer'>
                                <IoIosArrowDown size={25} />
                            </div>
                        </div>
                        <div className='w-full px-3 py-2 flex justify-between bg-[#658cc2] text-white'>
                            {
                                !displayChat ?
                                    (!selectingGrades ? (
                                        <button onClick={() => { setSelectingGrades(true) }}>Select</button>
                                    ) : (
                                        <div className='w-full flex justify-end items-center cursor-pointer gap-2'
                                            onClick={() => {
                                                setSelectingGrades(false)
                                                setSendTo([])
                                            }}>
                                            <span>Cancel</span>
                                            <IoCloseCircleOutline size={22} />
                                        </div>
                                    )
                                    ) : (
                                        <div className='py-[2px] flex gap-4 items-center'>
                                            <div onClick={() => {
                                                setDisplayChat(false)
                                                setChatParams([])
                                                setSelectingGrades(false)
                                                setSelectDate(false)
                                                setExpirationDate('')
                                                setSendTo([])
                                            }} className='cursor-pointer'>
                                                <FaArrowLeft size={20} />
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <div className='text-[#658cc2] bg-white p-2 rounded-full'>
                                                    <HiUserGroup size={25} />
                                                </div>
                                                {chatParams[0] == 'all' ? <p className='text-base font-medium capitalize'> All Grades </p> : <p className='text-base font-medium capitalize'>Grade {chatParams[0]} Section {chatParams[1]}</p>}
                                            </div>
                                        </div>
                                    )
                            }
                        </div>
                        {!displayChat ? (
                            <div className='w-full flex-1 divide-y-2 overflow-y-scroll'>
                                <div className='flex px-4 py-2 justify-between items-center cursor-pointer hover:bg-slate-200' onClick={() => {
                                    setDisplayChat(true)
                                    setChatParams(['all', 'all'])
                                }}>
                                    <div className='flex items-center gap-3'>
                                        <div className='bg-[#658cc2] text-white p-2 rounded-full'>
                                            <HiUserGroup size={25} />
                                        </div>
                                        <p className='text-base font-medium capitalize'>All Grades</p>
                                    </div>
                                    {selectingGrades && (
                                        <input type="checkbox" name="grade" id={"all"} value={'All'} className='w-[20px] h-[20px] z-0' onChange={(e) => { setSelectingAll(!selectingAll) }} onClick={(e) => { e.stopPropagation(); setInvalidRecipient(false) }} />
                                    )}
                                </div>
                                {found && classes.map((item, index) => (
                                    <div key={index} className='flex px-4 py-2 justify-between items-center cursor-pointer hover:bg-slate-200 z-[80]'
                                        onClick={() => {
                                            setDisplayChat(true)
                                            setChatParams(item)
                                        }}>
                                        <div className='flex items-center gap-3'>
                                            <div className='bg-[#658cc2] text-white p-2 rounded-full'>
                                                <HiUserGroup size={25} />
                                            </div>
                                            <p className='text-base font-medium capitalize'>Grade {item[0]} Section {item[1]}</p>
                                        </div>
                                        {(selectingGrades && !selectingAll) && (<input type="checkbox" name="grade" id={index} value={[item[0], item[1]]} className='w-[20px] h-[20px] z-0' onChange={(e) => handleSelection(e)} onClick={(e) => { e.stopPropagation(); setInvalidRecipient(false) }} />)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Chat chatParams={chatParams} New={New} setNew={setNew} setEditing={setEditing} edited={edited} setEdited={setEdited} inputMessageRef={messageRef} dateRef={dateRef} message={message} expirationDate={expirationDate} setExpirationDate={setExpirationDate} setMessage={setMessage} setSelectDate={setSelectDate} />
                        )
                        }
                        {/* sending form */}
                        <div className='w-full px-2 flex justify-between items-center relative'>
                            <form action="" className='w-full flex flex-col items-center gap-2 py-3'>
                                {invalidrecipient && <span className='text-sm text-red-500'>Select Recipient</span>}
                                {emptyMessage && <span className='text-sm text-red-500'>Enter a message</span>}
                                <div className='w-full flex items-center gap-2'>
                                    <textarea ref={messageRef} className='bg-slate-300 rounded-full px-3 py-2 flex-1 h-[40px] resize-none' required onChange={(e) => setMessage(e.target.value)} />
                                    <div className='w-[25px] rounded-full flex justify-center items-center cursor-pointer' onClick={() => setSelectDate(!selectDate)}>
                                        <label htmlFor="expiration">
                                            <PiClockCountdownFill size={22} className='text-[#054bb4] cursor-pointer' />
                                        </label>
                                    </div>
                                    <div className='w-[25px] flex justify-center items-center cursor-pointer' onClick={() => {
                                        if (editing) {
                                            setEdited(true)
                                        }
                                        else{
                                            if (expirationDate == '') {
                                                setSelectDate(true)
                                            }
                                            else if ((sendTo.length == 0 && chatParams.length == 0 && !selectingAll)) {
                                                setInvalidRecipient(true)
                                            }
                                            else if (message == '') {
                                                setEmptyMessage(true)
                                            }
                                            else {
                                                setInvalidRecipient(false)
                                                setEmptyMessage(false)
                                                pushNotification()
                                                setNew(true)
                                            }
                                        }
                                    }}>
                                        <MdSend size={22} className='text-[#054bb4]' />
                                    </div>
                                </div>
                                <div className={`absolute bottom-full z-[100] w-[95%] bg-[#658cc2] p-2 flex-col gap-2 rounded-t-md ${selectDate ? 'flex' : 'hidden'}`}>
                                    <span>Choose Expiration Date: </span>
                                    <input ref={dateRef} type="date" name="expiration" id="expiration" required
                                        onChange={(e) => {
                                            const date = new Date(e.target.value).getTime() / 1000
                                            setExpirationDate(date)
                                            setSelectDate(false)
                                        }}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Notifications