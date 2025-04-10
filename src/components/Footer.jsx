import { React, useState ,useEffect } from "react";
import { addNewsLetter } from "../services/ApiNewsLetter";
import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import AOS from 'aos'; 
import 'aos/dist/aos.css';
export default function Footer() {
  const [newsLetter, setNewsLetter] = useState({ email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewsLetter({ ...newsLetter, [name]: value });
  };

  const submitNewsLetter = async () => {
    try {
      await addNewsLetter(newsLetter);
      alert("Vous êtes bien inscrit à la newsletter");
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      alert("Une erreur est survenue lors de l'inscription");
    }
  };
 useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);
    useEffect(() => {
      AOS.refresh();
    }, []);
  
  return (
    
    <div data-aos="fade-up">
    <footer className="relative bg-gray-900 bg-[url('../public/background.jpg')] bg-cover bg-center text-gray-300 py-12 px-6 md:px-12">
      <div className="absolute inset-0 bg-sky-900/80 mix-blend-multiply"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 z-10">
        {/* Newsletter Section */}
        <div className="space-y-4">
          <div className="text-3xl text-blue-50 mb-8">
            Research has had a very large influence <br />
            on my life. I have learned <br />
            most of what I know through research.
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Newsletter</h3>
          <div className="relative">
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-3 bg-white/10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            />
            <button
              onClick={submitNewsLetter}
              className="absolute right-2 top-2 bg-blue-500 text-white px-4 py-1 rounded-3xl hover:bg-blue-600 transition-colors duration-200"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">Address</h4>
          <address className="text-sm mt-4 not-italic">
            Mahdia Sidi Massoude
            <br />
            Mahdia - 5100
            <br />
            Email: karhabti@gmail.com
            <br />
            Phone: +216 50 746 656
          </address>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2">
            {["Home", "About Us", "Services", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Brands & Social Media Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Our Brands</h4>
            <div className="text-sm space-y-1">
              {["BMW", "Audi", "Peugeot", "Mercedes"].map((brand) => (
                <div key={brand}>{brand}</div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
              >
                <Facebook className="text-white text-xl" />
                <span className="sr-only">Facebook</span>
              </a>

              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
              >
                <Instagram className="text-white text-xl" />
                <span className="sr-only">Instagram</span>
              </a>

              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
              >
                <Twitter className="text-white text-xl" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}