import { google } from 'googleapis';
import { Readable } from 'stream';
import { config } from './config';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

function buildAuth() {
    if (process.env.GOOGLE_REFRESH_TOKEN) {
        const oauth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
        );
        oauth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        return oauth;
    }

    return new google.auth.GoogleAuth({ scopes: SCOPES });
}

const drive = google.drive({ version: 'v3', auth: buildAuth() });

export interface PhotoInfo {
    id: string;
    name: string;
    mimeType: string;
    uploadedBy: string | null;
    createdAt: string;
    size: number | null;
}

function toPhotoInfo(file: {
    id?: string | null;
    name?: string | null;
    mimeType?: string | null;
    createdTime?: string | null;
    size?: string | null;
    appProperties?: { [key: string]: string } | null;
}): PhotoInfo {
    return {
        id: file.id ?? '',
        name: file.name ?? '',
        mimeType: file.mimeType ?? '',
        uploadedBy: file.appProperties?.uploadedBy ?? null,
        createdAt: file.createdTime ?? '',
        size: file.size ? Number(file.size) : null,
    };
}

const FILE_FIELDS = 'id,name,mimeType,createdTime,size,appProperties';

export async function listPhotos(pageToken?: string, pageSize = 30) {
    const res = await drive.files.list({
        q: `'${config.folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'video/') and trashed = false`,
        fields: `nextPageToken, files(${FILE_FIELDS})`,
        orderBy: 'createdTime desc',
        pageSize,
        pageToken,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
    });

    return {
        photos: (res.data.files ?? []).map(toPhotoInfo),
        nextPageToken: res.data.nextPageToken ?? null,
    };
}

export async function uploadPhoto(params: {
    buffer: Buffer;
    mimeType: string;
    fileName: string;
    username: string;
}): Promise<PhotoInfo> {
    const res = await drive.files.create({
        requestBody: {
            name: params.fileName,
            parents: [config.folderId],
            appProperties: { uploadedBy: params.username },
        },
        media: {
            mimeType: params.mimeType,
            body: Readable.from(params.buffer),
        },
        fields: FILE_FIELDS,
        supportsAllDrives: true,
    });

    return toPhotoInfo(res.data);
}

export async function getPhotoStream(fileId: string) {
    const meta = await drive.files.get({
        fileId,
        fields: 'id,mimeType,parents,trashed',
        supportsAllDrives: true,
    });

    const inFolder = meta.data.parents?.includes(config.folderId) ?? false;
    const isMedia =
        (meta.data.mimeType?.startsWith('image/') || meta.data.mimeType?.startsWith('video/')) ?? false;
    if (!inFolder || !isMedia || meta.data.trashed) {
        return null;
    }

    const media = await drive.files.get(
        { fileId, alt: 'media', supportsAllDrives: true },
        { responseType: 'stream' },
    );

    return { stream: media.data as Readable, mimeType: meta.data.mimeType! };
}