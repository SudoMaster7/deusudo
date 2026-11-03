# deusudo.com

Site principal da SUDO: monstruário de soluções, resultados de clientes, demo de vitrine por ramo, páginas de case e contato pelo WhatsApp.

Next.js 15 (App Router) + TypeScript, sem Tailwind. O visual está em `app/globals.css`.

O site tem um assistente de IA no canto da tela (o "S"). Ele responde pelo Groq, grava o
interesse de cada visita no Supabase — inclusive de onde a pessoa veio e o que a engatou — e
você lê tudo no painel `/admin`. Veja **O assistente "S"**, **De onde veio e qual o gancho** e
**O painel /admin** mais abaixo.

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

## O assistente "S"

O botão redondo no canto abre um painel de conversa. Quem responde é o Groq, pela rota
`app/api/agente/route.ts`. O que a pessoa faz no site (ramo escolhido, números do simulador,
regras montadas no laboratório, carrinho da vitrine, campos do formulário) é guardado em
memória por `components/Activity.tsx` e vai como contexto junto da pergunta — e também para o
registro de interesse.

### Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha. Na Vercel, cadastre os mesmos nomes em
**Settings > Environment Variables**.

| Variável | Para que serve | Sem ela |
| --- | --- | --- |
| `GROQ_API_KEY` | Cérebro do assistente | Ele responde uma frase de contingência e manda para o WhatsApp |
| `SUPABASE_URL` | Onde gravar o interesse | Nada é gravado, o assistente continua respondendo |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave **secreta**: grava e lê | O painel `/admin` não consegue listar os registros |
| `SUPABASE_KEY` | Chave publicável: grava, mas **não lê** | — |
| `ADMIN_PASSWORD` | Senha do painel `/admin`, mínimo 8 caracteres | Ninguém entra no painel, nem você |

> A chave publicável serve para gravar, mas o painel precisa **ler**. Como a tabela tem RLS
> sem política de leitura, de propósito, use a chave secreta se quiser ver os registros
> em `/admin`.

### Criar a tabela

Rode `supabase/interesse-site.sql` uma vez no **SQL Editor** do Supabase. O arquivo cria a
tabela `interesse_site`, a view de leitura `v_interesse` e liga o RLS. Leia os dois caminhos
comentados no fim do arquivo: com a chave **secreta** não precisa de política; com a chave
**publicável** é preciso descomentar o CAMINHO B.

Para ver os leads, no SQL Editor:

```sql
select nome, negocio, ramo, cidade, dor, quente, mensagens, temperatura
from public.v_interesse;
```

## De onde veio e qual o gancho

Duas perguntas que o painel sempre responde.

**De onde veio** sai dos parâmetros do link e do site que encaminhou, lidos na primeira página
que a pessoa abre e guardados ali — se ela chegou por um anúncio e depois navegou, o que conta
é o anúncio. Vira uma frase legível: "anúncio no Instagram", "busca no Google", "Instagram",
"digitou o endereço". Quando o link traz `utm_campaign` ou `utm_content`, a campanha e o
anúncio aparecem junto.

Para isso funcionar nas suas campanhas, mande o tráfego com os parâmetros no link:

```
https://deusudo.com/?utm_source=ig&utm_medium=cpc&utm_campaign=clinicas-rj&utm_content=video-headspa
```

`fbclid` e `gclid`, que o Meta e o Google acrescentam sozinhos, já são reconhecidos como
anúncio mesmo sem `utm_source`.

**O gancho** é a primeira seção em que a pessoa mexeu de verdade: "fez a conta no simulador de
perdas", "montou um atendente do jeito dele", "montou um carrinho na vitrine", "foi ler uma
etapa do fluxo". Escolher um ramo nas demonstrações não conta como gancho, por ser quase um
reflexo, a não ser que seja a única coisa que ela fez. Os textos estão no mapa `GANCHOS`, em
`components/Activity.tsx`.

### Quem clica no WhatsApp sem conversar também é registrado

Um ouvinte único em `components/Activity.tsx` pega o clique em qualquer link do `wa.me` e
manda a visita para `/api/interesse` com `navigator.sendBeacon`, que entrega mesmo com a aba
saindo. Sem isso a pessoa chegaria no seu WhatsApp sem nenhum rastro — e é esse o caminho mais
comum. O registro guarda a origem, o gancho, o que ela fez e **a mensagem que ela te mandou**,
para você achá-la no painel.

Como a mesma sessão grava várias vezes, `salvarInteresse` nunca envia campo vazio: um clique no
WhatsApp não apaga a conversa que a pessoa teve com o agente, e um lead marcado como quente não
volta a ser frio.

## O painel /admin

`deusudo.com/admin` lista os clientes em potencial: de onde cada um veio e de qual campanha, o
gancho que o prendeu, a mensagem que ele te mandou, o que fez em cada seção do site, a conversa
que teve com o "S" e a qualificação que a IA extraiu (nome, negócio, ramo, cidade, dor,
interesse). Quem pediu contato aparece marcado e os contadores no topo mostram quantos estão
nesse ponto.

O acesso é por senha única, em `ADMIN_PASSWORD`. O cookie guarda uma assinatura da senha, não
a senha, e trocar a senha derruba as sessões abertas. A página está fora do Google, por
`noindex` e por `robots.ts`.

## As mensagens de WhatsApp

Cada botão do site monta uma mensagem **em texto natural**, curta, como a própria pessoa
escreveria, com as informações dela diluídas na frase — nunca um bloco de "campo: valor". O
simulador, por exemplo, gera:

> Oi! Fiz aquela conta no site de vocês. Recebo umas 150 mensagens por semana e só consigo
> responder 30% no mesmo dia, então dá uns R$ 8.400 por mês que escapa. O que mais me pega é
> mensagem que fica sem resposta. Como vocês resolveriam isso?

As funções estão em `lib/config.ts` (`waNatural`, `emFrase`, `minuscula`) e cada componente
escreve a sua frase. Duas regras ao mexer nisso:

1. A mensagem só pode afirmar o que a pessoa realmente disse. Clicar num ramo da demonstração
   não quer dizer que o negócio dela é daquele ramo.
2. O detalhe exato fica no painel `/admin`. A mensagem é o convite para a conversa, não o
   relatório.

### Mudar o que ele sabe ou como ele fala

O prompt está em `lib/agentPrompt.ts`, e os fatos (etapas do fluxo, soluções, números,
perguntas frequentes) são lidos de `lib/content.ts`. Atualizar um número em `content.ts`
atualiza o site **e** o assistente de uma vez. As regras de conduta são irmãs das do bot do
WhatsApp, em `ChatAnti-Ban/SYSTEM-PROMPT.md`: se mudar uma regra aqui, mude lá também.

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
| **Como o assistente "S" fala e o que ele sabe** | `lib/agentPrompt.ts` (os fatos vêm de `lib/content.ts`) |
| Saudação e perguntas de atalho do assistente | `lib/agentPrompt.ts` (`AGENT_HELLO`, `AGENT_SHORTCUTS`) |
| Etapas do fluxo e itens do relatório mensal | `lib/content.ts` (`funnel`, `report`) |
| Simulador de perdas e laboratório do atendente | `lib/interactive.ts` |
| Tabela do registro de interesse | `supabase/interesse-site.sql` |
| Texto das mensagens de WhatsApp | cada componente, com os ajudantes de `lib/config.ts` |
| Painel de clientes em potencial | `app/admin/page.tsx` |

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
- Rodar `supabase/interesse-site.sql` no Supabase e cadastrar as variáveis de ambiente na Vercel,
  senão o assistente responde mas não grava nada.
- Definir `ADMIN_PASSWORD` e pegar a chave **secreta** do Supabase, senão o painel `/admin`
  não abre nem lista ninguém.

## O que já está pronto

- Imagem de pré-visualização gerada automaticamente, para a home e para cada case.
- Dados estruturados (negócio local, perguntas frequentes, cases) para a busca do Google.
- `sitemap.xml`, `robots.txt` e manifesto para salvar na tela inicial do celular.
- Fontes servidas pelo próprio domínio, sem chamada ao Google Fonts.
- Menu para celular, página 404 própria e atalho de teclado para pular ao conteúdo.
- Cabeçalhos de segurança e redirecionamentos de endereços antigos em `next.config.mjs`.
