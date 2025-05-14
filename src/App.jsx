import { Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Footer  from './components/Footer';
import Login from './layouts/Login'
import Singup from './layouts/Singup.jsx'
import Profil from './layouts/profil.jsx'
import Home  from './layouts/home.jsx'
import UsersTable from './components/UsersTable.jsx'
import CarCards from './components/CarCards.jsx'
import CarDetaille from './layouts/CarDetaille.jsx'
import Search from './layouts/search.jsx'
import Services from './layouts/Services.jsx'
import Contact from './layouts/Contact.jsx'
import CarPlusDetaille  from './components/CarPlusDetaille.jsx'
import CommentCards from './components/CommentCards.jsx'
import AddCarAnnounecement from './components/AddCarAnnounecement.jsx'
import ProfilCard from './components/ProfilCards.jsx'
import Favoris from './components/Favoris.jsx'
import Notifications from './components/notificationsCards.jsx'
import UserCars from './components/UserCars.jsx'
import SideBar from './components/FilterSidebar.jsx'
import Parametres from './components/Parametres'
import HomeAdmin from './Admin/HomeAdmin.jsx'
import DashboardAdmin from './Admin/AdminComponent/DashboardAdmin.jsx'
import SideBarAdmin from './Admin/AdminComponent/SideBarAdmin.jsx'
import UsersManagement from './Admin/AdminComponent/UsersManagement.jsx'
import CarManagement  from './Admin/AdminComponent/CarManagement.jsx'
import MessagesMangement from './Admin/AdminComponent/MessagesMangement.jsx'
import NavbarAdmin from './Admin/AdminComponent/navbarAdmin.jsx'
import AddADmin from './Admin/AdminComponent/addAdmin.jsx'
import ForgotPassword from "./layouts/ForgotPassword";

function App() {
  return (
    <GoogleOAuthProvider 
      clientId="245431269605-m16pbv8u5dcu550m0r0923lil02o5psu.apps.googleusercontent.com"
      onScriptLoadSuccess={() => {
        console.log('Google OAuth script loaded successfully');
        // Vérifier si le script est chargé correctement
        if (window.google) {
          console.log('Google API is available');
        }
      }}
      onScriptLoadError={(error) => {
        console.error('Google OAuth script failed to load:', error);
      }}
    >
      <Routes>
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/navbarAdmin" element={<NavbarAdmin />} />
        <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
        <Route path="/messagesMangement" element={<MessagesMangement />} />
        <Route path="/sideBarAdmin" element={<SideBarAdmin />} />
        <Route path="/usersManagement" element={<UsersManagement />} />
        <Route path="/carManagement" element={<CarManagement />} />    
        <Route path="/addAdmin" element={<AddADmin />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/singup" element={<Singup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={< Notifications/>} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/parametres" element={<Parametres />} />
        <Route path="/UsersTable" element={<UsersTable />} />
        <Route path="/carCards" element={<CarCards />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="/sideBar" element={<SideBar />} />
        <Route path='/carDetaille/:id' element={<CarDetaille/>}></Route>
        <Route path='/carPlusDetaille/:id' element={<CarPlusDetaille/>}></Route>
        <Route path='/commentCards/:id' element={<CommentCards/>}></Route>
        <Route path='/addCarAnnounecement' element={<AddCarAnnounecement/>}></Route>
        <Route path='/userCars' element={<UserCars/>}></Route>
        <Route path='/profilCard' element={<ProfilCard/>}></Route>{/*id from session*/}
        <Route path='/*' element={<Home/>}></Route>
        {/*<Route path='/*' element={<Error/>}></Route>*/}
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App