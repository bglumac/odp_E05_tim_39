import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import type { INoteAPIService } from "../../api_services/note_api/INoteAPIService";
import EditNoteTogetherForm from "../../components/edit_note/EditNoteTogetherForm";
import { connectSocket } from "../../helpers/socket_helper";
import { ProcitajVrednostPoKljucu } from "../../helpers/local_storage";
import { useParams } from "react-router-dom";

interface EditNoteTogetherProps {
  noteApi: INoteAPIService;
}

const EditNoteTogether = ({ noteApi }: EditNoteTogetherProps) => {
  const { noteId } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = ProcitajVrednostPoKljucu("authToken") || "";

  useEffect(() => {
    let activeSocket: Socket | null = null;
    console.log("twice test")

    const init = async () => {
      activeSocket = await connectSocket(token, Number(noteId));
      setSocket(activeSocket);
    };

    init();

    return () => {
      activeSocket?.disconnect();
    };
  }, [token]);

  return (
    <div className="flex h-screen">
      <main className="ml-64 flex-1 h-screen overflow-y-auto p-6">
        {socket ? (
          <EditNoteTogetherForm noteApi={noteApi} socket={socket} />
        ) : (
          <div>Connecting...</div>
        )}
      </main>
    </div>
  );
};

export default EditNoteTogether;