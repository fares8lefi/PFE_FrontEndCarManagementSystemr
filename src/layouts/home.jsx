import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarCards from '../components/CarCards';
import Services from './Services';
import Contact from './Contact';
export default function home() {
  return (
    <div>
    <Navbar/>
    <CarCards/>
    <Services/>
    <Contact/>
     <Footer/>
    </div>
  )
}
