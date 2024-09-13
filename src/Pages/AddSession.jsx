import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GoCheckCircleFill } from "react-icons/go";
import { useParams } from 'react-router';


const AddSession = () => {

  const params = useParams()


  const [day, setDay] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [emptyDay, setEmptyDay] = useState(false)
  const [emptyFrom, setEmptyFrom] = useState(false)
  const [emptyTo, setEmptyTo] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]


  const addSchedule = (grade, section) => {
    const response = axios.post("https://e-scholars.com/teacher/classes/set_schedule.php", { grade: params.grade, section: params.section, days: [{ day: day, from: from, to: to }] }, {withCredentials: true})
      .then((res) => (res.data))
      .then((data) => {
        if (data.status == 'OK') {
          setAddedSuccess(true)
        }
        else if (data.status == 'error' && data.message == 'Already Exists') {
          setClassesExists(true)
        }
        else {
          setFailed(true)
        }
      })
  }

  return (
    <div className='w-full h-screen flex flex-col gap-10 items-center bg-cover relative bg-[#658cc2] max-sm:bg-white'>
      <div className='container w-full h-screen flex justify-center pt-[90px] pb-[50px] px-6 gap-8 items-center z-10'>
        <div className='md:w-1/2 sm:w-3/4 max-sm:w-full bg-white rounded-md p-5 max-sm:p-0 flex flex-col gap-4'>
          {
            addedSuccess ?
              (
                <div className='flex justify-center items-center py-6 max-sm:shadow-lg'>
                  <div className='flex flex-col items-center text-center justify-center gap-6 text-2xl text-[#054bb4] font-bold'>
                    <GoCheckCircleFill size={70} />
                    <p>Session Added Successfully</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className='text-3xl font-semibold text-[#054bb4]'>Add a Session</p>
                  <div>
                    <form action="" className='flex flex-col gap-4'
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (to != '' && from != '' && day != '') {
                          addSchedule()
                        }
                        else {
                          if (day == '') {
                            setEmptyDay(true)
                          }
                          if (from == '') {
                            setEmptyFrom(true)
                          }
                          if (to == '') {
                            setEmptyTo(true)
                          }
                        }
                      }}
                    >
                      <label htmlFor="date" className={`text-lg font-medium ${ emptyDay && 'text-red-500'}`}>Day</label>

                      <select name="date" id="date" className={`h-10 bg-slate-300 px-2 cursor-pointer text-slate-700 ${emptyDay && 'text-red-500'}`} required defaultValue={'default'}
                        onChange={(e) => {
                          setDay(e.target.value)
                          setEmptyDay(false)
                        }}
                      >
                        <option value="default" disabled>-- Select day --</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                      </select>

                      {emptyDay && <p className='text-red-600 text-sm'>Select a day</p>}

                      <label htmlFor="from" className={`text-lg font-medium ${emptyFrom && 'text-red-500'}`}>From</label>
                      <input type="time" name='from' className={`border-2 ${emptyFrom ? 'border-red-500' : 'border-[#054bb4]'} h-[50px] rounded-md px-2`}
                        onChange={(e) => {
                          setFrom(e.target.value)
                          setEmptyFrom(false)
                        }}
                      />
                      {emptyFrom && <p className={`text-red-600 text-sm `}>Enter time</p>}
                      <label htmlFor="to" className={`text-lg font-medium ${emptyTo && 'text-red-500'} `}>To</label>
                      <input type="time" name='to' className={`border-2 ${emptyTo ? 'border-red-500' : 'border-[#054bb4]'} h-[50px] rounded-md px-2`}
                        onChange={(e) => {
                          setTo(e.target.value)
                          setEmptyTo(false)
                        }}
                      />
                      {emptyTo && <p className='text-red-600 text-sm'>Enter time</p>}

                      {failed && <p className='text-red-600 text-sm text-center'>Failed to add session</p>}
                      <input type="submit" className='bg-[#054bb4] font-bold text-white py-2 rounded-full mt-4 cursor-pointer' value={'Add'} />
                    </form>
                  </div>
                </>
              )}
        </div>
      </div>
    </div>
  )
}

export default AddSession