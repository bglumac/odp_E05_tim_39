import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { NoteDto } from "../../models/notes/NoteDto";
import SideMenuForm from "../../components/dashboard/SideMenuForm";
import { useAuthHook } from "../../hooks/auth/useAuthHook";
import NoteViewForm from "../../components/dashboard/NoteViewForm";
import { ProcitajVrednostPoKljucu } from "../../helpers/local_storage";
import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";

//mock za proveru funkcionalnosti
// export const mockNotes: NoteDto[] = [
//   { noteId: 1, noteTitle: "Shopping List", content: "Milk, Eggs, Bread, Butter", isPinned: true, isSelected: false },
//   { noteId: 2, noteTitle: "Work Tasks", content: "Finish report, Call client, Email proposal", isPinned: false, isSelected: false },
//   { noteId: 3, noteTitle: "Ideas", content: "New project for WeNotes app", isPinned: false, isSelected: false },
//   { noteId: 4, noteTitle: "Movies to watch", content: "Inception, Interstellar, Matrix", isPinned: false, isSelected: false },
//   { noteId: 5, noteTitle: "Books to read", content: "Clean Code, React in Action", isPinned: false, isSelected: false },
// ];

interface DashboardPageProps {
  noteApi: INoteAPIService;
}


export default function DashboardPage({ noteApi }: DashboardPageProps) {
  const { isAuthenticated, logout } = useAuthHook();
  const navigate = useNavigate();
  const token = ProcitajVrednostPoKljucu("authToken") || "";
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthHook();
  const [notes, setNotes] = useState<NoteDto[]>([]);
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      logout();
      navigate("/login");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const data = await noteApi.getAllNotes(token);
        setNotes(data.map(n => ({ ...n, isSelected: false })));
      }
      catch (error) {
        console.error(error);
        logout();
        navigate("/login");
      }
      finally {
        setLoading(false);
      }
    })()

  }, [isAuthenticated, logout, navigate, token]);

  const handleSelectNote = (id: number) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, isSelected: !note.isSelected } : note));
  }

  const handlePinNote = async () => {
    const selected = notes.filter(n => n.isSelected);

    try {
      for (const n of selected) {
        await noteApi.pinNote(token!, n.id, !n.isPinned);
      }

      const updated = await noteApi.getAllNotes(token!);
      setNotes(updated.map(n => ({ ...n, isSelected: false })));
    }
    catch (error) {
      console.error("Greska pri pinovanju beleske: ", error);
    }
  }

  const handleDuplicateNote = async () => {
    const selected = notes.filter(n => n.isSelected);

    try {
      for (const n of selected) {
        await noteApi.createNote(token!, { ...n, id: undefined, isSelected: false })
      }

      const updated = await noteApi.getAllNotes(token!);
      setNotes(updated.map(n => ({ ...n, isSelected: false })));
    }
    catch (error) {
      console.error("Greska prilikom dupliranja beleske: ", error);
    }
  }

  const handleDeleteNote = async () => {
    const selected = notes.filter(n => n.isSelected);

    try {
      for (const n of selected) {
        await noteApi.deleteNote(token!, n.id);
      }

      const updated = await noteApi.getAllNotes(token!);
      setNotes(updated.map(n => ({ ...n, isSelected: false })));
      setShowDeleteConfirm(false);
    }
    catch (error) {
      console.error("Greska prilikom brisanja beleske/beleski: ", error);
    }
  }

  const selectedCount = notes.filter(n => n.isSelected).length;

  return (
    <div className="flex min-h-screen">
      <SideMenuForm
        selectedCount={selectedCount}
        onEdit={() => {
          const noteToEdit = notes.find(n => n.isSelected);
          if (noteToEdit) {
            navigate(`/edit/${noteToEdit.id}`); // vodi na Edit page
          }
        }}
        onPin={handlePinNote}
        onDuplicate={handleDuplicateNote}
        onShare={() => alert("Share selected note(s)")}
        onDelete={() => {
          const confirmed = window.confirm("Are you sure you want to delete selected note(s)?");
          if (confirmed) handleDeleteNote();
        }}
        onAccount={() => navigate("/account")}
        onLogout={() => navigate("/login")}
      />

      {/* Deo za potvrdu brisanja beleske(beleski)*/}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to delete the selected note(s)?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteNote}
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

      <main className="flex-1 p-6 flex flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4451A4] mb-12">
          Welcome back, {user?.username}!
        </h1>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 border-4 border-[#4451A4] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-semibold text-[#4451A4] animate-pulse">
                Fetching your notes...
              </p>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex justify-center items-center border border-[#4451A4] rounded-lg p-10 text-2xl text-[#4451A4]">
              Your notes will appear here...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pl-10 pt-6 pb-6">
              {notes.map(note => (
                <NoteViewForm key={note.id} note={note} onSelect={handleSelectNote} />
              ))}
            </div>
          )}

          {/* Dugme za dodavanje nove note */}
          <button
            onClick={async () => {
              try {
                if (user?.permission !== 1 && notes.length >= 10) {
                  setShowLimitPopup(true);
                  setTimeout(() => setShowLimitPopup(false), 3000);
                  return;
                }
                // kreiraj belešku na serveru
                const newNote = await noteApi.createNote(token!, {
                  header: "Title",     // iz inputa forme
                  content: "",     // iz contentEditable ili textarea
                  isPinned: false,   // boolean
                });

                console.log(newNote)

                setNotes(prevNotes => [...prevNotes, newNote]);
              } catch (err) {
                console.error(err);
              }
            }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-[#4451A4] text-white rounded-lg shadow-lg hover:bg-[#2b2b7a] transition text-3xl font-bold"
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

        </div>
      </main>
    </div>
  );
};
