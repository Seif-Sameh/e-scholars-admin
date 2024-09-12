import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
import MCQQuestion from '../Components/MCQQuestion';
import { v4 as uuidv4 } from 'uuid';  // Add this line
import RearrangeQuestion from '../Components/RearrangeQuestion';
import { GoCheckCircleFill } from "react-icons/go";

const AddQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emptyTitle, setEmptyTitle] = useState(false);
  const [emptyDescription, setEmptyDescription] = useState(false);
  const [showQuesitionOptions, setShowQuestionOptions] = useState(false);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [emptyQuestions, setEmptyQuestions] = useState(false);

  const addQuiz = () => {
    if (validationErrors.length > 0) {
      alert("Please fill all the question fields, add more than two options and check the correct one before submitting.");
      return;
    }

    questions.length !== 0 ? axios.post("https://e-scholars.com/teacher/quizzes/add_quiz.php", { title, description })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        if (data.status === 'OK') {
          questions.length !== 0 && addQuestions(data.quiz_id);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.status === 'error' && err.response.data.message === 'The same title exists') {
          setAlreadyExists(true);
        }
      })
      : setEmptyQuestions(true)

  };

  const addQuestions = (quiz_id) => {
    axios.post("https://e-scholars.com/teacher/quizzes/add_question.php", { quiz_id: Number(quiz_id), questions })
      .then((res) => res.data)
      .then((data) => {
        if (data.status == 'OK') {
          setAddedSuccessfully(true)
        }
      });
  };

  useEffect(() => {
    window.scrollTo(top)
  }, [alreadyExists, emptyTitle, emptyDescription])

  console.log(questions)
  return (
    <div className='w-full min-h-screen flex flex-col gap-10 items-center bg-cover relative bg-[#658cc2]'>
      <div className='w-full flex justify-center pt-[90px] pb-[50px] px-4 gap-8 items-center z-10'>
        <div className='max-md:w-[100%] md:w-3/5 bg-white rounded-md flex flex-col gap-4 py-5'>
          {
            addedSuccessfully ? (
              <div className='flex justify-center items-center py-6'>
                <div className='flex flex-col items-center gap-6 text-2xl text-[#054bb4] font-bold'>
                  <GoCheckCircleFill size={70} />
                  <p>Quiz Added Successfully</p>
                </div>
              </div>
            ) : (
              <>
                <p className='text-3xl font-semibold text-[#054bb4] px-5'>Add a Quiz</p>
                <form action="" className='flex flex-col gap-5' onSubmit={(e) => e.preventDefault()}>
                  <div className='flex flex-col gap-3 px-5'>
                    <label htmlFor="title" className={`text-lg font-medium ${(emptyTitle || alreadyExists) && 'text-red-500'}`}>Title <span className='text-red-500'>*</span></label>
                    <input type="text" name='title' className={`border-2 border-[#054bb4] h-[50px] rounded-md px-2 ${(emptyTitle || alreadyExists) && 'border-red-500'}`} value={title}
                      onChange={(e) => {
                        setTitle(e.target.value)
                        emptyTitle && setEmptyTitle(false)
                        alreadyExists && setAlreadyExists(false)
                      }}
                    />
                    {alreadyExists && <p className='text-sm text-red-500'>A quiz with the same title already exists</p>}
                    <label htmlFor="description" className={`text-lg font-medium ${emptyDescription && 'text-red-500'}`}>Description <span className='text-red-500'>*</span></label>
                    <input type="text" name='description' className={`border-2 border-[#054bb4] h-[50px] rounded-md px-2 ${emptyDescription && 'border-red-500'}`} value={description}
                      onChange={(e) => {
                        setDescription(e.target.value)
                        setEmptyDescription(false)
                      }}
                    />
                  </div>

                  {questionTypes.map((ques) => (
                    <div key={ques.id} className='w-full flex flex-col gap-4 group border-l-[6px] border-white has-[:focus]:border-l-[#054bb4] pl-4 py-4 pr-5 rounded-md'>
                    {ques.type === 'MCQ' && (
                      <MCQQuestion id={ques.id} questions={questions} setQuestions={setQuestions} questionTypes={questionTypes} setQuestionTypes={setQuestionTypes} setValidationErrors={setValidationErrors} />
                    )}
                      {ques.type === 'Rearrange' && (
                      <RearrangeQuestion id={ques.id} questions={questions} setQuestions={setQuestions} questionTypes={questionTypes} setQuestionTypes={setQuestionTypes} setValidationErrors={setValidationErrors} />
                    )}
                    </div>
                  ))}
                  {emptyQuestions && <p className='w-full text-center text-red-500 text-sm'>There is no questions in this quiz</p>}
                  <div className='relative select-none pl-6'>
                    <div className='flex text-lg items-center gap-2 border-2 font-semibold text-[#054bb4] border-[#054bb4] w-fit py-1 px-4 rounded-full hover:bg-slate-100 cursor-pointer'
                      onClick={() => setShowQuestionOptions(!showQuesitionOptions)}>
                      <FaPlus size={15} className='rounded-full cursor-pointer' />
                      <p>Question</p>
                    </div>
                    {showQuesitionOptions && (
                      <div className='absolute top-1 left-[170px] w-[150px] flex flex-col items-start py-1 bg-slate-100 rounded-md shadow-md shadow-slate-500'>
                        <button className='w-full text-start px-3 py-2 hover:bg-slate-200'
                          onClick={() => {
                            setShowQuestionOptions(false);
                            const newId = uuidv4();
                            setQuestionTypes([...questionTypes, { type: 'MCQ', id: newId }]);
                            setEmptyQuestions(false)
                          }}>
                          MCQ
                        </button>
                        <button className='w-full text-start px-3 py-2 hover:bg-slate-200'
                          onClick={() => {
                            setShowQuestionOptions(false);
                            const newId = uuidv4();
                            setQuestionTypes([...questionTypes, { type: 'Rearrange', id: newId }]);
                            setEmptyQuestions(false)
                          }}>
                          Rearrange
                        </button>
                      </div>
                    )}
                  </div>

                  <div className='w-full flex justify-end pr-4'>
                    <input type="submit" className='bg-[#054bb4] font-bold max-md:w-[40%] w-[20%] text-white py-2 rounded-full cursor-pointer' value={'Save'} 
                    onClick={() => {
                      if(title == '' && description == ''){
                          setEmptyTitle(true)
                          setEmptyDescription(true)
                        }
                        else if (title == ''){
                          setEmptyTitle(true)
                          setEmptyDescription(false)
                        }
                        else if(description == ''){
                        setEmptyTitle(false)
                        setEmptyDescription(true)
                      }
                      else{
                        setEmptyTitle(false)
                        setEmptyDescription(false)
                        addQuiz()
                      }
                    }} />
                  </div>
                </form>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;
