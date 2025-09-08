import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
import axios from "axios";

const API_URL: string = "http://localhost:8000/api/v1/auth";

export const authApi: IAuthAPIService = {
    async prijava(korisnickoIme: string, lozinka: string): Promise<AuthResponse> {
       try {
            const res = await axios.post<AuthResponse>(`${API_URL}/login`, {
                username: korisnickoIme,
                password: lozinka,
                //permission: 0
            });

            return res.data;
       }
       catch(error) {
        let message = "Greska prilikom prijave.";
        console.log(error);

        if(axios.isAxiosError(error)){
            message = error.response?.data?.message || message;
        }

        return {
            status: false,
            message,
            data: undefined
        };
       }
    },
    
    async registracija(korisnickoIme: string, lozinka: string, premium: number): Promise<AuthResponse> {
        try {
            const res = await axios.post<AuthResponse>(`${API_URL}/register`, {
                username: korisnickoIme,
                password: lozinka,
                permission: premium
            });

            return res.data;
       }
       catch(error) {
        let message = "Greska prilikom registracije.";

        if(axios.isAxiosError(error)){
            message = error.response?.data?.message || message;
        }

        return {
            status: false,
            message,
            data: undefined
        };
       }
    }
}