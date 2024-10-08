import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GoCheckCircleFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";


const AddClass = () => {

  const [grade, setGrade] = useState()
  const [section, setSection] = useState()
  const [validGrade, setValidGrade] = useState(true)
  const [validSection, setValidSection] = useState(true)
  const [addedSuccess, setAddedSuccess] = useState(false)
  const [classExists, setClassesExists] = useState(false)
  const [failed, setFailed] = useState(false)
  const [classes, setClasses] = useState([])

  const navigate = useNavigate()

  const addGrade = (grade, section) => {
    const response = axios.post("https://e-scholars.com/teacher/classes/add_grade.php", { grade, section }, {withCredentials: true})
      .then((res) => (res.data))
      .then((data) => {
        if (data.status == 'OK') {
          setAddedSuccess(true)
        }
        else if(data.status == 'error' && data.message == 'Already Exists'){
          setClassesExists(true)
        }
        else{
          setFailed(true)
        }
      })
      .catch((err)=> {
        if(!err.response.data.authenticated){
            navigate('/login')
        }
    })
  }

  const requestGrades = () => {
    const response = axios.post("https://e-scholars.com/teacher/classes/current_classes.php", {}, {withCredentials: true})
      .then((res) => (res.data))
      .then((data) => {
        const classes = data.classes
        setClasses(classes.sort())
      })
      .catch((err)=> {
        if(!err.response.data.authenticated){
            navigate('/login')
        }
    })
  }

  useEffect(() => {
    requestGrades()
  }, [])

  return (
    <div className='w-full h-screen flex flex-col gap-10 items-center bg-cover relative bg-[#658cc2] max-sm:bg-white'>
    <div className='container w-full h-screen flex justify-center pt-[90px] pb-[50px] px-6 gap-8 items-center z-10'>
      <div className='md:w-1/2 sm:w-3/4 max-sm:w-full bg-white rounded-md p-5 max-sm:p-0 flex flex-col gap-4'>
        {
          addedSuccess ?
            (
              <div className='flex justify-center items-center py-6 max-sm:shadow-lg'>
                <div className='flex flex-col items-center text-center gap-6 text-2xl text-[#054bb4] font-bold'>
                  <GoCheckCircleFill size={70} />
                  <p>Class Added Successfully</p>
                </div>
              </div>
            ) : (
              <>
                <p className='text-3xl font-semibold text-[#054bb4]'>Add a class</p>
                <div>
                  <form action="" className='flex flex-col gap-4'
                    onSubmit={(e) => {
                      e.preventDefault()
                      const regex = /^[a-zA-Z]+$/;
                      if (!isNaN(grade) && regex.test(section)) {
                          setValidGrade(true)
                          setValidSection(true)
                          addGrade(grade, section)
                      }
                      else {
                        if (!regex.test(section)) {
                          setValidSection(false)
                        }
                        if (isNaN(grade)) {
                          setValidGrade(false)
                        }
                      }
                    }
                    }
                  >
                    <label htmlFor="grade" className='text-lg font-medium'>Grade</label>
                    <input type="text" name='grade' className='border-2 border-[#054bb4] h-[50px] rounded-md px-2'
                      placeholder='Enter a number form 1-6' maxLength={1}
                      onChange={(e) => {
                        setGrade(e.target.value)
                      }}
                    />
                    {!validGrade && <p className='text-red-600 text-sm'>Must be a Number</p>}
                    <label htmlFor="grade" className='text-lg font-medium'>Section</label>
                    <input type="text" name='section' className='border-2 border-[#054bb4] h-[50px] rounded-md px-2'
                      placeholder='Enter a character' maxLength={1}
                      onChange={(e) => {
                        setSection(e.target.value)
                      }}
                    />
                    {!validSection && <p className='text-red-600 text-sm'>Must be a letter</p>}
                    {classExists && <p className='text-red-600 text-sm text-center'>This class already exists</p>}
                    {failed && <p className='text-red-600 text-sm text-center'>Failed to add class</p>}
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