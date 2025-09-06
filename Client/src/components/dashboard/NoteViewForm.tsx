import { Pin } from "lucide-react";
import type { FC } from "react";
import type { NoteDto } from "../../models/notes/NoteDto";

interface NoteViewProps {
  note: NoteDto;
  onSelect: (id: number) => void;
}

const NoteViewForm: FC<NoteViewProps> = ({ note, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(note.noteId)}
      className={`relative w-72 h-48 bg-[#DDE5FF] border border-[#DDE5FF] rounded-xl p-4 shadow-lg cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-2xl ${
        note.isSelected ? "ring-2 ring-[#4451A4]" : ""
      }`}
    >
      {note.isPinned && (
        <Pin className="absolute top-3 right-3 text-[#4451A4]" size={20} />
      )}
      <h3 className="text-center text-[#4451A4] font-semibold mb-2 text-lg">{note.noteTitle}</h3>
      <p className="text-[#4451A4] text-sm line-clamp-6">{note.content}</p>
    </div>
  );
};


export default NoteViewForm;