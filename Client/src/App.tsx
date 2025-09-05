import { Navigate, Route, Routes } from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import Prijava from "./pages/auth/PrijavaPage";
import RegistracijaPage from "./pages/auth/RegistracijaPage";
import PageNotFound from "./pages/auth/not_found_page/PageNotFound";
import { ProtectedRoute } from "./components/auth/protected_route/ProtectedRoute";


function App() {
  return(
    <Routes>
      
      <Route path="/login" element={<Prijava authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaPage authApi={authApi} />} /> 
      <Route path="/404" element={<PageNotFound />} />

      {/*User dashboard */}
      {/* <Route 
        path="/user-dashboard"
        element={
          <ProtectedRoute premium={0}>
            <UserHomePage />
          </ProtectedRoute>
        }/>  */}

      {/*Default ruta*/}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/*Ruta za nepostojece stranice*/}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
} 

export default App;