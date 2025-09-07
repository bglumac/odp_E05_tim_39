import { useEffect, useState } from "react";
import type { NoteDto } from "../../models/notes/NoteDto";
import SideMenuForm from "../../components/dashboard/SideMenuForm";
import EditNoteForm from "../../components/edit_note/EditNoteForm";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { ProcitajVrednostPoKljucu } from "../../helpers/local_storage";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";
import { useNavigate, useParams } from "react-router-dom";

interface EditPageProps {
    noteApi: INoteAPIService;
}

const mockNote: NoteDto = {
    id: 1,
    owner: 1,
    header: "Shopping List",
    content: "Milk, Eggs, Bread, Butter",
    public: false,
    isPinned: true,
    isSelected: false,
    createdAt: "2025-09-01",
    updatedAt: "2025-09-02",
};


const EditNotePage = ({ noteApi }: EditPageProps) => {
    const navigate = useNavigate();
    const params = useParams();
    const [note, setNote] = useState<NoteDto>(mockNote);

    const { isAuthenticated, logout } = useAuthHook();
    const token = ProcitajVrednostPoKljucu("authToken") || "";

    useEffect(() => {
        if (!isAuthenticated || !token) {
            logout();
            navigate("/login");
            return;
        }

        (async () => {
            try {
                const noteID = params.noteId;
                console.log(noteID)
                if (!noteID) return;
                const data = await noteApi.getNoteById(token, parseInt(noteID))
                setNote(data);
                console.log(data);
            }

            catch (error) {
                console.error(error);
                // logout();
                navigate("/login");
            }
        })()

    }, [isAuthenticated, logout, navigate, token]);

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this note?");
        if (confirmed) {
            console.log("Note deleted:", note.id);
            navigate("/dashboard");
        }
    };

    const handlePin = () => {
        setNote((prev) => ({ ...prev, isPinned: !prev.isPinned }));
    };

    const handleShare = () => {
        alert("Sharing note ID: " + note.id);
    };

    const handleSaveNote = (updatedNote: NoteDto) => {
        setNote(updatedNote); // ažurira lokalno
        // Ovdje kasnije možeš dodati API poziv ako backend postoji
        noteApi.updateNote(token, updatedNote.id, updatedNote);
        console.log(updatedNote);
        navigate("/user-dashboard");
    };

    return (
        <div className="flex h-screen">
            {/* Leva strana meni - fiksiran */}
            <div className="w-64 h-full fixed top-0 left-0">
                <SideMenuForm
                    selectedCount={1}
                    onEdit={() => { }}
                    onPin={handlePin}
                    onDuplicate={() => { }}
                    onShare={handleShare}
                    onDelete={handleDelete}
                />
            </div>

            {/* Glavni deo - pomeren desno i skrolabilan */}
            <main className="ml-64 flex-1 h-screen overflow-y-auto p-6">
                <EditNoteForm note={note} isPremium={true} onSave={handleSaveNote} />
            </main>
        </div>
    );
};

export default EditNotePage;
