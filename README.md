# aniversario_site · XV Ana Luísa

Protótipo de front do site da festa de 15 anos da Ana Luísa (tema Enrolados: noite de lanternas).

Os convidados entram com o nome, fotografam ou gravam bumerangues de até 6 s pela câmera do próprio site, e tudo aparece numa galeria em exposição com o nome de quem registrou. No computador o site serve só para ver as fotos depois da festa.

> **Status:** só front. Não há backend: o envio fica no próprio aparelho, as fotos desfocadas e os nomes da galeria são exemplos.

## Telas

1. **Abertura**: lanternas subindo, sol da Rapunzel e o nome. Tocar em qualquer lugar acende uma lanterna e leva para a próxima tela.
2. **Boas-vindas**: como funciona em três passos e o campo do nome (salvo no aparelho, sem senha).
3. **Galeria**: fotos e bumerangues em colunas. Vídeo fica parado na capa e só toca ao abrir. Barra inferior com o **+**.
4. **Câmera**: abas Foto e Vídeo; no vídeo, segurar o botão enche o anel até 6 s e para sozinho. Revisão com Refazer ou Enviar.

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
```

## Próximos passos

- Implementar o backend no front para testar as conexões.
- Testar mandando e lendo as midias com os end points (POST: http://localhost:3000/photos, GET: http://localhost:3000/photos).
- Limitar por IP os dispositivos a poder adicionar 2 midias no maximo.
- Data e local da festa; QR code das mesas.
