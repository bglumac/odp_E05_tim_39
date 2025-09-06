import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NoteDto } from "../../models/notes/NoteDto";
import SideMenuForm from "../../components/dashboard/SideMenuForm";
import EditNoteForm from "../../components/edit_note/EditNoteForm";

const mockNote: NoteDto = {
    noteId: 1,
    noteTitle: "Shopping List",
    content: "Milk, Eggs, Bread, Butter",
    isPinned: true,
    isSelected: false,
    createdAt: "2025-09-01",
    updatedAt: "2025-09-02",
};

const EditNotePage = () => {
    const navigate = useNavigate();
    const [note, setNote] = useState<NoteDto>(mockNote);

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this note?");
        if (confirmed) {
            console.log("Note deleted:", note.noteId);
            navigate("/dashboard");
        }
    };

    const handlePin = () => {
        setNote((prev) => ({ ...prev, isPinned: !prev.isPinned }));
    };

    const handleShare = () => {
        alert("Sharing note ID: " + note.noteId);
    };

    const handleSaveNote = (updatedNote: NoteDto) => {
    setNote(updatedNote); // ažurira lokalno
    // Ovdje kasnije možeš dodati API poziv ako backend postoji
    navigate("/user-dashboard");
};

    return (
        <div className="flex h-screen">
            {/* Leva strana meni - fiksiran */}
            <div className="w-64 h-full fixed top-0 left-0">
                <SideMenuForm
                    selectedCount={1}
                    onEdit={() => {}}
                    onPin={handlePin}
                    onDuplicate={() => {}}
                    onShare={handleShare}
                    onDelete={handleDelete}
                />
            </div>

            {/* Glavni deo - pomeren desno i skrolabilan */}
            <main className="ml-64 flex-1 h-screen overflow-y-auto p-6">
                <EditNoteForm note={note} isPremium={true} onSave={handleSaveNote}/>
            </main>
        </div>
    );
};

export default EditNotePage;
