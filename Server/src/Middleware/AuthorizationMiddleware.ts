import { Request, Response, NextFunction } from "express";
import { UserRole } from "../Domain/enums/user/Roles";
export const authorize = (...permittedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user;
        if (!user || !permittedRoles.includes(user.permission)) {
            res.status(403).json({ success: false, message: "Access Denied!" });
            return;
        }
        next();
    };
};