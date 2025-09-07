import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { ProcitajVrednostPoKljucu } from "../../helpers/local_storage";

interface EditNoteFormProps {
    noteApi: INoteAPIService;
}

const EditNoteForm = ({ noteApi }: EditNoteFormProps) => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuthHook();
    const token = ProcitajVrednostPoKljucu("authToken") || "";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPinned, setIsPinned] = useState(false);
    const [image, setImage] = useState<File | null>(null);


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
                setIsPinned(data.pinned ?? false);
            } catch (err) {
                console.error(err);
                navigate("/user-dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [noteId, isAuthenticated, token, logout, navigate, noteApi]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const noteUpdate: any = { header: title, content, pinned: isPinned };
            if (image && user?.permission === 1) {
                noteUpdate.image = image;
            }
            await noteApi.updateNote(token, Number(noteId), noteUpdate);
            navigate("/user-dashboard");
        } catch (err) {
            console.error(err);
            setError("Greška pri čuvanju beleške. Pokušajte ponovo.");
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Gornji deo sa ID i checkbox */}
            <div className="flex justify-between items-center">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isPinned}
                        onChange={() => setIsPinned((prev) => !prev)}
                    />
                    Pin
                </label>
                <span className="text-gray-400 text-sm">ID: {noteId}</span>
            </div>

            {/* Title input */}
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="border-b-2 border-[#4451A4] text-2xl px-2 py-1"
            />

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type here..."
                className="min-h-[300px] border p-4 w-full resize-none"
            />



            {error && <p className="text-red-600">{error}</p>}

            {/* Dugmici Save/Cancel desno */}
            <div className="flex justify-end gap-4 mt-2">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-4 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-[#4451A4] hover:bg-[#3b4699]"
                        }`}
                >
                    {saving ? "Saving..." : "Save"}
                </button>
                <button
                    onClick={() => navigate("/user-dashboard")}
                    className="border border-[#4451A4] text-[#4451A4] px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditNoteForm;
