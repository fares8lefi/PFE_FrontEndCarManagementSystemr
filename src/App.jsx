import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'


function App() {
  return (
    <>
     
      <Routes>
        <Route path="/Navbar" element={<Navbar />} />
        
      </Routes>
    </>
  )
}

export default App