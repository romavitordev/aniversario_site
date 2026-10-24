import 'dotenv/config';
import http from 'http';
import { google } from 'googleapis';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
    console.error('Preencha GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env primeiro.');
    process.exit(1);
}

const PORT = 3333;
const redirectUri = `http://localhost:${PORT}/oauth2callback`;
const oauth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const url = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive'],
});

const server = http.createServer(async (req, res) => {
    if (!req.url?.startsWith('/oauth2callback')) {
        res.writeHead(404).end();
        return;
    }

    const code = new URL(req.url, `http://localhost:${PORT}`).searchParams.get('code');
    if (!code) {
        res.writeHead(400).end('Código ausente.');
        return;
    }

    try {
        const { tokens } = await oauth.getToken(code);
        res.end('Pronto! Pode fechar esta aba e voltar ao terminal.');
        console.log('\nCopie esta linha para o seu .env:\n');
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    } catch (err) {
        res.writeHead(500).end('Erro ao obter o token. Veja o terminal.');
        console.error(err);
    } finally {
        server.close();
    }
});

server.listen(PORT, () => {
    console.log('Abra este link no navegador, logado na conta Google DO PROJETO:\n');
    console.log(url + '\n');
});