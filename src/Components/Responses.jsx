import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import axios from 'axios';


const Responses = ({ grade, section }) => {

    const params = useParams()

    const [attendance, setAttendance] = useState([])
    const [absence, setAbsence] = useState([])
    const [found, setFound] = useState(false)


    const requestResponses = () => {
        const response = axios.post("https://e-scholars.com/teacher/quizzes/quiz_attendance.php", { grade: grade, section: section, quiz_id: Number(params.quiz_id) }, {withCredentials: true})
            .then((res) => res.data)
            .then((data) => {
                if (data.status == 'OK') {
                    setAbsence(data.absent)
                    setAttendance(data.attended)
                    setFound(data.found)
                }
            })
    }

    useEffect(() => {
        (grade && section) && requestResponses()
    }, [])



    return (
        <>
            <p className='text-3xl font-semibold text-[#054bb4] px-5'>Responses</p>
            {
                (found && (attendance.length != 0 || absence.length != 0 )) ? (
                    <div className=' flex justify-center '>
                        <table className=' w-[95%] table-auto'>
                            <thead>
                                <tr >
                                    <th className='text-center w-[60px] p-0 text-xl border-r-[6px]  border-white max-md:text-base text-white rounded-lg'> <div className='bg-[#054bb4] py-2 w-full h-full rounded-tl-lg'>No.</div></th>
                                    <th className='text-start  p-0 text-xl max-md:text-base  text-white rounded-md'> <div className='bg-[#054bb4] py-2 pl-4 w-full h-full '>Name</div></th>
                                    <th className='text-center p-0 text-xl max-md:text-base  text-white rounded-md'> <div className='bg-[#054bb4] py-2 pr-4 w-full h-full rounded-tr-lg'>Marks</div></th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    found && attendance.map((item, index) => (
                                        <>
                                            <tr key={index} className={`relative rounded-lg ${index % 2 == 0 ? 'bg-white' : 'bg-gray-200'}`}>
                                                <td className='text-center border-y-[6px] border-r-[6px] border-white bg-[#054bb4] rounded-l-lg text-white font-bold  py-2 text-lg max-md:text-base'>{index + 1}</td>
                                                <td className='text-start border-y-[6px] border-white pl-4 py-2 text-lg max-md:text-base '>
                                                    <p>{item[0]}</p>
                                                    <p className='text-sm text-slate-600'>submitted {item[1].slice(0, 10)} at {item[1].slice(11, 16)}</p>
                                                </td>
                                                <td className='text-center border-y-[6px] border-white px-2 py-2 text-lg max-md:text-base rounded-r-lg'>{item[2]}</td>
                                            </tr>
                                        </>
                                    ))

                                }
                                {
                                    found && absence.map((item, index) => (
                                        <>
                                            <tr key={index} className={`relative rounded-lg ${index % 2 == 0 ? 'bg-white' : 'bg-gray-200'}`}>
                                                <td className='text-center border-y-[6px] border-r-[6px] border-white bg-[#054bb4] rounded-l-lg text-white font-bold  py-2 text-lg max-md:text-base'>{attendance.length + index + 1}</td>
                                                <td className='text-start border-y-[6px] border-white pl-4 py-2 text-lg max-md:text-base '>{item}</td>
                                                <td className='text-center border-y-[6px] border-white rounded-r-lg px-2 text-lg max-md:text-base '>-</td>
                                            </tr>
                                        </>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                ) : 
                (
                    <p className='font-bold text-2xl text-slate-600 text-center'> No Responses yet</p>
                )
            }
        </>
    )
}

export default Responses