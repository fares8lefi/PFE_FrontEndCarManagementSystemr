import React, { useRef, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 import { addUserAdmin } from "../../services/ApiUser";

export default function AddAdmin() {
  const Password = useRef(null);
  const ConfirmPassword = useRef(null);

  // Par défaut, user_image est le chemin de l'image par défaut
  const [userImage, setUserImage] = useState("/user.png");
  const [userImageFile, setUserImageFile] = useState(null);

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.warning("Veuillez sélectionner une image !");
      return;
    }
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Seules les images sont autorisées !");
      return;
    }
    setUserImage(URL.createObjectURL(file));
    setUserImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = newAdmin;

    if (!username || !email || !password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("L'adresse e-mail n'est pas valide. Exemple : exemple@domaine.com");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial, et avoir 8 caractères minimum.");
      return;
    }

    if (Password.current?.value !== ConfirmPassword.current?.value) {
      toast.error("Les mots de passe doivent être identiques !");
      return;
    }

    const formData = new FormData();
    formData.append(
      "user",
      JSON.stringify({
        ...newAdmin,
        role: "admin",
      })
    );
    // Si l'utilisateur a choisi une image, on l'envoie, sinon on envoie le nom du fichier par défaut
    if (userImageFile) {
      formData.append("user_image", userImageFile);
    } else {
      // On envoie le nom du fichier par défaut (à gérer côté backend si besoin)
      formData.append("user_image", "user.png");
    }

    try {
      const response = await addUserAdmin(formData);
      if (response.data.success) {
        toast.success("Administrateur ajouté avec succès !");
        setNewAdmin({
          username: "",
          email: "",
          password: "",
          role: "admin",
        });
        setUserImage("/user.png");
        setUserImageFile(null);
        Password.current.value = "";
        ConfirmPassword.current.value = "";
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Une erreur est survenue lors de l'ajout"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 py-8">
      <form
        onSubmit={handleSubmit}
        className="relative border border-gray-200 shadow-2xl p-10 rounded-3xl w-full max-w-lg bg-white/90 backdrop-blur-md"
      >
        <h3 className="text-2xl font-extrabold text-center mb-2 text-sky-900">Ajouter un administrateur</h3>
        <p className="text-gray-500 text-center mb-6">Remplissez le formulaire pour créer un nouveau compte admin</p>

        <div className="flex flex-col items-center mb-6">
          <img
            src={userImage}
            alt="Aperçu de l'admin"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 shadow mb-2"
          />
          <label className="cursor-pointer text-blue-600 hover:underline">
            Changer la photo
            <input
              type="file"
              name="user_image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            name="username"
            value={newAdmin.username}
            onChange={handleChange}
            className="w-full bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            value={newAdmin.email}
            onChange={handleChange}
            placeholder="Adresse e-mail"
            className="w-full bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              name="password"
              value={newAdmin.password}
              onChange={handleChange}
              ref={Password}
              className="w-full bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              ref={ConfirmPassword}
              placeholder="Confirmez le mot de passe"
              onChange={(e) => (ConfirmPassword.current.value = e.target.value)}
              className="w-full bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
            </span>
          </div>

          <button
            className="bg-gradient-to-r from-sky-500 to-blue-600 w-full rounded-xl py-3 text-white text-center font-semibold hover:from-blue-600 hover:to-sky-500 transition-all shadow-lg mt-2"
            type="submit"
          >
            Ajouter l'admin
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
    </div>
  );
}
