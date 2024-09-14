import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { RiCheckDoubleLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Confirmation from './Confirmation';
import { useNavigate } from "react-router-dom";


const Chat = ({chatParams, New, setNew, setEditing, edited, setEdited, inputMessageRef, message, expirationDate, setExpirationDate, setMessage,  setSelectDate, dateRef}) => {

    const [found, setFound] = useState(null)
    const [notifications, setNotifications] = useState(null)
    const [showOptions, setShowOptions] = useState(false)
    const [selected, setSelected] = useState('')
    const [confirmation, setConfirmation] = useState(false)

    const [messageData, setMessageData] = useState(null)

    const chat = useRef()
    const navigate = useNavigate()
    const fetchNotifications = () =>{
        const response = axios.post("https://e-scholars.com/teacher/notifications/class_notifications.php", { grade: chatParams[0], section: chatParams[1] }, {withCredentials: true})
        .then((res) => (res.data))
        .then((data) => {
            setFound( data.found)
            setNotifications(data.notification)
            setNew(false)
        })
        .catch((err)=> {
            if(!err.response.data.authenticated){
                navigate('/login')
            }
        })
    }
    const deleteNotification = (grade, section, id) =>{
        const response = axios.post("https://e-scholars.com/teacher/notifications/remove_notification.php", { grade: grade, section: section, id: id }, {withCredentials: true})
        .then((res) => (res.data))
        .then((data) => {
            if(data.status == 'OK'){
                setConfirmation(false)
                fetchNotifications()
            }
        })
        .catch((err)=> {
            if(!err.response.data.authenticated){
                navigate('/login')
            }
        })
    }
    const updateNotification = (grade, section, id, message) =>{
        const response1 = axios.post("https://e-scholars.com/teacher/notifications/update_notification.php", { grade: grade, section: section, id: id , message: message  ,expire_date: expirationDate}, {withCredentials: true})
        .then((res) => (res.data))
        .then((data) => {
            if(data.status == 'OK'){
                fetchNotifications()
                inputMessageRef.current.value = ''
                dateRef.current.value = ''
                setMessageData([])
                setExpirationDate('')
                setMessage('')
                setSelectDate(false)
            }
        })
        .catch((err)=> {
            if(!err.response.data.authenticated){
                navigate('/login')
            }
        })
    }
        
    useEffect(() => {
        console.log('useEffect new: ',New)
        New == true && fetchNotifications() 
    }, [New])

    useEffect(() => {
        fetchNotifications()
        return(() => setNotifications([]))
    }, [])

    useEffect(() => {
        chat.current?.lastElementChild?.scrollIntoView()
    }, [notifications])

    useEffect(() => {
        if(edited == true){
            if(message == ''){
                updateNotification(chatParams[0], chatParams[1], messageData[0], messageData[1], expirationDate)
            }
            else if(expirationDate == ''){
                updateNotification(chatParams[0], chatParams[1], messageData[0], message, messageData[2])
            }
            else if (message == '' && expirationDate == ''){
                updateNotification(chatParams[0], chatParams[1], messageData[0], messageData[1], messageData[2])
            }
            else{
                updateNotification(chatParams[0], chatParams[1], messageData[0], message, expirationDate)
            }
            setEditing(false)
            setEdited(false)
        }
    },[edited])

  return (
    <>
        {confirmation && <Confirmation type={'message'} data={[chatParams[0], chatParams[1], messageData[0]]} handler={deleteNotification} cancelHandler={setConfirmation}/>}
    <div className='w-full flex-1 flex flex-col p-3 overflow-y-scroll relative'>
        <div className='flex flex-col gap-2'>
        {
            found ? (
                notifications.map((item) => {
                    const pre_date = new Date(Number(item.Expire_date) * 1000)
                    const date = pre_date.toISOString().split('T')[0];
                    return(
                    <div key={item.id} className='flex flex-col gap-2' ref={chat}>
                        <div className='w-full flex justify-center'>
                            <span className='text-sm font-light bg-[#658cc2] px-3 py-1 rounded-full text-white opacity-90'>{item.time_created.slice(0, 10)}</span>
                        </div>
                        <div className='flex justify-between'>
                        <div className='bg-slate-300 px-3 py-1 w-fit max-w-full rounded-xl rounded-bl-none flex flex-col '>
                            {item.notification.split('\n').map((text, index) => (<span key={index}>
                                {text}
                                <br/>
                            </span>))}
                            <span className='text-[12px] font-light text-slate-600 flex items-center gap-1'>
                                <RiCheckDoubleLine size={15} color='#227ad8'/>
                                {item.time_created.slice(11, 16)}
                            </span>
                        </div>
                        <div className='flex items-center relative'>
                            <div className='flex items-center p-2 hover:bg-slate-300 rounded-full cursor-pointer' onClick={() => {
                                setSelected(item.id)
                                setShowOptions(!showOptions)
                                }}>
                            <BsThreeDotsVertical/>
                            </div>
                            {(showOptions && selected == item.id) && (
                                <div className='absolute top-[5%] right-[110%] bg-slate-100 py-2 text-base font-light flex flex-col gap-2 rounded-md select-none z-[110]'>
                                    <button className='flex items-center gap-2  px-4 cursor-pointer'
                                        onClick={() => {
                                            const date = new Date(item.Expire_date * 1000)
                                            setShowOptions(false)
                                            setEditing(true)
                                            setSelectDate(true)
                                            setExpirationDate(item.Expire_date)
                                            setMessageData([item.id, item.notification, item.Expire_date])
                                            inputMessageRef.current.value = item.notification
                                            dateRef.current.defaultValue = `${date.getFullYear()}-${date.getMonth() <=9 ? `0${date.getMonth()+1}` : date.getMonth()}-${date.getDate()}`
                                        }}
                                    >
                                        <MdEdit />
                                        <span >Edit</span>
                                    </button>
                                    <button className='flex items-center gap-2 text-red-500 px-4 cursor-pointer'
                                        onClick={() => {
                                            setShowOptions(false)
                                            setMessageData([item.id])
                                            setConfirmation(true)
                                        }}
                                    >
                                        <FaTrashAlt />
                                        <span>Delete</span>
                                    </button>
                                </div>
                        )}
                        </div>
                        </div>
                            <p className='text-[12px] font-light text-slate-500'>Expires: {`${date}`}</p>
                    </div>
                )})
            ):(
                <p className='text-center text-slate-600 font-medium'>No Notifcations yet</p>
            )
        }
        </div>
    </div>
    </>
  )
}

export default Chat