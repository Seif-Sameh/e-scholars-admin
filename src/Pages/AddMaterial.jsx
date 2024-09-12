import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GoCheckCircleFill } from "react-icons/go";
import { useParams } from 'react-router';
import { LuUpload } from "react-icons/lu";
import { IoImage } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileAudio } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";

const AddClass = () => {

  const [type, setType] = useState(null)
  const [material, setMaterial] = useState(null)
  const [description, setDescription] = useState('')
  const [addedSuccess, setAddedSuccess] = useState(false)
  const [invalidType, setInvalidType] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  const params = useParams()

  const addMaterial = () => {
    const file = new FormData()
    file.append('grade', params.grade)
    file.append('section', params.section)
    file.append('material_type', type)
    file.append('description', description)

    if (type == 'YouTube') {
      file.append('url', material)

      const response = axios.post("https://e-scholars.com/teacher/materials/push_materials.php", file, {
        headers: {
          "Content-Type": 'multipart/form-data'
        },
        withCredentials: true
      })
        .then((res) => (res.data))
        .then((data) => {
          if (data.status == 'OK') {
            setAddedSuccess(true)
          }
          else if (data.status == 'error' && data.message == 'Student name already exists') {
            setExistingStudent(true)
          }
          else {
            setErrorMessage(data.message)
          }
        })
    }
    else {
      file.append('file', material)

      const response = axios.post("https://e-scholars.com/teacher/materials/push_materials.php", file, {
        headers: {
          "Content-Type": 'multipart/form-data'
        },
        withCredentials: true
      })
        .then((res) => (res.data))
        .then((data) => {
          if (data.status == 'OK') {
            setAddedSuccess(true)
          }
          else if (data.status == 'error' && data.message == 'Student name already exists') {
            setExistingStudent(true)
          }
          else {
            setErrorMessage(data.message)
          }
        })
    }
  }


  return (
    <div className='w-full h-screen flex flex-col gap-10 items-center bg-cover relative bg-[#658cc2] max-sm:bg-white'>
      <div className='container w-full h-screen flex justify-center pt-[90px] pb-[50px] px-6 gap-8 items-center z-10'>
        <div className='md:w-1/2 sm:w-3/4 max-sm:w-full  bg-white rounded-md p-5 flex flex-col gap-4'>
          {
            addedSuccess ?
              (
                <div className='flex justify-center items-center py-6'>
                  <div className='flex flex-col items-center gap-6 text-2xl text-[#054bb4] font-bold'>
                    <GoCheckCircleFill size={70} />
                    <p>Material Added Successfully</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className='text-3xl font-semibold text-[#054bb4]'>Add a Material</p>
                  <div>
                    <form className='flex flex-col gap-4'
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (
                          (type == 'Image' && material.type == 'image/png') ||
                          (type == 'Image' && material.type == 'image/jpeg') ||
                          (type == 'Image' && material.type == 'image/jpg') ||
                          (type == 'PDF' && material.type == 'application/pdf') ||
                          (type == 'Audio' && material.type == 'audio/wav') ||
                          (type == 'Audio' && material.type == 'audio/mpeg') ||
                          (type == 'YouTube')
                        ) {
                          setInvalidType(false)
                          addMaterial()
                        }
                        else {
                          setInvalidType(true)
                        }
                      }
                      }
                    >
                      <label htmlFor="type" className='text-lg font-medium'>Type</label>
                      <select name="type" id="type" className='h-10 bg-slate-300 px-2 cursor-pointer text-slate-700' required defaultValue={'default'}
                        onChange={(e) => {
                          setType(e.target.value)
                        }}
                      >
                        <option value="default" disabled>-- Select document type --</option>
                        <option value="Image">Image</option>
                        <option value="PDF">PDF</option>
                        <option value="YouTube">Youtube Link</option>
                        <option value="Audio">Audio</option>
                      </select>

                      {
                        type && type == 'YouTube' ? (
                          <>
                            <label htmlFor="URL" className='text-lg font-medium'>URL</label>
                            <input type="text" name='name' required className='border-2 border-[#054bb4] h-[50px] rounded-md px-2'
                              placeholder='Video&#39;s Link'
                              onChange={(e) => {
                                setMaterial(e.target.value)
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <label htmlFor="upload" className='text-lg font-medium'>Upload</label>
                            {
                              material == null ? (
                                <>
                                  <div className='w-full flex justify-center'>
                                    <label htmlFor="upload" className='text-lg font-medium'>
                                      <div className='w-[100px] h-[100px] text-[#054bb4] bg-slate-300 flex justify-center items-center rounded-md cursor-pointer'>
                                        <LuUpload size={50} />
                                      </div>
                                    </label>
                                  </div>
                                  <input type="file" name="upload" id="upload" required hidden
                                    onChange={(e) => {
                                      setMaterial(e.target.files[0])
                                    }}
                                  />
                                </>
                              ) : (
                                <div className='w-fit max-w-full flex gap-3 p-2 bg-slate-300 text-[#054bb4] rounded-md items-center' >
                                  {type == 'Image' && <IoImage size={30} />}
                                  {type == 'PDF' && <FaFilePdf size={25} />}
                                  {type == 'Audio' && <FaFileAudio size={25} />}
                                  <span className='text-slate-700 truncate'>{material && material.name}</span>
                                  <div className='cursor-pointer text-red-500 flex items-center justify-center'
                                    onClick={() => {
                                      setMaterial(null)
                                    }}
                                  >
                                    <IoCloseCircleOutline size={20} />
                                  </div>
                                </div>
                              )
                            }
                          </>
                        )
                      }

                      <label htmlFor="description" className='text-lg font-medium'>Description</label>
                      <input type="text" name='description' id='description' required className='border-2 border-[#054bb4] h-[50px] rounded-md px-2'
                        placeholder='Material&#39;s title or description'
                        onChange={(e) => {
                          setDescription(e.target.value)
                        }}
                      />

                      {invalidType && <p className='text-red-600 text-sm text-center'>Invalid type. Please choose the right document format.</p>}
                      {/* {errorMessage != '' && <p className='text-red-600 text-sm text-center'>{errorMessage}</p>} */}
                      <input type="submit" className='bg-[#054bb4] font-bold text-white py-2 rounded-full mt-4  cursor-pointer' value={'Submit'} />
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