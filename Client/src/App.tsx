import { Route, Routes } from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import Prijava from "./pages/auth/PrijavaPage";


function App() {
  return(
    <Routes>
      <Route path="/" element={<Prijava authApi={authApi} />} />
      <Route path="/login" element={<Prijava authApi={authApi} />} />
    </Routes>
  );
} 

export default App;