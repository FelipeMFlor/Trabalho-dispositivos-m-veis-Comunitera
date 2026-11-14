# Guia de Estudo — Comunitera

Este documento ensina a construir o **Comunitera** do zero: instalar as ferramentas, entender os fundamentos e escrever todo o código do servidor (Node.js) e do aplicativo (React Native), até ter o app rodando no celular.

Ele foi pensado para quem **está começando agora**. Nada é "óbvio" aqui: cada comando e cada arquivo vem com a explicação do que faz e por quê.

## Como usar este guia

1. **Faça na ordem.** Cada parte depende da anterior.
2. **Digite o código, não copie e cole.** Parece mais lento, mas é assim que o cérebro aprende a sintaxe. Errar uma vírgula e descobrir o erro sozinho ensina mais do que qualquer explicação. Copiar e colar só vale para comandos de instalação.
3. **Leia as seções "Entendendo o código".** O objetivo é você conseguir explicar cada linha para um colega (e para o professor).
4. **Teste a cada passo.** Todo trecho termina com um "Teste" ou "Checkpoint". Só siga em frente quando funcionar.
5. **Faça commit a cada checkpoint** seguindo o fluxo do [README](../README.md#6-o-fluxo-do-dia-a-dia-a-receita).
6. **Desafios:** algumas partes têm um desafio. Tente resolver sozinho primeiro; a resposta fica escondida num bloco "Ver resposta" que você clica para abrir.
7. **Travou?** Veja a [Parte 8 — Problemas comuns](#parte-8--problemas-comuns). Se não resolver, mande no grupo o **print do erro completo**.

> **Sobre IA:** a proposta do trabalho é usar o mínimo de IA. Para não ter o código "escrito sozinho" enquanto você digita, desligue as sugestões de IA do VS Code: `Ctrl + ,` → pesquise `chat.disableAIFeatures` → marque a caixa. (Isso esconde o chat e as sugestões automáticas do Copilot.)

---

## Sumário

- [Parte 0 — Visão geral do projeto](#parte-0--visão-geral-do-projeto)
- [Parte 1 — Preparando o computador](#parte-1--preparando-o-computador)
- [Parte 2 — Fundamentos (estude antes de programar)](#parte-2--fundamentos-estude-antes-de-programar)
  - [2.1 Como o app conversa com o servidor](#21-como-o-app-conversa-com-o-servidor)
  - [2.2 JavaScript essencial](#22-javascript-essencial)
  - [2.3 SQL essencial](#23-sql-essencial)
  - [2.4 React essencial](#24-react-essencial)
  - [2.5 Login, senha e token: como funciona](#25-login-senha-e-token-como-funciona)
- [Parte 3 — Preparando o repositório](#parte-3--preparando-o-repositório)
- [Parte 4 — Backend (servidor)](#parte-4--backend-servidor)
- [Parte 5 — App mobile](#parte-5--app-mobile)
- [Parte 6 — Rodando tudo junto](#parte-6--rodando-tudo-junto)
- [Parte 7 — Dividindo o trabalho no time](#parte-7--dividindo-o-trabalho-no-time)
- [Parte 8 — Problemas comuns](#parte-8--problemas-comuns)
- [Parte 9 — Indo além](#parte-9--indo-além)
- [Parte 10 — Glossário e links para estudar](#parte-10--glossário-e-links-para-estudar)

---

# Parte 0 — Visão geral do projeto

## O que vamos construir

Um aplicativo de celular com 4 abas:

| Aba | O que tem | Quem pode criar conteúdo |
|---|---|---|
| **Notícias** | Avisos do DA, com detalhe ao tocar | Só a diretoria (`admin`) |
| **Loja** | Itens à venda por alunos, com botão "Chamar no WhatsApp" | Qualquer aluno logado |
| **Eventos** | Próximos eventos, em formato de calendário | Só a diretoria (`admin`) |
| **Perfil** | Entrar, criar conta, sair | — |

## Como as peças se encaixam

O projeto tem **duas partes separadas** que conversam pela internet (ou pelo Wi-Fi da sua casa):

```
 ┌───────────────────────┐        HTTP + JSON         ┌───────────────────────┐        SQL        ┌──────────────────┐
 │   APP (mobile/)       │ ────────────────────────>  │  SERVIDOR (backend/)  │ ───────────────>  │  BANCO DE DADOS  │
 │                       │   "me dá as notícias"      │                       │  SELECT * FROM    │  comunitera.db   │
 │  React Native + Expo  │                            │  Node.js + Express    │  noticias         │  (SQLite)        │
 │  roda no celular      │ <────────────────────────  │  roda no seu PC       │ <───────────────  │  arquivo no PC   │
 │                       │   [ {notícia}, {...} ]     │                       │   linhas          │                  │
 └───────────────────────┘                            └───────────────────────┘                   └──────────────────┘
```

- O **app** só mostra telas e pede dados. Ele **não** acessa o banco direto.
- O **servidor** (também chamado de **backend** ou **API**) recebe os pedidos, confere se a pessoa tem permissão, lê/grava no banco e responde.
- O **banco de dados** guarda tudo de forma permanente (usuários, notícias, itens, eventos).

Por que separar? Porque assim o servidor é o único "porteiro" dos dados. Se o app pudesse falar direto com o banco, qualquer pessoa que abrisse o app conseguiria apagar tudo.

## As tecnologias e por que foram escolhidas

| Tecnologia | Para quê | Por que ela |
|---|---|---|
| **JavaScript** | A linguagem de tudo (app e servidor) | Uma linguagem só para o projeto inteiro: menos coisa para aprender |
| **Node.js** | Rodar JavaScript fora do navegador (no PC) | Exigência do trabalho; é a base do servidor e das ferramentas do app |
| **Express** | Criar o servidor e as rotas da API | O framework mais usado e mais documentado de Node |
| **SQLite** (`node:sqlite`) | Banco de dados | Já vem dentro do Node, é só um arquivo, **não precisa instalar nada** |
| **bcryptjs** | Criptografar senhas | Nunca se guarda senha "pura" no banco |
| **jsonwebtoken (JWT)** | "Crachá" de quem está logado | Padrão de mercado para APIs |
| **React Native** | Fazer o app de celular com React | Exigência do trabalho (React) para celular |
| **Expo** | Ferramentas que facilitam o React Native | Roda o app no seu celular pelo app **Expo Go**, sem instalar Android Studio |
| **Expo Router** | Navegação entre telas | Cada arquivo vira uma tela, simples de entender |

## Como o projeto vai ficar no final

```
Comunitera/
├── .gitignore
├── README.md
├── docs/
│   └── GUIA_DE_ESTUDO.md
│
├── backend/
│   ├── package.json
│   ├── .env                 ← segredos (NÃO vai pro Git)
│   ├── .env.example         ← modelo do .env (vai pro Git)
│   ├── requests.http        ← testes da API
│   ├── comunitera.db        ← banco, criado sozinho (NÃO vai pro Git)
│   ├── scripts/
│   │   └── tornar-admin.js
│   └── src/
│       ├── server.js        ← ponto de partida do servidor
│       ├── db.js            ← conexão e tabelas do banco
│       ├── middlewares/
│       │   └── auth.js      ← "porteiros": está logado? é admin?
│       └── routes/
│           ├── auth.js      ← cadastro, login, "quem sou eu"
│           ├── noticias.js
│           ├── itens.js
│           └── eventos.js
│
└── mobile/
    ├── package.json
    ├── app.json
    ├── .env.local           ← IP do seu PC (NÃO vai pro Git)
    ├── .env.example
    └── src/
        ├── app/             ← CADA ARQUIVO AQUI É UMA TELA
        │   ├── _layout.js
        │   ├── (tabs)/
        │   │   ├── _layout.js
        │   │   ├── index.js     ← Notícias
        │   │   ├── loja.js
        │   │   ├── eventos.js
        │   │   └── perfil.js
        │   ├── noticia/
        │   │   ├── [id].js      ← detalhe de uma notícia
        │   │   └── nova.js
        │   ├── item/
        │   │   ├── [id].js
        │   │   └── novo.js
        │   ├── evento/
        │   │   └── novo.js
        │   ├── login.js
        │   └── cadastro.js
        ├── componentes/     ← pedaços de tela reutilizáveis
        │   ├── tema.js
        │   ├── Botao.js
        │   ├── Campo.js
        │   ├── CartaoNoticia.js
        │   └── CartaoItem.js
        └── servicos/        ← lógica que não é tela
            ├── api.js
            ├── AuthContext.js
            ├── formatar.js
            ├── confirmar.js
            └── navegacao.js
```

Não se assuste: vamos criar um arquivo de cada vez.

## Roteiro

| Parte | O que você faz | Resultado |
|---|---|---|
| 1 | Instala Node, Git, VS Code, Expo Go | Computador pronto |
| 2 | Estuda JS, SQL, React, HTTP | Entende o que vai digitar |
| 3 | Cria a estrutura do repositório | `.gitignore` e pastas |
| 4 | Constrói o servidor | API completa testada no VS Code |
| 5 | Constrói o app | App completo no celular |
| 6 | Roda tudo junto | Projeto funcionando de ponta a ponta |
| 7 | Divide as tarefas | Cada um sabe o que fazer |

---

# Parte 1 — Preparando o computador

Faça tudo isto **uma vez** em cada computador do time.

## 1.1 Node.js

1. Acesse <https://nodejs.org>.
2. Baixe a versão marcada como **LTS** (Long Term Support, a versão estável). Escolha o instalador para Windows (`.msi`).
3. Instale com as opções padrão (Next, Next...). Se aparecer uma caixa sobre "Tools for Native Modules" (Chocolatey), **pode deixar desmarcada**: este projeto não precisa.
4. **Feche e abra de novo** o VS Code e os terminais.
5. Confira:

```bash
node -v
npm -v
```

Os dois precisam mostrar um número de versão. O `node` deve ser **22.13 ou mais novo** (o banco SQLite embutido que usamos precisa disso). Com a LTS atual (24 ou mais nova) está tudo certo.

> **O que é o npm?** É o "Play Store das bibliotecas JavaScript". Vem junto com o Node. Com ele você instala bibliotecas (`npm install express`) e roda scripts (`npm run dev`).
>
> **E o npx?** Também vem junto. Ele roda uma ferramenta sem precisar instalar ela de vez no computador (ex.: `npx create-expo-app`).

## 1.2 Git

Siga a seção [2 do README](../README.md#2-instalar-e-configurar-uma-vez-só): instalar, configurar nome e e-mail e aceitar o convite do repositório.

## 1.3 Visual Studio Code

1. Baixe em <https://code.visualstudio.com> e instale. Durante a instalação, marque **"Adicionar ação 'Abrir com Code'"** e **"Adicionar ao PATH"**.
2. Instale estas extensões (ícone de quadradinhos na barra lateral, `Ctrl + Shift + X`):

| Extensão | Para quê |
|---|---|
| **REST Client** (autor: Huachao Mao) | Testar a API escrevendo pedidos num arquivo `.http` |
| **SQLite Viewer** (autor: Florian Klampfer) | Abrir o arquivo `comunitera.db` e ver as tabelas |
| **Prettier - Code formatter** | Arruma a formatação do código ao salvar |
| **Portuguese (Brazil) Language Pack** (opcional) | VS Code em português |

3. Ative "formatar ao salvar": `Ctrl + ,` → pesquise `format on save` → marque. Pesquise `default formatter` → escolha **Prettier**.
4. Desligue a IA (veja o aviso no começo deste guia): `Ctrl + ,` → `chat.disableAIFeatures` → marque.

## 1.4 Expo Go no celular

Instale o app **Expo Go** na Play Store (Android) ou App Store (iPhone). É ele que vai rodar o nosso app no celular enquanto desenvolvemos, sem precisar gerar instalador.

> O Expo Go da loja sempre roda a **versão mais nova do Expo**. Por isso, quando criarmos o projeto, vamos usar `@latest`. Se um dia aparecer "Project is incompatible with this version of Expo Go", veja a [Parte 8](#parte-8--problemas-comuns).

## 1.5 Terminal no Windows: um problema clássico

Abra o terminal do VS Code (`` Ctrl + ` ``) e digite `npx -v`. Se aparecer um erro vermelho parecido com este:

```
npx : O arquivo C:\Program Files\nodejs\npx.ps1 não pode ser carregado porque a execução de scripts foi desabilitada neste sistema.
```

O PowerShell está bloqueando scripts. Resolva **uma vez** rodando:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Responda `S` (ou `Y`) se perguntar. Feche e abra o terminal de novo.

## 1.6 Checkpoint

Num terminal novo, todos estes comandos devem responder sem erro:

```bash
node -v
npm -v
npx -v
git --version
```

E o Expo Go precisa estar instalado no celular.

---

# Parte 2 — Fundamentos (estude antes de programar)

Esta parte é teoria com prática curta. Reserve algumas horas. Tudo que aparece aqui vai ser usado no projeto, e quando você encontrar no código algo que não entende, volte aqui.

## 2.1 Como o app conversa com o servidor

### Pedido e resposta

Toda conversa entre app e servidor é um **pedido** (request) seguido de uma **resposta** (response), usando o protocolo **HTTP**. É o mesmo protocolo que o navegador usa para abrir sites.

```
APP  ──── pedido ────>  SERVIDOR
         GET /noticias

APP  <─── resposta ───  SERVIDOR
         200 OK
         [ { "id": 1, "titulo": "Semana Acadêmica" } ]
```

Um **pedido** tem:

| Parte | Exemplo | O que é |
|---|---|---|
| **Método** | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | O "verbo": o que você quer fazer |
| **Caminho (rota)** | `/noticias/5` | Em qual "coisa" |
| **Cabeçalhos (headers)** | `Content-Type: application/json` / `Authorization: Bearer abc...` | Informações extras (formato, quem é você) |
| **Corpo (body)** | `{ "titulo": "Oi" }` | Os dados enviados (só em POST, PUT, PATCH) |

Uma **resposta** tem um **código de status** (número) e, geralmente, um corpo.

### Os métodos (verbos)

| Método | Significado | Exemplo no Comunitera |
|---|---|---|
| `GET` | Buscar | `GET /noticias` lista as notícias |
| `POST` | Criar | `POST /itens` cria um anúncio |
| `PUT` | Substituir/editar tudo | `PUT /noticias/3` edita a notícia 3 |
| `PATCH` | Editar uma parte | `PATCH /itens/7/vendido` marca o item 7 como vendido |
| `DELETE` | Apagar | `DELETE /eventos/2` apaga o evento 2 |

### Os códigos de status mais importantes

| Código | Nome | Quando o nosso servidor usa |
|---|---|---|
| `200` | OK | Deu certo e tem resposta |
| `201` | Created | Algo foi criado (cadastro, notícia nova...) |
| `204` | No Content | Deu certo, mas não tem nada para devolver (ex.: apagou) |
| `400` | Bad Request | Você mandou dados errados (faltou campo, senha curta...) |
| `401` | Unauthorized | Você não está logado (ou o token venceu) |
| `403` | Forbidden | Você está logado, mas **não tem permissão** (ex.: aluno tentando postar notícia) |
| `404` | Not Found | Não existe (rota errada ou id que não existe) |
| `409` | Conflict | Conflito (ex.: e-mail já cadastrado) |
| `500` | Internal Server Error | O servidor quebrou (bug nosso) |

Regra fácil: **2xx = sucesso, 4xx = erro de quem pediu, 5xx = erro do servidor.**

### JSON

**JSON** é o formato de texto que app e servidor usam para trocar dados. É quase igual a um objeto JavaScript, só que as chaves sempre têm aspas duplas:

```json
{
  "id": 1,
  "titulo": "Camiseta do DA",
  "preco": 45.9,
  "vendido": false,
  "tags": ["roupa", "tera"]
}
```

### API REST

Uma **API** é o "cardápio" de rotas que o servidor oferece. Chamamos de **REST** quando ela é organizada por "coisas" (recursos) + verbos HTTP. Este é o cardápio completo do Comunitera, que vamos construir na Parte 4:

| Método | Rota | O que faz | Precisa estar logado? |
|---|---|---|---|
| GET | `/` | Teste: "API funcionando" | Não |
| POST | `/auth/cadastro` | Cria conta | Não |
| POST | `/auth/login` | Entra e recebe um token | Não |
| GET | `/auth/eu` | Diz quem é o dono do token | Sim |
| GET | `/noticias` | Lista notícias | Não |
| GET | `/noticias/:id` | Uma notícia | Não |
| POST | `/noticias` | Cria notícia | Sim, **admin** |
| PUT | `/noticias/:id` | Edita notícia | Sim, **admin** |
| DELETE | `/noticias/:id` | Apaga notícia | Sim, **admin** |
| GET | `/itens` | Lista itens à venda | Não |
| GET | `/itens/:id` | Um item | Não |
| POST | `/itens` | Anuncia item | Sim |
| PATCH | `/itens/:id/vendido` | Marca como vendido | Sim, dono ou admin |
| DELETE | `/itens/:id` | Apaga anúncio | Sim, dono ou admin |
| GET | `/eventos` | Próximos eventos | Não |
| POST | `/eventos` | Cria evento | Sim, **admin** |
| DELETE | `/eventos/:id` | Apaga evento | Sim, **admin** |

O `:id` significa "aqui vai um número", ex.: `/noticias/5`.

---

## 2.2 JavaScript essencial

Crie uma pasta **fora do repositório** para treinar, por exemplo `Desktop/estudos-js`. Abra no VS Code (`code .`). Para cada exemplo, crie o arquivo, digite o código e rode no terminal com:

```bash
node nome-do-arquivo.js
```

### Variáveis, tipos e funções — `01-basico.js`

```js
// 1. Variáveis
const nome = 'Comunitera';   // const: não muda
let curtidas = 0;             // let: pode mudar
curtidas = curtidas + 1;

// 2. Tipos
const texto = 'olá';          // string
const numero = 42;            // number (inteiro ou decimal: 4.5)
const verdadeiro = true;      // boolean
const nada = null;            // "vazio de propósito"
let indefinido;               // undefined: nunca recebeu valor

// 3. Template string (crase) — junta texto e variável
console.log(`O app ${nome} tem ${curtidas} curtida(s)`);

// 4. Funções
function somar(a, b) {
  return a + b;
}
const multiplicar = (a, b) => a * b;   // arrow function
const dobro = (n) => n * 2;            // uma linha: o return é automático
console.log(somar(2, 3), multiplicar(2, 3), dobro(5));
```

Saída esperada:

```
O app Comunitera tem 1 curtida(s)
5 6 10
```

- Use **`const` por padrão**. Use `let` só quando o valor precisa mudar. Nunca use `var` (é a forma antiga).
- `console.log(...)` imprime no terminal. É o seu melhor amigo para descobrir o que está acontecendo.
- **Arrow functions** (`=>`) são só um jeito mais curto de escrever funções. Vamos usar muito no React.

### Objetos e arrays — `02-objetos-arrays.js`

```js
// Objeto: um "registro" com propriedades
const aluno = { nome: 'Ana', curso: 'ADS', semestre: 3 };
console.log(aluno.nome);          // Ana
aluno.semestre = 4;               // pode alterar propriedade mesmo com const

// Array: uma lista
const itens = [
  { id: 1, titulo: 'Camiseta', preco: 45.9, vendido: false },
  { id: 2, titulo: 'Caneca', preco: 25, vendido: true },
  { id: 3, titulo: 'Livro de Cálculo', preco: 80, vendido: false },
];

console.log(itens.length);        // 3
console.log(itens[0].titulo);     // Camiseta (o índice começa em 0)

// map: transforma cada elemento -> novo array do mesmo tamanho
const titulos = itens.map((item) => item.titulo);
console.log(titulos);             // [ 'Camiseta', 'Caneca', 'Livro de Cálculo' ]

// filter: fica só com quem passa no teste
const aVenda = itens.filter((item) => !item.vendido);
console.log(aVenda.length);       // 2

// find: acha o primeiro que passa no teste (ou undefined)
const caneca = itens.find((item) => item.id === 2);
console.log(caneca.titulo);       // Caneca

// Desestruturação: tira propriedades de dentro do objeto
const { titulo, preco } = itens[0];
console.log(titulo, preco);       // Camiseta 45.9

// Spread (...): copia propriedades / elementos
const itemAtualizado = { ...itens[0], vendido: true };
console.log(itemAtualizado);      // { id: 1, titulo: 'Camiseta', preco: 45.9, vendido: true }

// Rest (...): "pega o resto"
const { id, ...semId } = itens[1];
console.log(semId);               // { titulo: 'Caneca', preco: 25, vendido: true }
```

Os comentários mostram o que cada linha imprime. **Desestruturação** e **spread/rest** parecem estranhos no começo, mas aparecem em quase todo arquivo do projeto. Releia até fazer sentido.

### Condições — `03-condicoes.js`

```js
const usuario = { nome: 'Bruno', papel: 'admin' };
const visitante = null;

// if / else
if (usuario.papel === 'admin') {
  console.log('Pode publicar notícias');
} else {
  console.log('Só pode ler');
}

// Ternário: condição ? seVerdadeiro : seFalso
const mensagem = usuario.papel === 'admin' ? 'Diretoria' : 'Aluno';
console.log(mensagem);                       // Diretoria

// || : "se o da esquerda for vazio/falso, usa o da direita"
const porta = process.env.PORTA_QUE_NAO_EXISTE || 3000;
console.log(porta);                          // 3000

// ?. (optional chaining): não quebra se for null/undefined
console.log(visitante?.nome);                // undefined (sem erro!)
// console.log(visitante.nome);              // isso daria ERRO: Cannot read properties of null

// === compara valor E tipo (use sempre ===, nunca ==)
console.log(1 === 1, '1' === 1);             // true false
```

O **ternário** é muito usado no React para mostrar uma coisa ou outra na tela.

### Código assíncrono: async/await — `04-async.js`

Buscar dados na internet ou no banco **demora**. O JavaScript não fica parado esperando: ele segue em frente e "volta" quando o resultado chega. Para escrever isso de forma legível usamos `async` e `await`.

```js
// Uma função que demora (simula buscar algo na internet)
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buscarNoticias() {
  console.log('Buscando...');
  await esperar(1000); // "espera aqui até terminar", sem travar o resto do programa
  return ['Semana Acadêmica', 'Festa de Halloween'];
}

async function principal() {
  try {
    const noticias = await buscarNoticias();
    console.log('Chegou:', noticias);
  } catch (erro) {
    console.log('Deu erro:', erro.message);
  } finally {
    console.log('Terminou (com ou sem erro)');
  }
}

principal();
console.log('Esta linha aparece ANTES do "Chegou", porque não esperou!');
```

Saída:

```
Buscando...
Esta linha aparece ANTES do "Chegou", porque não esperou!
Chegou: [ 'Semana Acadêmica', 'Festa de Halloween' ]
Terminou (com ou sem erro)
```

Regras de bolso:

- Uma função que **demora** devolve uma **Promise** (uma "promessa" de resultado).
- `await` só pode ser usado **dentro** de uma função `async`.
- `await` "abre" a promessa e te dá o valor de dentro.
- Coloque `await` dentro de `try { } catch (erro) { }` para tratar erros.
- `finally { }` roda sempre, deu certo ou não (ótimo para esconder o "carregando...").

### Erros com throw — `05-erro.js`

```js
async function dividir(a, b) {
  if (b === 0) {
    throw new Error('Não dá pra dividir por zero');
  }
  return a / b;
}

async function principal() {
  try {
    console.log(await dividir(10, 2));   // 5
    console.log(await dividir(10, 0));   // vai pular direto pro catch
    console.log('nunca chega aqui');
  } catch (erro) {
    console.log('Erro:', erro.message);  // Erro: Não dá pra dividir por zero
  }
}

principal();
```

`throw new Error('mensagem')` "lança" um erro, que é "pego" pelo `catch` mais próximo. Vamos usar isso no app: quando a API responde com erro, lançamos um `Error` com a mensagem do servidor e mostramos na tela.

### Módulos: import e export

Cada arquivo é um **módulo**. Para usar algo de outro arquivo, o arquivo de origem **exporta** e o outro **importa**. Crie uma pasta `modulos` com 3 arquivos:

`modulos/package.json` (avisa o Node que usamos `import/export`):

```json
{ "type": "module" }
```

`modulos/matematica.js`:

```js
export function somar(a, b) {
  return a + b;
}

export const PI = 3.14;

export default function dobro(n) {
  return n * 2;
}
```

`modulos/principal.js`:

```js
import dobro, { somar, PI } from './matematica.js';

console.log(somar(1, 2), PI, dobro(4));   // 3 3.14 8
```

Rode com `node principal.js` (dentro da pasta `modulos`).

- `export default` → cada arquivo pode ter **um**. Importa **sem chaves**, com o nome que você quiser.
- `export` normal (nomeado) → pode ter vários. Importa **com chaves** e com o **mesmo nome**.

### Buscar dados da internet: fetch — `06-fetch.js`

Precisa de internet. Dentro da pasta `modulos` (para poder usar `await` no topo do arquivo):

```js
const resposta = await fetch('https://viacep.com.br/ws/01001000/json/');
const dados = await resposta.json();

console.log(resposta.status);             // 200
console.log(dados.localidade, dados.uf);  // São Paulo SP
```

- `fetch(url)` faz um pedido HTTP (GET por padrão) e devolve uma Promise da resposta.
- `resposta.json()` lê o corpo e transforma o JSON em objeto (também demora, por isso outro `await`).
- `resposta.status` é o código (200, 404...). `resposta.ok` é `true` se for 2xx.

É exatamente assim que o app vai conversar com o nosso servidor.

### Exercícios de JavaScript

Faça num arquivo `07-exercicios.js`, usando o array `itens` do exemplo 2:

1. Crie uma função `formatarPreco(valor)` que recebe `45.9` e devolve `"R$ 45,90"`. (Dica: `valor.toFixed(2)` e `.replace('.', ',')`.)
2. Usando `map`, crie um array de textos como `"Camiseta - R$ 45,90"`.
3. Usando `filter` e depois `map`, mostre só os títulos dos itens com preço menor que 50.
4. Escreva uma função `async` que espera 2 segundos e depois imprime "pronto".

<details>
<summary>Ver resposta</summary>

```js
const itens = [
  { id: 1, titulo: 'Camiseta', preco: 45.9, vendido: false },
  { id: 2, titulo: 'Caneca', preco: 25, vendido: true },
  { id: 3, titulo: 'Livro de Cálculo', preco: 80, vendido: false },
];

// 1
function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}
console.log(formatarPreco(45.9)); // R$ 45,90

// 2
const textos = itens.map((item) => `${item.titulo} - ${formatarPreco(item.preco)}`);
console.log(textos);

// 3
const baratos = itens.filter((item) => item.preco < 50).map((item) => item.titulo);
console.log(baratos); // [ 'Camiseta', 'Caneca' ]

// 4
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function exercicio4() {
  await esperar(2000);
  console.log('pronto');
}
exercicio4();
```

</details>

---

## 2.3 SQL essencial

Um banco de dados **relacional** guarda dados em **tabelas**, como planilhas: cada **coluna** é um campo e cada **linha** é um registro.

Tabela `usuarios`:

| id | nome | email | papel |
|---|---|---|---|
| 1 | Felipe | felipe@tera.com | admin |
| 2 | Ana | ana@tera.com | aluno |

Tabela `noticias`:

| id | titulo | autor_id |
|---|---|---|
| 1 | Semana Acadêmica | 1 |
| 2 | Festa de Halloween | 1 |

O `autor_id` da notícia aponta para o `id` de um usuário. Isso é uma **chave estrangeira** (foreign key): é assim que as tabelas se "relacionam".

**SQL** é a linguagem para conversar com o banco. Os comandos que vamos usar:

```sql
-- Criar tabela
CREATE TABLE IF NOT EXISTS usuarios (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,  -- número único, gerado sozinho
  nome   TEXT NOT NULL,                      -- texto obrigatório
  email  TEXT NOT NULL UNIQUE,               -- não pode repetir
  papel  TEXT NOT NULL DEFAULT 'aluno'       -- se não informar, vira 'aluno'
);

-- Inserir
INSERT INTO usuarios (nome, email) VALUES ('Ana', 'ana@tera.com');

-- Buscar tudo
SELECT * FROM usuarios;

-- Buscar algumas colunas, com filtro e ordem
SELECT id, nome FROM usuarios WHERE papel = 'aluno' ORDER BY nome ASC;

-- Atualizar (SEMPRE com WHERE, senão altera TODAS as linhas!)
UPDATE usuarios SET papel = 'admin' WHERE email = 'ana@tera.com';

-- Apagar (SEMPRE com WHERE, senão apaga TUDO!)
DELETE FROM usuarios WHERE id = 2;

-- Juntar duas tabelas: notícias com o nome do autor
SELECT n.titulo, u.nome AS autor
FROM noticias n
JOIN usuarios u ON u.id = n.autor_id;
```

O último exemplo (JOIN) devolve:

| titulo | autor |
|---|---|
| Semana Acadêmica | Felipe |
| Festa de Halloween | Felipe |

### Por que usamos `?` no código (e nunca juntamos texto)

No servidor, os valores vêm do usuário. **Nunca** monte o SQL juntando texto:

```js
// ERRADO — perigo de SQL Injection!
db.prepare(`SELECT * FROM usuarios WHERE email = '${email}'`).get();
```

Se alguém digitar no campo de e-mail `' OR '1'='1`, o SQL vira `... WHERE email = '' OR '1'='1'`, que é verdadeiro para todo mundo. Isso se chama **SQL Injection** e é uma das falhas mais comuns da internet.

O jeito certo é usar `?` e passar os valores separados. O banco trata o valor como **dado**, nunca como comando:

```js
// CERTO
db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
```

---

## 2.4 React essencial

**React** é uma biblioteca para construir telas a partir de **componentes**: funções que devolvem "o que deve aparecer". **React Native** é o React para celular: em vez de `<div>` e `<p>` do HTML, usamos `<View>` e `<Text>`, que viram componentes nativos do Android/iOS.

Você só vai conseguir rodar estes exemplos na Parte 5. Por enquanto, **leia e entenda**.

### Componente e JSX

```jsx
import { Text, View } from 'react-native';

export default function Saudacao() {
  const nome = 'Ana';

  return (
    <View>
      <Text>Olá, {nome}!</Text>
      <Text>2 + 2 = {2 + 2}</Text>
    </View>
  );
}
```

- Um componente é uma **função** com nome em **Maiúscula** que devolve **JSX**.
- **JSX** é esse "HTML dentro do JavaScript". Entre `{ }` você coloca qualquer expressão JavaScript.
- O `return` precisa ter **um elemento só por fora** (aqui, a `View`). Se precisar de vários sem uma View, use `<> ... </>` (fragmento).
- No React Native, **todo texto precisa estar dentro de `<Text>`**. Texto solto dentro de `<View>` dá erro.

### Props: passando informação para um componente

```jsx
function CartaoAluno({ nome, curso }) {
  return (
    <View>
      <Text>{nome}</Text>
      <Text>{curso}</Text>
    </View>
  );
}

// Usando:
<CartaoAluno nome="Ana" curso="ADS" />
<CartaoAluno nome="Bruno" curso="Engenharia de Software" />
```

**Props** são os "parâmetros" do componente. Quem usa o componente passa os valores como se fossem atributos. Dentro, recebemos com desestruturação `{ nome, curso }`.

### Estado (useState): informação que muda

```jsx
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Contador() {
  const [curtidas, setCurtidas] = useState(0);

  return (
    <View>
      <Text>Curtidas: {curtidas}</Text>
      <Pressable onPress={() => setCurtidas(curtidas + 1)}>
        <Text>Curtir</Text>
      </Pressable>
    </View>
  );
}
```

- `useState(0)` cria uma "variável de estado" que começa em `0`. Devolve **duas coisas**: o valor atual (`curtidas`) e uma função para mudar (`setCurtidas`).
- **Nunca** altere direto (`curtidas = 5` não funciona). Sempre use o `set...`.
- Quando o estado muda, o React **desenha o componente de novo** com o valor novo. É assim que a tela se atualiza.
- `onPress` recebe uma **função** que roda quando o usuário toca.

### Mostrar ou esconder (renderização condicional)

```jsx
{ehAdmin ? <Botao titulo="Nova notícia" /> : null}
{erro ? <Text>{erro}</Text> : <Text>Tudo certo</Text>}
```

> No React Native, prefira sempre `condicao ? <Algo /> : null` em vez de `condicao && <Algo />`. Se `condicao` for `0` ou `''`, o `&&` tenta desenhar `0` fora de um `<Text>` e o app quebra.

### Listas

```jsx
const alunos = ['Ana', 'Bruno', 'Carla'];

<View>
  {alunos.map((aluno) => (
    <Text key={aluno}>{aluno}</Text>
  ))}
</View>
```

Para listas grandes vamos usar o componente `<FlatList>`, que é mais eficiente. Todo item de lista precisa de uma `key` única (geralmente o `id`).

### Efeitos (useEffect): fazer algo quando a tela aparece

```jsx
import { useEffect, useState } from 'react';

export default function ListaNoticias() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    async function carregar() {
      const resposta = await fetch('http://.../noticias');
      setNoticias(await resposta.json());
    }
    carregar();
  }, []); // [] = roda só uma vez, quando o componente aparece

  return <Text>{noticias.length} notícias</Text>;
}
```

`useEffect(funcao, [dependencias])` roda a função **depois** que o componente aparece na tela. O array no final diz **quando rodar de novo**: `[]` = só uma vez; `[id]` = toda vez que `id` mudar.

### Estilos

```jsx
import { StyleSheet, Text, View } from 'react-native';

<View style={styles.cartao}>
  <Text style={styles.titulo}>Oi</Text>
</View>

const styles = StyleSheet.create({
  cartao: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12 },
  titulo: { fontSize: 18, fontWeight: 'bold' },
});
```

- Parece CSS, mas com nomes em **camelCase** (`backgroundColor`, não `background-color`) e números **sem `px`**.
- O layout usa **Flexbox**. Diferente da web, a direção padrão é **coluna** (um embaixo do outro). Para lado a lado: `flexDirection: 'row'`.
- `flex: 1` = "ocupe todo o espaço disponível".
- Dá para juntar estilos com array: `style={[styles.botao, styles.vermelho]}`.

---

## 2.5 Login, senha e token: como funciona

### Senha: hash, não texto

Nunca guardamos a senha como o usuário digitou. Guardamos um **hash**: uma "impressão digital" da senha, gerada por uma função de mão única (a **bcrypt**).

```
senha "123456"  ──bcrypt──>  "$2b$10$N9qo8uLOickgx2ZMRZoMye..."   (vai pro banco)
```

- Não dá para voltar do hash para a senha.
- No login, a bcrypt calcula o hash da senha digitada e compara com o guardado.
- Se o banco vazar, as senhas não ficam expostas.

### Token JWT: a pulseira da festa

Depois do login, o servidor entrega um **token JWT**: um texto assinado com um segredo que só o servidor conhece (`JWT_SECRET`). Pense numa **pulseira de festa**:

1. Você mostra o documento na entrada (login com e-mail e senha).
2. Recebe uma pulseira (o token) que diz quem você é e se é VIP (`papel: admin`).
3. Daí em diante, só mostra a pulseira (manda o token em cada pedido). Ninguém pede documento de novo.
4. A pulseira é difícil de falsificar (assinatura) e tem validade (aqui, 7 dias).

O app manda o token em todo pedido, num cabeçalho:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

O servidor confere a assinatura e descobre quem é. Se o token não vier ou for inválido: **401**. Se vier certo, mas a pessoa não tiver permissão (aluno tentando criar notícia): **403**.

> O conteúdo de um JWT **não é secreto**: qualquer um consegue ler (cole um token em <https://jwt.io> e veja). Ele só não pode ser **alterado** sem o segredo. Por isso nunca coloque a senha dentro do token.

---

# Parte 3 — Preparando o repositório

Faça esta parte **uma pessoa só**, compartilhando a tela com o time. Depois que entrar na `main`, todo mundo faz `git pull`.

1. Abra a pasta `Comunitera` no VS Code e, no terminal, crie uma branch:

```bash
git switch main
git pull
git switch -c chore/estrutura-inicial
```

2. Na raiz do projeto (a pasta `Comunitera`, ao lado do `README.md`), crie o arquivo **`.gitignore`** (com o ponto na frente, sem extensão):

```gitignore
# Dependências (cada um instala com npm install)
node_modules/

# Segredos e configurações locais de cada pessoa
.env
.env*.local

# Banco de dados local (cada um tem o seu)
*.db
*.db-journal

# Lixo do sistema
.DS_Store
Thumbs.db
```

**Por que cada linha?**

- `node_modules/` tem milhares de arquivos de bibliotecas. Qualquer pessoa recria com `npm install` a partir do `package.json`. Nunca vai pro Git.
- `.env` guarda segredos (como a chave que assina os tokens). Segredo no GitHub deixa de ser segredo.
- `*.db` é o banco de dados. Cada pessoa tem o seu banco local para testar; se fosse pro Git, cada commit sobrescreveria os dados dos outros.

3. Faça o commit e abra o PR:

```bash
git add .
git commit -m "chore: adiciona .gitignore"
git push -u origin chore/estrutura-inicial
```

As pastas `backend/` e `mobile/` vão ser criadas nas próximas partes (o Git não guarda pasta vazia).

---

# Parte 4 — Backend (servidor)

Nesta parte vamos construir a API inteira e testá-la **sem o app**, direto do VS Code.

## 4.1 Criando o projeto Node

No terminal, na raiz do `Comunitera`:

```bash
mkdir backend
cd backend
npm init -y
```

O `npm init -y` cria o **`package.json`**, a "carteira de identidade" do projeto: nome, scripts e lista de bibliotecas.

Agora instale as bibliotecas:

```bash
npm install express cors bcryptjs jsonwebtoken
```

| Biblioteca | Para quê |
|---|---|
| `express` | Criar o servidor e as rotas |
| `cors` | Permitir que o app (principalmente a versão web) chame a API |
| `bcryptjs` | Gerar e conferir o hash das senhas |
| `jsonwebtoken` | Criar e validar os tokens de login |

Repare que apareceram:

- a pasta `node_modules/` → o código das bibliotecas (ignorada pelo Git);
- o arquivo `package-lock.json` → as versões **exatas** instaladas. **Este vai pro Git**, para todo mundo instalar as mesmas versões.

Abra o `package.json` e deixe assim (mude `name`, troque `main` e `scripts`, e **adicione** `"type": "module"`; se já existir uma linha `"type": "commonjs"`, troque por `"module"`). Pode apagar `description`, `keywords`, `author` e `license`. **Não mexa** no bloco `dependencies`: os números de versão podem ser diferentes dos daqui, e tudo bem.

```json
{
  "name": "comunitera-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "dev": "node --watch --env-file=.env src/server.js",
    "start": "node --env-file=.env src/server.js",
    "admin": "node --env-file=.env scripts/tornar-admin.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "express": "^5.3.0",
    "jsonwebtoken": "^9.0.3"
  }
}
```

**Entendendo:**

- `"type": "module"` → permite usar `import`/`export` (igual ao app), em vez do antigo `require`.
- `scripts` → atalhos. `npm run dev` executa o comando que está em `"dev"`.
- `--watch` → reinicia o servidor sozinho toda vez que você salva um arquivo.
- `--env-file=.env` → carrega as variáveis do arquivo `.env` (vamos criar no 4.3).

## 4.2 O primeiro servidor

Crie a pasta `src` e dentro dela o arquivo `server.js`:

```
backend/
└── src/
    └── server.js
```

```js
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Comunitera funcionando!' });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
```

Rode (de dentro da pasta `backend`):

```bash
node src/server.js
```

Deve aparecer `Servidor rodando em http://localhost:3000`. Abra esse endereço no navegador: você vai ver `{"mensagem":"API do Comunitera funcionando!"}`.

Parabéns: isso é uma API. Para parar o servidor: `Ctrl + C` no terminal.

> Se o Windows perguntar se quer **permitir o acesso do Node.js à rede**, marque **Redes privadas** e clique em **Permitir**. Isso vai ser necessário para o celular conseguir falar com o seu PC.

**Entendendo o código:**

- `import express from 'express'` → traz a biblioteca.
- `const app = express()` → cria a aplicação (o servidor).
- `app.get('/', (req, res) => { ... })` → "quando chegar um **GET** no caminho **`/`**, rode esta função". Uma combinação de método + caminho + função é uma **rota**.
  - `req` (request) → tudo sobre o pedido que chegou (corpo, parâmetros, cabeçalhos).
  - `res` (response) → o que usamos para responder.
  - `res.json({...})` → responde com um JSON (status 200 por padrão).
- `app.listen(3000, ...)` → começa a "escutar" pedidos na porta 3000. Porta é como o número do apartamento num prédio: o prédio é o seu PC.

## 4.3 Variáveis de ambiente (.env)

Configurações que mudam de computador para computador, ou que são **secretas**, ficam num arquivo `.env`, fora do código.

Crie `backend/.env`:

```env
PORT=3000
JWT_SECRET=troque-por-uma-frase-grande-e-secreta-123
```

Troque o `JWT_SECRET` por qualquer frase longa e aleatória. Ele é a "caneta" que assina os tokens.

Como o `.env` **não vai pro Git**, crie também um modelo para o time saber o que precisa ter. `backend/.env.example`:

```env
PORT=3000
JWT_SECRET=coloque-aqui-uma-frase-grande-e-secreta
```

Quem clonar o projeto copia o `.env.example`, renomeia para `.env` e preenche.

Agora rode com o script do `package.json`:

```bash
npm run dev
```

Daqui pra frente, deixe esse terminal aberto com o servidor rodando. Ao salvar qualquer arquivo, ele reinicia sozinho.

## 4.4 Testando a API com o REST Client

O navegador só faz `GET`. Para testar `POST`, `DELETE` etc., vamos usar a extensão **REST Client**. Crie o arquivo `backend/requests.http`:

```http
@url = http://localhost:3000

### Servidor está vivo?
GET {{url}}/
```

Vai aparecer um link **"Send Request"** em cima do `GET`. Clique: a resposta abre ao lado, com status, cabeçalhos e corpo.

- `@url = ...` cria uma variável; `{{url}}` usa ela.
- `###` separa um pedido do outro. Vamos adicionar pedidos neste arquivo ao longo da Parte 4.

**Checkpoint:** o "Send Request" responde `200 OK` com a mensagem. Faça commit:

```bash
git add .
git commit -m "feat: cria servidor express inicial"
```

> Antes do `git add .`, rode `git status` e confira que `node_modules/` e `.env` **não** aparecem na lista. Se aparecerem, o `.gitignore` da Parte 3 não está na raiz do projeto.

## 4.5 Banco de dados

Vamos usar o **SQLite** que já vem embutido no Node (`node:sqlite`). O banco inteiro fica num arquivo só, `comunitera.db`, criado automaticamente.

Crie `backend/src/db.js`:

```js
import { DatabaseSync } from 'node:sqlite';

// Abre (ou cria, se não existir) o arquivo do banco de dados
const db = new DatabaseSync('comunitera.db');

// Cria as tabelas na primeira vez que o servidor sobe
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    senha_hash  TEXT    NOT NULL,
    curso       TEXT,
    papel       TEXT    NOT NULL DEFAULT 'aluno',
    criado_em   TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS noticias (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo      TEXT    NOT NULL,
    conteudo    TEXT    NOT NULL,
    imagem_url  TEXT,
    autor_id    INTEGER NOT NULL REFERENCES usuarios(id),
    criado_em   TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS itens (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo       TEXT    NOT NULL,
    descricao    TEXT,
    preco        REAL    NOT NULL,
    imagem_url   TEXT,
    contato      TEXT    NOT NULL,
    vendido      INTEGER NOT NULL DEFAULT 0,
    vendedor_id  INTEGER NOT NULL REFERENCES usuarios(id),
    criado_em    TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS eventos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo      TEXT    NOT NULL,
    descricao   TEXT,
    local       TEXT    NOT NULL,
    data_hora   TEXT    NOT NULL,
    criado_por  INTEGER NOT NULL REFERENCES usuarios(id),
    criado_em   TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
```

**Entendendo o código:**

- `DatabaseSync` → abre o arquivo do banco. Se o arquivo não existir, ele cria. "Sync" quer dizer que os comandos são **síncronos** (não precisam de `await`), o que deixa o código mais simples.
- `db.exec(...)` → executa SQL puro. Aqui criamos as 4 tabelas. O `IF NOT EXISTS` faz com que, se a tabela já existir, nada aconteça. Assim podemos rodar isso toda vez que o servidor sobe.
- `REFERENCES usuarios(id)` → chave estrangeira: o banco não deixa criar uma notícia com um `autor_id` que não existe.
- `CURRENT_TIMESTAMP` → data e hora atual, em **UTC** (horário de Londres). O app converte para o horário do Brasil na hora de mostrar.
- `preco REAL` → número com casas decimais.
- `vendido INTEGER DEFAULT 0` → o SQLite não tem tipo verdadeiro/falso, então usamos `0` (não) e `1` (sim).
- `export default db` → outros arquivos importam e usam esta conexão.

**As 4 tabelas:**

```
usuarios                 noticias                 itens                    eventos
──────────               ──────────               ──────────               ──────────
id                       id                       id                       id
nome                     titulo                   titulo                   titulo
email (único)            conteudo                 descricao                descricao
senha_hash               imagem_url               preco                    local
curso                    autor_id ──> usuarios    imagem_url               data_hora
papel (aluno|admin)      criado_em                contato (WhatsApp)       criado_por ──> usuarios
criado_em                                         vendido (0|1)            criado_em
                                                  vendedor_id ──> usuarios
                                                  criado_em
```

### Como usar o banco no código (os 4 comandos que você vai repetir)

```js
// Prepara um SQL com ? no lugar dos valores
const comando = db.prepare('SELECT * FROM usuarios WHERE id = ?');

comando.get(1);    // devolve UMA linha (objeto) ou undefined
comando.all();     // devolve TODAS as linhas (array)  — usado em listas
comando.run(...);  // executa INSERT/UPDATE/DELETE e devolve { changes, lastInsertRowid }
```

- `changes` → quantas linhas foram afetadas (se for `0` num UPDATE/DELETE, o id não existia).
- `lastInsertRowid` → o `id` gerado no INSERT.

O banco só é criado quando algum arquivo importar o `db.js`. Isso vai acontecer na próxima seção.

> **Aviso normal:** quando o servidor sobe, pode aparecer `ExperimentalWarning: SQLite is an experimental feature...`. É só o Node avisando que o módulo SQLite ainda é recente. Pode ignorar.

## 4.6 Cadastro e login

Agora a parte mais importante do servidor. Crie a pasta `src/routes` e o arquivo `backend/src/routes/auth.js`:

```js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = Router();

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, papel: usuario.papel },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /auth/cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha, curso } = req.body || {};

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
  }

  const emailLimpo = email.trim().toLowerCase();

  const jaExiste = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(emailLimpo);
  if (jaExiste) {
    return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const resultado = db
    .prepare('INSERT INTO usuarios (nome, email, senha_hash, curso) VALUES (?, ?, ?, ?)')
    .run(nome.trim(), emailLimpo, senhaHash, curso || null);

  const usuario = {
    id: resultado.lastInsertRowid,
    nome: nome.trim(),
    email: emailLimpo,
    curso: curso || null,
    papel: 'aluno',
  };

  res.status(201).json({ usuario, token: gerarToken(usuario) });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha.' });
  }

  const usuario = db
    .prepare('SELECT * FROM usuarios WHERE email = ?')
    .get(email.trim().toLowerCase());

  // Mesma mensagem nos dois casos, para não revelar quais e-mails existem
  if (!usuario) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaConfere) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  }

  const { senha_hash, ...usuarioSemSenha } = usuario;
  res.json({ usuario: usuarioSemSenha, token: gerarToken(usuario) });
});

export default router;
```

**Entendendo o código:**

- `Router()` → um "mini app" só com rotas. Depois, no `server.js`, penduramos ele num prefixo: tudo aqui vai começar com `/auth`. Então `router.post('/login')` vira `POST /auth/login`.
- `async (req, res) => {...}` → a função é `async` porque `bcrypt.hash` e `bcrypt.compare` demoram (de propósito, para dificultar ataques) e usamos `await`.
- `const { nome, email, senha, curso } = req.body || {}` → pega os campos que o app mandou no corpo. O `|| {}` evita erro se o corpo vier vazio.
- **Validação:** antes de qualquer coisa, conferimos se os dados fazem sentido. Se não, `return res.status(400).json({ erro: '...' })`. O `return` é importante: ele **para** a função ali. Sem ele, o código continuaria e tentaria responder duas vezes (erro).
- `email.trim().toLowerCase()` → tira espaços e deixa minúsculo, para `Ana@Tera.com` e `ana@tera.com ` serem o mesmo e-mail.
- `bcrypt.hash(senha, 10)` → gera o hash. O `10` é o "custo" (quanto maior, mais lento e mais seguro).
- `gerarToken(usuario)` → cria o JWT com `id`, `nome` e `papel` dentro, assinado com o `JWT_SECRET`, válido por 7 dias.
- No login, a mensagem de erro é **a mesma** para "e-mail não existe" e "senha errada". Se fosse diferente, alguém poderia descobrir quais e-mails estão cadastrados.
- `const { senha_hash, ...usuarioSemSenha } = usuario` → desestruturação com rest: separa o `senha_hash` e fica com o resto. Assim **nunca** devolvemos o hash para o app.

Agora troque o conteúdo do `backend/src/server.js` por:

```js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());          // deixa o app (inclusive a versão web) chamar a API
app.use(express.json());  // transforma o corpo JSON das requisições em objeto (req.body)

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Comunitera funcionando!' });
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

O que mudou:

- `app.use(express.json())` → sem isso, o `req.body` fica `undefined`. Ele lê o corpo JSON do pedido e transforma em objeto.
- `app.use(cors())` → libera o acesso da versão web do app (o navegador bloqueia chamadas entre endereços diferentes se o servidor não autorizar).
- `app.use('/auth', authRoutes)` → pendura as rotas de `auth.js` no prefixo `/auth`.
- `process.env.PORT` → lê a porta do `.env`.

**Teste.** Adicione no final do `requests.http`:

```http
### Criar conta
POST {{url}}/auth/cadastro
Content-Type: application/json

{
  "nome": "Seu Nome",
  "email": "voce@tera.com",
  "senha": "123456",
  "curso": "ADS"
}

### Entrar
# @name login
POST {{url}}/auth/login
Content-Type: application/json

{
  "email": "voce@tera.com",
  "senha": "123456"
}

###
@token = {{login.response.body.$.token}}
```

> Atenção ao formato: tem que ter **uma linha em branco** entre os cabeçalhos (`Content-Type...`) e o JSON.

1. Clique em "Send Request" em **Criar conta** → `201 Created` com `usuario` e `token`.
2. Clique de novo → `409 Conflict` ("e-mail já cadastrado"). Ótimo, a validação funciona.
3. Mude a senha para `"12"` e envie → `400`.
4. Clique em **Entrar** → `200 OK` com o token. A linha `@token = ...` guarda o token dessa resposta automaticamente (`# @name login` dá um nome ao pedido para podermos ler a resposta dele).
5. Mude a senha do login para uma errada → `401`.

Abra o arquivo `backend/comunitera.db` no VS Code (a extensão SQLite Viewer abre ele) e veja a tabela `usuarios`: a senha aparece como um hash `$2b$10$...`, nunca como `123456`.

Copie o token e cole em <https://jwt.io> para ver o que tem dentro.

**Checkpoint:** commit `feat: cadastro e login de usuários`.

## 4.7 Middleware: o porteiro das rotas

Várias rotas só podem ser usadas por quem está logado, e algumas só por admins. Em vez de repetir a verificação em cada rota, criamos **middlewares**: funções que rodam **antes** da rota e decidem se o pedido pode passar.

```
pedido ──> [ autenticar ] ──> [ somenteAdmin ] ──> rota de verdade ──> resposta
               │                    │
               └─ 401 se não        └─ 403 se não
                  tiver token           for admin
```

Crie a pasta `src/middlewares` e o arquivo `backend/src/middlewares/auth.js`:

```js
import jwt from 'jsonwebtoken';

// Só deixa passar quem mandou um token válido
export function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization; // ex.: "Bearer eyJhbGciOi..."

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Você precisa estar logado.' });
  }

  const token = cabecalho.slice(7); // tira o "Bearer " do começo

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = dados; // { id, nome, papel } — as próximas funções podem usar
    next();
  } catch {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada. Entre de novo.' });
  }
}

// Só deixa passar quem é da diretoria do DA
// (sempre use DEPOIS do autenticar)
export function somenteAdmin(req, res, next) {
  if (req.usuario.papel !== 'admin') {
    return res.status(403).json({ erro: 'Apenas a diretoria do DA pode fazer isso.' });
  }
  next();
}
```

**Entendendo o código:**

- Um middleware recebe `(req, res, next)`. Chamar `next()` = "pode passar para o próximo". Responder com `res.status(...)` sem chamar `next()` = "barrado".
- `cabecalho.slice(7)` → corta os 7 primeiros caracteres (`"Bearer "`), sobrando só o token.
- `jwt.verify(token, segredo)` → confere a assinatura e a validade. Se o token foi alterado ou venceu, ele **lança um erro**, que cai no `catch` → 401.
- `req.usuario = dados` → guardamos quem é o usuário **dentro do pedido**. As funções seguintes (a rota) leem `req.usuario.id` para saber quem está fazendo a ação.
- `somenteAdmin` confia no `req.usuario` que o `autenticar` preencheu. Por isso a ordem importa: **sempre `autenticar` antes de `somenteAdmin`**.

Agora vamos usar o middleware na primeira rota protegida: `GET /auth/eu` ("quem sou eu?"). No `backend/src/routes/auth.js`:

1. Adicione este import junto com os outros, no topo:

```js
import { autenticar } from '../middlewares/auth.js';
```

2. Adicione esta rota **antes** do `export default router;`:

```js
// GET /auth/eu  -> devolve quem é o dono do token
router.get('/eu', autenticar, (req, res) => {
  const usuario = db
    .prepare('SELECT id, nome, email, curso, papel, criado_em FROM usuarios WHERE id = ?')
    .get(req.usuario.id);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }
  res.json(usuario);
});
```

Repare em `router.get('/eu', autenticar, (req, res) => ...)`: você pode colocar quantos middlewares quiser entre o caminho e a função final. Eles rodam em ordem.

**Teste** (adicione no `requests.http`):

```http
### Quem sou eu? (precisa ter clicado em "Entrar" antes)
GET {{url}}/auth/eu
Authorization: Bearer {{token}}

### Quem sou eu, com token falso (deve dar 401)
GET {{url}}/auth/eu
Authorization: Bearer token-inventado
```

**Checkpoint:** o primeiro responde `200` com seus dados; o segundo, `401`. Commit `feat: middleware de autenticação`.

## 4.8 Notícias (CRUD completo)

**CRUD** = Create, Read, Update, Delete (criar, ler, atualizar, apagar). As notícias têm as quatro operações.

Crie `backend/src/routes/noticias.js`:

```js
import { Router } from 'express';
import db from '../db.js';
import { autenticar, somenteAdmin } from '../middlewares/auth.js';

const router = Router();

// GET /noticias  -> lista todas (mais nova primeiro)
router.get('/', (req, res) => {
  const noticias = db.prepare(`
    SELECT n.id, n.titulo, n.conteudo, n.imagem_url, n.criado_em, u.nome AS autor
    FROM noticias n
    JOIN usuarios u ON u.id = n.autor_id
    ORDER BY n.criado_em DESC, n.id DESC
  `).all();

  res.json(noticias);
});

// GET /noticias/:id  -> uma notícia
router.get('/:id', (req, res) => {
  const noticia = db.prepare(`
    SELECT n.id, n.titulo, n.conteudo, n.imagem_url, n.criado_em, u.nome AS autor
    FROM noticias n
    JOIN usuarios u ON u.id = n.autor_id
    WHERE n.id = ?
  `).get(req.params.id);

  if (!noticia) {
    return res.status(404).json({ erro: 'Notícia não encontrada.' });
  }
  res.json(noticia);
});

// POST /noticias  -> cria (só diretoria)
router.post('/', autenticar, somenteAdmin, (req, res) => {
  const { titulo, conteudo, imagem_url } = req.body || {};

  if (!titulo || !conteudo) {
    return res.status(400).json({ erro: 'Título e conteúdo são obrigatórios.' });
  }

  const resultado = db
    .prepare('INSERT INTO noticias (titulo, conteudo, imagem_url, autor_id) VALUES (?, ?, ?, ?)')
    .run(titulo.trim(), conteudo.trim(), imagem_url || null, req.usuario.id);

  const criada = db.prepare('SELECT * FROM noticias WHERE id = ?').get(resultado.lastInsertRowid);
  res.status(201).json(criada);
});

// PUT /noticias/:id  -> edita (só diretoria)
router.put('/:id', autenticar, somenteAdmin, (req, res) => {
  const { titulo, conteudo, imagem_url } = req.body || {};

  if (!titulo || !conteudo) {
    return res.status(400).json({ erro: 'Título e conteúdo são obrigatórios.' });
  }

  const resultado = db
    .prepare('UPDATE noticias SET titulo = ?, conteudo = ?, imagem_url = ? WHERE id = ?')
    .run(titulo.trim(), conteudo.trim(), imagem_url || null, req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Notícia não encontrada.' });
  }

  const atualizada = db.prepare('SELECT * FROM noticias WHERE id = ?').get(req.params.id);
  res.json(atualizada);
});

// DELETE /noticias/:id  -> apaga (só diretoria)
router.delete('/:id', autenticar, somenteAdmin, (req, res) => {
  const resultado = db.prepare('DELETE FROM noticias WHERE id = ?').run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Notícia não encontrada.' });
  }
  res.status(204).end();
});

export default router;
```

**Entendendo o código:**

- `req.params.id` → o valor do `:id` da URL. Em `GET /noticias/5`, `req.params.id` é `"5"`.
- `JOIN usuarios u ON u.id = n.autor_id` + `u.nome AS autor` → em vez de devolver só o número do autor, já devolvemos o **nome**. O app não precisa fazer outro pedido.
- `ORDER BY n.criado_em DESC, n.id DESC` → mais novas primeiro (`DESC` = decrescente). O `id` desempata notícias criadas no mesmo segundo.
- `router.post('/', autenticar, somenteAdmin, ...)` → dois porteiros antes de criar.
- `req.usuario.id` → o autor é **quem está logado**, lido do token. Nunca confie num `autor_id` mandado pelo app: qualquer um poderia mandar o id de outra pessoa.
- `resultado.changes === 0` no UPDATE/DELETE → nenhuma linha foi afetada, ou seja, o id não existe → 404.
- `res.status(204).end()` → "deu certo e não tenho nada para mandar".

No `server.js`, adicione o import **no topo**, junto com os outros imports, e o `app.use` **logo abaixo** do `app.use('/auth', authRoutes)`:

```js
import noticiasRoutes from './routes/noticias.js';
// ...
app.use('/noticias', noticiasRoutes);
```

### Virando admin

Só admin cria notícia, mas todo cadastro nasce como `aluno`. Vamos criar um script para promover alguém. Crie a pasta `backend/scripts` e o arquivo `backend/scripts/tornar-admin.js`:

```js
// Uso: npm run admin -- email@exemplo.com
import db from '../src/db.js';

const email = process.argv[2];

if (!email) {
  console.log('Informe o e-mail. Exemplo: npm run admin -- fulano@email.com');
  process.exit(1);
}

const resultado = db
  .prepare("UPDATE usuarios SET papel = 'admin' WHERE email = ?")
  .run(email.trim().toLowerCase());

if (resultado.changes === 0) {
  console.log('Nenhum usuário com esse e-mail. Cadastre-se no app primeiro.');
} else {
  console.log(`Pronto! ${email} agora é admin. Saia e entre de novo no app.`);
}
```

- `process.argv` → a lista de palavras digitadas no terminal. `process.argv[2]` é a primeira palavra depois do nome do arquivo.
- `process.exit(1)` → encerra o programa (1 = terminou com erro).

Use assim (com o seu e-mail cadastrado):

```bash
npm run admin -- voce@tera.com
```

O `--` serve para o npm repassar o e-mail para o script.

> O papel fica **dentro do token**. Depois de virar admin, faça login de novo (clique em "Entrar" no `requests.http`) para pegar um token novo com `papel: admin`.
>
> Cada pessoa do time tem o próprio banco, então **cada um** roda esse comando no seu computador.

**Teste** (adicione no `requests.http`):

```http
### Criar notícia (precisa ser admin)
POST {{url}}/noticias
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "titulo": "Semana Acadêmica 2026",
  "conteudo": "As inscrições estão abertas! Garanta sua vaga.",
  "imagem_url": null
}

### Listar notícias
GET {{url}}/noticias

### Uma notícia
GET {{url}}/noticias/1

### Editar notícia
PUT {{url}}/noticias/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "titulo": "Semana Acadêmica 2026 (atualizado)",
  "conteudo": "Inscrições até sexta-feira!"
}

### Apagar notícia
DELETE {{url}}/noticias/1
Authorization: Bearer {{token}}
```

Teste também: criar notícia **antes** de virar admin (deve dar `403`) e buscar `/noticias/999` (deve dar `404`).

**Checkpoint:** commit `feat: rotas de notícias`.

## 4.9 Itens da loja

Na loja, **qualquer aluno logado** anuncia, mas só **o dono do anúncio** (ou um admin) pode marcar como vendido ou apagar.

Crie `backend/src/routes/itens.js`:

```js
import { Router } from 'express';
import db from '../db.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();

const SELECT_ITEM = `
  SELECT i.*, u.nome AS vendedor
  FROM itens i
  JOIN usuarios u ON u.id = i.vendedor_id
`;

// Dono do anúncio ou diretoria podem mexer no item
function podeAlterar(item, usuario) {
  return item.vendedor_id === usuario.id || usuario.papel === 'admin';
}

// GET /itens  -> itens à venda
router.get('/', (req, res) => {
  const itens = db
    .prepare(`${SELECT_ITEM} WHERE i.vendido = 0 ORDER BY i.criado_em DESC, i.id DESC`)
    .all();
  res.json(itens);
});

// GET /itens/:id
router.get('/:id', (req, res) => {
  const item = db.prepare(`${SELECT_ITEM} WHERE i.id = ?`).get(req.params.id);
  if (!item) {
    return res.status(404).json({ erro: 'Item não encontrado.' });
  }
  res.json(item);
});

// POST /itens  -> qualquer aluno logado pode anunciar
router.post('/', autenticar, (req, res) => {
  const { titulo, descricao, preco, contato, imagem_url } = req.body || {};

  if (!titulo || preco === undefined || !contato) {
    return res.status(400).json({ erro: 'Título, preço e contato são obrigatórios.' });
  }

  const precoNumero = Number(preco);
  if (Number.isNaN(precoNumero) || precoNumero < 0) {
    return res.status(400).json({ erro: 'Preço inválido.' });
  }

  const resultado = db
    .prepare(`
      INSERT INTO itens (titulo, descricao, preco, contato, imagem_url, vendedor_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(titulo.trim(), descricao || null, precoNumero, contato.trim(), imagem_url || null, req.usuario.id);

  const criado = db.prepare(`${SELECT_ITEM} WHERE i.id = ?`).get(resultado.lastInsertRowid);
  res.status(201).json(criado);
});

// PATCH /itens/:id/vendido  -> marca como vendido
router.patch('/:id/vendido', autenticar, (req, res) => {
  const item = db.prepare('SELECT * FROM itens WHERE id = ?').get(req.params.id);

  if (!item) {
    return res.status(404).json({ erro: 'Item não encontrado.' });
  }
  if (!podeAlterar(item, req.usuario)) {
    return res.status(403).json({ erro: 'Só quem anunciou pode marcar como vendido.' });
  }

  db.prepare('UPDATE itens SET vendido = 1 WHERE id = ?').run(req.params.id);
  res.json({ ...item, vendido: 1 });
});

// DELETE /itens/:id
router.delete('/:id', autenticar, (req, res) => {
  const item = db.prepare('SELECT * FROM itens WHERE id = ?').get(req.params.id);

  if (!item) {
    return res.status(404).json({ erro: 'Item não encontrado.' });
  }
  if (!podeAlterar(item, req.usuario)) {
    return res.status(403).json({ erro: 'Só quem anunciou pode apagar.' });
  }

  db.prepare('DELETE FROM itens WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
```

**Entendendo o código:**

- `SELECT_ITEM` → um pedaço de SQL repetido em várias rotas, guardado numa constante. `${SELECT_ITEM} WHERE ...` monta o SQL completo. (Isso **não** é SQL Injection, porque `SELECT_ITEM` é um texto fixo escrito por nós, e não algo que veio do usuário. Os valores do usuário continuam indo pelo `?`.)
- `i.*` → todas as colunas da tabela de itens.
- `podeAlterar(item, usuario)` → uma função comum, reaproveitada pelo PATCH e pelo DELETE.
- `Number(preco)` → converte para número. `Number('abc')` dá `NaN` ("Not a Number"), e `Number.isNaN` detecta isso.
- `preco === undefined` em vez de `!preco` → porque um item de preço `0` (doação) é válido, e `!0` é `true`.
- `{ ...item, vendido: 1 }` → spread: copia o item e troca só o `vendido`.

No `server.js`:

```js
import itensRoutes from './routes/itens.js';
// ...
app.use('/itens', itensRoutes);
```

**Teste** (adicione no `requests.http`):

```http
### Anunciar item
POST {{url}}/itens
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "titulo": "Camiseta do DA Tera",
  "descricao": "Tamanho M, nunca usada",
  "preco": 45.9,
  "contato": "54999998888"
}

### Listar itens à venda
GET {{url}}/itens

### Marcar como vendido
PATCH {{url}}/itens/1/vendido
Authorization: Bearer {{token}}

### Apagar item
DELETE {{url}}/itens/1
Authorization: Bearer {{token}}
```

Para testar a regra do "só o dono": crie uma segunda conta, faça login com ela e tente apagar o item da primeira. Deve dar `403`.

**Checkpoint:** commit `feat: rotas da loja`.

## 4.10 Eventos — desafio

Agora é com você. Usando `noticias.js` como modelo, crie `backend/src/routes/eventos.js` com:

| Rota | Regra |
|---|---|
| `GET /eventos` | Lista só eventos **de hoje em diante**, do mais próximo para o mais distante. Pública. |
| `POST /eventos` | Só admin. Campos obrigatórios: `titulo`, `local`, `data_hora`. `descricao` é opcional. |
| `DELETE /eventos/:id` | Só admin. 404 se não existir. |

Dicas:

- O `data_hora` vai ser um texto no formato `"2026-10-30 19:00"` (ano-mês-dia hora:minuto). Nesse formato, comparar textos funciona como comparar datas: `'2026-10-30 19:00' > '2026-10-12'` é verdadeiro.
- No SQLite, `date('now', 'localtime')` devolve a data de hoje (`'2026-10-12'`) no fuso do computador.
- Valide o formato da data com esta expressão regular (regex): `/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(data_hora)`. Ela devolve `true` se o texto tiver exatamente o formato `AAAA-MM-DD HH:MM`.
- Não esqueça de registrar a rota no `server.js`.

<details>
<summary>Ver resposta</summary>

```js
import { Router } from 'express';
import db from '../db.js';
import { autenticar, somenteAdmin } from '../middlewares/auth.js';

const router = Router();

// GET /eventos  -> de hoje em diante, do mais próximo para o mais distante
router.get('/', (req, res) => {
  const eventos = db.prepare(`
    SELECT * FROM eventos
    WHERE data_hora >= date('now', 'localtime')
    ORDER BY data_hora ASC
  `).all();
  res.json(eventos);
});

// POST /eventos  -> só diretoria
router.post('/', autenticar, somenteAdmin, (req, res) => {
  const { titulo, descricao, local, data_hora } = req.body || {};

  if (!titulo || !local || !data_hora) {
    return res.status(400).json({ erro: 'Título, local e data/hora são obrigatórios.' });
  }

  // Formato esperado: "2026-10-30 19:00"
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(data_hora)) {
    return res.status(400).json({ erro: 'Use o formato AAAA-MM-DD HH:MM para a data.' });
  }

  const resultado = db
    .prepare('INSERT INTO eventos (titulo, descricao, local, data_hora, criado_por) VALUES (?, ?, ?, ?, ?)')
    .run(titulo.trim(), descricao || null, local.trim(), data_hora, req.usuario.id);

  const criado = db.prepare('SELECT * FROM eventos WHERE id = ?').get(resultado.lastInsertRowid);
  res.status(201).json(criado);
});

// DELETE /eventos/:id  -> só diretoria
router.delete('/:id', autenticar, somenteAdmin, (req, res) => {
  const resultado = db.prepare('DELETE FROM eventos WHERE id = ?').run(req.params.id);
  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Evento não encontrado.' });
  }
  res.status(204).end();
});

export default router;
```

E no `server.js`:

```js
import eventosRoutes from './routes/eventos.js';
// ...
app.use('/eventos', eventosRoutes);
```

</details>

**Teste:**

```http
### Criar evento
POST {{url}}/eventos
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "titulo": "Festa de Halloween do Tera",
  "local": "Sala do DA",
  "data_hora": "2026-10-30 19:00",
  "descricao": "Concurso de fantasias!"
}

### Evento com data no formato errado (deve dar 400)
POST {{url}}/eventos
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "titulo": "Teste",
  "local": "Sala 1",
  "data_hora": "30/10/2026"
}

### Listar eventos
GET {{url}}/eventos
```

Crie também um evento com data no passado e confira que ele **não** aparece na lista.

**Checkpoint:** commit `feat: rotas de eventos`.

## 4.11 Tratando rotas inexistentes e erros

Últimos retoques no `server.js`. Esta é a versão final completa:

```js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import noticiasRoutes from './routes/noticias.js';
import itensRoutes from './routes/itens.js';
import eventosRoutes from './routes/eventos.js';

const app = express();

app.use(cors());          // deixa o app (inclusive a versão web) chamar a API
app.use(express.json());  // transforma o corpo JSON das requisições em objeto (req.body)

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Comunitera funcionando!' });
});

app.use('/auth', authRoutes);
app.use('/noticias', noticiasRoutes);
app.use('/itens', itensRoutes);
app.use('/eventos', eventosRoutes);

// Se nenhuma rota respondeu: 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Se alguma rota deu erro: cai aqui
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ erro: status === 500 ? 'Erro interno no servidor.' : 'Requisição inválida.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

**O que foi adicionado no final:**

- **404:** um `app.use` **sem caminho**, colocado **depois** de todas as rotas, só é alcançado se nenhuma rota respondeu. Então respondemos "Rota não encontrada" em JSON (em vez da página HTML padrão do Express).
- **Tratador de erros:** um middleware com **4 parâmetros** `(err, req, res, next)` é especial no Express: ele recebe qualquer erro que aconteceu nas rotas (inclusive dentro de funções `async`). Mostramos o erro no terminal (`console.error`) e respondemos `500` sem expor detalhes internos. Se o erro já tiver um status (ex.: o app mandou um JSON quebrado → 400), respeitamos.

Teste: `GET {{url}}/rota-que-nao-existe` → `404` com `{"erro":"Rota não encontrada."}`.

## 4.12 Checkpoint final do backend

A estrutura deve estar assim:

```
backend/
├── .env
├── .env.example
├── comunitera.db
├── package.json
├── package-lock.json
├── requests.http
├── scripts/
│   └── tornar-admin.js
└── src/
    ├── db.js
    ├── server.js
    ├── middlewares/
    │   └── auth.js
    └── routes/
        ├── auth.js
        ├── eventos.js
        ├── itens.js
        └── noticias.js
```

Confira, pelo `requests.http`, todas as rotas da [tabela da seção 2.1](#api-rest). Se tudo responde como esperado, **o servidor está pronto**. Abra o PR!

**Perguntas para ver se você entendeu** (responda para um colega, sem olhar):

1. Qual a diferença entre 401 e 403?
2. Por que o `autor_id` da notícia vem de `req.usuario.id` e não do corpo do pedido?
3. O que aconteceria se esquecêssemos o `return` antes de `res.status(400).json(...)`?
4. Por que o `.env` não vai para o GitHub?
5. O que o `JOIN` faz na listagem de notícias?

---

# Parte 5 — App mobile

Agora vamos construir o app que roda no celular e conversa com o servidor da Parte 4.

> Daqui em diante você vai trabalhar com **dois terminais** no VS Code: um com o servidor (`cd backend` → `npm run dev`) e outro para o app (`cd mobile`). Para abrir um segundo terminal, clique no `+` no painel do terminal.

## 5.1 Criando o projeto Expo

No terminal, **na raiz do `Comunitera`** (não dentro de `backend`!):

```bash
npx create-expo-app@latest mobile --template blank
```

Ele vai fazer duas perguntas:

1. `Need to install the following packages: create-expo-app... Ok to proceed?` → digite `y` e Enter.
2. `You are creating a project inside of an existing Git repository. Skip initializing a new git repository?` → aperte **Enter** (a resposta padrão é **Sim**). O projeto já está dentro do nosso repositório; não queremos um Git dentro do outro.

No final vai aparecer algo como `22 vulnerabilities (7 moderate, 15 high)`. **Ignore.** E **nunca** rode `npm audit fix --force` neste projeto: ele troca versões de bibliotecas e quebra o Expo.

O comando criou a pasta `mobile/` com:

| Arquivo | O que é |
|---|---|
| `App.js` | A tela inicial (vamos apagar logo, ao instalar o Expo Router) |
| `index.js` | O ponto de partida (também vamos apagar) |
| `app.json` | Configurações do app: nome, ícone, cores |
| `package.json` | Igual ao do backend: bibliotecas e scripts |
| `assets/` | Ícone e imagem de abertura |
| `.gitignore` | Um `.gitignore` próprio do Expo (pode manter) |
| `AGENTS.md` e `.claude/` | Instruções para assistentes de IA. **Pode apagar** os dois, não fazem parte do app. |

Rode o app:

```bash
cd mobile
npx expo start
```

Vai aparecer um **QR Code** no terminal.

- **Android:** abra o **Expo Go** → "Scan QR code".
- **iPhone:** abra a **Câmera** normal e aponte para o QR Code.

O celular e o PC precisam estar **no mesmo Wi-Fi**. Em alguns segundos aparece "Open up App.js to start working on your app!". Abra o `App.js` no VS Code, mude esse texto e salve: o celular atualiza sozinho. Isso se chama **Fast Refresh**.

Teclas úteis no terminal do Expo:

| Tecla | Faz |
|---|---|
| `r` | Recarrega o app |
| `w` | Abre no navegador do PC (depois do 5.2) |
| `Ctrl + C` | Para o Expo |

> Não conectou? A rede da faculdade costuma bloquear a conversa entre aparelhos. Veja a [Parte 8](#parte-8--problemas-comuns) (solução mais fácil: rotear a internet do celular para o PC, ou usar a tecla `w`).

**Checkpoint:** o texto alterado aparece no celular. Commit `feat: cria projeto expo`.

## 5.2 Instalando o Expo Router e as bibliotecas

Pare o Expo (`Ctrl + C`) e, dentro de `mobile`, instale tudo de uma vez:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar react-native-web react-dom @expo/vector-icons @react-native-async-storage/async-storage
```

> **No app, use sempre `npx expo install` em vez de `npm install`.** Ele escolhe a versão de cada biblioteca que é compatível com a sua versão do Expo. No backend continuamos usando `npm install`.

| Biblioteca | Para quê |
|---|---|
| `expo-router` | Navegação: cada arquivo vira uma tela |
| `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants` | Peças que o Expo Router precisa para funcionar |
| `expo-status-bar` | Controlar a barra de status (relógio, bateria) |
| `react-native-web`, `react-dom` | Permitir rodar o app no navegador (tecla `w`) |
| `@expo/vector-icons` | Ícones (usaremos nas abas) |
| `@react-native-async-storage/async-storage` | Guardar dados no celular (o token de login) |

Agora 4 ajustes:

**1.** No `mobile/package.json`, troque a linha do `main`:

```json
"main": "expo-router/entry",
```

Isso diz: "o ponto de partida agora é o Expo Router".

**2.** No `mobile/app.json`, mude `name` e `slug` e adicione `scheme`. Os `plugins` podem ter sido adicionados sozinhos pelo comando anterior. Deve ficar parecido com isto:

```json
{
  "expo": {
    "name": "Comunitera",
    "slug": "comunitera",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-status-bar"
    ],
    "scheme": "comunitera"
  }
}
```

**3.** **Apague** os arquivos `App.js` e `index.js`.

**4.** Crie a pasta `src/app` dentro de `mobile` e, nela, dois arquivos.

`mobile/src/app/_layout.js`:

```js
import { Stack } from 'expo-router';

export default function LayoutRaiz() {
  return <Stack />;
}
```

`mobile/src/app/index.js`:

```js
import { StyleSheet, Text, View } from 'react-native';

export default function Inicio() {
  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Comunitera</Text>
      <Text>O app do DA Tera está vivo!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
```

Rode limpando o cache (sempre faça isso depois de mexer em `package.json` ou `app.json`):

```bash
npx expo start --clear
```

**Entendendo o Expo Router:**

- Todo arquivo dentro de `src/app/` **vira uma tela**, e o caminho do arquivo vira o "endereço" da tela:
  - `src/app/index.js` → `/` (a tela inicial)
  - `src/app/login.js` → `/login`
  - `src/app/noticia/[id].js` → `/noticia/5`, `/noticia/12`... (os colchetes indicam uma parte variável)
- Arquivos `_layout.js` **não são telas**: eles definem **como** as telas daquela pasta são mostradas. O `<Stack />` empilha as telas: abrir uma tela nova coloca ela por cima, e "voltar" tira de cima.
- Por isso, **componentes e funções auxiliares nunca ficam dentro de `src/app/`**, senão viram telas. Eles vão em `src/componentes/` e `src/servicos/`.

**Checkpoint:** o celular mostra "Comunitera / O app do DA Tera está vivo!". Aperte `w` no terminal: o app abre também no navegador. Commit `feat: instala expo router`.

## 5.3 Aquecimento: estado e toque

Antes de construir as telas de verdade, um exercício para "sentir" o React. Substitua o `src/app/index.js` por:

```js
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Inicio() {
  const [curtidas, setCurtidas] = useState(0);

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Comunitera</Text>
      <Text style={styles.texto}>Curtidas: {curtidas}</Text>

      <Pressable style={styles.botao} onPress={() => setCurtidas(curtidas + 1)}>
        <Text style={styles.textoBotao}>Curtir</Text>
      </Pressable>

      {curtidas >= 5 ? <Text style={styles.texto}>Uau, que popular!</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
  },
  titulo: { fontSize: 32, fontWeight: 'bold', color: '#5B21B6' },
  texto: { fontSize: 18, marginTop: 12 },
  botao: {
    marginTop: 16,
    backgroundColor: '#5B21B6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  textoBotao: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
```

Toque em "Curtir" algumas vezes. Ao chegar em 5, aparece "Uau, que popular!".

**Entendendo:**

- `useState(0)` → a tela "lembra" quantas curtidas tem. Cada `setCurtidas(...)` redesenha a tela.
- `<Pressable onPress={...}>` → qualquer coisa tocável. Dentro dele, o texto do botão.
- `{curtidas >= 5 ? <Text>...</Text> : null}` → renderização condicional.
- `StyleSheet.create({...})` → os estilos ficam no fim do arquivo, com nomes.
- `justifyContent: 'center'` centraliza na vertical (o eixo principal, que é a coluna); `alignItems: 'center'` centraliza na horizontal.

**Brinque:** mude cores, tamanhos, adicione um botão "Descurtir" que não deixa ficar negativo. Não precisa commitar esse exercício.

## 5.4 Navegação com abas

Agora a estrutura real do app: 4 abas embaixo (Notícias, Loja, Eventos, Perfil).

**1. Cores do app.** Crie a pasta `mobile/src/componentes` e o arquivo `tema.js`:

```js
export const cores = {
  primaria: '#5B21B6',
  primariaClara: '#EDE9FE',
  fundo: '#F4F4F5',
  cartao: '#FFFFFF',
  texto: '#18181B',
  textoSuave: '#71717A',
  borda: '#E4E4E7',
  perigo: '#DC2626',
  sucesso: '#16A34A',
};
```

Ter todas as cores num lugar só permite mudar a cara do app inteiro trocando um arquivo.

**2. Apague** o `src/app/index.js` do exercício.

**3.** Crie a pasta `src/app/(tabs)` (sim, com os parênteses no nome) e dentro dela o `_layout.js`:

```js
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { cores } from '../../componentes/tema';

export default function LayoutAbas() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: cores.primaria,
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notícias',
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="loja"
        options={{
          title: 'Loja',
          tabBarIcon: ({ color, size }) => <Ionicons name="pricetag-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="eventos"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
```

**4.** Ainda em `src/app/(tabs)`, crie as 4 telas, por enquanto só com um texto. Esta é a `loja.js`:

```js
import { StyleSheet, Text, View } from 'react-native';

export default function TelaLoja() {
  return (
    <View style={styles.tela}>
      <Text>Loja (em construção)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
```

Faça as outras 3 iguais, mudando o nome da função e o texto:

| Arquivo | Nome da função | Texto |
|---|---|---|
| `(tabs)/index.js` | `TelaNoticias` | Notícias (em construção) |
| `(tabs)/loja.js` | `TelaLoja` | Loja (em construção) |
| `(tabs)/eventos.js` | `TelaEventos` | Eventos (em construção) |
| `(tabs)/perfil.js` | `TelaPerfil` | Perfil (em construção) |

**5.** Troque o `src/app/_layout.js` (o de fora, da raiz) por:

```js
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cores } from '../componentes/tema';

export default function LayoutRaiz() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: '#FFFFFF',
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
```

**Entendendo:**

- Agora temos **navegadores um dentro do outro**: o `Stack` (raiz) contém o grupo `(tabs)`, que é um navegador de abas. Mais pra frente, telas como "detalhe da notícia" vão ficar no `Stack`, **por cima** das abas (com botão de voltar).
- Pasta com **parênteses** é um **grupo**: serve para organizar, mas **não aparece no endereço**. `src/app/(tabs)/loja.js` é a tela `/loja`, e `(tabs)/index.js` é `/`.
- `<Tabs.Screen name="loja" .../>` → configura a aba do arquivo `loja.js`. `name` tem que ser igual ao nome do arquivo (sem `.js`).
- `tabBarIcon: ({ color, size }) => <Ionicons .../>` → uma função que desenha o ícone. As abas passam a cor certa (roxa se ativa, cinza se não). Os nomes dos ícones estão em <https://icons.expo.fyi> (filtre por Ionicons).
- `<Stack.Screen name="(tabs)" options={{ headerShown: false }} />` → esconde o cabeçalho do Stack nas abas, porque as abas já têm o próprio cabeçalho (senão apareceriam dois).
- `screenOptions` → opções que valem para **todas** as telas daquele navegador (cor do cabeçalho etc.).
- `<>...</>` → fragmento: agrupa a `StatusBar` e o `Stack` sem criar uma `View`.

**Checkpoint:** 4 abas com ícones, trocando de tela ao tocar. Commit `feat: navegação com abas`.

## 5.5 Componentes reutilizáveis

Vamos usar botões e campos de texto em quase toda tela. Em vez de repetir os estilos em todo lugar, criamos **nossos próprios componentes**.

`mobile/src/componentes/Botao.js`:

```js
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { cores } from './tema';

// variante: 'primario' (padrão), 'secundario' ou 'perigo'
export default function Botao({ titulo, onPress, variante = 'primario', carregando = false }) {
  const corDoTexto = variante === 'secundario' ? cores.primaria : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      disabled={carregando}
      style={({ pressed }) => [styles.botao, styles[variante], pressed && styles.pressionado]}
    >
      {carregando ? (
        <ActivityIndicator color={corDoTexto} />
      ) : (
        <Text style={[styles.texto, { color: corDoTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 6,
  },
  primario: { backgroundColor: cores.primaria },
  secundario: { backgroundColor: cores.primariaClara },
  perigo: { backgroundColor: cores.perigo },
  pressionado: { opacity: 0.75 },
  texto: { fontSize: 16, fontWeight: 'bold' },
});
```

**Entendendo:**

- `{ titulo, onPress, variante = 'primario', carregando = false }` → props com **valor padrão**. Se quem usar não passar `variante`, ela vale `'primario'`.
- `styles[variante]` → acessa o estilo pelo nome guardado na variável. Se `variante` for `'perigo'`, é o mesmo que `styles.perigo`.
- `style={({ pressed }) => [...]}` → o `Pressable` aceita uma **função** no `style`, que recebe se o botão está sendo pressionado. Assim o botão fica levemente transparente durante o toque.
- `disabled={carregando}` + `ActivityIndicator` → enquanto envia algo para o servidor, o botão mostra uma rodinha e não aceita toques (evita enviar duas vezes).

`mobile/src/componentes/Campo.js`:

```js
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { cores } from './tema';

// Um TextInput com um rótulo em cima.
// "...props" pega todas as outras props (value, onChangeText, placeholder...) e repassa pro TextInput.
export default function Campo({ rotulo, ...props }) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.input, props.multiline && styles.multilinha]}
        placeholderTextColor={cores.textoSuave}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginBottom: 6 },
  input: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: cores.texto,
  },
  multilinha: { minHeight: 120, textAlignVertical: 'top' },
});
```

**Entendendo:**

- `{ rotulo, ...props }` → **rest**: separa o `rotulo` e junta todo o resto num objeto `props`.
- `<TextInput {...props} />` → **spread**: repassa todas essas props para o `TextInput`. Assim, quem usa o `Campo` pode passar `value`, `onChangeText`, `placeholder`, `secureTextEntry`... sem precisarmos listar uma por uma.
- `props.multiline && styles.multilinha` → se for campo de várias linhas, fica mais alto.

**Experimente** no `(tabs)/perfil.js` (depois volte ao original):

```js
import { View } from 'react-native';
import Botao from '../../componentes/Botao';
import Campo from '../../componentes/Campo';

export default function TelaPerfil() {
  return (
    <View style={{ padding: 16 }}>
      <Campo rotulo="Teste" placeholder="Digite algo" />
      <Botao titulo="Botão de teste" onPress={() => console.log('apertou!')} />
      <Botao titulo="Perigo" variante="perigo" />
      <Botao titulo="Carregando" carregando />
    </View>
  );
}
```

O `console.log` do app aparece **no terminal onde o Expo está rodando**. Use isso para investigar problemas.

> Repare nos caminhos do `import`: `'../../componentes/Botao'`. Cada `../` sobe uma pasta. De `src/app/(tabs)/perfil.js`, subir duas vezes chega em `src/`, e daí entra em `componentes/`.

**Checkpoint:** commit `feat: componentes Botao e Campo`.

## 5.6 Conectando o app ao servidor

### O problema do "localhost"

No PC, `localhost` significa "este computador". **No celular, `localhost` é o próprio celular**, onde não tem servidor nenhum. Por isso o app precisa do **IP do seu PC na rede Wi-Fi**.

Descubra o IP: abra um terminal e rode:

```bash
ipconfig
```

Procure o bloco **"Adaptador de Rede sem Fio Wi-Fi"** (ou "Wireless LAN adapter Wi-Fi") e a linha **"Endereço IPv4"**. Algo como `192.168.0.15`.

**Teste a rede antes de programar:** com o servidor rodando (`npm run dev` no backend), abra o **navegador do celular** e acesse `http://192.168.0.15:3000` (com o seu IP). Se aparecer `{"mensagem":"API do Comunitera funcionando!"}`, a rede está ok. Se não abrir, resolva isso antes de seguir ([Parte 8](#parte-8--problemas-comuns): firewall e Wi-Fi da faculdade).

### Guardando o endereço da API

Cada pessoa tem um IP diferente, então o endereço fica num arquivo que **não vai pro Git**. Crie `mobile/.env.local`:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.15:3000
```

(com o **seu** IP). E um modelo para o time, `mobile/.env.example`:

```env
# Copie este arquivo para .env.local e coloque o IP do seu PC (veja com ipconfig)
EXPO_PUBLIC_API_URL=http://192.168.0.XX:3000
```

- Variáveis que começam com `EXPO_PUBLIC_` ficam disponíveis no código do app como `process.env.EXPO_PUBLIC_...`.
- O `.gitignore` do Expo já ignora arquivos `.env*.local`.
- **Toda vez que mudar o `.env.local`, pare o Expo e rode `npx expo start --clear`.** O valor é lido só na inicialização.
- O seu IP pode mudar quando você troca de rede (casa, faculdade). Se o app parar de conectar, confira o IP de novo.

### O arquivo que conversa com a API

Crie a pasta `mobile/src/servicos` e o arquivo `api.js`:

```js
// Endereço da API. Cada pessoa coloca o IP do próprio PC no arquivo .env.local
// Se não tiver nada lá, usa localhost (só funciona no navegador do próprio PC).
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

let token = null;

export function definirToken(novoToken) {
  token = novoToken;
}

export async function api(caminho, opcoes = {}) {
  const { metodo = 'GET', corpo } = opcoes;

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Não consegui falar com o servidor. Ele está rodando? O IP no .env.local está certo?');
  }

  // 204 = deu certo, mas não tem corpo (ex.: DELETE)
  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json();

  if (!resposta.ok) {
    const erro = new Error(dados.erro || 'Algo deu errado.');
    erro.status = resposta.status;
    throw erro;
  }

  return dados;
}
```

**Entendendo o código:**

Esta função `api()` é a **única porta** entre o app e o servidor. Todas as telas vão usar ela. Exemplos de uso:

```js
const noticias = await api('/noticias');                                   // GET
await api('/itens', { metodo: 'POST', corpo: { titulo: 'Livro', ... } }); // POST
await api('/itens/3', { metodo: 'DELETE' });                              // DELETE
```

Passo a passo do que ela faz:

1. Monta os cabeçalhos. Se tiver um token guardado (depois do login), adiciona `Authorization: Bearer ...`.
2. Chama o `fetch`. Se o `fetch` falhar (servidor desligado, IP errado, sem rede), lança um erro com uma mensagem clara em português.
3. Se a resposta for `204` (sem conteúdo), devolve `null`.
4. Lê o JSON da resposta.
5. Se o status não for de sucesso (`resposta.ok` é falso), **lança um erro** com a mensagem que o **servidor** mandou (`dados.erro`, ex.: "E-mail ou senha incorretos."). Também guarda o `status` no erro, para quem chamou saber se foi 401, 404...
6. Se deu tudo certo, devolve os dados.

O `token` fica numa variável do próprio arquivo (fora da função). A função `definirToken` muda ela. Assim, depois do login, todo pedido passa a ir com o token automaticamente.

### Testando a conexão

Troque temporariamente o `src/app/(tabs)/index.js` por:

```js
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { api } from '../../servicos/api';

export default function TelaNoticias() {
  const [mensagem, setMensagem] = useState('Conectando...');

  useEffect(() => {
    async function testar() {
      try {
        const noticias = await api('/noticias');
        setMensagem(`Conectado! A API tem ${noticias.length} notícia(s).`);
      } catch (e) {
        setMensagem(e.message);
      }
    }
    testar();
  }, []);

  return (
    <View style={styles.tela}>
      <Text>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
});
```

**Checkpoint:** a aba Notícias mostra "Conectado! A API tem N notícia(s).". Se aparecer "Não consegui falar com o servidor...", confira: servidor rodando? IP certo no `.env.local`? Reiniciou o Expo com `--clear`? Celular no mesmo Wi-Fi? Commit `feat: conexão com a API`.

## 5.7 Login e sessão

### O problema: várias telas precisam saber quem está logado

A aba Perfil mostra o nome. A aba Notícias mostra o botão "Nova notícia" só para admin. A Loja precisa saber se tem alguém logado para deixar anunciar. Passar o usuário de tela em tela por props seria um inferno.

A solução do React é o **Context**: um "quadro de avisos" global. Um componente lá no topo (o **Provider**) guarda a informação, e **qualquer** tela lá embaixo lê direto, com um hook.

```
<AuthProvider>            ← guarda: usuario, entrar(), sair()...
  <Stack>
    <Tabs>
      <TelaNoticias />    ← useAuth() → { ehAdmin }
      <TelaPerfil />      ← useAuth() → { usuario, sair }
    </Tabs>
    <TelaLogin />         ← useAuth() → { entrar }
  </Stack>
</AuthProvider>
```

Crie `mobile/src/servicos/AuthContext.js`:

```js
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, definirToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Roda uma vez quando o app abre: se tem token salvo, descobre quem é o usuário
  useEffect(() => {
    async function restaurarSessao() {
      try {
        const tokenSalvo = await AsyncStorage.getItem('token');
        if (tokenSalvo) {
          definirToken(tokenSalvo);
          const eu = await api('/auth/eu');
          setUsuario(eu);
        }
      } catch (erro) {
        // 401 = token vencido ou inválido: joga fora.
        // Outros erros (ex.: servidor desligado): mantém o token para a próxima vez.
        if (erro.status === 401) {
          await AsyncStorage.removeItem('token');
          definirToken(null);
        }
      } finally {
        setCarregando(false);
      }
    }
    restaurarSessao();
  }, []);

  async function guardarSessao(resposta) {
    await AsyncStorage.setItem('token', resposta.token);
    definirToken(resposta.token);
    setUsuario(resposta.usuario);
  }

  async function entrar(email, senha) {
    const resposta = await api('/auth/login', { metodo: 'POST', corpo: { email, senha } });
    await guardarSessao(resposta);
  }

  async function cadastrar(dados) {
    const resposta = await api('/auth/cadastro', { metodo: 'POST', corpo: dados });
    await guardarSessao(resposta);
  }

  async function sair() {
    await AsyncStorage.removeItem('token');
    definirToken(null);
    setUsuario(null);
  }

  const ehAdmin = usuario?.papel === 'admin';

  // Enquanto verifica o token, mostra só uma rodinha girando
  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ usuario, ehAdmin, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

**Entendendo o código:**

- `createContext(null)` → cria o "quadro de avisos".
- `AuthProvider({ children })` → um componente que envolve outros. `children` é tudo que estiver dentro dele no JSX.
- `<AuthContext.Provider value={{...}}>` → publica no quadro: o usuário, se é admin e as funções.
- `useAuth()` → um **hook personalizado** (todo hook começa com `use`). Qualquer tela chama `const { usuario } = useAuth()` e pronto.
- **AsyncStorage** → um armazenamento simples de texto no celular, que **não se apaga ao fechar o app**. Guardamos o token ali.
- O `useEffect` com `[]` roda **uma vez** quando o app abre: se tiver token salvo, pergunta ao servidor `/auth/eu` "de quem é este token?". Assim o usuário continua logado ao reabrir o app.
- Se o servidor responder **401** (token vencido), apagamos o token. Se for outro erro (servidor desligado), mantemos, para tentar de novo na próxima vez.
- `usuario?.papel === 'admin'` → se `usuario` for `null`, o `?.` evita erro e o resultado é `false`.
- Enquanto `carregando` é `true`, mostramos só uma rodinha. Isso evita a tela "piscar" mostrando "você não está logado" por meio segundo.

Crie também `mobile/src/servicos/navegacao.js`, uma ajudinha para "voltar":

```js
import { router } from 'expo-router';

// Volta para a tela anterior. Se não existir (ex.: abriu a página direto no navegador), vai para o início.
export function voltar() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}
```

- `router` (do Expo Router) é quem navega: `router.push('/login')` abre uma tela por cima, `router.back()` volta, `router.replace('/')` troca a tela atual por outra.
- No navegador, se a pessoa recarregar a página numa tela interna, não existe "tela anterior". O `canGoBack()` evita o erro nesse caso.

Agora **envolva o app com o `AuthProvider`** e registre as telas de login e cadastro. Troque o `src/app/_layout.js` por:

```js
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../servicos/AuthContext';
import { cores } from '../componentes/tema';

export default function LayoutRaiz() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: '#FFFFFF',
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Entrar' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
      </Stack>
    </AuthProvider>
  );
}
```

Crie `mobile/src/app/login.js`:

```js
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../servicos/AuthContext';
import { voltar } from '../servicos/navegacao';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import { cores } from '../componentes/tema';

export default function TelaLogin() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function fazerLogin() {
    setErro('');
    setEnviando(true);
    try {
      await entrar(email, senha);
      voltar();
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.tela} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Bem-vindo de volta!</Text>

      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Campo rotulo="Senha" value={senha} onChangeText={setSenha} placeholder="Sua senha" secureTextEntry />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Botao titulo="Entrar" onPress={fazerLogin} carregando={enviando} />
      <Botao titulo="Ainda não tenho conta" variante="secundario" onPress={() => router.replace('/cadastro')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { padding: 24 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto, marginBottom: 24 },
  erro: { color: cores.perigo, marginBottom: 12 },
});
```

**Entendendo:**

- Cada campo do formulário tem um `useState`. `value={email}` + `onChangeText={setEmail}` é o padrão de **campo controlado**: o que aparece no campo é sempre o valor do estado, e cada letra digitada atualiza o estado.
- `keyboardType="email-address"` mostra o teclado com `@`. `autoCapitalize="none"` impede a primeira letra maiúscula automática. `secureTextEntry` esconde a senha.
- `fazerLogin` chama o `entrar` do contexto. Se der erro (senha errada), o `catch` mostra a mensagem do servidor na tela.
- `router.replace('/cadastro')` → troca login por cadastro (sem empilhar: voltar não cai no login de novo).
- `keyboardShouldPersistTaps="handled"` → no `ScrollView`, permite tocar no botão mesmo com o teclado aberto.

Crie `mobile/src/app/cadastro.js`:

```js
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../servicos/AuthContext';
import { voltar } from '../servicos/navegacao';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import { cores } from '../componentes/tema';

export default function TelaCadastro() {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function criarConta() {
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      await cadastrar({ nome, email, curso, senha });
      voltar();
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.tela} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Crie sua conta</Text>

      <Campo rotulo="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Campo rotulo="Curso" value={curso} onChangeText={setCurso} placeholder="Ex.: Análise e Desenvolvimento de Sistemas" />
      <Campo rotulo="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Botao titulo="Criar conta" onPress={criarConta} carregando={enviando} />
      <Botao titulo="Já tenho conta" variante="secundario" onPress={() => router.replace('/login')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { padding: 24 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto, marginBottom: 24 },
  erro: { color: cores.perigo, marginBottom: 12 },
});
```

É o mesmo padrão do login, com mais campos e uma validação antes de enviar (a senha). Validar no app dá resposta rápida ao usuário; validar no servidor garante a segurança. **Sempre valide nos dois.**

Por fim, a tela de perfil de verdade. Troque `mobile/src/app/(tabs)/perfil.js` por:

```js
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../servicos/AuthContext';
import Botao from '../../componentes/Botao';
import { cores } from '../../componentes/tema';

export default function TelaPerfil() {
  const { usuario, ehAdmin, sair } = useAuth();

  if (!usuario) {
    return (
      <View style={styles.tela}>
        <Text style={styles.nome}>Você não está logado</Text>
        <Text style={styles.texto}>Entre para anunciar na loja e participar da comunidade.</Text>
        <Botao titulo="Entrar" onPress={() => router.push('/login')} />
        <Botao titulo="Criar conta" variante="secundario" onPress={() => router.push('/cadastro')} />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <View style={styles.avatar}>
        <Text style={styles.inicial}>{usuario.nome[0].toUpperCase()}</Text>
      </View>

      <Text style={styles.nome}>{usuario.nome}</Text>
      <Text style={styles.texto}>{usuario.email}</Text>
      {usuario.curso ? <Text style={styles.texto}>{usuario.curso}</Text> : null}
      {ehAdmin ? <Text style={styles.selo}>Diretoria do DA</Text> : null}

      <View style={styles.espaco} />
      <Botao titulo="Sair" variante="perigo" onPress={sair} />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 24 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  inicial: { color: '#FFFFFF', fontSize: 40, fontWeight: 'bold' },
  nome: { fontSize: 22, fontWeight: 'bold', color: cores.texto, textAlign: 'center' },
  texto: { fontSize: 16, color: cores.textoSuave, textAlign: 'center', marginTop: 4, marginBottom: 8 },
  selo: {
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: cores.primariaClara,
    color: cores.primaria,
    fontWeight: 'bold',
  },
  espaco: { height: 24 },
});
```

- Dois `return` diferentes: um para quem não está logado e outro para quem está. Isso é bem comum.
- `usuario.nome[0].toUpperCase()` → primeira letra do nome, maiúscula, para o "avatar".

**Teste:**

1. Aba Perfil → **Criar conta** → preencha → você volta ao perfil com seu nome.
2. Feche o app no celular completamente e abra de novo pelo Expo Go: continua logado.
3. **Sair** → volta para "Você não está logado". **Entrar** com senha errada → aparece a mensagem do servidor.
4. No terminal do backend: `npm run admin -- seu@email.com`. No app: Sair e Entrar de novo → aparece o selo **"Diretoria do DA"**.

**Checkpoint:** commit `feat: login, cadastro e perfil`.

## 5.8 Notícias

### Funções de formatação

Datas e preços vêm do servidor num formato "de computador". Vamos criar funções para deixar bonito. `mobile/src/servicos/formatar.js`:

```js
// "2026-10-12 02:05:51" (o SQLite guarda em UTC) -> "11/10/2026"
export function formatarData(textoDoBanco) {
  const data = new Date(textoDoBanco.replace(' ', 'T') + 'Z');
  return data.toLocaleDateString('pt-BR');
}

// 45.5 -> "R$ 45,50"
export function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// "2026-10-30 19:00" -> { dia: '30', mes: 'OUT', hora: '19:00', completa: '30/10/2026 às 19:00' }
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export function partesDaDataEvento(dataHora) {
  const [data, hora] = dataHora.split(' ');
  const [ano, mes, dia] = data.split('-');
  return {
    dia,
    mes: MESES[Number(mes) - 1],
    hora,
    completa: `${dia}/${mes}/${ano} às ${hora}`,
  };
}
```

- `formatarData`: o SQLite devolve `"2026-10-12 02:05:51"` em UTC. Trocamos o espaço por `T` e adicionamos `Z` (de "Zulu", que significa UTC) para o JavaScript entender como horário UTC. O `toLocaleDateString('pt-BR')` converte para o fuso do celular e escreve em formato brasileiro.
- `formatarPreco`: `toFixed(2)` deixa sempre 2 casas (`45.9` → `"45.90"`) e trocamos ponto por vírgula.
- `partesDaDataEvento`: quebra `"2026-10-30 19:00"` em pedaços com `split` e desestruturação de array. Vamos usar na aba Eventos.

### Perguntar "tem certeza?"

`mobile/src/servicos/confirmar.js`:

```js
import { Alert, Platform } from 'react-native';

// Pergunta "tem certeza?" e devolve true ou false.
// No celular usa o Alert nativo; no navegador usa o confirm() do próprio navegador.
export function confirmar(titulo, mensagem) {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }

  return new Promise((resolve) => {
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Confirmar', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
```

- No celular, `Alert.alert` mostra a caixinha nativa com botões. No navegador, o `Alert` não funciona, então usamos o `window.confirm` do próprio navegador.
- `Platform.OS` diz onde o app está rodando: `'android'`, `'ios'` ou `'web'`.
- `new Promise((resolve) => ...)` → cria uma promessa que só termina quando alguém chama `resolve(valor)`. Aqui, isso acontece quando o usuário toca num botão. Assim quem chama pode simplesmente fazer `const certeza = await confirmar(...)`.

### O cartão de notícia

`mobile/src/componentes/CartaoNoticia.js`:

```js
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { cores } from './tema';
import { formatarData } from '../servicos/formatar';

export default function CartaoNoticia({ noticia }) {
  return (
    <Pressable style={styles.cartao} onPress={() => router.push(`/noticia/${noticia.id}`)}>
      {noticia.imagem_url ? (
        <Image source={{ uri: noticia.imagem_url }} style={styles.imagem} />
      ) : null}

      <View style={styles.corpo}>
        <Text style={styles.titulo}>{noticia.titulo}</Text>
        <Text style={styles.resumo} numberOfLines={2}>
          {noticia.conteudo}
        </Text>
        <Text style={styles.rodape}>
          {noticia.autor} · {formatarData(noticia.criado_em)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: cores.borda,
  },
  imagem: { width: '100%', height: 160 },
  corpo: { padding: 14 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
  resumo: { fontSize: 15, color: cores.textoSuave, marginTop: 4 },
  rodape: { fontSize: 13, color: cores.textoSuave, marginTop: 8 },
});
```

- O cartão inteiro é um `Pressable`: tocar em qualquer lugar abre o detalhe.
- `` router.push(`/noticia/${noticia.id}`) `` → vai para `/noticia/5`, por exemplo. O Expo Router acha o arquivo `noticia/[id].js`.
- `<Image source={{ uri: ... }} />` → imagem da internet. **Toda imagem de URL precisa de largura e altura** no estilo, senão não aparece.
- `numberOfLines={2}` → corta o texto em 2 linhas com "...".
- `overflow: 'hidden'` → faz a imagem respeitar as bordas arredondadas do cartão.

### A lista de notícias

Troque o `mobile/src/app/(tabs)/index.js` (o teste de conexão) pela versão final:

```js
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { api } from '../../servicos/api';
import { useAuth } from '../../servicos/AuthContext';
import CartaoNoticia from '../../componentes/CartaoNoticia';
import Botao from '../../componentes/Botao';
import { cores } from '../../componentes/tema';

export default function TelaNoticias() {
  const { ehAdmin } = useAuth();
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      setErro('');
      const dados = await api('/noticias');
      setNoticias(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  async function puxarParaAtualizar() {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }

  // Roda toda vez que a tela aparece (inclusive quando você volta de "Nova notícia")
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      {ehAdmin ? <Botao titulo="+ Nova notícia" onPress={() => router.push('/noticia/nova')} /> : null}
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <FlatList
        data={noticias}
        keyExtractor={(noticia) => String(noticia.id)}
        renderItem={({ item }) => <CartaoNoticia noticia={item} />}
        refreshing={atualizando}
        onRefresh={puxarParaAtualizar}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma notícia por enquanto.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 16 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  erro: { color: cores.perigo, marginBottom: 12 },
  vazio: { textAlign: 'center', color: cores.textoSuave, marginTop: 40 },
});
```

**Entendendo:**

- **3 estados de tela** que você vai ver em toda lista: `carregando` (mostra a rodinha), `erro` (mostra a mensagem) e os dados (`noticias`).
- `useFocusEffect(useCallback(() => {...}, []))` → como o `useEffect`, mas roda **toda vez que a tela volta a ficar visível**. Exemplo: você cria uma notícia e volta para a lista; ela recarrega sozinha e a notícia nova aparece. (O `useCallback` é exigido por esse hook; pense nele como "a mesma função, guardada".)
- `<FlatList>` → lista otimizada (só desenha o que aparece na tela):
  - `data` → o array.
  - `keyExtractor` → a `key` de cada item (precisa ser texto, por isso o `String(...)`).
  - `renderItem={({ item }) => ...}` → como desenhar cada um. O FlatList sempre chama de `item`, mesmo que seja uma notícia.
  - `refreshing` + `onRefresh` → **puxar para atualizar** (arraste a lista para baixo).
  - `ListEmptyComponent` → o que mostrar se a lista estiver vazia.
- `{ehAdmin ? <Botao .../> : null}` → o botão de criar só aparece para a diretoria. (Lembre que isso é só visual: a segurança de verdade é o `somenteAdmin` no servidor.)

### Detalhe da notícia

Crie a pasta `src/app/noticia` e o arquivo `mobile/src/app/noticia/[id].js` (sim, o nome do arquivo é `[id].js`, com colchetes):

```js
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../servicos/api';
import { useAuth } from '../../servicos/AuthContext';
import { formatarData } from '../../servicos/formatar';
import { confirmar } from '../../servicos/confirmar';
import { voltar } from '../../servicos/navegacao';
import Botao from '../../componentes/Botao';
import { cores } from '../../componentes/tema';

export default function TelaNoticia() {
  const { id } = useLocalSearchParams(); // o [id] do nome do arquivo
  const { ehAdmin } = useAuth();
  const [noticia, setNoticia] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        setNoticia(await api(`/noticias/${id}`));
      } catch (e) {
        setErro(e.message);
      }
    }
    carregar();
  }, [id]);

  async function excluir() {
    const certeza = await confirmar('Excluir notícia', 'Tem certeza? Isso não pode ser desfeito.');
    if (!certeza) return;

    try {
      await api(`/noticias/${id}`, { metodo: 'DELETE' });
      voltar();
    } catch (e) {
      setErro(e.message);
    }
  }

  if (erro) {
    return <Text style={styles.erro}>{erro}</Text>;
  }

  if (!noticia) {
    return <ActivityIndicator style={styles.carregando} size="large" color={cores.primaria} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.tela}>
      {noticia.imagem_url ? <Image source={{ uri: noticia.imagem_url }} style={styles.imagem} /> : null}

      <Text style={styles.titulo}>{noticia.titulo}</Text>
      <Text style={styles.meta}>
        Por {noticia.autor} em {formatarData(noticia.criado_em)}
      </Text>
      <Text style={styles.texto}>{noticia.conteudo}</Text>

      {ehAdmin ? <Botao titulo="Excluir notícia" variante="perigo" onPress={excluir} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { padding: 16 },
  carregando: { marginTop: 40 },
  erro: { color: cores.perigo, padding: 16 },
  imagem: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto },
  meta: { fontSize: 14, color: cores.textoSuave, marginTop: 6, marginBottom: 16 },
  texto: { fontSize: 17, lineHeight: 26, color: cores.texto, marginBottom: 24 },
});
```

- `useLocalSearchParams()` → lê as partes variáveis do endereço. Em `/noticia/5`, devolve `{ id: '5' }`.
- `useEffect(..., [id])` → busca a notícia quando a tela abre (e de novo se o `id` mudar).
- `ScrollView` → tela com rolagem (a notícia pode ser longa). Para **listas** use `FlatList`; para **uma tela comprida**, `ScrollView`.
- `excluir` → pergunta, chama `DELETE`, e volta para a lista (que recarrega sozinha por causa do `useFocusEffect`).

### Nova notícia

`mobile/src/app/noticia/nova.js`:

```js
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { api } from '../../servicos/api';
import { useAuth } from '../../servicos/AuthContext';
import { voltar } from '../../servicos/navegacao';
import Campo from '../../componentes/Campo';
import Botao from '../../componentes/Botao';
import { cores } from '../../componentes/tema';

export default function TelaNovaNoticia() {
  const { ehAdmin } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Proteção extra: o botão já some para quem não é admin, mas o servidor também barra
  if (!ehAdmin) {
    return <Text style={styles.erro}>Apenas a diretoria do DA pode publicar notícias.</Text>;
  }

  async function publicar() {
    if (!titulo.trim() || !conteudo.trim()) {
      setErro('Preencha o título e o conteúdo.');
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      await api('/noticias', {
        metodo: 'POST',
        corpo: { titulo, conteudo, imagem_url: imagemUrl || null },
      });
      voltar();
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.tela} keyboardShouldPersistTaps="handled">
      <Campo rotulo="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Inscrições abertas para a Semana Acadêmica" />
      <Campo rotulo="Conteúdo" value={conteudo} onChangeText={setConteudo} placeholder="Escreva a notícia..." multiline />
      <Campo
        rotulo="Link de uma imagem (opcional)"
        value={imagemUrl}
        onChangeText={setImagemUrl}
        placeholder="https://..."
        autoCapitalize="none"
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Botao titulo="Publicar" onPress={publicar} carregando={enviando} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { padding: 16 },
  erro: { color: cores.perigo, marginBottom: 12, padding: 4 },
});
```

- `imagem_url: imagemUrl || null` → se o campo estiver vazio (`''`), mandamos `null`.
- Os **hooks** (`useState`, `useAuth`) ficam todos no começo, **antes** de qualquer `return`. Regra do React: hooks sempre na mesma ordem, nunca dentro de `if`.

### Registrando as telas no Stack

No `src/app/_layout.js`, adicione estas duas linhas logo abaixo da linha do `(tabs)`:

```js
        <Stack.Screen name="noticia/[id]" options={{ title: 'Notícia' }} />
        <Stack.Screen name="noticia/nova" options={{ title: 'Nova notícia' }} />
```

Isso dá o título do cabeçalho de cada tela. (Sem essas linhas a tela até funciona, mas o título fica feio, com o nome do arquivo.)

**Teste:** logado como admin, crie uma notícia, veja na lista, toque para abrir, puxe a lista para atualizar, exclua. Teste também com um usuário comum: o botão "+ Nova notícia" não aparece.

**Checkpoint:** commit `feat: telas de notícias`.

## 5.9 Loja

Mesmos padrões das notícias, com duas novidades: o botão de WhatsApp e a regra de "só o dono pode mexer".

`mobile/src/componentes/CartaoItem.js`:

```js
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { cores } from './tema';
import { formatarPreco } from '../servicos/formatar';

export default function CartaoItem({ item }) {
  return (
    <Pressable style={styles.cartao} onPress={() => router.push(`/item/${item.id}`)}>
      {item.imagem_url ? (
        <Image source={{ uri: item.imagem_url }} style={styles.imagem} />
      ) : (
        <View style={[styles.imagem, styles.semImagem]}>
          <Text style={styles.semImagemTexto}>Sem foto</Text>
        </View>
      )}

      <View style={styles.corpo}>
        <Text style={styles.titulo} numberOfLines={1}>
          {item.titulo}
        </Text>
        <Text style={styles.preco}>{formatarPreco(item.preco)}</Text>
        <Text style={styles.vendedor}>por {item.vendedor}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    backgroundColor: cores.cartao,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: cores.borda,
  },
  imagem: { width: 100, height: 100 },
  semImagem: { backgroundColor: cores.primariaClara, justifyContent: 'center', alignItems: 'center' },
  semImagemTexto: { color: cores.primaria, fontSize: 12 },
  corpo: { flex: 1, padding: 12, justifyContent: 'center' },
  titulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  preco: { fontSize: 18, fontWeight: 'bold', color: cores.sucesso, marginTop: 4 },
  vendedor: { fontSize: 13, color: cores.textoSuave, marginTop: 4 },
});
```

- Cartão **horizontal** (`flexDirection: 'row'`): foto à esquerda, textos à direita.
- `flex: 1` no corpo → os textos ocupam todo o espaço que sobrou ao lado da foto.
- Se não tiver foto, mostramos uma caixa "Sem foto" do mesmo tamanho (para todos os cartões ficarem alinhados).

`mobile/src/app/(tabs)/loja.js`:

```js
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { api } from '../../servicos/api';
import { useAuth } from '../../servicos/AuthContext';
import CartaoItem from '../../componentes/CartaoItem';
import Botao from '../../componentes/Botao';
import { cores } from '../../componentes/tema';

export default function TelaLoja() {
  const { usuario } = useAuth();
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      setErro('');
      setItens(await api('/itens'));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  async function puxarParaAtualizar() {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  function anunciar() {
    // Quem não está logado vai para o login primeiro
    if (usuario) {
      router.push('/item/novo');
    } else {
      router.push('/login');
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <Botao titulo="+ Anunciar um item" onPress={anunciar} />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CartaoItem item={item} />}
        refreshing={atualizando}
        onRefresh={puxarParaAtualizar}
        ListEmptyComponent={<Text style={styles.vazio}>Nada à venda no momento.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 16 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  erro: { color: cores.perigo, marginBottom: 12 },
  vazio: { textAlign: 'center', color: cores.textoSuave, marginTop: 40 },
});
```

- O botão "Anunciar" aparece para todos; quem **não** está logado é mandado para o login primeiro.

Crie a pasta `src/app/item` e `mobile/src/app/item/[id].js`:

```js
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../servicos/api';
import { useAuth } from '../../servicos/AuthContext';
import { formatarPreco } from '../../servicos/formatar';
import { confirmar } from '../../servicos/confirmar';
import { voltar } from '../../servicos/navegacao';
import Botao from '../../componentes/Botao';
import { cores } from '../../componentes/tema';

export default function TelaItem() {
  const { id } = useLocalSearchParams();
  const { usuario, ehAdmin } = useAuth();
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        setItem(await api(`/itens/${id}`));
      } catch (e) {
        setErro(e.message);
      }
    }
    carregar();
  }, [id]);

  function chamarNoWhatsApp() {
    const numero = item.contato.replace(/\D/g, ''); // tira tudo que não for número
    const mensagem = `Oi! Vi seu anúncio "${item.titulo}" no Comunitera.`;
    Linking.openURL(`https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`);
  }

  async function marcarComoVendido() {
    try {
      await api(`/itens/${id}/vendido`, { metodo: 'PATCH' });
      voltar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function excluir() {
    const certeza = await confirmar('Excluir anúncio', 'Tem certeza?');
    if (!certeza) return;

    try {
      await api(`/itens/${id}`, { metodo: 'DELETE' });
      voltar();
    } catch (e) {
      setErro(e.message);
    }
  }

  if (erro) {
    return <Text style={styles.erro}>{erro}</Text>;
  }

  if (!item) {
    return <ActivityIndicator style={styles.carregando} size="large" color={cores.primaria} />;
  }

  // Só o dono do anúncio (ou a diretoria) vê os botões de gerenciar
  const podeGerenciar = usuario && (usuario.id === item.vendedor_id || ehAdmin);

  return (
    <ScrollView contentContainerStyle={styles.tela}>
      {item.imagem_url ? <Image source={{ uri: item.imagem_url }} style={styles.imagem} /> : null}

      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.preco}>{formatarPreco(item.preco)}</Text>
      <Text style={styles.vendedor}>Vendido por {item.vendedor}</Text>
      {item.descricao ? <Text style={styles.descricao}>{item.descricao}</Text> : null}

      <Botao titulo="Chamar no WhatsApp" onPress={chamarNoWhatsApp} />

      {podeGerenciar ? (
        <>
          <Botao titulo="Marcar como vendido" variante="secundario" onPress={marcarComoVendido} />
          <Botao titulo="Excluir anúncio" variante="perigo" onPress={excluir} />
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { padding: 16 },
  carregando: { marginTop: 40 },
  erro: { color: cores.perigo, padding: 16 },
  imagem: { width: '100%', height: 260, borderRadius: 12, marginBottom: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto },
  preco: { fontSize: 26, fontWeight: 'bold', color: cores.sucesso, marginTop: 6 },
  vendedor: { fontSize: 14, color: cores.textoSuave, marginTop: 6 },
  descricao: { fontSize: 16, lineHeight: 24, color: cores.texto, marginTop: 16, marginBottom: 16 },
});
```

**Entendendo:**

- `item.contato.replace(/\D/g, '')` → uma **regex**: `\D` = "qualquer coisa que **não** é dígito", `g` = "todas as ocorrências". Ou seja, transforma `"(54) 99999-8888"` em `"54999998888"`.
- `https://wa.me/55NUMERO?text=...` → link oficial do WhatsApp para abrir uma conversa. `55` é o código do Brasil.
- `encodeURIComponent(mensagem)` → transforma espaços, acentos e aspas num formato que pode ir numa URL.
- `Linking.openURL(...)` → abre o link fora do app (no WhatsApp).
- `podeGerenciar` → dono do anúncio **ou** admin. Igual à regra do servidor (`podeAlterar`).
- `<> ... </>` → fragmento para devolver dois botões dentro do ternário.

`mobile/src/app/item/novo.js`:

```js
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { api } from '../../servicos/api';
import { useAuth } from '../../servicos/AuthContext';
import { voltar } from '../../servicos/navegacao';
import Campo from '../../componentes/Campo';
import Botao from '../../componentes/Botao';
import { cores } from '../../componentes/tema';

export default function TelaNovoItem() {
  const { usuario } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [contato, setContato] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!usuario) {
    return <Text style={styles.erro}>Entre na sua conta para anunciar.</Text>;
  }

  async function anunciar() {
    // O usuário digita "25,90"; o JavaScript entende "25.90"
    const precoNumero = Number(preco.replace(',', '.'));

    if (!titulo.trim() || !contato.trim()) {
      setErro('Preencha título e contato.');
      return;
    }
    if (!preco || Number.isNaN(precoNumero)) {
      setErro('Digite um preço válido. Ex.: 25,90');
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      await api('/itens', {
        metodo: 'POST',
        corpo: { titulo, descricao, preco: precoNumero, contato, imagem_url: imagemUrl || null },
      });
      voltar();
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.tela} keyboardShouldPersistTaps="handled">
      <Campo rotulo="O que você está vendendo?" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Livro de Cálculo I" />
      <Campo rotulo="Preço (R$)" value={preco} onChangeText={setPreco} placeholder="25,90" keyboardType="decimal-pad" />
      <Campo
        rotulo="WhatsApp com DDD"
        value={contato}
        onChangeText={setContato}
        placeholder="54999998888"
        keyboardType="phone-pad"
      />
      <Campo rotulo="Descrição (opcional)" value={descricao} onChangeText={setDescricao} placeholder="Estado, detalhes..." multiline />
      <Campo
        rotulo="Link de uma foto (opcional)"
        value={imagemUrl}
        onChangeText={setImagemUrl}
        placeholder="https://..."
        autoCapitalize="none"
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Botao titulo="Publicar anúncio" onPress={anunciar} carregando={enviando} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { padding: 16 },
  erro: { color: cores.perigo, marginBottom: 12, padding: 4 },
});
```

- `keyboardType="decimal-pad"` → teclado numérico com vírgula. `"phone-pad"` → teclado de telefone.
- `preco.replace(',', '.')` → o brasileiro digita `25,90`, mas o JavaScript só entende `25.90`.
- `Number.isNaN(...)` → confere se virou um número de verdade.

Registre as telas no `src/app/_layout.js`:

```js
        <Stack.Screen name="item/[id]" options={{ title: 'Anúncio' }} />
        <Stack.Screen name="item/novo" options={{ title: 'Anunciar item' }} />
```

**Teste:** anuncie um item, abra, toque em "Chamar no WhatsApp" (no celular abre o WhatsApp). Marque como vendido: ele some da lista. Entre com outra conta e confira que os botões de gerenciar não aparecem no item dos outros.

**Checkpoint:** commit `feat: telas da loja`.

## 5.10 Eventos — desafio

Agora é com você. Crie:

**1. A aba de eventos** (`src/app/(tabs)/eventos.js`) que:

- busca `GET /eventos` e recarrega ao voltar para a tela;
- mostra cada evento num cartão com um "quadradinho de calendário" à esquerda (dia grande e mês abreviado embaixo, usando `partesDaDataEvento` do `formatar.js`) e, à direita, título, hora, local e descrição;
- mostra o botão "+ Novo evento" só para admin, abrindo `/evento/novo`;
- mostra "Nenhum evento marcado." se a lista estiver vazia.

**2. A tela de novo evento** (`src/app/evento/novo.js`) com os campos: nome do evento, local, data (`DD/MM/AAAA`), hora (`HH:MM`) e descrição (opcional). Antes de enviar, converta a data para o formato que o servidor quer: `"30/10/2026"` + `"19:00"` → `"2026-10-30 19:00"`.

**3.** Registre `evento/novo` no `_layout.js` raiz com o título "Novo evento".

Dicas:

- Copie a estrutura de `loja.js` e `item/novo.js` e adapte.
- `'30/10/2026'.split('/')` devolve `['30', '10', '2026']`.
- `'5'.padStart(2, '0')` devolve `'05'` (para quem digitar `5/1/2026`).
- `/^\d{2}:\d{2}$/.test(hora)` confere se a hora está no formato `HH:MM`.
- O cartão do evento pode ser um componente **no mesmo arquivo** da tela (uma função `CartaoEvento` antes do `export default`). Componentes pequenos que só uma tela usa podem ficar assim.

<details>
<summary>Ver resposta: <code>src/app/(tabs)/eventos.js</code></summary>

```js
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { api } from '../../servicos/api';
import { useAuth } from '../../servicos/AuthContext';
import { partesDaDataEvento } from '../../servicos/formatar';
import Botao from '../../componentes/Botao';
import { cores } from '../../componentes/tema';

function CartaoEvento({ evento }) {
  const data = partesDaDataEvento(evento.data_hora);

  return (
    <View style={styles.cartao}>
      <View style={styles.calendario}>
        <Text style={styles.dia}>{data.dia}</Text>
        <Text style={styles.mes}>{data.mes}</Text>
      </View>
      <View style={styles.corpo}>
        <Text style={styles.titulo}>{evento.titulo}</Text>
        <Text style={styles.info}>
          {data.hora} · {evento.local}
        </Text>
        {evento.descricao ? <Text style={styles.descricao}>{evento.descricao}</Text> : null}
      </View>
    </View>
  );
}

export default function TelaEventos() {
  const { ehAdmin } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      setErro('');
      setEventos(await api('/eventos'));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      {ehAdmin ? <Botao titulo="+ Novo evento" onPress={() => router.push('/evento/novo')} /> : null}
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <FlatList
        data={eventos}
        keyExtractor={(evento) => String(evento.id)}
        renderItem={({ item }) => <CartaoEvento evento={item} />}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum evento marcado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 16 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  erro: { color: cores.perigo, marginBottom: 12 },
  vazio: { textAlign: 'center', color: cores.textoSuave, marginTop: 40 },
  cartao: {
    flexDirection: 'row',
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  calendario: {
    width: 60,
    borderRadius: 10,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dia: { fontSize: 24, fontWeight: 'bold', color: cores.primaria },
  mes: { fontSize: 12, fontWeight: 'bold', color: cores.primaria },
  corpo: { flex: 1, marginLeft: 12 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  info: { fontSize: 14, color: cores.textoSuave, marginTop: 2 },
  descricao: { fontSize: 14, color: cores.texto, marginTop: 6 },
});
```

</details>

<details>
<summary>Ver resposta: <code>src/app/evento/novo.js</code></summary>

```js
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { api } from '../../servicos/api';
import { useAuth } from '../../servicos/AuthContext';
import { voltar } from '../../servicos/navegacao';
import Campo from '../../componentes/Campo';
import Botao from '../../componentes/Botao';
import { cores } from '../../componentes/tema';

export default function TelaNovoEvento() {
  const { ehAdmin } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!ehAdmin) {
    return <Text style={styles.erro}>Apenas a diretoria do DA pode criar eventos.</Text>;
  }

  async function criar() {
    // O usuário digita "30/10/2026" e "19:00". O servidor quer "2026-10-30 19:00".
    const partes = data.split('/');

    if (!titulo.trim() || !local.trim()) {
      setErro('Preencha título e local.');
      return;
    }
    if (partes.length !== 3 || !/^\d{2}:\d{2}$/.test(hora)) {
      setErro('Use data no formato DD/MM/AAAA e hora no formato HH:MM.');
      return;
    }

    const [dia, mes, ano] = partes;
    const dataHora = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')} ${hora}`;

    setErro('');
    setEnviando(true);
    try {
      await api('/eventos', {
        metodo: 'POST',
        corpo: { titulo, local, descricao, data_hora: dataHora },
      });
      voltar();
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.tela} keyboardShouldPersistTaps="handled">
      <Campo rotulo="Nome do evento" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Festa de Halloween do Tera" />
      <Campo rotulo="Local" value={local} onChangeText={setLocal} placeholder="Ex.: Sala do DA" />
      <Campo rotulo="Data" value={data} onChangeText={setData} placeholder="30/10/2026" keyboardType="numbers-and-punctuation" />
      <Campo rotulo="Hora" value={hora} onChangeText={setHora} placeholder="19:00" keyboardType="numbers-and-punctuation" />
      <Campo rotulo="Descrição (opcional)" value={descricao} onChangeText={setDescricao} multiline />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Botao titulo="Criar evento" onPress={criar} carregando={enviando} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { padding: 16 },
  erro: { color: cores.perigo, marginBottom: 12, padding: 4 },
});
```

</details>

**Checkpoint:** crie um evento pelo app e veja na aba Eventos. Commit `feat: telas de eventos`.

## 5.11 Checkpoint final do app

O `src/app/_layout.js` completo deve estar assim:

```js
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../servicos/AuthContext';
import { cores } from '../componentes/tema';

export default function LayoutRaiz() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: '#FFFFFF',
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="noticia/[id]" options={{ title: 'Notícia' }} />
        <Stack.Screen name="noticia/nova" options={{ title: 'Nova notícia' }} />
        <Stack.Screen name="item/[id]" options={{ title: 'Anúncio' }} />
        <Stack.Screen name="item/novo" options={{ title: 'Anunciar item' }} />
        <Stack.Screen name="evento/novo" options={{ title: 'Novo evento' }} />
        <Stack.Screen name="login" options={{ title: 'Entrar' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
      </Stack>
    </AuthProvider>
  );
}
```

E a estrutura de `mobile/src`:

```
src/
├── app/
│   ├── _layout.js
│   ├── cadastro.js
│   ├── login.js
│   ├── (tabs)/
│   │   ├── _layout.js
│   │   ├── eventos.js
│   │   ├── index.js
│   │   ├── loja.js
│   │   └── perfil.js
│   ├── evento/
│   │   └── novo.js
│   ├── item/
│   │   ├── [id].js
│   │   └── novo.js
│   └── noticia/
│       ├── [id].js
│       └── nova.js
├── componentes/
│   ├── Botao.js
│   ├── Campo.js
│   ├── CartaoItem.js
│   ├── CartaoNoticia.js
│   └── tema.js
└── servicos/
    ├── api.js
    ├── AuthContext.js
    ├── confirmar.js
    ├── formatar.js
    └── navegacao.js
```

**Perguntas para ver se você entendeu:**

1. Por que o app não pode usar `localhost` para falar com o servidor no celular?
2. Qual a diferença entre `useEffect` e `useFocusEffect`? Por que a lista de notícias usa o segundo?
3. Por que esconder o botão "Nova notícia" no app **não** é suficiente para a segurança?
4. O que acontece, passo a passo, quando o usuário toca em "Entrar"? (Do `onPress` até aparecer o nome no perfil.)
5. Onde o token fica guardado no celular e por que o usuário continua logado ao fechar o app?

---

# Parte 6 — Rodando tudo junto

## Primeira vez num computador (depois de clonar)

O Git não traz `node_modules`, `.env` nem o banco. Então, depois do `git clone` (ou quando o projeto já estiver pronto e você for rodar pela primeira vez):

```bash
# Backend
cd backend
npm install
# copie o .env.example para .env e preencha o JWT_SECRET
# (no Explorer do VS Code: botão direito no .env.example → Copy → Paste → renomeie para .env)

# App (em outro terminal, a partir da raiz do projeto)
cd mobile
npm install
# copie o .env.example para .env.local e coloque o IP do seu PC (ipconfig)
```

> Repare: aqui é `npm install` **sem nome de biblioteca**. Isso instala tudo o que está listado no `package.json`. No app também vale `npm install` nesse caso, porque as versões já foram escolhidas pelo `npx expo install` de quem adicionou a biblioteca.

## Todo dia

```
Terminal 1                         Terminal 2
──────────                         ──────────
cd backend                         cd mobile
npm run dev                        npx expo start
(deixe rodando)                    (escaneie o QR Code com o celular)
```

E sempre que fizer `git pull` ou `git merge main` e alguém tiver adicionado uma biblioteca (mudou o `package.json`), rode `npm install` na pasta correspondente.

## Criando o primeiro admin

O banco começa vazio. Crie sua conta pelo app (aba Perfil) e promova:

```bash
cd backend
npm run admin -- seu@email.com
```

Depois saia e entre de novo no app.

## Roteiro de teste completo (use também na apresentação)

1. Abrir o app sem login: Notícias, Loja e Eventos aparecem; o botão "Nova notícia" **não**.
2. Perfil → Criar conta (aluno).
3. Loja → Anunciar um item → ver na lista → abrir → "Chamar no WhatsApp".
4. Sair. Entrar com uma conta **admin**.
5. Notícias → Nova notícia → aparece no topo da lista → abrir → excluir.
6. Eventos → Novo evento → aparece com o dia e o mês no calendário.
7. Loja → abrir o item do aluno → como admin, marcar como vendido → some da lista.
8. Fechar e reabrir o app: continua logado.

Para a apresentação, deixe o banco já com algumas notícias, itens e eventos de exemplo, e teste a rede do local **antes** (veja "Wi-Fi da faculdade" na Parte 8). Se a rede não colaborar, rode no navegador do PC (tecla `w`) com `EXPO_PUBLIC_API_URL=http://localhost:3000` e projete a tela.

---

# Parte 7 — Dividindo o trabalho no time

## Princípios

- **Cada pessoa constrói uma funcionalidade inteira** (servidor + app). Assim todo mundo entende o caminho completo: tela → `api()` → rota → banco → resposta → tela.
- **Quem tem mais experiência revisa mais e digita menos.** Na revisão de PR, em vez de corrigir, pergunte: "o que esta linha faz?", "o que acontece se o usuário não estiver logado?". Se a pessoa souber responder, aprova.
- **Trabalho em dupla (pair programming)** nas partes difíceis: um digita, o outro lê e aponta. Troquem a cada 20 minutos.
- **Uma tarefa = uma branch = um PR.**

## Plano sugerido

| Etapa | Quem | O que (seções do guia) | Branch sugerida | Depende de |
|---|---|---|---|---|
| 0 | Todos, individual | Partes 1 e 2 + PR de teste (adicione seu nome na seção "Equipe" do README) | `docs/meu-nome-na-equipe` | — |
| 1 | Todos juntos, um digitando de cada vez | Parte 3 + 4.1 a 4.5 | `chore/estrutura-inicial`, `feat/backend-base` | 0 |
| 2 | Felipe | 4.6 e 4.7 (cadastro, login, middleware) | `feat/backend-auth` | 1 |
| 2 | Pessoa A + Pessoa B em dupla | 5.1 a 5.5 (projeto Expo, navegação, componentes) | `feat/app-base` | 1 |
| 3 | Felipe | 5.6 e 5.7 (conexão, login no app) | `feat/app-login` | 2 |
| 3 | Pessoa A | 4.8 (rotas de notícias) | `feat/backend-noticias` | 2 |
| 3 | Pessoa B | 4.9 (rotas da loja) | `feat/backend-loja` | 2 |
| 4 | Pessoa A | 5.8 (telas de notícias) | `feat/app-noticias` | 3 |
| 4 | Pessoa B | 5.9 (telas da loja) | `feat/app-loja` | 3 |
| 4 | Quem terminar primeiro (ou A + B em dupla) | 4.10, 4.11 e 5.10 (eventos) | `feat/eventos` | 3 |
| 5 | Todos | Parte 6 (teste completo), correções, apresentação, extras da Parte 9 | `fix/...` | 4 |

Dica: crie uma **Issue** no GitHub para cada linha da tabela (aba **Issues → New issue**) e um quadro em **Projects** com as colunas "A fazer / Fazendo / Em revisão / Pronto". No PR, escreva `Closes #3` na descrição para a issue 3 fechar sozinha quando o PR for aceito.

Os PRs da etapa 3 em diante mexem em arquivos diferentes, mas **todos** mexem no `server.js` (backend) ou no `_layout.js` (app). Isso gera conflitos pequenos e fáceis: é um ótimo treino da [seção 11 do README](../README.md#11-conflitos-de-merge).

---

# Parte 8 — Problemas comuns

## Rede e conexão

**O celular não abre o app pelo QR Code (fica carregando ou dá erro de conexão)**
- Celular e PC precisam estar **no mesmo Wi-Fi**.
- **Wi-Fi da faculdade** costuma bloquear a comunicação entre aparelhos. Soluções, da mais fácil para a mais difícil:
  1. **Roteie a internet do celular** (hotspot) e conecte o PC nela. Agora os dois estão na mesma rede. **O IP do PC muda**: rode `ipconfig` de novo e atualize o `.env.local`.
  2. Use o app **no navegador do PC** (tecla `w`), com `EXPO_PUBLIC_API_URL=http://localhost:3000` no `.env.local`.
  3. `npx expo start --tunnel` faz o app carregar por outro caminho, mas **o app ainda não vai alcançar a API** no seu PC. Só resolve metade do problema.

**"Não consegui falar com o servidor. Ele está rodando? O IP no .env.local está certo?"**
Confira nesta ordem:
1. O backend está rodando (`npm run dev`) sem erro vermelho?
2. No **navegador do celular**, `http://SEU_IP:3000` abre? Se não abrir, é rede ou firewall (próximos itens).
3. O IP no `.env.local` é o atual (`ipconfig`)? Começa com `http://` e termina com `:3000`, sem `/` no final?
4. Você reiniciou o Expo com `npx expo start --clear` depois de mudar o `.env.local`?

**O navegador do PC abre `localhost:3000`, mas o celular não abre `http://SEU_IP:3000`**
É o **Firewall do Windows**:
- Iniciar → "Firewall do Windows Defender" → **Permitir um aplicativo ou recurso pelo Firewall** → **Alterar configurações** → encontre **Node.js JavaScript Runtime** e marque a coluna **Privada** → OK.
- E deixe a sua rede Wi-Fi como privada: Configurações → Rede e Internet → Wi-Fi → (sua rede) → **Tipo de perfil de rede: Privada**.

**"Project is incompatible with this version of Expo Go"**
O projeto e o Expo Go do celular estão em versões diferentes do Expo.
- Se o Expo Go for **mais novo** que o projeto (o mais comum, quando o Expo lança versão nova), atualize o projeto, na pasta `mobile`:
  ```bash
  npx expo install expo@latest
  npx expo install --fix
  ```
  Faça isso numa branch própria e avise o time, porque muda o `package.json` de todo mundo.
- Se o Expo Go for **mais velho**, atualize o app Expo Go na loja.

## Erros no backend

| Erro no terminal | Causa e solução |
|---|---|
| `SyntaxError: Cannot use import statement outside a module` | Falta `"type": "module"` no `package.json`. |
| `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../routes/auth'` | No backend, o import **precisa** terminar em `.js`: `'./routes/auth.js'`. (No app não precisa.) |
| `node: .env: not found` | Não existe o arquivo `backend/.env`. Copie do `.env.example`. |
| `secretOrPrivateKey must have a value` | Falta o `JWT_SECRET` no `.env`. |
| `Error: listen EADDRINUSE: address already in use :::3000` | Já tem um servidor rodando na porta 3000 (talvez em outro terminal). Feche o outro com `Ctrl + C`. |
| `Error: no such column: ...` / `Error: table ... has no column named ...` | Você mudou uma tabela no `db.js` depois que o banco já existia. O `CREATE TABLE IF NOT EXISTS` não altera tabelas existentes. Pare o servidor, **apague o `comunitera.db`** e rode de novo (os dados de teste somem; recrie a conta e o admin). |
| A rota responde "Preencha ..." mesmo mandando os dados | O pedido está sem `Content-Type: application/json`, ou faltou a linha em branco antes do JSON no `.http`, ou faltou `app.use(express.json())`. |
| Virei admin mas continua dando 403 | O papel fica no token. Faça login de novo. |
| `ExperimentalWarning: SQLite is an experimental feature` | Não é erro. Pode ignorar. |

## Erros no app

| Erro (tela vermelha ou terminal do Expo) | Causa e solução |
|---|---|
| `Unable to resolve module ../../componentes/Botao` | Caminho do import errado (conte os `../`) ou nome com letra maiúscula/minúscula diferente do arquivo. |
| `Unable to resolve module expo-router` (ou outra biblioteca) | Biblioteca não instalada. Se veio de um `git pull`, rode `npm install`. Se é nova, `npx expo install nome`. |
| `Text strings must be rendered within a <Text> component` | Tem texto solto fora de `<Text>`. Procure espaços ou `;` perdidos no JSX, ou um `{condicao && ...}` com valor `0` ou `''` (troque por ternário). |
| `Rendered more hooks than during the previous render` / `Invalid hook call` | Um `useState`/`useEffect`/`useAuth` está depois de um `return` ou dentro de um `if`. Hooks sempre no topo do componente. |
| `Cannot read properties of null (reading 'nome')` | Você usou um dado antes de ele chegar do servidor (ex.: `noticia.titulo` com `noticia` ainda `null`). Mostre "carregando" enquanto for `null`, ou use `?.`. |
| `npx.ps1 não pode ser carregado...` | Veja a [seção 1.5](#15-terminal-no-windows-um-problema-clássico). |
| Mudei o `.env.local`, `app.json` ou `package.json` e nada mudou | Pare o Expo e rode `npx expo start --clear`. |
| Imagem não aparece | Faltou `width` e `height` no estilo, ou o link não é de uma imagem direta (precisa terminar em `.jpg`, `.png`... ou ser um link direto de imagem). |
| Comportamento estranho sem explicação | `Ctrl + C` e `npx expo start --clear`. Ainda estranho? Feche o Expo Go no celular e abra de novo. |

## Como pedir ajuda direito

Mande no grupo:
1. **O que você estava tentando fazer** (qual seção do guia).
2. **O erro completo**, copiado como texto (não só "deu erro").
3. **O código do arquivo** onde acontece (ou o link do commit/branch).
4. **O que você já tentou.**

---

# Parte 9 — Indo além

Com o projeto funcionando, estas são ideias para evoluir. Estão em ordem de dificuldade.

**1. Editar notícia (fácil).** O servidor já tem `PUT /noticias/:id`. Crie a tela `src/app/noticia/editar/[id].js`: copie o formulário da `nova.js`, carregue a notícia no `useEffect` para preencher os campos, e envie com `metodo: 'PUT'`. Adicione um botão "Editar" no detalhe (só admin).

**2. Busca na loja (fácil).** No servidor, aceite `GET /itens?busca=livro`: leia `req.query.busca` e, se existir, adicione `AND i.titulo LIKE ?` passando `` `%${busca}%` `` como valor. No app, um `Campo` no topo da loja que chama `api('/itens?busca=' + encodeURIComponent(texto))`.

**3. Meus anúncios (médio).** Uma rota `GET /itens/meus` (com `autenticar`) que filtra por `vendedor_id = req.usuario.id`, e uma seção no Perfil listando os anúncios do usuário, inclusive os vendidos. (Atenção: no Express, uma rota fixa como `/meus` precisa ser declarada **antes** de `/:id`, senão o `/:id` captura "meus" como se fosse um id.)

**4. Categorias na loja (médio).** Nova coluna `categoria` em `itens` (lembre de apagar o `.db`), um seletor no formulário e filtro na lista.

**5. Foto pela câmera/galeria (difícil).** No app: `npx expo install expo-image-picker` para escolher a foto. No servidor: a biblioteca `multer` recebe o arquivo e salva numa pasta `uploads/`, e `app.use('/uploads', express.static('uploads'))` serve as imagens. O app envia com `FormData` em vez de JSON. Leia a documentação do `expo-image-picker` e do `multer` antes de começar.

**6. Notificações (difícil).** Avisar todos quando sair notícia nova, com `expo-notifications`. Exige criar conta no Expo e entender tokens de push.

**7. Colocar o servidor na internet (difícil).** Serviços como Render ou Railway hospedam o Node. Problema: nos planos gratuitos o disco é apagado a cada reinício, e o `comunitera.db` sumiria. Seria preciso um banco hospedado (ex.: PostgreSQL gerenciado) e trocar o `node:sqlite` por outra biblioteca. Com o servidor online (HTTPS), o app funciona em qualquer rede.

**8. Gerar o APK para instalar sem Expo Go (difícil).** Com uma conta no Expo, o **EAS Build** gera o instalador na nuvem: `npx eas-cli@latest build -p android --profile preview`. Requer configuração (`eas.json`) e, na prática, o servidor na internet com HTTPS (item 7), porque o Android bloqueia `http://` em apps instalados.

**9. Testes automatizados.** O Node tem um executor de testes embutido (`node --test`). Escreva testes que chamam as rotas e conferem os status (201, 400, 401, 403...).

---

# Parte 10 — Glossário e links para estudar

## Glossário

| Termo | Significado |
|---|---|
| **API** | Conjunto de rotas que um servidor oferece para outros programas usarem |
| **Async / await** | Jeito de escrever código que espera algo demorado sem travar o programa |
| **Backend** | O servidor: regras, segurança e banco de dados |
| **Branch** | Linha do tempo paralela no Git |
| **Commit** | Uma "foto" salva do projeto no Git |
| **Componente** | Função do React que devolve um pedaço de tela |
| **Context** | Forma do React de compartilhar dados com muitas telas sem passar props |
| **CORS** | Regra do navegador que bloqueia chamadas entre endereços diferentes, a menos que o servidor permita |
| **CRUD** | Create, Read, Update, Delete |
| **Endpoint / rota** | Combinação de método + caminho, ex.: `POST /itens` |
| **Expo Go** | App que roda o seu projeto no celular durante o desenvolvimento |
| **Frontend** | A parte que o usuário vê (o app) |
| **Hash** | "Impressão digital" de um dado, de mão única (usado em senhas) |
| **Hook** | Função especial do React que começa com `use` (`useState`, `useEffect`, `useAuth`...) |
| **JSON** | Formato de texto para trocar dados |
| **JSX** | A sintaxe "HTML dentro do JavaScript" do React |
| **JWT** | Token assinado que prova quem está logado |
| **Middleware** | Função que roda antes da rota e pode barrar o pedido |
| **npm** | Gerenciador de bibliotecas do Node |
| **Props** | Parâmetros de um componente |
| **Pull Request** | Pedido para juntar uma branch na `main`, com revisão |
| **SQL** | Linguagem para consultar e alterar o banco de dados |
| **State (estado)** | Dado de um componente que, quando muda, atualiza a tela |
| **Status code** | Número da resposta HTTP (200, 404...) |

## Para estudar mais

- **JavaScript:** [Guia de JavaScript da MDN (em português)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide) e [javascript.info](https://javascript.info/) (o melhor curso gratuito, em inglês).
- **React:** [Aprenda React, documentação oficial em português](https://pt-br.react.dev/learn). Leia "Descrevendo a UI" e "Adicionando interatividade".
- **React Native:** [Documentação oficial](https://reactnative.dev/docs/getting-started), principalmente "Core Components" e "Style".
- **Expo e Expo Router:** [docs.expo.dev](https://docs.expo.dev/) e [Expo Router](https://docs.expo.dev/router/introduction/).
- **Express:** [Guia oficial em português](https://expressjs.com/pt-br/).
- **SQLite no Node:** [Documentação do `node:sqlite`](https://nodejs.org/api/sqlite.html).
- **SQL:** [SQLite Tutorial](https://www.sqlitetutorial.net/) (exercícios práticos).
- **HTTP:** [Visão geral do HTTP na MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Overview) e [códigos de status](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status).
- **JWT:** [jwt.io](https://jwt.io/) (cole um token e veja por dentro).
- **Git:** [Pro Git em português](https://git-scm.com/book/pt-br/v2) e [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR).

Bons estudos e bom projeto!
