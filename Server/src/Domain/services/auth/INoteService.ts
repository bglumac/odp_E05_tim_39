import { Note } from "../../models/Note";

export interface INoteService {
    create(header: string, content: string): Promise<Note>

    getNoteById(id: number): Promise<Note>
    getAllUserNotes(username: string): Promise<Note[]>
    getAllNotes(): Promise<Note[]>

    updateNote(note: Note): Promise<Note>

    deleteNote(id: number): Promise<boolean>
}