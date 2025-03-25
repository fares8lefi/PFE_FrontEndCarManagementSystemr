import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer  from './components/Footer';
import Login from './layouts/Login'
import Singup from './layouts/Singup.jsx'
import Home  from './layouts/home.jsx'
import UsersTable from './components/UsersTable.jsx'
import CarCards from './components/CarCards.jsx'
import CarDetaille from './layouts/CarDetaille.jsx'
import CarPlusDetaille  from './components/CarPlusDetaille.jsx'
import CommentCards from './components/CommentCards.jsx'
import AddCarAnnounecement from './components/AddCarAnnounecement.jsx'

function App() {
  return (
    <>
  
     
      <Routes>
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/singup" element={<Singup />} />
        <Route path="/UsersTable" element={<UsersTable />} />
        <Route path="/carCards" element={<CarCards />} />
        <Route path='/carDetaille/:id' element={<CarDetaille/>}></Route>
        <Route path='/carPlusDetaille/:id' element={<CarPlusDetaille/>}></Route>
        <Route path='/commentCards/:id' element={<CommentCards/>}></Route>
        <Route path='/addCarAnnounecement' element={<AddCarAnnounecement/>}></Route>
        <Route path='/*' element={<Home/>}></Route>
        {/*<Route path='/*' element={<Error/>}></Route>*/}
      </Routes>
    </>
  )
}

export default App