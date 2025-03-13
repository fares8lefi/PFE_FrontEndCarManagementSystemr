import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="border border-gray-300 shadow-2xl shadow-gray-500 p-8 rounded-xl w-full max-w-md bg-white">
          <h3 className="text-2xl font-bold text-center mb-2">Create Your Account</h3>
          <p className="text-gray-600 text-center mb-4">Let's Get Started </p>
          
          <button className="flex items-center justify-center w-full border border-gray-300 rounded-3xl py-2 mb-4">
            <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Login with Google
          </button>
          
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-2 text-gray-500">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          <input
            type="email"
            placeholder="Enter Your E-Mail"
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          
          <div className="flex justify-between items-center mb-4 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember Me
            </label>
            <a href="#" className="text-amber-700">Forgot Password ?</a>
          </div>
          
          <button className="bg-black w-full rounded-3xl py-3 text-white text-center font-semibold">LogIn</button>
          
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-2 text-gray-500">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          <button className="flex items-center justify-center w-full border border-gray-300 rounded-3xl py-2">
            <img src="/facebook-icon.png" alt="Facebook" className="w-5 h-5 mr-2" />
            Login with Facebook
          </button>
          
          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an account? <a href="#" className="text-blue-600">Create an account</a>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
