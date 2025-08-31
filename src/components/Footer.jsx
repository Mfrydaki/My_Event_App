import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
   return (
     <footer className="fixed bottom-0 left-0 right-0 bg-black text-gray-300 py-3">
       <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
         <p className="text-sm ">© 2025 MrK. All rights reserved.</p>

         {/* Δεξιά: Social Links */}
         <div className="flex gap-4 text-lg">
           <a
             href="https://instagram.com/"
             target="_blank"
             rel="noopener noreferrer"
             className="hover:text-pink-500 transition"
           >
             <FaInstagram />
           </a>
           <a
             href="https://facebook.com/"
             target="_blank"
             rel="noopener noreferrer"
             className="hover:text-blue-500 transition"
           >
             <FaFacebook />
           </a>
         </div>
       </div>
     </footer>
   );
}
