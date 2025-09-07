import { NextFunction, Request, Response } from "express";
import { NoteService } from "../Services/notes/NoteService";
import { INoteService } from "../Domain/services/notes/INoteService";

export const authorize_note_read = (noteService: INoteService) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = req.user;
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).json({ success: false, message: "No param id"})
            return;
        }
        const note = await noteService.getNoteById(parseInt(req.params.id));

        if (!user || (note.owner != user.id && !note.published)) {
            res.status(403).json({ success: false, message: "Access Denied!" });
            return;
        }

        next();
    };
};