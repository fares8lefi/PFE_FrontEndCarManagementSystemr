import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer  from './components/Footer';
import Login from './layouts/Login'
import Singup from './layouts/Singup.jsx'
import Error  from './layouts/Error.jsx'
import UsersTable from './components/UsersTable.jsx'
import CarCards from './components/CarCards.jsx'
import CarDetaille from './layouts/CarDetaille.jsx'
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
        {/*<Route path='/*' element={<Error/>}></Route>*/}
      </Routes>
    </>
  )
}

export default App