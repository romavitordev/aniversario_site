# Qualidade · XV Ana Luísa

Análise do front contra o `PADRAO-QUALIDADE-SITES.md` do estúdio, em 27/10/2026, atualizada em 31/10/2026 depois de ligar o front ao backend. O backend fica no branch `backend`, separado do front.
Legenda: `[x]` feito · `[~]` parcial · `[ ]` pendente · `n/a` não se aplica (com o motivo).

O backend do Richard está no branch `backend`. A seção 3 (Backend) ainda não foi auditada; os pontos já vistos na integração estão no README, em "Pontos para o backend".

## Lighthouse (celular, servidor local)

| Medição | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| 27/10 (protótipo) | 81 | 100 | 100 | 60 |
| **31/10 (ligado ao backend)** | **99** | **100** | **100** | 63 (de propósito, ver SEO) |

Agora: primeira pintura 1,0 s (era 3,4 s) · LCP 2,1 s (era 3,9 s; meta < 2,5 s) · CLS 0,045 · TBT 0 ms.

O que mudou: as fontes do Google deixaram de bloquear a primeira pintura (carregam em paralelo; o texto aparece na fonte do sistema e troca quando elas chegam, por isso o CLS subiu um pouco, ainda bem abaixo de 0,1), e a foto de decoração do protótipo (145 KB) saiu junto com a câmera simulada.
Ainda aparecem compressão e cache: o servidor local não comprime. Medir de novo na hospedagem final.
## 1. Design e referências

- [x] Direção visual a partir de referências anotadas no README (seção "Direção visual": Enrolados, cores e papel de cada fonte).
- [x] Tokens definidos antes das telas (variáveis em `:root`: cores, fontes, margens).
- [~] No máximo 2 famílias de fonte. São 3 (Great Vibes, Cormorant Garamond e Jost), e ficaram como **exceção registrada no README**, com o papel de cada uma e qual sai primeiro se a performance apertar.
- [x] Contraste AA. Lilás 9,5:1, ouro 13,7:1, botão 9:1 e o placeholder "Seu nome" subiu de 3,7:1 para 5,6:1.
- [x] Animações respeitam `prefers-reduced-motion` (lanternas, brilhos, sol, saída da abertura).
- [x] Efeitos pesados. Os canvas não têm WebGL, o TBT é 0, e os brilhos agora param enquanto a câmera ou a foto ampliada cobrem a tela.
- [x] Efeito decorativo não atrapalha leitura nem botão.
- n/a Modelos 3D: o site não tem.

## 2. Frontend

### Layout e responsividade
- [~] Testado em 375 px (celular) e no desktop do navegador. Faltam 360, 768, 1280 e 1920 px.
- [x] Sem rolagem horizontal (medido em 375 px).
- [x] Áreas de toque de 44 px. Barra, "+", botões da câmera, setas e "Fechar ✕" da foto ampliada (este tinha 43 px e passou para 44).
- n/a Tema claro/escuro: a noite escura é a identidade da festa.

### Conversão
- n/a CTA, WhatsApp flutuante e prova social: não é site de negócio. O "CTA" é o **+**, que fica sempre visível na barra.
- [x] Estados de carregando, sucesso e erro no envio: progresso em %, botões travados durante o envio, mensagem do servidor ou de falta de internet, e "Tentar de novo" sem perder a foto. A galeria também tem estados de carregando, vazio e erro.

### Performance
- [x] Lighthouse mobile ≥ 90 (99).
- [x] LCP < 2,5 s (2,1 s). [x] CLS < 0,1 (0,045). [x] INP/TBT.
- [~] Imagens. A galeria usa `loading="lazy"` e `decoding="async"`, e as fotos sobem em JPEG de até 1920 px. Faltam miniaturas (depende do backend; ver README) e `width`/`height`, que o backend ainda não informa.
- [~] Fontes com `display=swap` e sem bloquear a primeira pintura [x]. Continuam 3 famílias (exceção registrada).
- n/a Scripts de terceiros: não há analytics nem pixel.

### Acessibilidade
- [~] HTML semântico. Tem `header`, `main`, `nav`, um `h1` na abertura e agora o título "Momentos inesquecíveis" (`h1`) na galeria; como só uma tela aparece por vez, há um `h1` visível de cada vez. Não tem `footer` (entra junto com o aviso de LGPD).
- [x] Teclado e foco visível. O foco é visível, volta para o lugar certo ao fechar e fica preso dentro do que está aberto (câmera, revisão, foto ampliada, "Como usar").
- [x] `alt` nas fotos ("Foto de Marina"); decorativas com `aria-hidden`.
- [x] Label no campo de nome.

### SEO
- n/a Indexação: o `noindex` é de propósito, porque é a galeria privada de uma festa. Por isso o SEO dá 60 no Lighthouse, e está certo assim. `sitemap.xml`, JSON-LD, Search Console e GA4 também não se aplicam.
- [x] `title` e `description`.
- [~] Open Graph e Twitter Card [x], mas o `og:image` ainda é caminho relativo. O WhatsApp só mostra a prévia com endereço completo, que depende do domínio.
- [x] `robots.txt` com `Disallow: /` (só vale na raiz do domínio; no GitHub Pages de projeto quem protege é o `noindex`).

## 4. Compliance e LGPD

Aqui está o ponto mais sério: o site recolhe **nome e fotos de convidados, muitos deles menores de idade** (é uma festa de 15 anos). A LGPD (art. 14) pede cuidado extra com dados de crianças e adolescentes.

- [~] Aviso curto nas boas-vindas e no "Como usar": a foto aparece com o nome, para quem tiver o link. Falta dizer até quando a galeria fica no ar (pendente com a cliente).
- [~] Forma de pedir para tirar uma foto: o aviso diz "fale com a família da Ana Luísa". Falta um contato concreto (pendente com a cliente).
- [ ] Política de privacidade curta (pode ser uma folha dentro do próprio site).
- n/a Banner de cookies: não há analytics nem pixel. O nome fica no `localStorage` só para não perguntar de novo.
- [ ] Dados do controlador (quem responde pelas fotos: a família ou o estúdio). **Pendente com a cliente**, não vou inventar.

## 5. Entrega

- [x] README com stack, como rodar front e backend, rotas da API, referências visuais e pontos para o backend. As variáveis de ambiente estão explicadas em `backend/.env.example`, no branch `backend`.
- [~] Textos e fotos reais. A galeria agora vem do backend e os exemplos saíram. Faltam a data e o local da festa.
- [ ] Testado em Chrome, Safari (iOS) e Samsung Internet. Só foi testado no navegador do computador. **O Safari do iPhone é o mais importante**: a gravação de vídeo (`MediaRecorder`) e a câmera se comportam diferente lá.
- [x] Favicon, ícone do iPhone e imagem de compartilhamento.
- [x] Página 404.
- n/a Painel: não há.

## Qualidade de código

O que está bom:
- Nomes em português, consistentes com o tema (`lanternas`, `abrirFolha`, `meuNome`), e comentários que explicam o porquê.
- Sem dependências nem build: abre direto no GitHub Pages.
- Nomes de convidados passam por `esc()` antes de entrar no HTML, então um nome com `<script>` não quebra a página.
- `try/catch` no `localStorage` (navegação anônima no iPhone não derruba o site).

O que melhorar:
- [ ] **Arquivo único com ~860 linhas** (CSS + HTML + JS). Separar em `estilos.css` e `app.js` facilita revisar e deixa o navegador guardar em cache.
- [ ] **Várias instruções por linha** (ex.: `abrir()`, `pararGravacao()`, `fotografar()`). Fica difícil ler um diff e achar um erro. Um formatador (Prettier) resolve de uma vez.
- [ ] Dois blocos `<style>`, um no `<head>` e outro no `<body>`. O primeiro põe `padding` de área segura no `:root`, que se soma ao `body::before` e aos `env()` da barra. Juntar num só bloco e conferir no iPhone com notch.
- [x] Memória: as prévias descartadas e os vídeos abertos na foto ampliada agora são liberados com `revokeObjectURL`.
- [ ] Ao girar o celular, as lanternas são recriadas e a lanterna da pessoa some no meio da animação.
- [x] Dados vindos do servidor (id, nome de quem enviou, endereço da foto) passam por `esc()` antes de entrar no HTML.
- [x] `qr.html` carrega a biblioteca do cdnjs com `integrity` (SRI, SHA-512 conferido com o publicado pelo cdnjs).
- [ ] Sem lint, sem testes e sem CI. Para um site deste tamanho, basta um `npx prettier --check` e um `npx html-validate` no GitHub Actions.

## Prioridade sugerida

1. **Testar no iPhone e num Android** com o site e o backend publicados em HTTPS (câmera, gravação, envio e vídeo na foto ampliada).
2. **LGPD com a cliente:** quem responde pelas fotos, um contato para pedir remoção e até quando a galeria fica no ar.
3. **Backend (Richard):** limite por IP que vale para a festa inteira no Wi-Fi do salão, `Range` para vídeo no iPhone e miniaturas. Detalhes no README.
4. **Código:** separar CSS/JS e formatar com Prettier. Vale fazer depois da festa ou num PR só disso, para não misturar com mudanças de comportamento.
5. **Domínio:** trocar o `og:image` pelo endereço completo.