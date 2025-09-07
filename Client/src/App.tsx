import { Navigate, Route, Routes } from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import Prijava from "./pages/auth/PrijavaPage";
import RegistracijaPage from "./pages/auth/RegistracijaPage";
import PageNotFound from "./pages/auth/not_found_page/PageNotFound";
import { ProtectedRoute } from "./components/auth/protected_route/ProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard";
import EditNotePage from "./pages/edit_note/EditNotePage";
import { noteApi } from "./api_services/note_api/NoteAPIService";
import AccountInfoForm from "./components/account_info/AccountInfoForm";


function App() {
  return(
    <Routes>
      
      <Route path="/login" element={<Prijava authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaPage authApi={authApi} />} /> 
      <Route path="/404" element={<PageNotFound />} />

      {/*User dashboard */}
      <Route 
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard noteApi={noteApi} />
          </ProtectedRoute>
        }/> 

        {/*EditPage ruta*/}
        <Route 
        path="/edit/:noteId"
        element={
          <ProtectedRoute>
            <EditNotePage noteApi={noteApi} />
          </ProtectedRoute>
        }
        />

        {/*Account info ruta */}
        <Route 
          path="/account"
          element={
            <ProtectedRoute>
              <AccountInfoForm/>
            </ProtectedRoute>
          }
        />

      {/*Default ruta*/}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/*Ruta za nepostojece stranice*/}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
} 

export default App;