import { useState, useEffect } from "react";
import type { FC } from "react";
import type { NoteDto } from "../../models/notes/NoteDto";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import { useNavigate } from "react-router-dom";
import { Pencil, Pin, Copy, Share2, Trash2, User, LogOut } from "lucide-react";
import { ObrisiVrednostPoKljucu, ProcitajVrednostPoKljucu } from "../../helpers/local_storage";

interface NoteViewFormProps {
  noteApi: INoteAPIService;
}

const NoteViewForm: FC<NoteViewFormProps> = ({ noteApi }) => {
  const { isAuthenticated, logout, user } = useAuthHook();
  const navigate = useNavigate();
  const token = ProcitajVrednostPoKljucu("authToken") || "";
  const [notes, setNotes] = useState<NoteDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");

  const [copiedMessage, setCopiedMessage] = useState(false);


  if (!isAuthenticated || !token) {
    logout();
    navigate("/login");
    return null;
  }

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await noteApi.getAllNotes(token);
      const sorted = [
        ...data.filter(n => n.pinned),
        ...data.filter(n => !n.pinned)
      ].map(n => ({ ...n, isSelected: false }));
      setNotes(sorted);
    } catch (err) {
      console.error(err);
      logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [noteApi, token]);


  const handleSelectNote = (id: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isSelected: !n.isSelected } : n));
  };

  const selectedNotes = notes.filter(n => n.isSelected);
  const isSingleSelected = selectedNotes.length === 1;
  const hasSelection = selectedNotes.length > 0;


  const handleAddNote = async () => {
    try {
      if (user?.permission !== 1 && notes.length >= 10) {
        setShowLimitPopup(true);
        setTimeout(() => setShowLimitPopup(false), 3000);
        return;
      }

      const newNote = await noteApi.createNote(token, {
        header: "New Note",
        content: "",
        pinned: false,
      });

      setNotes(prev => [...prev, { ...newNote, isSelected: false }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    if (isSingleSelected) navigate(`/edit/${selectedNotes[0].id}`);
  };

  const handlePin = async () => {
    if (!hasSelection) return; // nema selektovanih beleški

    try {
      const updatedNotes = await Promise.all(
        notes.map(async (n) => {
          if (n.isSelected) {
            const newPinnedStatus = !n.pinned;
            // Update na serveru
            await noteApi.updateNote(token, n.id, {
              header: n.header,
              content: n.content,
              pinned: newPinnedStatus,
            });
            return { ...n, pinned: newPinnedStatus };
          }
          return n;
        })
      );

      // Sortiraj: pinovane idu na vrh
      const sortedNotes = [
        ...updatedNotes.filter(n => n.pinned),
        ...updatedNotes.filter(n => !n.pinned)
      ];

      setNotes(sortedNotes);

    } catch (err) {
      console.error("Greška pri pinovanju beleški:", err);
    }
  };

  const handleDuplicate = async () => {
    if (!hasSelection) return;

    try {
      // Provera limita za obicnog user-a korisnike
      if (user?.permission !== 1 && notes.length + selectedNotes.length > 10) {
        setShowLimitPopup(true);
        setTimeout(() => setShowLimitPopup(false), 3000);
        return;
      }

      for (const n of selectedNotes) {
        await noteApi.createNote(token, { ...n, id: undefined });
      }

      const updated = await noteApi.getAllNotes(token);
      setNotes(updated.map(n => ({ ...n, isSelected: false })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = () => {
    if (!hasSelection) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const notesToDelete = notes.filter(n => n.isSelected);
    if (notesToDelete.length === 0) return;

    try {
      setDeleting(true);

      // Brišemo sve selektovane beleške paralelno
      await Promise.all(
        notesToDelete.map(n => noteApi.deleteNote(token, n.id))
      );

      // Osvežavamo lokalnu listu odmah
      setNotes(prev => prev.filter(n => !notesToDelete.some(d => d.id === n.id)));

      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Greška pri brisanju beleške:", err);
      alert("Greška pri brisanju beleške. Pokušajte ponovo.");
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
  if (!isSingleSelected) return; // samo ako je jedna beleška selektovana

  const note = selectedNotes[0];

  try {
    if (!note.published) {
      const updatedNote = await noteApi.updateNote(token, note.id, { ...note, published: true });
      setNotes(prev =>
        prev.map(n => (n.id === note.id ? { ...n, published: true } : n))
      );
    }
    const link = `${window.location.origin}/notes/${note.id}/readonly`;
    setShareLink(link);
    setShowSharePopup(true);

  } catch (err) {
    console.error("Greška pri deljenju beleške:", err);
    alert("Došlo je do greške prilikom deljenja beleške. Pokušajte ponovo.");
  }
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(shareLink);
  setCopiedMessage(true);
  setTimeout(() => setCopiedMessage(false), 2000);
};




  const handleLogout = () => {
    ObrisiVrednostPoKljucu("authToken");
    logout();
  };


  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-[#4451A4] w-[244px] h-screen flex flex-col justify-between py-6 fixed top-0 left-0">
        {/* Logo */}
        <div className="flex justify-center mt-4">
          <img src="/sticky-note-white.png" alt="Logo" className="w-20 h-20" />
        </div>

        {/* Dugmad */}
        <div className="flex flex-col justify-center flex-1 mt-10 mb-6 items-center gap-3">
          <button
            onClick={handleEdit}
            disabled={!isSingleSelected}
            className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition ${!isSingleSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            <Pencil size={18} /> Edit
          </button>

          <button
            onClick={handlePin}
            disabled={!hasSelection}
            className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition ${!hasSelection ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            <Pin size={18} /> Pin
          </button>

          <button
            onClick={handleShare}
            disabled={!isSingleSelected}
            className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition ${!hasSelection ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            <Share2 size={18} /> Share
          </button>

          <button
            onClick={handleDuplicate}
            disabled={!hasSelection}
            className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition ${!hasSelection ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            <Copy size={18} /> Duplicate
          </button>

          <button
            onClick={handleDelete}
            disabled={!hasSelection}
            className={`flex items-center gap-2 bg-white text-[#4451A4] rounded-md px-4 py-2 font-medium w-[180px] transition ${!hasSelection ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>

        {/* Account & Logout */}
        <div className="flex flex-col gap-4 px-4">
          <button
            onClick={() => navigate("/account")}
            className="flex items-center gap-2 text-white hover:opacity-80 transition"
          >
            <User size={20} /> Account
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white hover:opacity-80 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Glavni deo - notes lista */}
      <div className="flex-1 ml-[244px] p-6 flex flex-col items-center w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 border-4 border-[#4451A4] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-semibold text-[#4451A4] animate-pulse">
              Fetching your notes...
            </p>
          </div>
        ) : (
          <>
            {notes.length === 0 ? (
              <div className="flex justify-center items-center border border-[#4451A4] rounded-lg p-10 text-2xl text-[#4451A4]">
                Your notes will appear here...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {notes.map(note => (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note.id)}
                    className={`relative w-72 h-48 bg-[#DDE5FF] border border-[#DDE5FF] rounded-xl p-4 shadow-lg cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-2xl ${note.isSelected ? "ring-2 ring-[#4451A4]" : ""
                      }`}
                  >
                    {note.pinned && (
                      <Pin className="absolute top-2 right-2 text-[#4451A4] z-10" size={20} />
                    )}
                    <h3 className="text-center text-[#4451A4] font-semibold mb-2 text-lg">{note.header}</h3>
                    <p className="text-[#4451A4] text-sm line-clamp-6">{note.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Dugme za dodavanje nove beleške */}
            <button
              onClick={handleAddNote}
              className="mt-6 px-6 py-3 bg-[#4451A4] text-white justify-alignment-center rounded-lg shadow-lg hover:bg-[#2b2b7a] transition text-2xl font-bold"
              title="Add New Note"
            >
              +
            </button>

            {/* Popup za limit beleški */}
            {showLimitPopup && (
              <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce z-50">
                Dostigli ste limit od 10 beleški. Nadogradite na premium za više beleški!
              </div>
            )}
          </>
        )}
      </div>

      {/* Popup za potvrdu brisanja */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to delete the selected note(s)?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSharePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-semibold text-[#4451A4] mb-4">Share Note</h2>
            <input
              type="text"
              value={shareLink}
              readOnly
              className="w-full p-2 border border-gray-300 rounded mb-4 text-sm text-gray-700 cursor-not-allowed"
            />
            {copiedMessage && (
              <p className="text-green-600 text-sm mb-2">Link kopiran!</p>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-[#4451A4] text-white rounded hover:bg-[#2b2b7a] transition flex items-center gap-2"
              >
                <Copy size={16} /> Copy
              </button>
              <button
                onClick={() => setShowSharePopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default NoteViewForm;
