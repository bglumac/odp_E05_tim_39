import { IDGenerator } from "../../API/utils/IDGenerator";
import { NoteDTO } from "../../Domain/DTOs/notes/NoteDTO";
import { Note } from "../../Domain/models/Note";
import { INoteRepository } from "../../Domain/repositories/notes/INoteRepository";
import { INoteService } from "../../Domain/services/notes/INoteService";

export class NoteService implements INoteService {
    public constructor(private noteRepo: INoteRepository) {}

    async create(owner: number, header: string, content: string): Promise<Note> {
        const note = await this.noteRepo.create(new Note(IDGenerator(), owner, header, content));

        if (note.id !== 0) {
            return new NoteDTO(note.id, note.owner, note.header, note.content, note.published);
        }

        return new NoteDTO();

    }
    async getNoteById(id: number): Promise<Note> {
        const note = await this.noteRepo.getByID(id);

        if (note.id !== 0) {
            return note;
        }

        return new Note();
    }
    async getAllUserNotes(id: number): Promise<Note[]> {
        return await this.noteRepo.getAllUserNotes(id);
    }
    async getAllNotes(): Promise<Note[]> {
        return await this.noteRepo.getAll();
    }
    async updateNote(note: Note): Promise<Note> {
        return await this.noteRepo.update(note);
    }
    async deleteNote(id: number): Promise<boolean> {
        return await this.noteRepo.delete(id);
    }
    
}