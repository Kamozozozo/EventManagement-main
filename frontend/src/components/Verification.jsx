import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { URL } from '../App';


const Verification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/api/auth/verifyEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email:id, verificationCode }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(()=>{
          toast.success(data.message);
          toast.success("please login")
        },100)
        navigate("/login")
      } else {
        setMessage(data.message);
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      setMessage('Verification failed');
      toast.error('Verification failed');
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center p-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Email Verification</h1>
        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="verificationCode" className="sr-only">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter verification code"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Verify Email
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{message}</p>}
      </div>
    </section>
  );
};

export default Verification;
