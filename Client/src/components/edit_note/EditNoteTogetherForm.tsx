import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { ProcitajVrednostPoKljucu } from "../../helpers/local_storage";
import { io, Socket } from "socket.io-client";
import { applyPatches, makePatches } from "@sanity/diff-match-patch";

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


        setLoading(false);

        // Socket setup
        socket.on("update-text", (data) => {
            setContent((prevContent) => {
                try {
                    // If data is { patches: [...] }, use data.patches
                    // If data is the raw array, use data
                    const patches = Array.isArray(data) ? data : data.patches;

                    const [newValue] = applyPatches(patches, prevContent);
                    console.log("New merged value:", newValue);
                    return newValue;
                } catch (err) {
                    console.error("Patch application failed", err);
                    return prevContent; // Don't change anything if it fails
                }
            });
        })

        // Sync
        socket.on("sync-text", (data) => {
            console.log("Forced sync!");
            setContent(data);
            console.log(data);
        })

        socket.emit("request-sync");
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

    const handleChange = (event: any) => {
        const patches = makePatches(content, event.target.value);
        console.log(patches);
        socket?.emit("update-text", patches);
        setContent(event.target.value)
        console.log("ev val " + event.target.value);
    }

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
                onChange={handleChange}
                placeholder="Type here..."
                className="min-h-[300px] border p-4 w-full resize-none"
            />



            {error && <p className="text-red-600">{error}</p>}

            {/* Dugmici Save/Cancel desno */}
            <div className="flex justify-end gap-4 mt-2">
                <button
                    onClick={handleSave}
                    disabled={saving && user?.id == owner}
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
