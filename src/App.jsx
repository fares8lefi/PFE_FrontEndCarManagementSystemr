import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer  from './components/Footer';

function App() {
  return (
    <>
     
      <Routes>
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Footer" element={<Footer />} />
      </Routes>
    </>
  )
}

export default App