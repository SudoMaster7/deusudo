# deusudo.com

Site principal da SUDO: monstruário de soluções, resultados de clientes, demo de vitrine por ramo, páginas de case e contato pelo WhatsApp.

Next.js 15 (App Router) + TypeScript, sem Tailwind. O visual está em `app/globals.css`.

## Rodar no seu computador

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # tipos + lint + build, tudo de uma vez
```

Rode `npm run check` antes de cada publicação. Se ele passar, a Vercel também vai passar.

## Subir para o GitHub

```bash
git add .
git commit -m "Atualiza o site"
git push
```

Na primeira vez:

```bash
git init
git add .
git commit -m "Site deusudo.com"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/deusudo.git
git push -u origin main
```

## Publicar na Vercel com o domínio deusudo.com

1. Em vercel.com, **Add New > Project** e importe o repositório. Os padrões do Next.js servem, não precisa configurar nada.
2. Em **Settings > Domains**, adicione `deusudo.com` e `www.deusudo.com`.
3. No painel onde você comprou o domínio, crie os registros de DNS exatamente como a Vercel mostrar na tela de Domains (normalmente um registro **A** para a raiz e um **CNAME** para `www`).
4. Na Vercel, deixe `deusudo.com` como domínio principal e `www` redirecionando para ele.
5. Depois que o site estiver no ar, aponte `usesudo.com.br` e `usesudo.vercel.app` para ele com um redirecionamento 301.

### Depois que estiver no ar

- Cadastre o site no [Google Search Console](https://search.google.com/search-console) e envie `https://deusudo.com/sitemap.xml`.
- Teste a imagem de pré-visualização mandando o link para você mesmo no WhatsApp. Se aparecer errado, o WhatsApp guarda o resultado em cache por algumas horas.
- Confira os dados estruturados no [Teste de Resultados Enriquecidos](https://search.google.com/test/rich-results) do Google.

## E-mail profissional

O site mostra `contato@deusudo.com`. Crie essa caixa (Zoho Mail, Google Workspace, Hostinger etc.) antes de divulgar e configure SPF, DKIM e DMARC no DNS.

## Onde mexer

| O que | Onde |
| --- | --- |
| WhatsApp, e-mail, Instagram, link do portfólio técnico | `lib/config.ts` |
| **Vídeo de apresentação** | `lib/config.ts`, campo `video` (`youtubeId` de um vídeo "não listado" **ou** `mp4` de um arquivo em `public/`) |
| Números dos resultados e textos dos cases | `lib/content.ts` (`results`, `cases`) |
| Soluções do monstruário, perguntas frequentes, passos | `lib/content.ts` |
| Ramos da demo (itens, preços, conversa) | `lib/niches.ts` |
| Seções do menu (topo e celular) | `lib/nav.ts` |
| Foto | `public/leo.jpg` (proporção 4:5) |
| **Logos dos clientes** | `public/logos/flor-da-pele.png`, `carlito-botecaria.png`, `espaco-granjear.png` (aceita svg, png, webp, jpg). Sem arquivo, o site mostra o nome em texto |
| Cores | variáveis no topo de `app/globals.css` |
| Imagem que aparece ao compartilhar o link | `app/opengraph-image.tsx` (home) e `app/cases/[slug]/opengraph-image.tsx` (cases) |
| Dados para o Google (negócio local, FAQ, cases) | `lib/schema.ts` |

### Conferir a imagem de compartilhamento

Com `npm run dev` rodando, abra:

- http://localhost:3000/opengraph-image
- http://localhost:3000/cases/flor-da-pele/opengraph-image

As fontes dessas imagens ficam em `assets/fonts/`. Não apague essa pasta: sem ela o build quebra.

## Pendências antes de divulgar

- Subir os logos dos clientes e o vídeo de apresentação.
- Criar o e-mail contato@deusudo.com.
- Revisar `app/privacidade/page.tsx`. É um texto-base. Se adicionar Meta Pixel, Google Analytics ou outro rastreador, atualize a página e inclua um aviso de cookies.
- Atualizar os números de `lib/content.ts` a cada novo relatório de campanha.

## O que já está pronto

- Imagem de pré-visualização gerada automaticamente, para a home e para cada case.
- Dados estruturados (negócio local, perguntas frequentes, cases) para a busca do Google.
- `sitemap.xml`, `robots.txt` e manifesto para salvar na tela inicial do celular.
- Fontes servidas pelo próprio domínio, sem chamada ao Google Fonts.
- Menu para celular, página 404 própria e atalho de teclado para pular ao conteúdo.
- Cabeçalhos de segurança e redirecionamentos de endereços antigos em `next.config.mjs`.
