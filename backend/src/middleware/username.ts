import { NextFunction, Request, Response } from 'express';

const USERNAME_REGEX = /^[\p{L}\p{N}_ .-]{2,30}$/u;

export function requireUsername(req: Request, res: Response, next: NextFunction) {
    const raw = req.header('x-username')?.trim();

    if (!raw || !USERNAME_REGEX.test(raw)) {
        res.status(400).json({
            error:
                'Nome de usuário inválido ou ausente. Envie o header X-Username (2 a 30 caracteres: letras, números, espaço, _ . -).',
        });
        return;
    }

    res.locals.username = raw;
    next();
}