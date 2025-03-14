import React, { useRef } from "react";

export default function Singup() {
  const Password = useRef(null);
  const ConfirmPassword = useRef(null);
  const Singup = () => {
    if (Password.current.value !== ConfirmPassword.current.value) {
      alert("Les mots de passe ne correspondent pas !");
    } else {
      console.log(" signup evec success !");
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="border border-gray-300 shadow-2xl shadow-gray-500 p-8 rounded-xl w-full max-w-md bg-white">
          <h3 className="text-2xl font-bold text-center mb-2">
            Create Your Account
          </h3>
          <p className="text-gray-600 text-center mb-4">Let's Get Started </p>

          <input
            type="text"
            placeholder="User name"
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <input
            type="email"
            placeholder="Enter Your E-Mail"
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            ref={Password}
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <input
            type="password"
            ref={ConfirmPassword}
            placeholder="Confirm your Password"
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <input
            type="file"
            placeholder="upload your image profil"
            accept="image/*"
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <div className="flex justify-between items-center mb-4 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember Me
            </label>
          </div>

          <button
            className="bg-black w-full rounded-3xl py-3 text-white text-center font-semibold"
            onClick={Singup}
          >
            Sing UP
          </button>
        </div>
      </section>
    </div>
  );
}
