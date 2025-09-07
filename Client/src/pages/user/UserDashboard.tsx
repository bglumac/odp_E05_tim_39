import { type FC } from "react";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { useNavigate } from "react-router-dom";
import NoteViewForm from "../../components/dashboard/NoteViewForm";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";
import { ProcitajVrednostPoKljucu } from "../../helpers/local_storage";

interface UserDashboardProps {
  noteApi: INoteAPIService;
}

const UserDashboard: FC<UserDashboardProps> = ({ noteApi }) => {
  const { isAuthenticated, logout, user } = useAuthHook();
  const navigate = useNavigate();

  const token = ProcitajVrednostPoKljucu("authToken") || "";

  if (!isAuthenticated || !token) {
    logout();
    navigate("/login");
    return null;
  }


  return (
    <div className="flex min-h-screen">
     
      <main className="flex-1 p-6 flex flex-col ml-[244px]">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4451A4] mb-12 ml-6 ">
          Welcome back, {user?.username}!
        </h1>

        {/* Komponenta koja prikazuje sve beleške i dugme za dodavanje */}
        <NoteViewForm noteApi={noteApi} />
      </main>
    </div>
  );
};

export default UserDashboard;
