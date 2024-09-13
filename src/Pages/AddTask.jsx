import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GoCheckCircleFill } from "react-icons/go";
import { useParams } from 'react-router';

const AddClass = () => {

  const [type, setType] = useState(null)
  const [title, setTitle] = useState('')
  const [expiration, setExpiration] = useState('')
  const [addedSuccess, setAddedSuccess] = useState(false)

  const params = useParams()


  const addTask= () => {

    const response = axios.post("https://e-scholars.com/teacher/tasks/push_tasks.php", { grade: params.grade, section: params.section, category: type, task: title, expire_date: expiration}, {withCredentials: true})
      .then((res) => (res.data))
      .then((data) => {
        if (data.status == 'OK') {
          setAddedSuccess(true)
        }
      })
  }


  return (
    <div className='w-full h-screen flex flex-col gap-10 items-center bg-cover relative bg-[#658cc2] max-sm:bg-white'>
      <div className='container w-full h-screen flex justify-center pt-[90px] pb-[50px] px-6 gap-8 items-center z-10'>
        <div className='md:w-1/2 sm:w-3/4 max-sm:w-full  bg-white rounded-md p-5 max-sm:p-0 flex flex-col gap-4'>
          {
            addedSuccess ?
              (
                <div className='flex justify-center items-center py-6 max-sm:shadow-lg'>
                  <div className='flex flex-col items-center text-center gap-6 text-2xl text-[#054bb4] font-bold'>
                    <GoCheckCircleFill size={70} />
                    <p>Task Added Successfully</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className='text-3xl font-semibold text-[#054bb4]'>Add a Task</p>
                  <div>
                    <form action="" className='flex flex-col gap-4'
                      onSubmit={(e) => {
                        e.preventDefault()
                        addTask()
                      }
                      }
                    >
                      <label htmlFor="type" className='text-lg font-medium'>Type</label>
                      <select name="type" id="type" className='h-10 bg-slate-300 px-2 cursor-pointer text-slate-700' required defaultValue={'default'}
                        onChange={(e) => {
                          setType(e.target.value)
                        }}
                      >
                        <option value="default" disabled>-- Select task type --</option>
                        <option value="vocab">Vocab</option>
                        <option value="paragraph">Paragraph</option>
                        <option value="homework">Homework</option>
                        <option value="listening">Listening</option>
                      </select>

                      <label htmlFor="title" className='text-lg font-medium'>Title</label>
                      <input type="text" name='title' id='title' required className='border-2 border-[#054bb4] h-[50px] rounded-md px-2'
                        placeholder='Task&#39;s title or description'
                        onChange={(e) => {
                          setTitle(e.target.value)
                        }}
                      />

                      <label htmlFor="expiration" className='text-lg font-medium'>Expiration date</label>
                      <input type="date" name='expiration' id='expiration' required className='border-2 border-[#054bb4] h-[50px] rounded-md px-2'
                        onChange={(e) => {
                          const date = new Date(e.target.value).getTime() / 1000
                          setExpiration(date)
                        }}
                      />

                      <input type="submit" className='bg-[#054bb4] font-bold text-white py-2 rounded-full mt-4 cursor-pointer' value={'Submit'} />
                    </form>
                  </div>
                </>
              )}
        </div>
      </div>
    </div>
  )
}

export default AddClass