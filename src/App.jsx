import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer  from './components/Footer';
import Login from './layouts/Login'
import Singup from './layouts/Singup.jsx'
function App() {
  return (
    <>
     
      <Routes>
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/singup" element={<Singup />} />

      </Routes>
    </>
  )
}

export default App