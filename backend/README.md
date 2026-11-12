# Comunitera — Backend (API)

Servidor do Comunitera em **Node.js + Express**, escrito em **TypeScript**, com banco **SQLite**
(o `node:sqlite`, que já vem dentro do Node). O Node 24 roda os arquivos `.ts` direto, sem compilar.

## Como rodar

```bash
npm install            # só na primeira vez
cp .env.example .env   # só na primeira vez (depois troque a senha do admin e o JWT_SEGREDO)
npm run dev            # liga em http://localhost:3000/api e reinicia sozinho ao salvar
```

Na primeira vez, o servidor cria o arquivo `comunitera.db`, as tabelas, alguns dados de exemplo
e o **login mestre do D.A.** com o usuário e a senha do `.env`.

> Para começar o banco do zero, desligue o servidor e apague o arquivo `comunitera.db`.

| Comando             | O que faz                                |
|---------------------|------------------------------------------|
| `npm run dev`       | Liga o servidor e reinicia ao salvar     |
| `npm start`         | Liga o servidor (sem reiniciar sozinho)  |
| `npm run verificar` | Confere os tipos com o TypeScript        |

## Rotas

Todas começam com `/api`. As marcadas com 🔒 precisam do token (`Authorization: Bearer <token>`)
e as com 👑 são só do admin.

| Método | Caminho                         | O que faz                                   |
|--------|---------------------------------|---------------------------------------------|
| POST   | `/cadastro`                     | Cria conta de aluno e devolve o token        |
| POST   | `/login`                        | Entra (RA ou usuário do D.A. + senha)        |
| GET    | `/eu` 🔒                        | Dados de quem está logado                    |
| GET    | `/eventos` 🔒                   | Lista os eventos (com nº de inscritos)       |
| POST   | `/eventos` 👑                   | Cadastra evento                              |
| DELETE | `/eventos/:id` 👑               | Apaga evento                                 |
| GET    | `/eventos/inscricoes` 🔒        | Ids dos eventos em que estou inscrito        |
| POST   | `/eventos/:id/inscricao` 🔒     | Me inscrever                                 |
| DELETE | `/eventos/:id/inscricao` 🔒     | Cancelar inscrição                           |
| GET    | `/vagas` 🔒                     | Lista as vagas (com nº de candidatos)        |
| POST   | `/vagas` 👑                     | Cadastra vaga                                |
| DELETE | `/vagas/:id` 👑                 | Apaga vaga                                   |
| GET    | `/vagas/candidaturas` 🔒        | Ids das vagas em que me candidatei           |
| POST   | `/vagas/:id/candidatura` 🔒     | Me candidatar                                |
| GET    | `/avisos` 🔒                    | Lista os avisos                              |
| POST   | `/avisos` 👑                    | Publica aviso                                |
| DELETE | `/avisos/:id` 👑                | Apaga aviso                                  |
| GET    | `/aulas` 🔒                     | Grade de aulas                               |
| POST   | `/aulas` 👑                     | Cadastra aula                                |
| DELETE | `/aulas/:id` 👑                 | Apaga aula                                   |
| GET    | `/compromissos` 🔒              | Datas gerais do D.A. + meus compromissos     |
| POST   | `/compromissos` 🔒              | Aluno: compromisso só dele. Admin: geral     |
| DELETE | `/compromissos/:id` 🔒          | Aluno apaga os dele; admin apaga os gerais   |

## Estrutura

```
src/
├── server.ts            liga o Express e junta as rotas
├── db.ts                abre o SQLite, cria as tabelas, dados de exemplo e o admin
├── auth.ts              token JWT e os "porteiros" exigirLogin / exigirAdmin
└── rotas/
    ├── contas.ts        cadastro, login, /eu
    ├── eventos.ts       eventos + inscrições
    ├── vagas.ts         vagas + candidaturas
    ├── avisos.ts
    ├── aulas.ts
    └── compromissos.ts
```
