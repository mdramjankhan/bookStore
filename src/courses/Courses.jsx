import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Course from "../components/Course";

export default function Courses() {
    return (
        <>
            <Navbar />
            <div className='max-w-screen-2xl container my-10 mx-auto md:px-20 px-4 '>
                <Course/>
            </div>
            <Footer />
        </>
    )
}
