import { TaskResult } from "../../Domain/types/TaskResult"

export function NoteDataValidation(header: string, content: string): TaskResult {
    if (header.length <= 0) {
        return { 
            status: false, 
            message: "Title must not be empty!"
        }
    }

    return { status: true }
}