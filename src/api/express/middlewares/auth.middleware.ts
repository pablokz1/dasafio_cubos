import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            document?: string;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as unknown as { document: string };

        if (!decoded.document) {
            return res.status(401).json({ message: 'Token does not contain document' });
        }

        req.document = decoded.document;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
