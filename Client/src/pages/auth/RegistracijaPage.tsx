
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { RegistracijaForma } from "../../components/auth/RegistracijaForma";


interface RegistracijaPageProps {
    authApi: IAuthAPIService;
}

export default function RegistracijaPage({authApi}: RegistracijaPageProps) {
    return(
        <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-blue-800/70 flex items-center justify-center">
            <RegistracijaForma authApi={authApi} />
        </main>
    )
}