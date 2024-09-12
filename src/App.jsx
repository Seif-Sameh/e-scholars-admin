import { Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import AdminDashboard from './Pages/AdminDashboard'
import AddClass from './Pages/AddClass'
import AddStudent from './Pages/AddStudent'
import AddMaterial from './Pages/AddMaterial'
import Classes from './Pages/Classes'
import Class from './Pages/Class'
import AddTask from './Pages/AddTask'
import QuizzesMain from './Pages/QuizzesMain'
import AddQuiz from './Pages/AddQuiz'
import ViewQuiz from './Pages/ViewQuiz'
import AddSession from './Pages/AddSession'
import MaterialPage from './MaterialPage'
import StudentInfo from './Pages/StudentInfo'
function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<AdminDashboard />}>
          <Route index element={<Classes />} />
          <Route path='/material_page/:grade/:section/:item_id' element={<MaterialPage />} />
          <Route path='/quizzes' element={<QuizzesMain />} />
          <Route path='/quizzes/quiz/:quiz_id' element={<ViewQuiz />} />
          <Route path='/add_quiz' element={<AddQuiz />} />
          <Route path='/add_class' element={<AddClass />} />
          <Route path='/class/:grade/:section' element={<Class />} />
          <Route path='/class/:grade/:section/student_info' element={<StudentInfo />} />
          <Route path='/class/:grade/:section/add_session' element={<AddSession />} />
          <Route path='/class/:grade/:section/add_student' element={<AddStudent />} />
          <Route path='/class/:grade/:section/add_material' element={<AddMaterial />} />
          <Route path='/ class/:grade/:section/add_task' element={<AddTask />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
