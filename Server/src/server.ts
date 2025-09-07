import express from 'express';
import cors from 'cors'
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserRepository } from './Domain/repositories/users/IUserRepository';
import { UserRepository } from './Database/repositories/UserRepository';
import { AuthController } from './API/controllers/AuthController';
import { INoteRepository } from './Domain/repositories/notes/INoteRepository';
import { NoteRepository } from './Database/repositories/NoteRepository';

const server = express();
server.use(cors())
server.use(express.json())

// Repos
const userRepo: IUserRepository = new UserRepository();
const noteRepo: INoteRepository = new NoteRepository();

// Services
const authService: IAuthService = new AuthService(userRepo);

// Routes
const authController = new AuthController(authService);

// Register Routes
server.use(`/api/v1/auth`, authController.getRouter());


export default server;