import React, { useEffect, useState } from 'react';
// import list from "../assets/list.json";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from './Cards';
import axios from "axios";


export default function FreeBook() {
    // const filterData = list.filter((data) => data.category === "Free");

    const [book, setBook] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBook = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/book');
                setBook(res.data.book.filter((data) => data.category === "Free"));
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        };
        getBook();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }


    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            <div className='max-w-screen-2xl container mx-auto md:px-20 px-4'>
                <div>
                    <h1 className='font-bold text-xl pb-2'>Free Offered Courses</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus voluptate minus molestiae amet laudantium in ipsam at a. Ratione dolores laborum veritatis animi facere recusandae dolore alias rerum cumque deserunt.</p>
                </div>
                <div>
                    <Slider {...settings}>
                        {
                            book.map((item) => (
                                <Cards item={item} key={item.id} />
                            ))
                        }
                    </Slider>
                </div>
            </div>

        </>
    )
}
