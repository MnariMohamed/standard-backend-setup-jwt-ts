import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { UserRoleEnum } from '../models/user.model';

export const checkAuthSuperAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token: string = (req.headers.authorization as string).split(' ')[1];
        const userData: any = jsonwebtoken.verify(
            token,
            process.env.JWT_KEY
        );
        if (userData.role != UserRoleEnum.SUPER_ADMIN) return false;
        (req as any).userData = userData;
        next();
    } catch (error) {
        res.status(401).json({ message: 'login' });
        throw Error('You are not authorized to perform the current operation!');
    }
};
