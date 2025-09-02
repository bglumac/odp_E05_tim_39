export type AuthResponse = {
    success: boolean;
    message: string;
    data?: {
        token: string;
        korisnickoIme: string;
        premium: number;
    }
}