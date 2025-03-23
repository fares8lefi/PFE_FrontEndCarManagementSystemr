import React, { useEffect, useState } from "react";
import { getAllUsers } from "../services/ApiUser";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  
  const getUsers = async () => {
    try {
      const response = await getAllUsers();
      // Accéder à response.data.userlist au lieu de response.data.userList
      if (response.data && Array.isArray(response.data.userlist)) {
        setUsers(response.data.userlist);
      } else {
        console.log("Données utilisateurs invalides :", response.data);
      }
    } catch (error) {
      console.log("Erreur dans le composant :", error);
    }
  };
  
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        users.map((user, index) => (
          <div key={index}>{user.email}</div>
        ))
      )}
    </div>
  );
}
