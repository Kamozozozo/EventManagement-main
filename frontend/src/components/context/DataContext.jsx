import React,{createContext,useState} from "react"
export  const DataContext = createContext()
export const DataProvider = ({children}) => {
    const [searchResults,setSearchResults] = useState([])
    return(
        <DataContext.Provider value={{searchResults,setSearchResults}}>
            {children}
        </DataContext.Provider>
    )
}
