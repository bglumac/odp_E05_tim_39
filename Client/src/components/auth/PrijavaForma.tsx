import { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import { Link } from "react-router-dom";



export function PrijavaForma({authApi} : AuthFormProps) {
    const [korisnickoIme, setKorisnickoIme] = useState("");
    const [lozinka, setLozinka] = useState("");
    const [greska, setGreska] = useState("");
    const {login} = useAuthHook();

    const podnesiFormu = async(e: React.FormEvent) => {
        e.preventDefault();

        const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
        
        if(!validacija.uspesno) {
            setGreska(validacija.poruka ?? "Neispavni podaci");
            return;
        }

        const odgovor = await authApi.prijava(korisnickoIme, lozinka);

        if(odgovor.success && odgovor.data) {
            login(odgovor.data.token);
        }
        else {
            setGreska(odgovor.message);
            setKorisnickoIme("");
            setLozinka("");
        }
  
    }

    return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Svetlija gradient pozadina */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-white"></div>

      {/* Animacija letećih papira sa svih strana */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 bg-white opacity-60 rounded-full animate-fly`}
          style={{
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            animationDuration: `${4 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}

      {/* Centriran box za prijavu */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-10 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center text-[#4451A4] mb-2">
            Dobrodošli u WeNotes
          </h1>
          <p className="text-center text-sm text-gray-700 mb-6">
            Aplikacija za beleške, tvoja digitalna sveska u džepu!
          </p>
          <form onSubmit={podnesiFormu} className="space-y-4">
            <input
              type="text"
              placeholder="Korisnicko ime"
              value={korisnickoIme}
              //required
              onChange={(e) => setKorisnickoIme(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4451A4]"
            />
            <input
              type="password"
              placeholder="Lozinka"
              value={lozinka}
             // required
              onChange={(e) => setLozinka(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4451A4]"
            />

            {greska && (
          <p className="text-md text-center text-red-600 font-medium">{greska}</p>
        )}

            <button
              type="submit"
              className="w-full bg-[#4451A4] hover:bg-[#2b2b7a] text-white py-2 rounded-lg transition"
            >
              Prijavi se
            </button>
          </form>

          
          <p className="text-center text-sm mt-4 text-gray-700">
            Nemate nalog?{" "}
            <Link to="/register" className="text-[#4451A4] hover:underline">
              Registruj se
            </Link>
          </p>
        </div>
      </div>

      {/* Tailwind CSS animacije */}
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