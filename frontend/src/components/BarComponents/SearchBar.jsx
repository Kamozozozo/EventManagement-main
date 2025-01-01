import React, { useEffect, useState ,useContext} from 'react';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { URL } from '../../App';
import toast from 'react-hot-toast';

const SearchBar = () => {
  const [query,setQuery]=useState("")
  const navigate=useNavigate()
  const {setSearchResults}=useContext(DataContext)
  async function Query(){
    try{
    const response = await fetch(`${URL}/api/events/search?eventName=${query}`);
    const data = await response.json();
    if(response.ok){
      setSearchResults(data)
      navigate("/event/search")
    }
    else{
      toast.error(data.message)
      setSearchResults([])
    }
    }
    catch(error){
      toast.error(error.message)
    }
  }
  const handleSearch=(e)=>{
    e.preventDefault();
    Query()
  }
  return (
    
    <form onSubmit={handleSearch} className="border-b-2 border-gray-400 fixed top-0 w-11/12 h-14 flex justify-center items-center  bg-white px-8 sm:px-9 lg:px-10">
    <input
      className="w-full max-w-xs sm:max-w-md lg:max-w-lg mr-3 px-4 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 h-9 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    <button
      className="h-9 px-4 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      type="submit"
    >
      <CiSearch className="w-5 h-5" />
    </button>
  </form>
  
    
  );
};

export default SearchBar;
