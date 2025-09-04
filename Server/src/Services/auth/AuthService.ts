import { UserAuthDTO } from "../../Domain/DTOs/auth/UserLoginDTO";
import { IAuthService } from "../../Domain/services/auth/IAuthService";

export class AuthService implements IAuthService {
    prijava(username: string, password: string): Promise<UserAuthDTO> {
        throw new Error("Method not implemented.");
    }
    registracija(username: string, password: string): Promise<UserAuthDTO> {
        throw new Error("Method not implemented.");
    }
}