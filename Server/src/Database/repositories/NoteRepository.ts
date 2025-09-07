import { Note } from "../../Domain/models/Note";
import { User } from "../../Domain/models/User";
import { INoteRepository } from "../../Domain/repositories/notes/INoteRepository";
import { DatabaseConnection } from "../connection/DbConnectionPool";

export class NoteRepository implements INoteRepository {
    async create(note: Note): Promise<Note> {
        const query = `
            INSERT INTO Notes VALUES (?, ?, ?, ?, ?)
            `

        try {
            const statement = await DatabaseConnection.Get().prepare(query);
            await statement.run(note.id, note.header, note.content, note.published, note.owner)
            return note;

        }

        catch (err) {
            console.log(err);
            return new Note()
        }
    }

    async getByID(id: number): Promise<Note> {
        const query = `
            SELECT * FROM Notes WHERE id = ?
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query, id);
            const result: any = await statement.get();

            if (!result) throw new Error("No such record!");

            return new Note(result.id, result.owner, result.header, result.content, result.published)
        }

        catch (err) {
            console.log(err);
            return new Note();
        }
    }

    async getAll(): Promise<Note[]> {
        const query = `
            SELECT * FROM Notes
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query);
            const results: any[] = await statement.all();

            return results.map(
                (row) => new Note(row.id, row.owner, row.header, row.content, row.published)
            );
        }

        catch (err) {
            console.log(err);
            return new Array<Note>();
        }
    }

    async getAllUserNotes(id: number): Promise<Note[]> {
        const query = `
            SELECT * FROM Notes WHERE owner = ?
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query, id);
            const results: any[] = await statement.all();

            return results.map(
                (row) => new Note(row.id, row.owner, row.header, row.content, row.published)
            );
        }

        catch (err) {
            console.log(err);
            return new Array<Note>();
        }
    }

    async update(note: Note): Promise<Note> {
        const query = `
            UPDATE Notes SET header = ?, content = ? WHERE id = ?
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query, note.header, note.content, note.id);
            const result = await statement.run();
            console.log(result);
            return note;
        }

        catch (err) {
            console.log(err);
            return new Note();
        }
    }

    async delete(id: number): Promise<boolean> {
        const query = `
            DELETE FROM Notes WHERE id = ?
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query, id);
            const result = await statement.run();

            if (result.changes == 1) {
                console.log("Record deleted!");
                return true;
            }
            return false;
        }

        catch (err) {
            console.log(err);
            return false;
        }
    }

    async exists(id: number): Promise<boolean> {
        const query = `
            SELECT * FROM Notes WHERE id = ?
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query, id);
            const result: any = await statement.get();

            if (!result) return false;
            return true;
        }

        catch (err) {
            console.log(err);
            return false;
        }
    }
}