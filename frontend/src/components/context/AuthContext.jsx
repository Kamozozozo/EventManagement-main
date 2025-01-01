import { useState, createContext,useContext } from "react";
export const AuthContext=createContext()
export const useAuthContext=()=>{
    return useContext(AuthContext)
}
export const AuthContextProvider=({children})=>{
    const [authUser,setAuthUser]=useState(JSON.parse(localStorage.getItem("event-user") )|| null)
    return <AuthContext.Provider value={{authUser,setAuthUser}}>
        {children}
    </AuthContext.Provider>
}
