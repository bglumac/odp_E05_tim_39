import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { NoteDto } from "../../models/notes/NoteDto";

interface EditNoteFormProps {
    note: NoteDto;
    isPremium: boolean;
    onSave: (updatedNote: NoteDto) => void;
}

const EditNoteForm = ({ note, isPremium, onSave}: EditNoteFormProps) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState(note.noteTitle);
    const [isPinned, setIsPinned] = useState(note.isPinned);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    const applyStyle = (command: string, value?: string) => {
        document.execCommand(command, false, value);            //za formatiranje teksta
    };

    const handleImageInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImages(prev => [...prev, ev.target?.result as string]);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };


    const handleSave = () => {
    if (contentRef.current) {
        note.content = contentRef.current.innerHTML;
    }
    const updatedNote = { ...note, noteTitle: title, isPinned };
    onSave(updatedNote); // ← šaljemo roditelju
};

    const handleCancel = () => {
        setShowCancelConfirm(false);
        navigate("/user-dashboard");
    };

    return (
        <div className="relative flex flex-col w-full gap-4 p-6">
            {/* Gornji deo */}
            <div className="flex justify-between items-start mb-4">
                <div className="text-left">
                    <p className="text-sm text-gray-400">Created: {note.createdAt || "N/A"}</p>
                    <p className="text-sm text-gray-400">Updated: {note.updatedAt || "N/A"}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-gray-400 text-sm">ID: {note.noteId}</span>
                    <label className="flex items-center gap-2 mt-1 font-semibold text-[#4451A4]">
                        <input
                            type="checkbox"
                            checked={isPinned}
                            onChange={() => setIsPinned(prev => !prev)}
                            className="accent-[#4451A4] w-5 h-5"
                        />
                        Pin
                    </label>
                </div>
            </div>

            {/* Title */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full border-b-2 border-[#4451A4] text-2xl px-2 py-1 focus:outline-none mb-4"
            />

            {/* Content sa toolbarom */}
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex gap-2 mb-1">
                    <button type="button" onClick={() => applyStyle("bold")} className="font-bold px-2 py-1 border rounded">B</button>
                    <button type="button" onClick={() => applyStyle("italic")} className="italic px-2 py-1 border rounded">I</button>
                    <button type="button" onClick={() => applyStyle("underline")} className="underline px-2 py-1 border rounded">U</button>
                    <input type="color" onChange={(e) => applyStyle("foreColor", e.target.value)} className="w-8 h-8 p-0 border rounded" />
                    {isPremium && (
                        <input type="file" accept="image/*" onChange={handleImageInsert} className="ml-2" />
                    )}
                </div>
                <div
                    ref={contentRef}
                    contentEditable
                    className="w-full min-h-[400px] p-4 border border-gray-300 rounded resize-none focus:outline-none"
                    dangerouslySetInnerHTML={{ __html: note.content || "" }}
                />

                {images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative inline-block">
                                <img src={img} alt={`Image ${index}`} className="max-h-32 rounded" />
                                <button
                                    type="button"
                                    onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Dugmici ispod textboxa */}
            <div className="flex justify-end gap-4">
                <button
                    className="px-6 py-2 bg-[#4451A4] text-white rounded-lg shadow"
                    onClick={() => setShowSaveConfirm(true)}
                >
                    Save
                </button>
                <button
                    className="px-6 py-2 bg-white border border-[#4451A4] text-[#4451A4] rounded-lg shadow"
                    onClick={() => setShowCancelConfirm(true)}
                >
                    Cancel
                </button>
            </div>

            {/* Save confirm modal */}
            {showSaveConfirm && (
                <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg">
                        <p className="mb-4 text-[#4451A4]">Želite li da sačuvate promene?</p>
                        <div className="flex justify-center gap-4">
                            <button className="px-4 py-2 bg-[#4451A4] text-white rounded-lg" onClick={handleSave}>Save</button>
                            <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setShowSaveConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel confirm modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg">
                        <p className="mb-4 text-[#4451A4]">Izmene se neće sačuvati. Želite li da izađete?</p>
                        <div className="flex justify-center gap-4">
                            <button className="px-4 py-2 bg-[#4451A4] text-white rounded-lg" onClick={handleCancel}>Exit, don't save</button>
                            <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setShowCancelConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditNoteForm;
