import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";
import type { NoteDto } from "../../models/notes/NoteDto";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { ProcitajVrednostPoKljucu } from "../../helpers/local_storage";

interface ReadOnlyNoteFormProps {
    noteApi: INoteAPIService;
}

const ReadOnlyNoteForm = ({ noteApi }: ReadOnlyNoteFormProps) => {
    const { noteId } = useParams<{ noteId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthHook();
    const token = ProcitajVrednostPoKljucu("authToken") || "";

    const [note, setNote] = useState<NoteDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            logout();
            navigate("/login");
            return;
        }

        if (!noteId) return;

        const fetchNote = async () => {
            try {
                const data = await noteApi.getNoteById(token, Number(noteId));
                setNote(data);
            } catch (err) {
                console.error(err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [noteId, noteApi, token, isAuthenticated, logout, navigate]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (notFound) return <div className="text-center mt-10 text-red-500">Beleška nije pronađena.</div>;

    return (
        <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
            <input
                value={note?.header || ""}
                readOnly
                placeholder="Note title..."
                className="border-b-2 border-[#4451A4] text-2xl px-2 py-1 bg-gray-100 text-gray-800 cursor-not-allowed"
            />
            <textarea
                value={note?.content || ""}
                readOnly
                placeholder="Note content..."
                className="min-h-[300px] border p-4 w-full resize-none bg-gray-100 text-gray-800 cursor-not-allowed"
            />
        </div>
    );
};

export default ReadOnlyNoteForm;
