import React,{useState} from 'react'
import useSIgnup from './hooks/useSIgnup';


const AddOrganizer = () => {
  
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [motivation,setMotivation] = useState('');
    const {addOrganizers}=useSIgnup()

    const role="Organizer"
    const handleName = (event) => {
        setName(event.target.value);
    };
    const handlePassword = (event) => {
        setPassword(event.target.value);
    };
    const handleComfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
    };
    const handleEmail = (event) => {
        setEmail(event.target.value);
    };
    const handleMotivation = (event) => {
        setMotivation(event.target.value);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        await addOrganizers(name,email,password,confirmPassword,motivation,role)
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
                        onChange={handleEmail}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Email"
                        required
                      
                    /> <input
                        
                    type="text"
                    id=""
                    onChange={handleMotivation}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-30px p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="motivation"
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
                          <input
                            type="password"
                            name="password"
                            id="password"
                            onChange={handleComfirmPassword}
                            placeholder="confirm password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
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

export default AddOrganizer