import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { LuLogOut } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate()

    const handleLogOut = () => {
        const response = axios.post("https://e-scholars.com/teacher/logging/logout.php", {}, {withCredentials: true})
        .then((res) => (res.data))
        .then((data) => {
            if (data.status === 'OK') {
                navigate('/login')
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('There was an error logging out!', error);
        })
    }

    return (
        <div className='w-full flex justify-center'>
            <div className='h-[60px] flex items-center p-4 justify-between container'>
                <div className='flex gap-10 items-center'>
                    <Link to={'/'}>
                    <div className='flex items-center gap-5 cursor-pointer'>
                        <h1 className='text-[#054bb4] font-extrabold text-[30px]'>ِE-Scholars</h1>
                    </div>
                    </Link>
                </div>
                <div className='flex gap-3  items-center relative'>
                    <button className='bg-[#658cc2] ml-5 max-md:ml-1 py-1 px-3 rounded-md text-white flex gap-2 items-center'
                        onClick={() => handleLogOut()}
                    >
                        <LuLogOut />
                        <span className='max-sm:hidden'>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar