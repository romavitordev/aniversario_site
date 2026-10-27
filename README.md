# aniversario_site · XV Ana Luísa

Protótipo de front do site da festa de 15 anos da Ana Luísa (tema Enrolados: noite de lanternas).

Os convidados entram com o nome, fotografam ou gravam bumerangues de até 5 s pela câmera do próprio site, e tudo aparece numa galeria em exposição com o nome de quem registrou. No computador o site serve só para ver as fotos depois da festa.

> **Status:** só front. Não há backend: o envio fica no próprio aparelho, as fotos desfocadas e os nomes da galeria são exemplos.

## Direção visual

- **Referência:** a cena das lanternas de *Enrolados* (Rapunzel): céu violeta à noite, lanternas douradas subindo e o sol da Rapunzel como marca d'água. Não usamos estilo do Refero, porque o tema veio da decoração da festa (`assets/decoracao.jpg`).
- **Cores** (variáveis em `:root`): `--noite` e `--violeta` para o fundo e as superfícies, `--perola` para o texto, `--lilas` para textos de apoio e `--ouro`/`--ouro-claro` só para o nome, os detalhes e a ação principal.
- **Fontes, cada uma com um papel:** Great Vibes só no nome "Ana Luísa", Cormorant Garamond (itálico) nas frases e títulos, e Jost no texto e nos botões. São 3 famílias, uma a mais que o padrão do estúdio. A exceção é consciente: a Great Vibes não serve para frases e a Jost não dá o tom de convite. Se a performance apertar, a primeira a sair é a Cormorant, trocada por Jost em itálico.
- **Movimento:** lanternas, brilhos e o giro do sol param com `prefers-reduced-motion`. Os brilhos também param enquanto a câmera ou a foto ampliada cobrem a tela, para não gastar bateria.

## Telas

1. **Abertura**: lanternas subindo, sol da Rapunzel e o nome. Tocar em qualquer lugar acende uma lanterna, toca os sinos e leva para a próxima tela.
2. **Boas-vindas**: como funciona em três passos e o campo do nome (salvo no aparelho, sem senha).
3. **Galeria**: fotos e bumerangues em colunas. Vídeo fica parado na capa e só toca ao abrir. Barra inferior com o **+**.
4. **Câmera**: abas Foto e Vídeo; no vídeo, segurar o botão enche o anel até 5 s e para sozinho (o backend recusa vídeo com mais de 5 s). Revisão com Refazer ou Enviar.

## Rodar

É um site estático, sem build:

```bash
npx serve .        # ou: python3 -m http.server 8000
```

A câmera real (`getUserMedia`) só funciona em **HTTPS** ou em `localhost`. Para testar no celular, use o GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root). Sem permissão de câmera, o site mostra um visor simulado.

## Estrutura

```
index.html            todas as telas, estilos e scripts
assets/decoracao.jpg  referência de decoração (visor simulado e galeria)
assets/bumerangue.*   bumerangue de exemplo (mp4 + webm) e capa
assets/sinos.mp3      sinos da abertura
assets/og.jpg         prévia do link no WhatsApp (1200x630)
assets/favicon.svg    ícone da aba (+ apple-touch-icon.png)
qr.html               plaquinhas com QR code para as mesas (4 por A4)
404.html              página de erro no tema da festa
```

## QR code das mesas

Abra `qr.html` no site publicado (o QR já aponta para ele) ou use `qr.html?url=https://...`. Confira com a câmera do celular e imprima: sai uma folha A4 com 4 plaquinhas para recortar.

## Próximos passos

- Backend de envio (storage + registro de quem enviou), seguindo o `PADRAO-QUALIDADE-SITES.md` do estúdio.
- Gerar o bumerangue (vai e volta) no servidor com ffmpeg e a capa do vídeo.
- Ligar a galeria e a câmera às rotas `/photos` do backend (cabeçalho `X-Username`).
- Quando o domínio estiver definido, trocar `og:image` no `index.html` pelo endereço completo (o WhatsApp não lê caminho relativo).
- Data e local da festa (pendente: a cliente precisa enviar).
