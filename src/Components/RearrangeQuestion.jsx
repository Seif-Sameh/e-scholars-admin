import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";

const RearrangeQuestion = ({ index, id, questions, setQuestions, questionTypes, setQuestionTypes, setUpdating, setValidationErrors }) => {
    const [options, setOptions] = useState([]);
    const [optionsCount, setOptionsCount] = useState(0);

    const DeleteOption = (optionId) => {
        setOptions(options.filter((item) => item.id !== optionId));
    };

    const DeleteQuestion = () => {
        setQuestionTypes(questionTypes.filter((item) => item.id !== id));
        setQuestions(questions.filter((item) => item.id !== id));
    };

    useEffect(() => {
        const existingQuestion = questions.find(q => q.id === id);

        if (existingQuestion) {
            setOptions(existingQuestion.question);
        } else {
            setQuestions(prevQuestions => [...prevQuestions, { type: 'Rearrange', id, question: options }]);
        }

        return () => {
            setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
        };
    }, []);

    useEffect(() => {
        // Validation check
        if (options.length < 2 || options.some(opt => !opt.option.trim())) {
            setValidationErrors(prevErrors => [...prevErrors, id]);
        } else {
            setValidationErrors(prevErrors => prevErrors.filter(errorId => errorId !== id));
        }

        setQuestions((prevQuestions) => prevQuestions.map((q) =>
            q.id === id ? { ...q, question: options } : q
        ));
    }, [options]);

    return (
        <>
            <div className='flex flex-col gap-1'>
                <div className='w-full flex gap-6 justify-between'>
                    <p className='font-medium'>{index + 1}&#41; Re-arrange the following:</p>
                    <div className='flex justify-center items-center pr-2 text-red-500 cursor-pointer'
                        onClick={() => {
                            DeleteQuestion();
                            setUpdating && setUpdating(true);
                        }}
                    >
                        <FaTrashAlt size={17} />
                    </div>
                </div>
                <p className='text-sm text-slate-600'>Enter the words in the correct order</p>
            </div>
            <div className='flex flex-col text-lg font-medium gap-4 pl-1'>
                {options && options.map((option) => (
                    <div key={option.id} className='flex justify-between items-center gap-3'>
                        <input
                            type='text'
                            value={option.option}
                            className='py-3 px-4 text-sm outline-none border-2 border-white hover:border-slate-400 focus:border-[#054bb4] bg-slate-100 rounded-full'
                            onChange={(e) => {
                                setOptions(options.map((item) =>
                                    item.id === option.id ? { ...item, option: e.target.value } : item
                                ));
                                setUpdating && setUpdating(true);
                            }}
                        />
                        <div
                            className='text-slate-600 p-1 rounded-full hover:bg-slate-200 cursor-pointer'
                            onClick={() => {
                                DeleteOption(option.id);
                                setUpdating && setUpdating(true);
                            }}
                        >
                            <IoMdClose size={25} />
                        </div>
                    </div>
                ))}
                <button className='w-fit flex gap-2 items-center' onClick={() => {
                    setOptions([...options, { id: optionsCount + 1, option: `Option ${options.length + 1}` }]);
                    setOptionsCount(optionsCount + 1);
                    setUpdating && setUpdating(true);
                }}>
                    <FaPlus size={22} name='option' id='option' className='text-[#054bb4] hover:bg-slate-200 p-1 rounded-full cursor-pointer' />
                    <p className='text-slate-500 text-base'>Add a word</p>
                </button>
            </div>
        </>
    );
}

export default RearrangeQuestion;
