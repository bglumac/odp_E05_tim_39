import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";

export class UserRepository implements IUserRepository {
    create(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    getByID(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
    getByUsername(username: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    update(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    exists(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}