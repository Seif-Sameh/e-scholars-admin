import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GoCheckCircleFill } from "react-icons/go";
import { useParams } from 'react-router';


const AddClass = () => {

  const [name, setName] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [addedSuccess, setAddedSuccess] = useState(false)
  const [existingStudent, setExistingStudent] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  


  const params = useParams()
  

  const addStudent = () => {
    const response = axios.post("https://e-scholars.com/teacher/students/add_student.php", {name: name,  grade:params.grade, section: params.section, phone_number: phoneNumber }, {withCredentials: true})
      .then((res) => (res.data))
      .then((data) => {
        if (data.status == 'OK') {
          setAddedSuccess(true)
        }
        else if(data.status == 'error' && data.message == 'Student name already exists'){
          setExistingStudent(true)
        }
        else{
          setErrorMessage(data.message)
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
              <div className='flex justify-center items-center py-6 shadow-lg'>
                <div className='flex flex-col items-center text-center gap-6 text-2xl text-[#054bb4] font-bold'>
                  <GoCheckCircleFill size={70} />
                  <p>Student Added Successfully</p>
                </div>
              </div>
            ) : (
              <>
                <p className='text-3xl font-semibold text-[#054bb4]'>Add a Student</p>
                <div>
                  <form action="" className='flex flex-col gap-4'
                    onSubmit={(e) => {
                      e.preventDefault()
                      addStudent()
                    }
                    }
                  >
                    <label htmlFor="name" className='text-lg font-medium'>Name</label>
                    <input type="text" name='name' required className='border-2 border-[#054bb4] h-[50px] rounded-md px-2'
                      placeholder='Student&#39;s full name'
                      onChange={(e) => {
                        setName(e.target.value)
                      }}
                    />
                    {existingStudent && <p className='text-red-600 text-sm text-center'>Student&#39;s name already exists</p>}
                    <label htmlFor="name" className='text-lg font-medium'>Phone Number</label>
                    <input type="text" name='name' required className='border-2 border-[#054bb4] h-[50px] rounded-md px-2'
                      placeholder='Phone Number'
                      onChange={(e) => {
                        setPhoneNumber(e.target.value)
                      }}
                    />
                    {errorMessage != '' && <p className='text-red-600 text-sm text-center'>{errorMessage}</p>}
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

export default AddClass