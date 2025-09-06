import { Link } from "react-router-dom";


export default function PageNotFound() {
 return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Gradient pozadina */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-white"></div>

      {/* Animacija letećih papirića */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-white opacity-60 rounded-full animate-fly"
          style={{
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            animationDuration: `${4 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}

      {/* Centrirani box */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-10 w-full max-w-sm text-center">
          <h1 className="text-6xl font-extrabold text-[#4451A4] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#4451A4] mb-2">
            Stranica nije pronađena
          </h2>
          <p className="text-gray-700 mb-6">
            Stranica koju tražite ne postoji ili je premeštena.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#4451A4] hover:bg-[#2b2b7a] text-white px-6 py-2 rounded-xl transition"
          >
            Nazad na početnu
          </Link>
        </div>
      </div>

      <style>
        {`
          @keyframes fly {
            0% { transform: translate(0,0) rotate(0deg); opacity: 0.5; }
            50% { opacity: 1; }
            100% { transform: translate(100vw, 100vh) rotate(360deg); opacity: 0; }
          }
          .animate-fly {
            animation-name: fly;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `}
      </style>
    </div>
  );
}