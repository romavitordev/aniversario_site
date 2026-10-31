import { execFile } from 'child_process';
import { randomUUID } from 'crypto';
import { unlink, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';
import ffprobe from 'ffprobe-static';

const execFileAsync = promisify(execFile);

// Pega a duração do video pq nn confio no front assim kkk
export async function getVideoDurationSeconds(buffer: Buffer): Promise<number | null> {
    const tmpPath = join(tmpdir(), `upload-${randomUUID()}`);
    await writeFile(tmpPath, buffer);

    try {
        const { stdout } = await execFileAsync(ffprobe.path, [
            '-v', 'error',
            '-show_entries', 'format=duration:stream=codec_type',
            '-of', 'json',
            tmpPath,
        ]);

        const data = JSON.parse(stdout) as {
            format?: { duration?: string };
            streams?: { codec_type?: string }[];
        };

        const hasVideoStream = data.streams?.some((s) => s.codec_type === 'video') ?? false;
        const seconds = Number.parseFloat(data.format?.duration ?? '');

        if (!hasVideoStream || !Number.isFinite(seconds)) return null;
        return seconds;
    } catch {
        return null;
    } finally {
        await unlink(tmpPath).catch(() => undefined);
    }
}