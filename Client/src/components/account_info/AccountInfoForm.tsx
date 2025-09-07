import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ProcitajVrednostPoKljucu, ObrisiVrednostPoKljucu } from "../../helpers/local_storage";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";
import { useNavigate } from "react-router-dom";

export default function AccountInfoForm() {
    const navigate = useNavigate();
    const [id, setId] = useState<string | number>("");
    const [korisnickoIme, setKorisnickoIme] = useState("");
    const [premium, setPremium] = useState<number>(0);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        const token = ProcitajVrednostPoKljucu("authToken");
        if (token) {
            try {
                const decoded = jwtDecode<JwtTokenClaims>(token);
                setId(decoded.id);
                setKorisnickoIme(decoded.korisnickoIme);
                setPremium(decoded.premium);
            } catch (err) {
                console.error("Nevalidan token:", err);
            }
        }
    }, []);

    const handleLogout = () => {
        ObrisiVrednostPoKljucu("authToken");
        navigate("/login");
    };

    const handleHome = () => {
        navigate("/user-dashboard");
    };

    return (
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg relative">
            {/* Ikonica naloga */}
            <div className="flex justify-center mb-6">
                <img
                    src="/Images/account_icon.png"
                    alt="Account Icon"
                    className="w-28 h-28 rounded-full border-4 border-[#4451A4]"
                />
            </div>

            {/* Podaci */}
            <div className="space-y-4 text-[#4451A4] text-lg">
                <div className="flex justify-between">
                    <span className="font-semibold">ID:</span>
                    <span>{id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Korisničko ime:</span>
                    <span>{korisnickoIme}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Premium:</span>
                    <span
                        className={`px-4 py-1 rounded-full text-white font-semibold ${premium === 1 ? "bg-green-500" : "bg-gray-400"
                            }`}
                    >
                        {premium === 1 ? "DA" : "NE"}
                    </span>
                </div>
            </div>

            {/* Dugmad */}
            <div className="absolute bottom-4 right-4 flex gap-4">
                <button
                    onClick={handleHome}
                    className="px-5 py-2 bg-[#4451A4] text-white rounded-xl shadow hover:bg-[#2f3a7d] transition"
                >
                    Homepage
                </button>
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="px-5 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>

            {/* Potvrda logout-a */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
                        <p className="mb-4 text-lg text-[#4451A4]">Da li ste sigurni da želite da se izlogujete?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                            >
                                Da
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
                            >
                                Ne
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
