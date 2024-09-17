import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const MaterialPage = () => {
    const params = useParams();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation()
    const {state} = location
    const navigate = useNavigate()

    const requestMaterial = () => {
        axios.post("https://e-scholars.com/teacher/materials/view_materials.php", {
            grade: params.grade,
            section: params.section,
            item_id: params.item_id
        }, {withCredentials: true})
        .then((res) => res.data)
        .then((data) => {
            if (data.status == 'OK') {
                setUrl(data.path);
            } else {
                setError('Failed to fetch material');
            }
            setLoading(false);
        })
        .catch((err) => {
            if(!err.response.data.authenticated){
                navigate('/login')
            }
            else{   
                setError('An error occurred while fetching the material');
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        requestMaterial();
    }, [params.grade, params.section, params.item_id]);

    if (loading) {
        return <div className='text-white'>Loading...</div>;
    }

    if (error) {
        return <div className='text-white'>{error}</div>;
    }

    return (
        <div className='w-screen h-screen flex justify-center items-center overflow-scroll bg-black'>
            {state.type == 'YouTube' && (
                <iframe src={`https://www.youtube.com/embed/${url.slice(17, 28)}`} className='w-full lg:h-full sm:h-[500px] max-sm:h-[300px]' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            )}
            {state.type == 'Image' && (<img src={url} alt=""/>)}
            {state.type == 'PDF' && (<iframe src={`https://docs.google.com/viewer?url=${url}&embedded=true`} className='w-full h-full' style={{ maxWidth: '100%', maxHeight: '100%', width: '100vw', height: '100vh' }} frameborder="0"></iframe>)}
            {state.type == 'Audio' && (<audio src={`${url}`} autoPlay controls controlsList="nodownload" className='w-[300px] h-[60px]'></audio>)}
        </div>
    );
};

export default MaterialPage;
