import React from 'react';
// import Layout from '../components/layouts/Layout';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div title={'404 Page Not Found - E.Com.Express'}>
      <div  className="flex justify-center items-center flex-col w-full h-[80vh]">
        <h1 className='text-[5rem] font-bold font-sans'>404</h1>
      <h1 className='text-[1.2rem]'> Oops ! Page Not found</h1>
        <button onClick={() => navigate(-1)}
          className='bg-red-300 p-2 rounded-lg pl-6 pr-6 mt-4 font-medium hover:bg-red-500 transition ease-in-out hover:text-white hover:border-black border'
        >Go Back</button>
      </div>
    </div>
  )
}

export default PageNotFound
