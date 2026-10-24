import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';

import { config } from '../config';
import { getPhotoStream, listPhotos, uploadPhoto } from '../drive';
import { requireUsername } from '../middleware/username';
import { getVideoDurationSeconds } from '../video';

export const photosRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: Math.max(config.maxImageSizeBytes, config.maxVideoSizeBytes),
        files: 1,
    },
    fileFilter: (_req, file, cb) => {
        const ok = (config.allowedMimeTypes as readonly string[]).includes(file.mimetype);
        if (!ok) {
            cb(new Error('INVALID_TYPE'));
            return;
        }
        cb(null, true);
    },
});

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitos uploads. Tente novamente em alguns minutos.' },
});

photosRouter.get('/', async (req, res, next) => {
    try {
        const pageToken = typeof req.query.pageToken === 'string' ? req.query.pageToken : undefined;
        const requested = Number(req.query.pageSize ?? 30);
        const pageSize = Number.isFinite(requested) ? Math.min(Math.max(requested, 1), 100) : 30;

        res.json(await listPhotos(pageToken, pageSize));
    } catch (err) {
        next(err);
    }
});

photosRouter.get('/:id', async (req, res, next) => {
    try {
        const result = await getPhotoStream(req.params.id);
        if (!result) {
            res.status(404).json({ error: 'Foto não encontrada.' });
            return;
        }

        res.setHeader('Content-Type', result.mimeType);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        result.stream.on('error', next);
        result.stream.pipe(res);
    } catch (err) {
        next(err);
    }
});

photosRouter.post(
    '/',
    uploadLimiter,
    requireUsername,
    upload.single('photo'),
    async (req, res, next) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'Envie a imagem no campo "photo" (multipart/form-data).' });
                return;
            }

            const isVideo = config.allowedVideoTypes.includes(req.file.mimetype);

            if (!isVideo && req.file.size > config.maxImageSizeBytes) {
                res.status(413).json({
                    error: `Imagem muito grande. Máximo: ${config.maxImageSizeBytes / 1024 / 1024} MB.`,
                });
                return;
            }

            if (isVideo) {
                const seconds = await getVideoDurationSeconds(req.file.buffer);

                if (seconds === null) {
                    res.status(400).json({ error: 'Vídeo inválido ou corrompido.' });
                    return;
                }

                if (seconds > config.maxVideoSeconds + config.videoToleranceSeconds) {
                    res.status(400).json({
                        error: `Vídeo muito longo (${seconds.toFixed(1)}s). Máximo: ${config.maxVideoSeconds}s.`,
                    });
                    return;
                }
            }

            const username = res.locals.username as string;
            const safeName = req.file.originalname.replace(/[^\w.\- ]+/g, '_').slice(0, 100);

            const photo = await uploadPhoto({
                buffer: req.file.buffer,
                mimeType: req.file.mimetype,
                fileName: `${Date.now()}-${safeName}`,
                username,
            });

            res.status(201).json(photo);
        } catch (err) {
            next(err);
        }
    },
);