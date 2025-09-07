import express from 'express';
import cors from 'cors'
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserRepository } from './Domain/repositories/users/IUserRepository';
import { UserRepository } from './Database/repositories/UserRepository';
import { AuthController } from './API/controllers/AuthController';
import { INoteRepository } from './Domain/repositories/notes/INoteRepository';
import { NoteRepository } from './Database/repositories/NoteRepository';
import { NoteController } from './API/controllers/NoteController';
import { NoteService } from './Services/notes/NoteService';
import { INoteService } from './Domain/services/notes/INoteService';

const server = express();
server.use(cors())
server.use(express.json())

// Repos
const userRepo: IUserRepository = new UserRepository();
const noteRepo: INoteRepository = new NoteRepository();

// Services
const authService: IAuthService = new AuthService(userRepo);
const noteService: INoteService = new NoteService(noteRepo);

// Routes
const authController = new AuthController(authService);
const noteController = new NoteController(noteService);

// Register Routes
server.use(`/api/v1/auth`, authController.getRouter());
server.use(`/api/v1/notes`, noteController.getRouter());


export default server;