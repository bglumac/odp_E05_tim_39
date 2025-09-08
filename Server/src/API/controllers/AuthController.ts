import { Request, Response, Router } from "express";
import { AuthService } from "../../Services/auth/AuthService";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import jwt from "jsonwebtoken";
import { AuthDataValidation } from "../validators/RegisterValidator";
import { permission } from "process";

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
        this.router.post('/register', this.register.bind(this));
    }

    public getRouter(): Router {
        return this.router;
    }

    /**
     * POST /api/v1/auth/register
     *
     * @param req Request header
     * @param res Response var
     */
    private async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, permission } = req.body;
            const validation = AuthDataValidation(username, password);

            console.log(`${username}:${password}`);

            if (!validation.status) {
                res.status(400).json({ status: false, message: validation.message })
            }

            const userDTO = await this.authService.registracija(username, password, permission);

            if (userDTO.id !== 0) {
                res.status(201).json({ status: true, message: 'Successful register!' })
            }

            else {
                res.status(401).json({ status: false, message: 'User already exists!' })
            }
        }

        catch (err) {
            res.status(500).json({ status: false, message: err })
            console.log(err);
        }
    }

    /**
     * POST /api/v1/auth/login
     *
     * @param req Request header
     * @param res Response var
     */
    private async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            const validation = AuthDataValidation(username, password);
            if (!validation.status) {
                res.status(400).json({ status: false, message: validation.message })
                return;
            }

            const userDTO = await this.authService.prijava(username, password);

            const token = jwt.sign(
                {
                    id: userDTO.id,
                    username: userDTO.username,
                    permission: userDTO.permission
                }, process.env.JWT_SECRET ?? "", { expiresIn: '12h' }
            )

            if (userDTO.id == 0) {
                res.status(404).json({ status: false, message: "User fetch error" })
            }

            else {
                res.status(200).json({ status: true, message: "Login success!", data: token })
            }
        }

        catch (err) {
            res.status(500).json({ status: false, message: err })
        }

    }
}