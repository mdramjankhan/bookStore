import React from 'react'

export default function Cards({item}) {
    // console.log(item) className='dark:bg-slate-900 dark:text-white'
    return (
        <div className='mt-4 p-3'>
            <div className="card w-[22rem] shadow-xl dark:bg-slate-900 dark:text-white ">
                <figure>
                    <img
                        src={item.image}/>
                </figure>
                <div className="card-body">
                    <h2 className="card-title">
                        {item.name}
                        <div className="badge badge-secondary">{item.category}</div>
                    </h2>
                    <p>{item.title}</p>
                    <div className="card-actions flex justify-between">
                        <div className="badge badge-outline">{`$${item.price}`}</div>
                        <div className=" cursor-pointer px-2 py-1 border-black border rounded-md hover:bg-pink-500 hover:border-none hover:text-white duration-500 ">Buy Now</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
