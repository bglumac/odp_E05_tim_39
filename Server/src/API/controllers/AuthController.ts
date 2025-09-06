import { Router } from "express";
import { AuthService } from "../../Services/auth/AuthService";
import { IAuthService } from "../../Domain/services/auth/IAuthService";

export class AuthController {
    private router: Router;
    private authService: AuthService;
    
    constructor(authService: IAuthService) {
        this.router = Router();
        this.authService = authService;
    }

    private initializeRoutes() {
        this.router.post('/login', this.prijava.bind(this));
        this.router.post('/register', this.registracija.bind(this));
    }

    private async prijava() {

    }

    private async registracija() {

    }
}