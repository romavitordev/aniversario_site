import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

const MB = 1024 * 1024;

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'] as const;

export const config = {
  port: Number(process.env.PORT ?? 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  folderId: required('DRIVE_FOLDER_ID'),

  maxImageSizeBytes: Number(process.env.MAX_FILE_SIZE_MB ?? 5) * MB,
  maxVideoSizeBytes: Number(process.env.MAX_VIDEO_SIZE_MB ?? 30) * MB,
  maxVideoSeconds: Number(process.env.MAX_VIDEO_SECONDS ?? 5),
  videoToleranceSeconds: 0.3,

  allowedImageTypes: allowedImageTypes as readonly string[],
  allowedVideoTypes: allowedVideoTypes as readonly string[],
  allowedMimeTypes: [...allowedImageTypes, ...allowedVideoTypes] as readonly string[],
};