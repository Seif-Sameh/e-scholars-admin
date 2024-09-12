import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import axios from 'axios';

const MaterialPage = () => {
    const params = useParams();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation()
    const {state} = location

    const requestMaterial = () => {
        axios.post("http://localhost/academic/admin/materials/view_materials.php", {
            grade: params.grade,
            section: params.section,
            item_id: params.item_id
        })
        .then((res) => res.data)
        .then((data) => {
            console.log(data)
            if (data.status == 'OK') {
                setUrl(data.path);
            } else {
                setError('Failed to fetch material');
            }
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setError('An error occurred while fetching the material');
            setLoading(false);
        });
    };

    useEffect(() => {
        requestMaterial();
    }, [params.grade, params.section, params.item_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='w-full h-screen flex justify-center items-center overflow-y-scroll bg-black'>
            {state.type == 'YouTube' && (
                <iframe src={`https://www.youtube.com/embed/${url.slice(17, 28)}`} className='w-full lg:h-full sm:h-[500px] max-sm:h-[300px]' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            )}
            {state.type == 'Image' && (<img src={url} alt=""/>)}
            {state.type == 'PDF' && (<iframe src={url} className='w-full h-full'></iframe>)}
            {state.type == 'Audio' && (<iframe src={url} className='w-full '></iframe>)}
        </div>
    );
};

export default MaterialPage;
