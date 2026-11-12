# Comunitera — Frontend (React + TypeScript)

App do Diretório Acadêmico TERA feito a partir das telas do Figma:
Página inicial, Calendário, Eventos, Vagas, Hub TERA (carteirinha digital) e o Painel do D.A. (só para o admin).

Os dados vêm do servidor em [`../backend`](../backend), que precisa estar ligado.
A documentação completa do código está em [`../docs/Documentacao_Comunitera.pdf`](../docs/Documentacao_Comunitera.pdf).

## Como rodar

Primeiro ligue o backend (veja o README dele). Depois, nesta pasta:

```bash
npm install     # só na primeira vez
npm run dev     # abre em http://localhost:5173
```

O Vite repassa todo pedido que começa com `/api` para o servidor em `http://localhost:3000`
(veja `vite.config.ts`).

| Comando           | O que faz                                         |
|-------------------|---------------------------------------------------|
| `npm run build`   | Confere os tipos e gera a versão final em `dist/` |
| `npm run preview` | Abre a versão final gerada pelo build             |
| `npm run lint`    | Procura problemas no código (ESLint)              |

## Estrutura

```
src/
├── main.tsx            ponto de partida
├── App.tsx             login, busca dos dados no servidor e troca de telas
├── api.ts              funções que conversam com o servidor (fetch + token)
├── links.ts            links fixos (WhatsApp, Instagram, Ouvidoria)
├── index.css           todos os estilos
├── types.ts            tipos (formatos dos dados)
├── utils/              funções de ajuda (localStorage e datas)
├── components/         BarraNavegacao, CartaoEvento, Modal, ItemAdmin
└── pages/              Login, Inicio, Calendario, Eventos, Vagas, HubTera
    └── admin/          Painel do D.A.: eventos, vagas, avisos, aulas, calendário
```
