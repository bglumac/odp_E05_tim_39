import { useEffect } from "react";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { useNavigate } from "react-router-dom";
import { PrijavaForma } from "../../components/auth/PrijavaForma";


interface LoginProps {
    authApi: IAuthAPIService;
}

export default function Prijava({ authApi }: LoginProps) {
    const { isAuthenticated, user } = useAuthHook();
    const navigate = useNavigate();



    useEffect(() => {
        if (isAuthenticated && user) {
            console.log("AUT");
            navigate(`/user-dashboard`);
        }

        else {
            console.log(isAuthenticated);
            console.log(user);
        }
    }, [isAuthenticated, navigate, user]);


    return (
        <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-blue-800/70 flex items-center justify-center">
            <PrijavaForma authApi={authApi} />
        </main>
    );
}
