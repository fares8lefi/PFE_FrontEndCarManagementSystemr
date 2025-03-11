import React from 'react'
import {Routes, Route} from 'react-router-dom';
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'
export default function RouteComp() {
  return (
    <div>
      <Routes>
        <Route path='/App' element={<App/>}></Route>
        <Route path='/Navbar' element={<Navbar/>}></Route>
      </Routes>

    </div>
  )
}
