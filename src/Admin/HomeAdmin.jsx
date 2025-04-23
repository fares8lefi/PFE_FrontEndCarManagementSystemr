import React from 'react';
import NavbarAdmin from './AdminComponent/navbarAdmin';
import AdminLayout from './AdminComponent/SideBarAdmin';

const HomeAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar fixe en haut */}
      <NavbarAdmin />
      
      {/* Layout principal avec Sidebar et contenu */}
      <AdminLayout />
    </div>
  );
};

export default HomeAdmin;
