import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ObrisiVrednostPoKljucu } from "../../../helpers/local_storage";
import { useAuthHook } from "../../../hooks/auth/useAuthHook";


type ProtectedRouteProps = {
    children: React.ReactNode;
    premium: number;
    redirectTo?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    premium,
    redirectTo = "/login",
}) => {
    const {isAuthenticated, user, isLoading, logout} = useAuthHook();
    const location = useLocation();

    const handleLogout = () => {
        ObrisiVrednostPoKljucu("authToken");
        logout();
    };

    if(isLoading) {
        return <h1>Loading...</h1>;
    }


    if(!isAuthenticated) {
        return <Navigate to={redirectTo} state={ { from: location }} replace />
    }

    //potrebna specificna uloga: premium user 
    if(premium && user?.premium !== premium) {
        return (
            <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-red-800/70 flex items-center justify-center">
                <div className="bg-white/30 backdrop-blur-lg shadow-lg border border-red-300 rounded-2xl p-10 w-full max-w-lg text-center">
                <h2 className="text-3xl font-bold text-red-800/70 mb-4">
                    Nemate dozvolu
                </h2>
                <p className="text-gray-800 text-lg mb-6">
                    Potrebna je uloga{" "}
                    <span className="font-semibold">"{premium}"</span> za pristup ovoj stranici.
                </p>
                <button
                    onClick={handleLogout}
                    className="bg-red-700/60 hover:bg-red-700/70 text-white px-6 py-2 rounded-xl transition"
                >
                    Odjava iz aplikacije
                </button>
                </div>
            </main>
        );
    }

    return <>{children}</>;
};