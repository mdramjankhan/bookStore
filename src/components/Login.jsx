import React from 'react'
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(data) => {
        const userInfo = {
            email: data.email,
            password: data.password
        }
        // console.log(userInfo);
        await axios.post("http://localhost:4000/api/login",userInfo)
        .then((res)=>{
            console.log(res.data);
            if(res.data.success) {
                toast.success(res.data.message,{duration:3000});
                setTimeout(()=>{
                    document.getElementById('my_modal_3').close();
                    window.location.reload();
                },3000)
            }
            localStorage.setItem("User",JSON.stringify(res.data.existingUser));
        })
        .catch ((e)=>{
            // if(e.responce){
            //     console.log(e);
            //     alert(e.responce.data.message);
            // }
            console.log(e);
            toast.error("Error- email not found");
        })
    }







    return (
        <div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn hidden" onClick={() => document.getElementById('my_modal_3').showModal()}>open modal</button>
            <dialog id="my_modal_3" className="modal">
                <form className="modal-box dark:bg-slate-900 dark:text-white" onSubmit={handleSubmit(onSubmit)}>
                    <div  method="dialog" onClick={() => document.getElementById('my_modal_3').close()} >
                        {/* if there is a button in form, it will close the modal */}
                        <Link to={"/"} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</Link>
                    </div>
                    <h3 className="font-bold text-lg">Login</h3>
                    <div className='mt-4 space-y-2'>
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
                    <div className='flex justify-around mt-4'>
                        <button type="submit" className='bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-200'>Login</button>
                        <p>Not Registered? <Link to={"/signup"}  className='underline text-blue-500 cursor-pointer'>Signup</Link></p>
                    </div>
                </form>
            </dialog>
        </div>
    )
}
