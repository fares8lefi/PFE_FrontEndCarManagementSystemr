import React from 'react'
import {Routes, Route} from 'react-router-dom';
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './layouts/Login.jsx'
import Singup from './layouts/Singup.jsx'
export default function RouteComp() {
  return (
    <div>
      <Routes>
        <Route path='/App' element={<App/>}></Route>
        <Route path='/Navbar' element={<Navbar/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/singup' element={<Singup/>}></Route>
      </Routes>

    </div>
  )
}
