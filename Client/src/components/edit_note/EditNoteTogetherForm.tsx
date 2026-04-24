import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { ProcitajVrednostPoKljucu } from "../../helpers/local_storage";
import { io, Socket } from "socket.io-client";
import { connectSocket } from "../../helpers/socket_helper";

interface EditNoteTogetherFormProps {
    noteApi: INoteAPIService;
    socket: Socket | null;
}

const EditNoteTogetherForm = ({ noteApi, socket }: EditNoteTogetherFormProps) => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuthHook();
    const token = ProcitajVrednostPoKljucu("authToken") || "";
    const [owner, setOwner] = useState(-1);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPinned, setIsPinned] = useState(false);
    //const [image, setImage] = useState<File | null>(null);


    useEffect(() => {

        if (!isAuthenticated || !token) {
            logout();
            navigate("/login");
            return;
        }

        if (socket == null) {
            navigate("/user-dashboard");
            return;
        }

        // Socket setup
        socket.on("update", () => {
            // Update text box
        })
        
        const fetchNote = async () => {
            try {
                const data = await noteApi.getNoteById(token, Number(noteId));
                setTitle(data.header ?? "");
                setContent(data.content ?? "");
                setIsPinned(data.pinned ?? false);
                setOwner(data.owner);
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
            // if (image && user?.permission === 1) {
            //     noteUpdate.image = image;
            // }
            await noteApi.updateNote(token, Number(noteId), noteUpdate);
            navigate("/user-dashboard");
        } catch (err) {
            console.error(err);
            setError("Greška pri čuvanju beleške. Pokušajte ponovo.");
        } finally {
            setSaving(false);
        }
    };

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         setImage(e.target.files[0]);
    //     }
    // };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Title input */}
            <input
                value={title}
                disabled={true}
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
                    disabled={saving && user?.id == owner }
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

export default EditNoteTogetherForm;
