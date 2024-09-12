import React from 'react'
import { useState, useEffect } from 'react'
import  image1  from '../assets/image-1.jpg'
import  image4  from '../assets/image-4.jpg'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [emptyUsername, setEmptyUsername] = useState(false)
    const [emptyPassword, setEmptyPassword] = useState(false)
    const navigate = useNavigate()

    // useEffect(() => {
    //     const response = axios.post("http://localhost/academic/already_logged.php", {}, {withCredentials: true})
    //     .then((res) => (res.data))
    //     .then((data) => {
    //         if(data.status != 'OK'){
    //             navigate('/student')
    //         }
    //     })
    // }, [])

    const handleLogin = async (e) => {
        try {
            const response = await axios.post("http://localhost/academic/login.php", { username, password }, {withCredentials: true});
            console.log(response);
            if (response.data.status === 'success') {
                navigate('/student')
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('There was an error logging in!', error);
        }
    };

    
    return (
        <div className='w-screen md:h-screen flex justify-center max-md:py-10 items-center bg-[#658cc2]'>
            <div className='flex flex-row-reverse w-2/3 md:h-3/4 max-sm:w-5/6 rounded-md max-md:flex-col-reverse'>
                <div className='w-full md:w-1/2 h-full bg-white  flex flex-col justify-center md:rounded-r-md max-md:rounded-b-md p-5'>
                    <div className='text-center font-bold text-[30px] mb-10'>
                        <h1 className='text-[#054bb4]'>Welcome to Academia</h1>
                    </div>
                    
                    <form  className='flex flex-col mb-6'
                        onSubmit={(e) => {
                            e.preventDefault()
                            setEmptyUsername(false)
                            setEmptyPassword(false)
                            if(username == '' || password == ''){
                                username == '' && setEmptyUsername(true)
                                password == '' && setEmptyPassword(true)
                            }
                            else{
                                handleLogin()
                            }
                        }}
                    >
                        <input type="text" placeholder='Username' 
                        onChange={(e) => setUsername(e.target.value)}
                        className='p-4 border-2 rounded-md outline-none focus:border-[#2e5caf] mb-2' />
                        <span className={`text-red-700 text-sm ${emptyUsername ? 'block' : 'hidden'}`}>Must enter a valid username</span>
                        <input type="password" placeholder='Password' 
                        onChange={(e) => setPassword(e.target.value)}
                        className='p-4 border-2 rounded-md outline-none focus:border-[#2e5caf] mt-2 mb-2' />
                        <span className={`text-red-700 text-sm ${emptyPassword ? 'block' : 'hidden'}`}>Must enter a correct password</span>
                        <input type="submit" value="Login" 
                        className='bg-[#054bb4] h-[50px] rounded-md text-white font-bold cursor-pointer mt-4' />
                    </form>

                </div>
                <div className='md:w-1/2 w-full md:h-full h-1/3'>
                    <img src={image1} alt="" className='w-full h-full max-md:hidden rounded-l-md object-cover'/>
                    <img src={image4} alt="" className='w-full h-full md:hidden rounded-t-md object-cover'/>
                </div>
            </div>
        </div>
    )
}

export default LoginPage