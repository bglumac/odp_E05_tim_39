import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { ProcitajVrednostPoKljucu } from "../../helpers/local_storage";

interface ReadOnlyNoteFormProps {
    noteApi: INoteAPIService;
}

const ReadOnlyNoteForm = ({ noteApi }: ReadOnlyNoteFormProps) => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthHook();
    const token = ProcitajVrednostPoKljucu("authToken") || "";

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (!isAuthenticated || !token) {
            logout();
            navigate("/login");
            return;
        }

        const fetchNote = async () => {
            try {
                const data = await noteApi.getNoteById(token, Number(noteId));
                setTitle(data.header ?? "");
                setContent(data.content ?? "");
            } catch (err) {
                console.error(err);
                navigate("/user-dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [noteId, isAuthenticated, token, logout, navigate, noteApi]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
            {/* Naslov */}
            <input
                value={title}
                readOnly
                placeholder="Note title..."
                className="border-b-2 border-[#4451A4] text-2xl px-2 py-1 bg-gray-100 text-gray-800 cursor-not-allowed"
            />

            {/* Sadržaj */}
            <textarea
                value={content}
                readOnly
                placeholder="Note content..."
                className="min-h-[300px] border p-4 w-full resize-none bg-gray-100 text-gray-800 cursor-not-allowed"
            />
        </div>
    );
};

export default ReadOnlyNoteForm;
