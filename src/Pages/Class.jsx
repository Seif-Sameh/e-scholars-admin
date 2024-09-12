import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Students from '../Components/Students'
import Materials from '../Components/Materials'
import Tasks from '../Components/Tasks'
import Quizzes from '../Components/Quizzes'
import Schedule from '../Components/Schedule'
import axios from 'axios'

const Class = () => {

    const params = useParams()
    const grade = Number(params['grade'])
    const section = params['section']

    const getCredentials = () => {
        axios.post("https://e-scholars.com/teacher/credentials/get_class_credentials.php", 
        { grade: grade, section: section }, 
        { responseType: 'blob' } // Important for handling binary data
        ).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `grade${grade}_section${section}.xlsx`); // Adjust filename as needed
            document.body.appendChild(link);
            link.click();
            link.remove();
        }).catch(error => {
            console.error('Error downloading the file:', error);
        });
    }

    return (
        <>
            <div className='w-full flex flex-col items-center bg-cover bg-white min-h-screen relative'>
                <div className='z-10 container w-full flex flex-col pt-[60px] pb-[90px] px-6 gap-14 items-center '>

                    <div className='w-full flex mt-[20px] justify-start max-sm:flex-col'>
                        <div className='w-1/2 max-sm:w-full flex flex-col justify-evenly animate-fadeinleft opacity-0'>
                            <p className='text-[#054bb4] font-black lg:text-[80px] md:text-[70px] sm:text-[50px] max-sm:text-[60px] tracking-wide'>Grade {grade}</p>
                            <p className='text-[#054bb4] font-black lg:text-[80px] md:text-[70px] sm:text-[50px] max-sm:text-[60px] capitalize tracking-wide'>Section {section}</p>
                            <button className='w-fit bg-white px-2 py-1 text-[#054bb4] border-2 border-[#054bb4] rounded-md'
                                onClick={() => getCredentials()}
                            >Class Credentials</button>
                        </div>
                        <div className='w-1/2 max-sm:w-full relative mt-6'>
                            <Schedule grade={grade} section={section} />
                        </div>
                    </div>
                    <div className='w-full relative'>
                        <Students grade={grade} section={section} />
                    </div>
                    <div className='w-full relative'>
                        <Materials grade={grade} section={section} />
                    </div>
                    <Tasks grade={grade} section={section} />
                    <Quizzes grade={grade} section={section} />
                </div>
            </div>
        </>
    )
}

export default Class