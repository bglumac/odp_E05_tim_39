import { randomUUID } from "node:crypto";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { v7 as uuidv7 } from 'uuid'
import { DatabaseConnection } from "../connection/DbConnectionPool";
import { AsyncDatabase } from "promised-sqlite3";

export class UserRepository implements IUserRepository {

    async create(user: User): Promise<User> {
        const query = `
            INSERT INTO Users VALUES (?, ?, ?, ?)
            `

        try {
            const statement = await DatabaseConnection.Get().prepare(query);
            await statement.run(user.id, user.username, user.password, user.permission)
            return user;
            
        }

        catch (err) {
            console.log(err);
            return new User();
        }
    }

    async getByID(id: number): Promise<User> {
        const query = `
            SELECT * FROM Users WHERE uuid = ?
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query, id);
            const result: any = await statement.get();
            if (!result) throw new Error("No such record!");

            return new User(result.uuid, result.username, result.password, result.permission)
        }

        catch (err) {
            console.log(err);
            return new User();
        } 
    }
    async getByUsername(username: string): Promise<User> {
        const query = `
            SELECT * FROM Users WHERE username = ?
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query, username);
            const result: any = await statement.get();

            if (!result) throw new Error("No such record!");

            return new User(result.uuid, result.username, result.password, result.permission)
        }

        catch (err) {
            console.log(err);
            return new User();
        } 
    }
    async getAll(): Promise<User[]> {
        const query = `
            SELECT * FROM Users
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query);
            const results: any[] = await statement.all();

            return results.map(
                (row) => new User(row.uuid, row.username, row.password, row.permission)
            );
        }

        catch (err) {
            console.log(err);
            return new Array<User>();
        } 
    }

    async update(user: User): Promise<User> {
        const query = `
            UPDATE Users SET username = ?, password = ?, permission = ? WHERE uuid = ?
        `

        try {
            const statement = await DatabaseConnection.Get().prepare(query, user.username, user.password, user.permission);
            const result = await statement.run();
            console.log(result);
            return user;
        }

        catch (err) {
            console.log(err);
            return new User();
        }
    }
    async delete(id: number): Promise<boolean> {
        const query = `
            DELETE FROM Users WHERE uuid = ?
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
            SELECT * FROM Users WHERE uuid = ?
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