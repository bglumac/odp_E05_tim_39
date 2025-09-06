import { TaskResult } from "../../Domain/types/TaskResult";

export function AuthDataValidation(username?: string, password?: string): TaskResult {
    if (!username || !password) {
        return {
            status: false,
            message: "Username and password are necessary!"
        }
    }

    if (username.length < 3) {
        return {
            status: false,
            message: "Name must be at least 3 characters long!"
        }
    }

    if (password.length < 6) {
        return {
            status: false,
            message: "Password must have at least 6 characters!"
        }
    }

    if (password.length > 20) {
        return {
            status: false,
            message: "Password can not be longer than 20 characters!"
        }
    }

    return { status: true }
}