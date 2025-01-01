import React,{useState} from 'react'
import useAddStudent from './hooks/useCreateStudent';

const AddStudent = () => {

    const [name, setName] = useState('');
    const [ surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [faculty,setFaculty] = useState('');
    const [StudyLevel,setStudyLevel] = useState('');
    const [StudentNumber,setStudentNumber] = useState('');

    const {addStudent}=useAddStudent()

    const role="Student"
    const handleName = (event) => {
        setName(event.target.value);
    };
    const handlePassword = (event) => {
        setPassword(event.target.value);
    };
    const handleFaculty = (event) => {
        setFaculty(event.target.value);
    };
    const handleStudyLevel = (event) => {
        setStudyLevel(event.target.value);
    };
    const handleSurname = (event) => {
        setSurname(event.target.value);
    };
    const handleStudentNumber= (event) => {
        setStudentNumber(event.target.value);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        await addStudent(name , surname, password, role,faculty,StudyLevel,StudentNumber)
    };
    
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col h-full items-center justify-center mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center">
            <div className=" space-y-4 md:space-y-6 sm:p-8">
                <form  onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
                <input
                        
                        type="text"
                        onChange={handleName}
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name"
                        required
                      
                    />
                     <input
                        type="text"
                        id=""
                        onChange={handleSurname }
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="surname"
                        required
                      
                    /> <input
                        
                    type="number"
                    id=""
                    onChange={handleStudentNumber}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-30px p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="StudentNumeber"
                    required
                  
                />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            onChange={handlePassword}
                            placeholder="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                        <select onChange={handleFaculty} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg">
                            <option value="">Select Faculty</option>
                            <option value="COMMERCE,ADMINISTRATION AND LAW">COMMERCE,ADMINISTRATION AND LAW</option>
                            <option value="EDUCATION">EDUCATION</option>
                            <option value="ENGINEERING, SCIENCE AND AGRICULTURE">ENGINEERING, SCIENCE AND AGRICULTURE</option>
                            <option value="HUMANITIES AND SOCIAL SCIENCE">HUMANITIES AND SOCIAL SCIENCE</option>
                            
                    </select>
                        <select onChange={handleStudyLevel} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg">
                            <option value="">Select Study Level</option>
                            <option value="postgrad">Postgrad</option>
                            <option value="undergrad">Undergrad</option>
              </select>
                    <button
                        type="submit"
                        className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      
                    >
                    ADD
                    </button>
                   
            

                </form>
               
            </div>
        </div>
    </div>
</section>
  )
}

export default AddStudent