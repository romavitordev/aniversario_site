# aniversario_site · XV Ana Luísa

Site da festa de 15 anos da Ana Luísa (tema Enrolados: noite de lanternas).

Os convidados entram com o nome, fotografam ou gravam bumerangues de até 5 s pela câmera do próprio site, e tudo aparece numa galeria em exposição com o nome de quem registrou. No computador o site serve só para ver as fotos depois da festa.

> **Status:** front ligado ao backend (`backend/`, Express + Google Drive). As fotos e vídeos vão para uma pasta do Drive com o nome de quem enviou.

## Direção visual

- **Referência:** a cena das lanternas de *Enrolados* (Rapunzel): céu violeta à noite, lanternas douradas subindo e o sol da Rapunzel como marca d'água. Não usamos estilo do Refero, porque o tema veio da decoração da festa (`assets/decoracao.jpg`).
- **Cores** (variáveis em `:root`): `--noite` e `--violeta` para o fundo e as superfícies, `--perola` para o texto, `--lilas` para textos de apoio e `--ouro`/`--ouro-claro` só para o nome, os detalhes e a ação principal.
- **Fontes, cada uma com um papel:** Great Vibes só no nome "Ana Luísa", Cormorant Garamond (itálico) nas frases e títulos, e Jost no texto e nos botões. São 3 famílias, uma a mais que o padrão do estúdio. A exceção é consciente: a Great Vibes não serve para frases e a Jost não dá o tom de convite. Se a performance apertar, a primeira a sair é a Cormorant, trocada por Jost em itálico.
- **Movimento:** lanternas, brilhos e o giro do sol param com `prefers-reduced-motion`. Os brilhos também param enquanto a câmera ou a foto ampliada cobrem a tela, para não gastar bateria.

## Telas

1. **Abertura**: lanternas subindo, sol da Rapunzel e o nome. Tocar em qualquer lugar acende uma lanterna, toca os sinos e leva para a próxima tela.
2. **Boas-vindas**: como funciona em três passos e o campo do nome (salvo no aparelho, sem senha).
3. **Galeria**: fotos e bumerangues em colunas, carregados de 24 em 24 conforme a pessoa rola. Vídeo aparece como capa e só baixa ao abrir. Fotos de outros convidados entram no topo a cada 45 s, ao tocar em "Galeria" ou ao voltar para o site. Estados de carregando, vazio e erro (com "Tentar de novo"). Barra inferior com o **+**.
4. **Câmera**: abas Foto e Vídeo; no vídeo, segurar o botão enche o anel até 5 s e para sozinho (o backend recusa vídeo com mais de 5 s). Revisão com Refazer ou Enviar; o envio mostra o progresso e, se falhar, mantém a foto com "Tentar de novo". Fotos saem com no máximo 1920 px em JPEG (também as escolhidas do celular). Sem permissão de câmera, a tela explica e deixa escolher do rolo.

## Rodar

O front é estático, sem build. O backend precisa do `.env` (copie `backend/.env.example` e peça as chaves do Google ao Richard):

```bash
cd backend && npm install && npm run dev      # API em http://localhost:3000
```

```bash
python -m http.server 5500                    # site em http://localhost:5500
```

O front acha a API pela meta `xv-api` no `<head>` do `index.html`. Vazia, usa `http://localhost:3000`. Em produção, coloque o endereço HTTPS do backend e troque `CORS_ORIGIN` no `.env` pelo endereço do site.

A câmera real (`getUserMedia`) só funciona em **HTTPS** ou em `localhost`. Para testar no celular, use o GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

## Estrutura

```
index.html            todas as telas, estilos e scripts
backend/              API (ver abaixo)
assets/decoracao.jpg  referência de decoração (não é carregada pelo site)
assets/bumerangue.*   bumerangue de exemplo do protótipo (não é carregado pelo site)
assets/sinos.mp3      sinos da abertura
assets/og.jpg         prévia do link no WhatsApp (1200x630)
assets/favicon.svg    ícone da aba (+ apple-touch-icon.png)
qr.html               plaquinhas com QR code para as mesas (4 por A4)
404.html              página de erro no tema da festa
robots.txt            pede para buscadores não indexarem nada
QUALIDADE.md          checklist do padrão de qualidade do estúdio, marcado
```

## QR code das mesas

Abra `qr.html` no site publicado (o QR já aponta para ele) ou use `qr.html?url=https://...`. Confira com a câmera do celular e imprima: sai uma folha A4 com 4 plaquinhas para recortar.

## API (backend/)

| Rota | Uso |
|---|---|
| `GET /photos?pageSize=24&pageToken=...` | lista, mais novas primeiro (`photos`, `nextPageToken`) |
| `GET /photos/:id` | o arquivo da foto ou do vídeo |
| `POST /photos` | envio: campo `photo` (multipart) e cabeçalho `X-Username` |
| `GET /health` | `{ ok: true }` |

Regras que o front repete para avisar antes de enviar: nome com 2 a 30 caracteres (letras, números, espaço, `_ . -`), vídeo de até 5 s e 30 MB, foto JPG/PNG/WebP de até 5 MB.

## Pontos para o backend

- **Limite de envios por IP.** Hoje são 20 envios a cada 15 min por IP. Na festa, quase todo mundo vai estar no Wi-Fi do salão, que sai para a internet com **um IP só**: o limite vale para a festa inteira, e não por pessoa. A ideia de "2 mídias por IP" teria o mesmo problema. Melhor limitar por `X-Username` + aparelho, ou subir bastante o limite por IP.
- **Vídeo no iPhone.** `GET /photos/:id` não responde por partes (`Range`/206), e o Safari do iPhone precisa disso para tocar um vídeo direto da URL. O front contorna baixando o vídeo inteiro antes de tocar; com `Range` no backend daria para tocar direto.
- **Miniaturas.** A galeria baixa cada foto no tamanho enviado (até 1920 px). O Drive tem `thumbnailLink`, e uma rota de miniatura deixaria a galeria bem mais leve na internet da festa.
- **CORS.** `CORS_ORIGIN=*` serve para testar; em produção, o domínio do site.
- Corrigido nesta integração: o tratamento de erro respondia 415 ("tipo não permitido") para qualquer erro, inclusive Drive fora do ar, e depois tentava responder de novo (`ERR_HTTP_HEADERS_SENT`).

## Próximos passos

- Publicar o backend (HTTPS) e preencher a meta `xv-api` e o `CORS_ORIGIN`.
- Testar no iPhone e num Android com o site publicado (câmera, gravação e envio).
- Gerar o bumerangue (vai e volta) no servidor com ffmpeg e a capa do vídeo.
- Quando o domínio estiver definido, trocar `og:image` no `index.html` pelo endereço completo (o WhatsApp não lê caminho relativo).
- Data e local da festa (pendente: a cliente precisa enviar).