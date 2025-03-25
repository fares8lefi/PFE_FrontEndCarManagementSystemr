import React from 'react'
import {BrowserRouter,Routes, Route} from 'react-router-dom';
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'
import UsersTable from './components/UsersTable.jsx'
import CarCards from './components/CarCards.jsx'
import Login from './layouts/Login.jsx'
import Singup from './layouts/Singup.jsx'
// import Error  from './layouts/Error.jsx'
import home  from './layouts/home.jsx'
import CarDetaille  from './layouts/CarDetaille.jsx'
import CarPlusDetaille  from './components/CarPlusDetaille.jsx'
import CommentCards  from './components/CommentCards.jsx'
export default function RouteComp() {
  return (
    <div>
       <BrowserRouter> 
      <Routes>
        <Route path='/App' element={<App/>}></Route>
        <Route path='/Navbar' element={<Navbar/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/singup' element={<Singup/>}></Route>
        <Route path='/usersTable' element={<UsersTable/>}></Route>
        <Route path='/carCards' element={<CarCards/>}></Route>
        <Route path='/carDetaille/:id' element={<CarDetaille/>}></Route>
        <Route path='/carPlusDetaille/:id' element={<CarPlusDetaille/>}></Route>
        <Route path='/commentCards/:id' element={<CommentCards/>}></Route>
        <Route path='/*' element={<home/>}></Route>
        {/*<Route path='/*' element={<Error/>}></Route>*/}
      </Routes>
      </BrowserRouter> 
    </div>
  )
}
