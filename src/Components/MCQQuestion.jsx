import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { ImRadioUnchecked } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { ImRadioChecked } from "react-icons/im";

const MCQQuestion = ({ index, id, questions, setQuestions, questionTypes, setQuestionTypes, setUpdating, setValidationErrors }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [answer, setAnswer] = useState('');
    const [answerId, setAnswerId] = useState('');

    useEffect(() => {
        const existingQuestion = questions.find(q => q.id === id);

        if (existingQuestion) {
            setQuestion(existingQuestion.question)
            setOptions(existingQuestion.options)
            setAnswer(existingQuestion.answer)
            setAnswerId(existingQuestion.options.filter((o) => o.option === existingQuestion.answer)[0]?.id)
        } else {
            setQuestions(prevQuestions => [...prevQuestions, { type: 'MCQ', id, question, options, answer }])
        }

        return () => {
            setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
        };
    }, []);

    useEffect(() => {
        if (!question.trim() || options.length < 2 || options.some(opt => !opt.option.trim()) || !answer) {
            setValidationErrors && setValidationErrors(prevErrors => [...prevErrors, id]);
        } else {
            setValidationErrors && setValidationErrors(prevErrors => prevErrors.filter(errorId => errorId !== id));
        }

        setQuestions((prevQuestions) => prevQuestions.map((q) =>
            q.id === id ? { ...q, question, options, answer } : q
        ));
    }, [question, options, answer]);

    const DeleteOption = (optionId) => {
        optionId === answerId && setAnswer('')
        setOptions(options.filter((item) => item.id !== optionId))
    };

    const DeleteQuestion = () => {
        setQuestionTypes(questionTypes.filter((item) => item.id !== id));
        setQuestions(questions.filter((item) => item.id !== id));
    };

    return (
        <>
            <div className='flex flex-col gap-3'>
                <div className='w-full flex gap-6 justify-between'>
                    <div className='flex gap-1 items-center'>
                    <span className='text-lg'>{index +1}&#41; </span>
                    <input type="text" placeholder='Question' value={question} className='w-full h-[50px] text-lg px-3 rounded-md bg-slate-100 outline-none border-b-2 border-white hover:border-b-slate-400 focus:border-b-[#054bb4]'
                        onChange={(e) => {
                            setQuestion(e.target.value)
                            setUpdating && setUpdating(true)
                        }}
                        />
                    </div>
                    <div className='flex justify-center items-center pr-2 text-red-500 cursor-pointer' onClick={() => {
                        DeleteQuestion()
                        setUpdating && setUpdating(true)
                    }}>
                        <FaTrashAlt size={17} />
                    </div>
                </div>
                <p className=' text-sm text-slate-600'>Check the correct answer</p>
            </div>
            <div className='flex flex-col text-lg font-medium gap-4 pl-1'>
                {options.map((option) => (
                    <div key={option.id} className='flex justify-between items-center gap-3'>
                        <div className='flex gap-2 items-center flex-1'>
                            {answerId === option.id ?
                                (<ImRadioChecked size={25} name='option' id='option' className='text-[#054bb4] p-1 rounded-full cursor-pointer' />)
                                :
                                (<ImRadioUnchecked size={25} name='option' id='option' className='text-[#054bb4] p-1 rounded-full cursor-pointer'
                                    onClick={() => {
                                        setAnswerId(option.id)
                                        setAnswer(option.option)
                                        setUpdating && setUpdating(true)
                                    }}
                                />)
                            }
                            <input type='text' value={option.option} className='w-full py-2 text-sm outline-none border-b-2 border-white hover:border-b-slate-400 focus:border-b-[#054bb4]'
                                onChange={(e) => {
                                    setOptions(options.map((item) =>
                                        item.id === option.id ? { ...item, option: e.target.value } : item
                                    ))
                                    answerId === option.id && setAnswer(e.target.value)
                                    setUpdating && setUpdating(true)
                                }}
                            />
                        </div>
                        <div className='text-slate-600 p-1 rounded-full hover:bg-slate-200 cursor-pointer' onClick={() => {
                            DeleteOption(option.id)
                            setUpdating && setUpdating(true)
                        }}>
                            <IoMdClose size={25} />
                        </div>
                    </div>
                ))}
                <button className='w-fit flex gap-2 items-center' onClick={() => {
                    const newOptionId = options.length ? options.length + 1 : 1
                    setOptions([...options, { id: newOptionId, option: `Option ${options.length + 1}` }])
                    setUpdating && setUpdating(true)
                }}>
                    <FaPlus size={22} name='option' id='option' className='text-[#054bb4] hover:bg-slate-200 p-1 rounded-full cursor-pointer' />
                    <p className='text-slate-500 text-base'>Add an option</p>
                </button>
            </div>
        </>
    );
};

export default MCQQuestion;
