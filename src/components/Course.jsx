import React, { useEffect, useState } from 'react';
import Cards from './Cards';
import {Link} from 'react-router-dom';
import axios from "axios";

export default function Course() {
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/book');
        setBook(res.data.book);
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

  // console.log(book)
  return (
    <>
    <div className=''>
      <div className='pt-28 text-center '>
        <h1 className='text-2xl font-semibold md:text-4xl'>We're delighted to have you <span className='text-pink-500'>Here!:)</span> </h1>
        <p className='mt-12'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur sunt architecto esse voluptate optio error dicta delectus neque numquam cumque maiores consequatur, soluta doloribus enim cum molestias aut unde mollitia!Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam architecto non impedit dolorum ullam est debitis nihil, animi rem assumenda dolorem magni dolore natus dolor vero quo quaerat? Minima, fugiat!
        </p>
        <Link to={"/"}>
        <button className='bg-pink-500 text-white px-4 py-2 rounded-md  hover:bg-pink-700 duration-300 mt-6'>Back</button>
        </Link>
      </div>
      <div className='mt-12 grid grid-cols-1 md:grid-cols-3'>
        {
          book.map((item)=>(
            <Cards item={item} key={item.id}  />
          ))
        }
      </div>
    </div>
    </>
  )
}
