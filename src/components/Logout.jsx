import React from 'react';
import { useAuth } from "../context/AuthProvider";
import toast from 'react-hot-toast';


export default function Logout() {
    const [authUser,setAuthUser] =useAuth();
    const handleLogout = () => {
        try {
            setAuthUser({
                ...authUser,
                user:null
            })
            localStorage.removeItem("User");
            toast.success("Logout successfully");
            window.location.reload()
        }
        catch(e){ 
            toast.error("Error: ",e);
        }
    }
    return (
        <div>
            <button 
            onClick={handleLogout}
            className='px-3 py-2 bg-red-500 text-white rounded-md cursor-pointer'>Logout</button>
        </div>
    )
}
