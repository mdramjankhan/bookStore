import React from 'react'
import { Link } from 'react-router-dom'
import Login from './Login'
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from 'react-hot-toast';

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(data) => {
        const userInfo = {
            fullname: data.fullname,
            email: data.email,
            password: data.password
        }
        // console.log(userInfo);
        await axios.post("http://localhost:4000/api/signup",userInfo)
        .then((res)=>{
            console.log(res.data);
            if(res.data.success) {
                toast.success(res.data.message);
            }
            localStorage.setItem("User",JSON.stringify(res.data.user));
        })
        .catch ((e)=>{
            // if(e.responce){
            //     console.log(e);
            //     alert(e.responce.data.message);
            // }
            console.log(e);
            toast.error("error- existing email found");
        })
    };
    return (
        <div className='flex h-screen justify-center items-center shadow-md'>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            {/* <button className="btn hidden" onClick={() => document.getElementById('my_modal_3').showModal()}>open modal</button> */}
            <div className="w-[600px]">
                <form className="modal-box dark:bg-slate-900 dark:text-white" onSubmit={handleSubmit(onSubmit)}>
                    <div method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <Link to={"/"} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</Link>
                    </div>
                    <h3 className="font-bold text-lg">Signup</h3>
                    <div className='mt-4 space-y-2'>
                        <span>Name</span> <br />
                        <input type="text" placeholder='Enter Your Name'
                        className='w-80 px-3 border rounded-md outline-none'
                        {...register("fullname", { required: true })}
                        />
                        <br />
                        {errors.fullname && <span className='text-sm text-red-500'>This field is required</span>}
                        <br /> <br />
                        <span>Email</span> <br />
                        <input type="email" placeholder='Enter Your Email'
                        className='w-80 px-3 border rounded-md outline-none'
                        {...register("email", { required: true })}
                        /> 
                        <br />
                        {errors.email && <span className='text-sm text-red-500'>This field is required</span>}
                        <br /> <br />
                        {/* password */}
                        <span>Password</span> <br />
                        <input type="password" placeholder='Enter Your Password'
                        className='w-80 px-3 border rounded-md outline-none'
                        {...register("password", { required: true })}
                        />
                        <br />
                        {errors.password && <span className='text-sm text-red-500'>This field is required</span>}
                    </div>
                    {/* button */}
                    <div className='flex justify-around mt-4 gap-20'>
                        <button className='bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-200'>Signup</button>
                        <p>Already have an account? 
                            <button onClick={() => document.getElementById('my_modal_3').showModal()} className='underline text-blue-500 cursor-pointer'>
                                Login</button> <Login/>
                                </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
