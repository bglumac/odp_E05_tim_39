
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RegistracijaForma } from "../../components/auth/RegistracijaForma";


interface RegistracijaPageProps {
    authApi: IAuthAPIService;
}

export default function RegistracijaPage({authApi}: RegistracijaPageProps) {
    const {isAuthenticated, user} = useAuthHook();
    const navigate = useNavigate();


    useEffect(() => {
        if(isAuthenticated && user) {
            const u = (user.premium === 0 ? "user" : "premium-user");
            navigate(`/${u}-dashboard`);
        }
    }, [isAuthenticated, navigate, user]);

    return(
        <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-blue-800/70 flex items-center justify-center">
            <RegistracijaForma authApi={authApi} />
        </main>
    )
}