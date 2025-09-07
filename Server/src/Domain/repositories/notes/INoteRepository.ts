import { Note } from "../../models/Note";
import { User } from "../../models/User";

export interface INoteRepository {
    create(note: Note): Promise<Note>;

    getByID(id: number): Promise<Note>;

    getAll(): Promise<Note[]>;

    getAllUserNotes(id: number): Promise<Note[]>;

    update(note: Note): Promise<Note>; 

    delete(id: number): Promise<boolean>;

    exists(id: number): Promise<boolean>;
}
