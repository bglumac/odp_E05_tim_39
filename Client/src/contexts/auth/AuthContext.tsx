import { createContext, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType } from "../../types/auth/AuthContext";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";
import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "../../types/auth/AuthUser";
import { ObrisiVrednostPoKljucu, ProcitajVrednostPoKljucu, SacuvajVrednostPoKljucu } from "../../helpers/local_storage";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeJwt = (token: string): JwtTokenClaims | null => {
    try {
        const decoded = jwtDecode<JwtTokenClaims>(token);
        console.log(decoded);

        if(decoded.id && decoded.username && decoded.permission != null) {
            return {
                id: decoded.id,
                username: decoded.username,
                permission: decoded.permission
            };
        }

        return null;
    }
    catch (error) {
        console.error('Greska pri dekodiranju JWT tokena.');
        return null;
    }
}

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp ? decoded.exp < currentTime : false;
    }
    catch {
        return true;
    }
}

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = ProcitajVrednostPoKljucu("authToken");

        if(savedToken) {
            if(isTokenExpired(savedToken)) {
                ObrisiVrednostPoKljucu("authToken");
                setIsLoading(false);
                return;
            }

            const claims = decodeJwt(savedToken);

            if(claims) {
                setToken(savedToken);
                setUser({
                    id: claims.id,
                    username: claims.username,
                    permission: claims.permission
                });
            }
            else {
                ObrisiVrednostPoKljucu("authToken");
            }
        }

        setIsLoading(false);
    }, []);
    

    const login = (newToken: string) => {
        const claims = decodeJwt(newToken);

        if(claims && !isTokenExpired(newToken)) {
            setToken(newToken);
            setUser({
                id: claims.id,
                username: claims.username,
                permission: claims.permission
            });

            SacuvajVrednostPoKljucu("authToken", newToken);
        }
        else {
            console.error('Nevazeci/istekao token.');
            setToken(null);
            setUser(null);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        ObrisiVrednostPoKljucu("authToken");
    }

    const isAuthenticated = !!user && !!token;

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading
    };

    return(
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthContext;