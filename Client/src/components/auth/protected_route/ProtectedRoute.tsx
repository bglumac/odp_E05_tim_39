import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthHook } from "../../../hooks/auth/useAuthHook";


type ProtectedRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    redirectTo = "/login",
}) => {
    const {isAuthenticated, isLoading} = useAuthHook();
    const location = useLocation();

    if(isLoading) {
        return <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 border-4 border-[#4451A4] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-semibold text-[#4451A4] animate-pulse">
                Loading...
              </p>
            </div>;
    }


    if(!isAuthenticated) {
        return <Navigate to={redirectTo} state={ { from: location }} replace />
    }

    return <>{children}</>;
};