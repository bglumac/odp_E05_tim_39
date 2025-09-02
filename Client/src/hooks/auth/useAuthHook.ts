import { useContext } from "react";
import type { AuthContextType } from "../../types/auth/AuthContext";
import AuthContext from "../../contexts/auth/AuthContext";

export const useAuthHook = (): AuthContextType => {
    const context = useContext(AuthContext);

    if(context === undefined) {
        throw new Error('useAuthHook mora biti koriscen unutar AuthProvider-a');        
    }

    return context;
};