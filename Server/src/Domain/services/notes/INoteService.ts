import { Note } from "../../models/Note";

export interface INoteService {
    create(owner: number, header: string, content: string): Promise<Note>

    getNoteById(id: number): Promise<Note>
    getAllUserNotes(id: number): Promise<Note[]>
    getAllNotes(): Promise<Note[]>

    updateNote(note: Note): Promise<Note>

    deleteNote(id: number): Promise<boolean>
}