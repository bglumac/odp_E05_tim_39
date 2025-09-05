import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
import axios from "axios";

const API_URL: string = import.meta.env.VITE_API_URL + "auth";

export const authApi: IAuthAPIService = {
    async prijava(korisnickoIme: string, lozinka: string): Promise<AuthResponse> {
       try {
            const res = await axios.post<AuthResponse>(`${API_URL}/login`, {
                korisnickoIme,
                lozinka
            });

            return res.data;
       }
       catch(error) {
        let message = "Greska prilikom prijave.";

        if(axios.isAxiosError(error)){
            message = error.response?.data?.message || message;
        }

        return {
            success: false,
            message,
            data: undefined
        };
       }
    },
    
    async registracija(korisnickoIme: string, lozinka: string, premium: number): Promise<AuthResponse> {
        try {
            const res = await axios.post<AuthResponse>(`${API_URL}/register`, {
                korisnickoIme,
                lozinka,
                premium
            });

            return res.data;
       }
       catch(error) {
        let message = "Greska prilikom registracije.";

        if(axios.isAxiosError(error)){
            message = error.response?.data?.message || message;
        }

        return {
            success: false,
            message,
            data: undefined
        };
       }
    }
}