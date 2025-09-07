import { Request, Response, Router } from "express";
import { INoteService } from "../../Domain/services/auth/INoteService";
import { NoteDataValidation } from "../validators/NoteValidator";
import { Note } from "../../Domain/models/Note";

export class NoteController {
    private router: Router;
    private noteService: INoteService;

    constructor(noteService: INoteService) {
        this.router = Router();
        this.noteService = noteService;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/create', this.create.bind(this));
        this.router.post('/update', this.update.bind(this));
    }

    private async create(req: Request, res: Response) {
        try {
            const { note_header, note_content, uuid } = req.body;

            const validation = NoteDataValidation(note_header, note_content)
            if (!validation.status) {
                res.status(400).json({ status: false, message: validation.message })
            }

            const noteDTO = await this.noteService.create(note_header, note_content);
            if (noteDTO.id !== 0) {
                res.status(200).json({ status: true, message: "Note created!" })
            }

            else {
                res.status(500).json({ status: false, message: "Server error!" })
            }
        }

        catch (err) {
            res.status(500).json({ status: false, message: err })
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const { id, note_header, note_content, published, uuid } = req.body;

            const validation = NoteDataValidation(note_header, note_content)
            if (!validation.status) {
                res.status(400).json({ status: false, message: validation.message })
            }

            const noteDTO = await this.noteService.updateNote(new Note(id, uuid, note_header, note_content, published));
            if (noteDTO.id !== 0) {
                res.status(200).json({ status: true, message: "Note updated!" })
            }

            else {
                res.status(500).json({ status: false, message: "Server error!" })
            }
        }

        catch (err) {
            res.status(500).json({ status: false, message: err })
        }
    }

    private async delete(req: Request, res: Response) {
        try {
            const { id } = req.body;

            const result = await this.noteService.deleteNote(id);
            if (result === true) {
                res.status(200).json({ status: true, message: "Note deleted!" })
            }

            else {
                res.status(500).json({ status: false, message: "Request failed!" })
            }
        }

        catch (err) {
            res.status(500).json({ status: false, message: err })
        }
    }
}