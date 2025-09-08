import { Request, Response, Router } from "express";
import { INoteService } from "../../Domain/services/notes/INoteService";
import { NoteDataValidation } from "../validators/NoteValidator";
import { Note } from "../../Domain/models/Note";
import { authenticate } from "../../Middleware/AuthenticationMiddleware";

export class NoteController {
    private router: Router;
    private noteService: INoteService;

    constructor(noteService: INoteService) {
        this.router = Router();
        this.noteService = noteService;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/getAll`, authenticate, this.getAll.bind(this))
        this.router.get(`/getID/:id`, authenticate, this.getID.bind(this))
        this.router.patch(`/getID/:id`, authenticate, this.update.bind(this))
        this.router.delete(`/getID/:id`, authenticate, this.delete.bind(this))

        this.router.post('/create', authenticate, this.create.bind(this));
        this.router.post('/update', authenticate, this.update.bind(this));
        this.router.post('/delete', authenticate, this.delete.bind(this));
    }

    public getRouter() {
        return this.router;
    }

    private async getAll(req: Request, res: Response) {
        try {
            if (req.user) {
                const notes = await this.noteService.getAllUserNotes(req.user?.id);
                res.status(200).json({ status: true, message: "Fetched!", data: notes })
            }

            else {
                res.status(401).json({ status: false, message: "Not logged in!" })
            }

        }

        catch (err) {
            res.status(500).json({ status: false, message: err })
        }
    }
    private async getID(req: Request, res: Response) {
        try {
            if (req.user) {
                const notes = await this.noteService.getNoteById(parseInt(req.params.id));
                res.status(200).json({ status: true, message: "Fetched!", data: notes })
            }

            else {
                res.status(401).json({ status: false, message: "Not logged in!" })
            }

        }

        catch (err) {
            res.status(500).json({ status: false, message: err })
        }
    }

    private async create(req: Request, res: Response) {
        try {
            const { header, content } = req.body;
            if (req.user) {
                if (req.user.permission < 1 && (await this.noteService.getAllUserNotes(req.user.id)).length >= 10) {
                    res.status(401).send({ status: false, message: "Can't make more than 10 as a non-premium user"})
                }

                const validation = NoteDataValidation(header, content)
                if (!validation.status) {
                    res.status(400).json({ status: false, message: validation.message })
                }

                const noteDTO = await this.noteService.create(req.user.id, header, content);
                if (noteDTO.id !== 0) {
                    res.status(200).json({ status: true, message: "Note created!", data: noteDTO })
                }

                else {
                    console.log("WTH")
                    res.status(500).json({ status: false, message: "Server error!" })
                }
            }

            else {
                res.status(401).json({ status: false, message: "Not logged in!" })
            }


        }

        catch (err) {
            console.log(err);
            res.status(500).json({ status: false, message: err })
        }
    }

    private async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { owner, header, content, pinned, published } = req.body;

            console.log("Updating to " + content);
            const validation = NoteDataValidation(header, content)
            if (!validation.status) {
                res.status(400).json({ status: false, message: validation.message })
            }

            const oldNote = await this.noteService.getNoteById(id);
            if (oldNote.id == 0) {
                res.status(400).json({ status: false, message: "Note not found!" })
                return;
            }


            const noteDTO = await this.noteService.updateNote(new Note(id, owner, header, content, pinned, published));
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
            const id = parseInt(req.params.id);

            const result = await this.noteService.deleteNote(id);
            if (result === true) {
                res.status(200).json({ status: true, message: "Note deleted!" })
            }

            else {
                res.status(500).json({ status: false, message: "Request failed!" })
            }
        }

        catch (err) {
            console.log(err)
            res.status(500).json({ status: false, message: err })
        }
    }
}