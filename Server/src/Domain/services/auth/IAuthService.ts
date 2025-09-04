import { UserAuthDTO } from "../../DTOs/auth/UserLoginDTO";


export interface IAuthService {
  prijava(username: string, password: string): Promise<UserAuthDTO>;
  registracija(username: string, password: string): Promise<UserAuthDTO>;
}
