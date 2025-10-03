import { createContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../configs/axios";
import toast from "react-hot-toast";


const AuthContext = createContext();

export default function AuthProvider({children}){
    const {getToken} = useAuth();

    useEffect(() => {
        const interceptor = axiosInstance.interceptors.request.use(
            async(config) => {
                try {
                    const token = await getToken();
                    if(token) config.headers.Authorization = `Bearer ${token}`;
                } catch (error) {
                    console.log("Error:", error);
                    toast.error("Authentication error.")
                }

                return config;
            },
            (error) => {
                console.log("Axios request error:", error);
                return Promise.reject(error);
            }
        )

        return () =>{
            axiosInstance.interceptors.request.eject(interceptor);
        }

    },[getToken])

    return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}