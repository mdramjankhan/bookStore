import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';
import FreeBook from './FreeBook';
import Footer from './Footer';

export default function Home() {
    return (
        <div>
            <Navbar />
            <Banner />
            <FreeBook />
            <Footer />
        </div>
    )
}
