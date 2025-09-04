import { Router } from "express";

export class AuthController {
    private router: Router;
    
    constructor() {
        this.router = Router();
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