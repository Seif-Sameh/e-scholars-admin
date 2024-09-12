import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Notifications from '../Components/Notifications'


const AdminDashboard = () => {
    const location = useLocation()
    return (
        <div className='w-full flex flex-col items-center relative '>
            {!location.pathname.includes('/material_page') && 
            <div className='w-full fixed bg-white z-[100]'>
                <Navbar />
            </div>}
            <Outlet/>
            
            {!location.pathname.includes('/material_page') && <Notifications/>}
        </div>
    )
}

export default AdminDashboard