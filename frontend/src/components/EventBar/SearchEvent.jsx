import React,{useContext} from 'react'
import { DataContext } from '../context/DataContext'
import EventsBar from '../BarComponents/EventsBar'
 

const SearchEvent = () => {
    const { searchResults } = useContext(DataContext)
    console.log(searchResults)
  return ( 
    <EventsBar events={searchResults}/>
  )
}

export default SearchEvent