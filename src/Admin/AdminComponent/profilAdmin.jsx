import React from "react";
import ProfileCard from "../../components/ProfilCards";
import NavbarAdmin from "./navbarAdmin";

export default function ProfileAdmin() {
  return (
    <>
      <NavbarAdmin />
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <ProfileCard hideTabs />
      </div>
    </>
  );
}