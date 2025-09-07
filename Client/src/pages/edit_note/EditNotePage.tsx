//import SideMenuForm from "../../components/dashboard/SideMenuForm";
import EditNoteForm from "../../components/edit_note/EditNoteForm";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";

interface EditPageProps {
  noteApi: INoteAPIService;
}

const EditNotePage = ({ noteApi }: EditPageProps) => {
  return (
    <div className="flex h-screen">
     

      {/* Glavni deo - EditNoteForm upravlja logikom */}
      <main className="ml-64 flex-1 h-screen overflow-y-auto p-6">
        <EditNoteForm noteApi={noteApi} />
      </main>
    </div>
  );
};

export default EditNotePage;
