import { Request, Response, Router } from "express";
import { AuthService } from "../../Services/auth/AuthService";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import jwt from "jsonwebtoken";
import { AuthDataValidation } from "../validators/RegisterValidator";

export class AuthController {
    private router: Router;
    private authService: IAuthService;
    
    constructor(authService: IAuthService) {
        this.router = Router();
        this.authService = authService;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', this.login.bind(this));
        this.router.post('/register', this.registracija.bind(this));
    }

    private async login(req: Request, res: Response) {
        const {username, password } = req.body;
        
        const validation = AuthDataValidation(username, password);
        if (!validation.status) {
            res.status(400).json( { status: false, message: validation.message })
            return;
        }

        const token = jwt.sign(
            {
                id: 
            }
        )
    }

    private async registracija() {

    }
}