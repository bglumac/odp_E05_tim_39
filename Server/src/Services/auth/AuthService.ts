import { IDGenerator } from "../../API/utils/IDGenerator";
import { UserAuthDTO } from "../../Domain/DTOs/auth/UserLoginDTO";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import bcrypt from 'bcryptjs'

export class AuthService implements IAuthService {
    private readonly saltRounds: number = 10;

    public constructor(private userRepo: IUserRepository) {}

    async prijava(username: string, password: string): Promise<UserAuthDTO> {
        const user = await this.userRepo.getByUsername(username);

        if (user.id !== 0 && await bcrypt.compare(password, user.password)) {
            return new UserAuthDTO(user.id, user.username, user.permission)
        }

        return new UserAuthDTO();
    }

    async registracija(username: string, password: string, permission: number): Promise<UserAuthDTO> {
        console.log("register serviice " + username)
        const existing = await this.userRepo.getByUsername(username);

        if (existing.id !== 0) {
            return new UserAuthDTO();
        }

        const hashed = await bcrypt.hash(password, this.saltRounds);

        const newUser = await this.userRepo.create(
            new User(IDGenerator(), username, hashed, permission)
        );

        if (newUser.id !== 0) {
            return new UserAuthDTO(newUser.id, newUser.username);
        }

        return new UserAuthDTO();
    }
}