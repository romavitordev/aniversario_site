import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { config } from './config';
import { photosRouter } from './routes/photos';

const app = express();

app.use(cors({ origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(',') }));

app.get('/health', (_req, res) => {
    res.json({ ok: true });
});

app.use('/photos', photosRouter);

app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({
                error: 'Arquivo muito grande.',
            });
            return;
        }
        res.status(400).json({ error: `Erro no upload: ${err.message}` });
        return;
    }

    res.status(415).json({
        error: 'Tipo de arquivo não permitido. Use JPG, PNG, WebP ou vídeo MP4, WebM ou MOV.',
    });

    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(config.port, () => {
    console.log(`API rodando em http://localhost:${config.port}`);
});