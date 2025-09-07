import type { NoteDto } from "../../models/notes/NoteDto";

export interface INoteAPIService {
    getAllNotes(token: string): Promise<NoteDto[]>;
    deleteNote(token: string, noteId: number): Promise<NoteDto>;
    getNoteById(token: string, noteId: number): Promise<NoteDto>; 
    createNote(token: string, note: Partial<NoteDto>): Promise<NoteDto>; 
    updateNote(token: string, noteId: number, note: Partial<NoteDto>): Promise<NoteDto>; 
}