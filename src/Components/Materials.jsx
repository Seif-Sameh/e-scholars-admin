import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaPlus } from "react-icons/fa";
import { IoImage } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileAudio } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import Confirmation from './Confirmation';


const Materials = ({ grade, section }) => {

    const [materials, setMaterials] = useState([])
    const [found, setFound] = useState(false)

    const [deletingData, setDeletingData] = useState([])
    const [confirm, setConfirm] = useState(false)
    const [viewingMaterial, setViewMaterial] = useState(false)

    const [toggleOptions, setToggleOptions] = useState(false)
    const [selected, setSelected] = useState('')

    const requestMaterials = () => {
        const response = axios.post("http://localhost/academic/admin/materials/class_materials.php", { grade, section })
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    setFound(data.found)
                    setMaterials(data.materials)
                }
            })
    }
    const deleteMaterial = (item_id) => {
        const response = axios.post("http://localhost/academic/admin/materials/remove_material.php", { grade, section, item_id })
            .then((res) => (res.data))
            .then((data) => {
                if (data.status == 'OK') {
                    setConfirm(false)
                    requestMaterials()
                }
            })
    }

    useEffect(() => {
        requestMaterials()
    }, [])


    return (
        <>
        {/* {viewingMaterial } */}
            {confirm && <Confirmation type={'material'} data={deletingData} handler={deleteMaterial} cancelHandler={setConfirm} />}
            <div className='w-full flex flex-col gap-6'>
                <div className='flex w-full justify-between items-center'>
                    <p className='text-[#054bb4] text-3xl font-bold'>Materials</p>
                    <Link to={`/admin/class/${grade}/${section}/add_material`}>
                        <button title='add class' className='text-[#054bb4] ml-5 max-md:ml-1 w-[40px] h-[40px] rounded-full hover:bg-slate-200 flex gap-2 items-center justify-center'>
                            <FaPlus size={20} />
                        </button>
                    </Link>
                </div>
                {
                    found ?
                        (
                            <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-5'>
                                {materials && materials.map((item, index) => (
                                    <div key={index} className='relative group transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer'>
                                        <Link to={`/admin/material_page/${grade}/${section}/${item.item_id}`} state={{type: item.type}} key={item.id}>
                                            <div className='w-full h-[200px] bg-slate-200 rounded-md px-4 py-6 cursor-pointer flex flex-col items-center gap-4'>
                                                <div className='h-1/2 flex items-center'>
                                                    {item.type == 'Image' && <IoImage size={90} className='text-[#054bb4]' />}
                                                    {item.type == 'PDF' && <FaFilePdf size={80} className='text-[#054bb4] ml-2' />}
                                                    {item.type == 'YouTube' && <IoLogoYoutube size={90} className='text-[#054bb4]' />}
                                                    {item.type == 'Audio' && <FaFileAudio size={80} className='text-[#054bb4]' />}
                                                </div>
                                                <div className='w-full '>
                                                    <p className='w-full text-xl text-center line-clamp-3'>{item.caption}</p>
                                                </div>
                                            </div>
                                        </Link>

                                        <BsThreeDotsVertical size={35} className='absolute z-[80] text-[#054bb4] top-2 right-2 cursor-pointer hover:bg-slate-300 p-2 rounded-full'
                                            onClick={(e) => {
                                                setToggleOptions(!toggleOptions)
                                                setSelected(index)
                                            }}
                                        />
                                        <button className={`absolute w-[180px] right-[-5px] top-[50px] z-[90] drop-shadow-md  items-center gap-2 p-3 bg-white text-red-600 text-lg rounded-md ${(toggleOptions && selected == index) ? 'flex' : 'hidden'}`}
                                            onClick={() => {
                                                setDeletingData([item.item_id, item.caption])
                                                setConfirm(true)
                                                setToggleOptions(false)
                                            }}
                                        >
                                            <FaTrashAlt />
                                            <span >Delete</span>
                                        </button>

                                    </div>
                                ))}
                            </div>
                        )
                        :
                        <p className='font-bold text-2xl text-slate-600 text-center'> No materials yet</p>
                }
            </div>
        </>
    )
}

export default Materials