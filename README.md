# Blog do Gustavo Franco

Painel de administração + blog público, separado do site principal (que é estático).
O Gustavo entra com e-mail e senha, escreve o post, opcionalmente anexa uma foto de capa
e/ou um PDF, marca "Publicado" e o artigo aparece em `/blog`.

## Rodando local (já configurado)

```bash
npm install
npm run dev
```

Abre em http://localhost:3000. Em dev, o banco é um arquivo SQLite local
(`prisma/dev.db`, já criado) e uploads vão para `public/uploads/` — não precisa
configurar nada a mais para testar.

Login de admin local: veja o arquivo `.env` (`ADMIN_EMAIL` e `ADMIN_PASSWORD`).

## Colocando no ar (Vercel)

O painel de admin precisa de um banco de dados de verdade e de um lugar pra guardar
fotos/PDFs — coisas que só existem em produção, não fazem parte do código. São 4 passos
dentro do painel da Vercel:

### 1. Criar o banco de dados

No projeto na Vercel: aba **Storage** → **Create Database** → escolha **Postgres**
(Neon, oferecido pela própria Vercel). Depois de criado, a Vercel já preenche a variável
`DATABASE_URL` automaticamente nas Environment Variables do projeto.

Depois disso, troque uma linha no arquivo `prisma/schema.prisma`:

```diff
 datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
   url      = env("DATABASE_URL")
 }
```

E rode uma vez (localmente, apontando pro banco de produção, ou via `vercel env pull`):

```bash
npx prisma db push
```

Isso cria a tabela de posts no banco novo.

### 2. Criar o armazenamento de arquivos (fotos/PDFs)

Aba **Storage** → **Create Database** → **Blob**. Depois de criado, a variável
`BLOB_READ_WRITE_TOKEN` é preenchida automaticamente. Sem isso configurado, o upload
cai automaticamente no modo de dev (salva em `public/uploads`), que **não funciona em
produção** (a Vercel não guarda arquivos escritos em disco entre uma requisição e outra) —
por isso esse passo é obrigatório antes de publicar de verdade.

### 3. Definir o login e o segredo de sessão

Aba **Settings → Environment Variables**, adicione:

- `ADMIN_EMAIL` — o e-mail que o Gustavo vai usar pra entrar no painel.
- `ADMIN_PASSWORD` — a senha que o Gustavo vai usar pra entrar no painel.
- `SESSION_SECRET` — qualquer string longa e aleatória (pode gerar em
  https://generate-secret.vercel.app/32 ou similar).

### 4. Trocar o link "Voltar ao site"

Em `lib/config.ts`, atualize `MAIN_SITE_URL` para o domínio real do site principal
do Gustavo assim que ele tiver um.

### Deploy

Com o repositório no GitHub, é só importar o projeto na Vercel
(vercel.com/new) e apontar pra pasta deste projeto. Cada push na branch principal
publica uma nova versão automaticamente.

## Como o Gustavo usa o painel

1. Acessa `/admin/login` e entra com e-mail e senha.
2. `/admin` mostra todos os posts (rascunho ou publicado).
3. "+ Novo post" abre o editor: título, resumo curto, conteúdo (com botões de
   formatação — negrito, listas, títulos, etc., sem precisar saber Markdown de cor),
   foto de capa opcional, PDF opcional.
4. Marca "Publicado" quando quiser que o post apareça em `/blog` — sem marcar, fica
   salvo como rascunho, só visível pra ele no painel.
5. Pode editar ou excluir qualquer post depois.

## Estrutura

- `app/blog` — páginas públicas (lista + artigo).
- `app/admin` — painel (protegido por login).
- `app/api/admin` — rotas de login/logout, criar/editar/excluir post, upload.
- `proxy.ts` — protege todas as rotas `/admin` e `/api/admin` (exceto o próprio login).
- `prisma/schema.prisma` — modelo do post.
- `lib/upload.ts` — decide automaticamente entre Vercel Blob (produção) e disco local (dev).
