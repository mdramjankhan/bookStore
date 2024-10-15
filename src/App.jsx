import React, { Children } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageNotFound from './pages/PageNotFound';
import Home from './components/Home';
import Courses from './courses/Courses';
// import Navbar from './components/Navbar';
import Signup from './components/Signup';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthProvider';

const App = () => {
  const [authUser,setAuthUser] =useAuth();
  return (
    <>
    <div className='dark:bg-slate-900 dark:text-white'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course" element={authUser?<Courses />:<Navigate to={"/signup"}/>} />
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Toaster />
    </div>
    </>

  )
}

export default App
