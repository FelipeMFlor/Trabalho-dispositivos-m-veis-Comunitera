# Comunitera

Comunitera: aplicativo do Diretório Acadêmico Tera que centraliza calendário, avisos e informações da vida universitária em um só lugar.

É a "comunidade" dos alunos de Tecnologia: a diretoria do D.A. cadastra eventos, vagas, avisos e datas do calendário, e os alunos acompanham tudo pelo app.

| | |
|---|---|
| **App (frontend)** | React Native + TypeScript com **Expo** e **Expo Router** (roda no celular pelo Expo Go) |
| **Servidor (API)** | Node.js + Express, em TypeScript |
| **Banco de dados** | SQLite (já vem dentro do Node, não precisa instalar nada) |
| **Login** | Senha criptografada com bcrypt + token JWT |

> **Documentação do código:** [`docs/Documentacao_Comunitera.pdf`](docs/Documentacao_Comunitera.pdf) explica o projeto inteiro, arquivo por arquivo.

> **Material de estudo:** o passo a passo completo para construir o projeto do zero (instalação, fundamentos e todo o código) está em [`docs/GUIA_DE_ESTUDO.md`](docs/GUIA_DE_ESTUDO.md). Leia este README primeiro (Git) e depois vá para o guia.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Equipe](#equipe)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Tutorial de Git para o time](#tutorial-de-git-para-o-time)
  - [1. Git e GitHub em 1 minuto](#1-git-e-github-em-1-minuto)
  - [2. Instalar e configurar (uma vez só)](#2-instalar-e-configurar-uma-vez-só)
  - [3. Onde digitar os comandos](#3-onde-digitar-os-comandos)
  - [4. Clonar o projeto](#4-clonar-o-projeto)
  - [5. Como o Git organiza as coisas](#5-como-o-git-organiza-as-coisas)
  - [6. O fluxo do dia a dia (a receita)](#6-o-fluxo-do-dia-a-dia-a-receita)
  - [7. Branches em detalhe](#7-branches-em-detalhe)
  - [8. Atualizar a sua branch com outra branch](#8-atualizar-a-sua-branch-com-outra-branch)
  - [9. Commits: o que e como escrever](#9-commits-o-que-e-como-escrever)
  - [10. Pull Request (PR) no GitHub](#10-pull-request-pr-no-github)
  - [11. Conflitos de merge](#11-conflitos-de-merge)
  - [12. Desfazendo coisas](#12-desfazendo-coisas)
  - [13. Erros comuns e como resolver](#13-erros-comuns-e-como-resolver)
  - [14. Regras do time](#14-regras-do-time)
  - [15. Colinha de comandos](#15-colinha-de-comandos)

---

## Funcionalidades

- **Página inicial:** evento em destaque, aulas do dia, avisos do D.A. (sininho) e links da comunidade.
- **Calendário:** datas do D.A., eventos e compromissos pessoais de cada aluno.
- **Eventos:** inscrição nos eventos do D.A. ("Garantir minha vaga!").
- **Vagas:** mural de estágios e empregos, com candidatura.
- **Hub TERA:** carteirinha digital e contatos do D.A.
- **Painel do D.A.:** só o admin (diretoria) vê. Cadastra e apaga eventos, vagas, avisos, aulas e datas do calendário, e mostra quantos alunos se inscreveram/candidataram.
- **Contas:** alunos se cadastram com nome, curso, RA e senha. O login mestre do D.A. é criado automaticamente (veja `backend/.env.example`).

## Equipe

- Felipe Flôr
- Uilsom
- Mariana

## Estrutura do repositório

```
Comunitera/
├── README.md              ← você está aqui
├── docs/
│   ├── Documentacao_Comunitera.pdf  ← documentação completa do código
│   ├── GUIA_DE_ESTUDO.md            ← material de estudo
│   └── imagens/                     ← prints das telas
├── backend/               ← API em Node.js + Express + SQLite (TypeScript)
└── frontend/              ← app mobile em React Native (Expo + Expo Router)
```

## Como rodar o projeto

Precisa do **Node.js 24** (ou 22.18+). Você vai precisar de **dois terminais abertos ao mesmo tempo**:

```bash
# Terminal 1 — servidor
cd backend
npm install        # só na primeira vez (ou quando alguém adicionar uma biblioteca)
cp .env.example .env   # só na primeira vez (no Windows também pode copiar e renomear na mão)
npm run dev

# Terminal 2 — app
cd frontend
npm install        # só na primeira vez
npx expo start
```

O Terminal 2 mostra um **QR code**:

- **No celular:** instale o app **Expo Go** (Play Store / App Store) e leia o QR code (no iPhone, pela câmera). O celular precisa estar **no mesmo Wi-Fi** que o computador.
- **Tecla `a`:** abre no emulador Android (Android Studio).
- **Tecla `w`:** abre no navegador, bom para testar rápido sem celular.

Para entrar como diretoria, use o usuário e a senha que estão no `backend/.env`. Para entrar como aluno, toque em **Cadastre-se**.

> **O app não conecta no servidor pelo celular?** O app procura o servidor no IP do computador (o mesmo que aparece embaixo do QR code, ex: `exp://192.168.1.14:8081`), na porta 3000. Confira se o celular está no mesmo Wi-Fi e se o Firewall do Windows liberou o Node na rede privada. Se precisar, crie o arquivo `frontend/.env` com `EXPO_PUBLIC_API_URL=http://SEU_IP:3000/api` (veja o README do frontend).

---

# Tutorial de Git para o time

Este tutorial parte do zero. Se você nunca usou Git, leia na ordem e **teste cada comando**. Não precisa decorar: a [colinha](#15-colinha-de-comandos) no final resume tudo.

## 1. Git e GitHub em 1 minuto

- **Git** é um programa que roda no seu computador e guarda o **histórico** de um projeto. Cada vez que você "salva uma versão" (um **commit**), o Git tira uma foto de todos os arquivos. Dá para voltar no tempo, ver quem mudou o quê e trabalhar em paralelo sem um apagar o trabalho do outro.
- **GitHub** é um site que guarda uma cópia do repositório na nuvem. É por ele que o time compartilha o código.
- **Repositório (repo)** é a pasta do projeto com o histórico do Git dentro (a pasta escondida `.git`).
- **Branch** (ramo) é uma linha do tempo paralela. Você cria uma branch para a sua tarefa, trabalha nela à vontade e, quando estiver pronto, junta (**merge**) com a branch principal, a `main`.

Pense assim: a `main` é o trabalho "oficial" que funciona. Ninguém mexe nela direto. Cada um trabalha numa cópia (branch) e depois pede para juntar (Pull Request).

## 2. Instalar e configurar (uma vez só)

### 2.1 Instalar o Git

1. Baixe em <https://git-scm.com/downloads> (escolha **Windows**).
2. Rode o instalador. Pode deixar tudo no padrão e ir clicando em **Next**. Só uma tela merece atenção:
   - Em **"Choosing the default editor used by Git"**, escolha **"Use Visual Studio Code as Git's default editor"** (assim você não fica preso no editor Vim, que é confuso para iniciantes).
3. Feche e abra de novo o VS Code (ou o terminal) depois de instalar.
4. Confira se deu certo:

```bash
git --version
```

Deve aparecer algo como `git version 2.xx.x`. Se aparecer "não é reconhecido como um comando", reinicie o computador e tente de novo.

### 2.2 Dizer ao Git quem você é

O Git anota o autor de cada commit. Use **o mesmo e-mail da sua conta do GitHub**:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
git config --global core.editor "code --wait"
git config --global init.defaultBranch main
```

Para conferir: `git config --global --list`

### 2.3 Conta no GitHub e acesso ao repositório

1. Crie uma conta em <https://github.com> (se ainda não tiver).
2. Passe o seu usuário para o Felipe. Ele adiciona você em **Settings → Collaborators → Add people** no repositório.
3. Você vai receber um **convite por e-mail** (ou em <https://github.com/notifications>). **Aceite o convite**, senão você não vai conseguir enviar código (dá erro 403).

## 3. Onde digitar os comandos

Use o **terminal integrado do VS Code**: menu **Terminal → New Terminal** (atalho `` Ctrl + ` ``). Ele abre já dentro da pasta do projeto, o que evita muita confusão.

Comandos básicos de terminal que você vai usar o tempo todo:

| Comando | O que faz |
|---|---|
| `cd nome-da-pasta` | Entra numa pasta |
| `cd ..` | Volta uma pasta |
| `ls` (PowerShell/Git Bash) ou `dir` (cmd) | Lista os arquivos da pasta atual |
| `pwd` | Mostra em que pasta você está |
| `code .` | Abre a pasta atual no VS Code |
| Seta para cima `↑` | Repete os comandos anteriores |
| `Ctrl + C` | Para um programa que está rodando (ex.: o servidor) |

> **Dica:** antes de qualquer comando Git, confira se você está na pasta certa. Todo comando Git precisa ser rodado **dentro** da pasta do repositório (`Comunitera`).

## 4. Clonar o projeto

**Clonar** = baixar o repositório do GitHub para o seu computador, com todo o histórico. Você faz isso **uma vez só**.

```bash
# 1. Vá para a pasta onde quer guardar o projeto (ex.: Área de Trabalho)
cd Desktop
# (se o seu Windows estiver em português e der erro, tente: cd "Área de Trabalho" ou cd OneDrive\Desktop)

# 2. Clone
git clone https://github.com/FelipeMFlor/Comunitera.git

# 3. Entre na pasta que foi criada
cd Comunitera

# 4. Abra no VS Code
code .
```

Na primeira vez que o Git precisar falar com o GitHub (geralmente no primeiro `push`), vai abrir uma janela do navegador pedindo para você **entrar na sua conta do GitHub e autorizar**. Isso é normal: é o *Git Credential Manager*, que veio junto com o Git. Autorize e pronto, ele lembra de você.

Para conferir se está tudo certo:

```bash
git status
```

Deve responder algo como `On branch main` / `nothing to commit, working tree clean`.

## 5. Como o Git organiza as coisas

Existem 4 "lugares" por onde o seu código passa:

```
  Seus arquivos          Área de preparação       Histórico local          GitHub
  (o que você edita)     (staging)                (seus commits)           (remoto: origin)
 ┌──────────────────┐   ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
 │                  │   │                  │     │                  │     │                  │
 │  você altera     │──>│  git add         │────>│  git commit      │────>│  git push        │
 │  os arquivos     │   │  (escolhe o que  │     │  (salva a foto)  │     │  (envia)         │
 │                  │   │   vai na foto)   │     │                  │<────│  git pull        │
 │                  │   │                  │     │                  │     │  (recebe)        │
 └──────────────────┘   └──────────────────┘     └──────────────────┘     └──────────────────┘
```

- `git add` = coloca alterações na "caixa" do próximo commit.
- `git commit` = fecha a caixa e cola uma etiqueta (a mensagem). Fica **só no seu computador**.
- `git push` = envia os seus commits para o GitHub.
- `git pull` = traz os commits novos do GitHub para o seu computador.
- `origin` = o apelido do repositório no GitHub.

## 6. O fluxo do dia a dia (a receita)

Este é o fluxo que o time vai usar **para toda tarefa**. Grave esta sequência:

```bash
# 1. Vá para a main e pegue a versão mais nova
git switch main
git pull

# 2. Crie uma branch para a sua tarefa (a partir da main atualizada)
git switch -c feat/tela-de-login

# 3. Programe! Salve os arquivos normalmente no VS Code.

# 4. Veja o que mudou
git status

# 5. Adicione as mudanças e faça o commit
git add .
git commit -m "feat: cria tela de login"

# (repita 3, 4 e 5 quantas vezes quiser — commits pequenos são melhores)

# 6. Envie a branch para o GitHub
git push -u origin feat/tela-de-login     # na PRIMEIRA vez que enviar esta branch
git push                                  # nas próximas vezes

# 7. Abra um Pull Request no GitHub (seção 10) e peça revisão

# 8. Depois que o PR for aprovado e juntado (merge), volte para a main e atualize
git switch main
git pull
git branch -d feat/tela-de-login          # apaga a branch local que já foi juntada
```

Por que `-u` no primeiro push? Ele liga a sua branch local à branch do GitHub. Depois disso, `git push` e `git pull` sozinhos já sabem para onde ir.

## 7. Branches em detalhe

### Ver as branches

```bash
git branch        # branches no seu computador (a atual tem um * na frente)
git branch -a     # inclui as do GitHub (aparecem como remotes/origin/...)
```

### Criar uma branch nova e ir para ela

```bash
git switch -c feat/lista-de-noticias
```

A branch nova começa **igual à branch onde você estava**. Por isso, quase sempre crie a partir da `main` atualizada (passo 1 da receita).

### Trocar de branch

```bash
git switch main
git switch feat/lista-de-noticias
```

> Antes de trocar de branch, faça commit do que está fazendo (ou use `git stash`, veja a seção 12). Se tiver alterações não salvas em commit, o Git pode reclamar ou levar essas alterações junto para a outra branch.

### Pegar uma branch que um colega criou

O colega fez `git push` de `feat/cadastro` e você quer testar ou continuar o trabalho dele:

```bash
git fetch                  # baixa a lista de novidades do GitHub (não mexe nos seus arquivos)
git switch feat/cadastro   # o Git cria a branch local ligada à do GitHub automaticamente
```

Depois, para pegar novos commits que ele enviar: `git pull`.

### Nomes de branch

Use o padrão `tipo/descricao-curta`, sem acentos e sem espaços:

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feat/` | Funcionalidade nova | `feat/tela-da-loja` |
| `fix/` | Correção de bug | `fix/login-senha-errada` |
| `docs/` | Documentação | `docs/atualiza-readme` |
| `chore/` | Configuração, organização | `chore/gitignore` |
| `style/` | Só visual/formatação | `style/cores-do-tema` |

> Branches com o nome da pessoa (ex.: `FelipeF`) até funcionam, mas viram uma "segunda main" que fica cada vez mais diferente da original e gera conflitos enormes. Prefira **uma branch por tarefa**, que nasce da `main` e morre depois do merge.

### Apagar branches

```bash
git branch -d feat/tela-de-login          # apaga a local (só deixa se já foi juntada)
git push origin --delete feat/tela-de-login   # apaga no GitHub (o botão "Delete branch" do PR faz o mesmo)
```

## 8. Atualizar a sua branch com outra branch

Situação clássica: você criou `feat/tela-da-loja` na segunda-feira. Na quarta, um colega juntou o login na `main`. Agora a sua branch está "atrasada" e você precisa do código novo. Você vai **trazer a `main` para dentro da sua branch** com `merge`.

### Opção A — passo a passo (recomendada para começar)

```bash
# 1. Salve o seu trabalho atual
git add .
git commit -m "wip: tela da loja em andamento"

# 2. Atualize a sua main local
git switch main
git pull

# 3. Volte para a sua branch e traga a main para dentro dela
git switch feat/tela-da-loja
git merge main

# 4. Envie a branch atualizada
git push
```

### Opção B — atalho, sem sair da sua branch

```bash
git fetch origin            # baixa as novidades do GitHub
git merge origin/main       # junta a main do GitHub na sua branch atual
git push
```

`origin/main` é "a main como está no GitHub", e não a sua cópia local.

### Trazer a branch de um colega (não a main)

É igual, só troca o nome. Ex.: você precisa do componente de botão que está na branch do colega, que ainda não foi para a `main`:

```bash
git fetch origin
git merge origin/feat/componente-botao
```

> Use com moderação: se o PR do colega mudar depois, você vai ter as duas versões misturadas. O ideal é esperar o PR dele entrar na `main` e trazer a `main`.

### O que pode acontecer no merge

- **"Already up to date."** → não tinha nada novo. Tudo certo.
- **"Fast-forward"** → o Git só avançou a sua branch. Tudo certo.
- **Abre o VS Code com uma mensagem tipo `Merge branch 'main' into feat/...`** → é a mensagem do commit de merge. Pode só **fechar a aba** (a mensagem padrão é boa). Se o terminal ficou "travado" esperando, é isso: feche a aba no VS Code.
  - Se abrir um editor estranho dentro do terminal (Vim), digite `Esc`, depois `:wq` e `Enter`.
- **"CONFLICT (content): Merge conflict in ..."** → duas pessoas mexeram na mesma linha. Veja a [seção 11](#11-conflitos-de-merge).

### Com que frequência?

**Todo dia que for programar**, antes de começar: atualize a sua branch com a `main`. Conflito pequeno e frequente é fácil de resolver. Conflito acumulado de duas semanas é um pesadelo.

## 9. Commits: o que e como escrever

### O que é um bom commit

- **Pequeno e com um assunto só:** "cria a rota de login" é bom. "Várias coisas" é ruim.
- **Funciona:** não faça commit de código que nem roda (exceto com `wip:` na sua própria branch).
- **Frequente:** terminou uma partezinha que funciona? Commit.

### Padrão de mensagem do time (Conventional Commits)

```
tipo: descrição curta no imperativo, em minúsculas
```

| Tipo | Exemplo |
|---|---|
| `feat` | `feat: adiciona lista de itens da loja` |
| `fix` | `fix: corrige preço aparecendo com ponto` |
| `docs` | `docs: explica como rodar o backend` |
| `style` | `style: ajusta espaçamento dos cartões` |
| `refactor` | `refactor: separa o botão em um componente` |
| `chore` | `chore: adiciona .gitignore` |
| `wip` | `wip: tela de eventos pela metade` (só na sua branch) |

### Comandos

```bash
git status                     # o que mudou? (vermelho = fora do commit, verde = vai no commit)
git diff                       # mostra exatamente as linhas que mudaram
git add .                      # adiciona TODAS as mudanças da pasta atual
git add backend/src/db.js      # ou adiciona só um arquivo
git commit -m "feat: cria banco de dados"
git log --oneline              # histórico resumido (aperte q para sair)
```

> **Atenção:** antes de `git add .`, olhe o `git status`. Se aparecer `node_modules/`, `.env` ou `comunitera.db`, **pare**: o `.gitignore` não está certo. Esses arquivos nunca devem ir para o GitHub.

### Pelo VS Code (alternativa visual)

O ícone **Source Control** (terceiro da barra lateral, `Ctrl + Shift + G`) faz o mesmo: o `+` ao lado do arquivo é o `git add`, a caixa de texto + botão **Commit** é o `git commit`, e **Sync Changes** faz `pull` + `push`. Use à vontade, mas **aprenda primeiro pelo terminal** para entender o que está acontecendo.

## 10. Pull Request (PR) no GitHub

Um **Pull Request** é um pedido: "por favor, juntem a minha branch na `main`". É onde o time revisa o código antes de entrar.

1. Faça `git push` da sua branch.
2. Abra o repositório no GitHub. Vai aparecer uma faixa amarela **"feat/... had recent pushes" → Compare & pull request**. Clique. (Ou vá na aba **Pull requests → New pull request**, escolha `base: main` ← `compare: sua-branch`.)
3. Escreva:
   - **Título:** igual a um commit (`feat: tela de login`).
   - **Descrição:** o que fez, como testar, print da tela (arraste a imagem para a caixa de texto).
4. Em **Reviewers**, marque um colega.
5. Clique em **Create pull request**.
6. O revisor lê o código na aba **Files changed** e comenta ou aprova.
7. Se pedirem mudanças: altere na mesma branch, faça commit e `git push`. O PR se atualiza sozinho.
8. Aprovado → **Merge pull request** → **Confirm merge** → **Delete branch**.
9. Todo mundo atualiza a main local: `git switch main` + `git pull`.

Se o GitHub mostrar **"This branch has conflicts that must be resolved"**, atualize a sua branch com a `main` ([seção 8](#8-atualizar-a-sua-branch-com-outra-branch)), resolva os conflitos no seu computador e dê `git push`.

## 11. Conflitos de merge

Conflito acontece quando você e outra pessoa mudaram **a mesma linha** do mesmo arquivo. O Git não sabe qual versão escolher e pergunta para você.

O terminal mostra:

```
CONFLICT (content): Merge conflict in mobile/src/componentes/tema.js
Automatic merge failed; fix conflicts and then commit the result.
```

E o arquivo fica assim:

```js
export const cores = {
<<<<<<< HEAD
  primaria: '#5B21B6',
=======
  primaria: '#2563EB',
>>>>>>> main
};
```

- Entre `<<<<<<< HEAD` e `=======` está **a sua versão**.
- Entre `=======` e `>>>>>>> main` está **a versão que chegou**.

### Como resolver

1. Abra o arquivo no VS Code. Ele mostra botões em cima do conflito: **Accept Current Change** (a sua), **Accept Incoming Change** (a que chegou), **Accept Both Changes** (as duas). Ou edite à mão.
2. O resultado final **não pode ter** `<<<<<<<`, `=======` nem `>>>>>>>`.
3. Se não souber qual é a certa, **pergunte para quem escreveu a outra versão**. Não apague o trabalho do colega no chute.
4. Salve o arquivo e rode o projeto para ver se ainda funciona.
5. Finalize:

```bash
git add .
git commit -m "merge: resolve conflito com a main"
git push
```

Quer desistir do merge e voltar como estava antes? `git merge --abort`

## 12. Desfazendo coisas

| Situação | Comando |
|---|---|
| Estraguei um arquivo e quero voltar para a versão do último commit | `git restore caminho/do/arquivo.js` |
| Dei `git add` em algo que não queria | `git restore --staged caminho/do/arquivo.js` |
| Errei a mensagem do último commit (e **ainda não** dei push) | `git commit --amend -m "mensagem certa"` |
| Esqueci um arquivo no último commit (e **ainda não** dei push) | `git add arquivo` e `git commit --amend --no-edit` |
| Preciso trocar de branch mas não quero commitar ainda | `git stash` (guarda), troca de branch, volta e `git stash pop` (devolve) |
| Quero desfazer um commit que **já foi** para o GitHub | `git revert <código-do-commit>` (cria um commit "ao contrário"; pegue o código no `git log --oneline`) |

> **Nunca** use `git push --force` na `main`. E evite `git reset --hard` se não tiver certeza: ele apaga alterações sem volta.

## 13. Erros comuns e como resolver

**`fatal: not a git repository`**
Você está fora da pasta do projeto. Use `cd` até a pasta `Comunitera` (onde existe a pasta `.git`).

**`Author identity unknown` / `Please tell me who you are`**
Faltou a configuração da [seção 2.2](#22-dizer-ao-git-quem-você-é).

**`! [rejected] ... (fetch first)` ou `(non-fast-forward)` no push**
Alguém enviou commits para a mesma branch antes de você. Traga primeiro e envie depois:
```bash
git pull
git push
```

**`fatal: The current branch feat/x has no upstream branch`**
É o primeiro push dessa branch. Use `git push -u origin feat/x` (o próprio erro mostra o comando certo para copiar).

**`error: Your local changes to the following files would be overwritten by checkout/merge`**
Você tem alterações sem commit. Faça commit (`git add .` + `git commit -m "..."`) ou guarde com `git stash`, e tente de novo.

**`remote: Permission to FelipeMFlor/Comunitera.git denied` / erro `403`**
Você não aceitou o convite de colaborador, ou o Git está logado em outra conta do GitHub. Aceite o convite. Se continuar: Windows → **Gerenciador de Credenciais** → **Credenciais do Windows** → remova as entradas `git:https://github.com` e tente o push de novo (ele pede login outra vez).

**O terminal ficou "preso" depois de um `git merge` ou `git commit`**
O Git abriu um editor para você escrever a mensagem. Se for o VS Code, feche a aba que abriu. Se for o Vim (tela estranha no terminal), digite `Esc`, depois `:wq` e `Enter`.

**`git log` ou `git diff` ficou "preso" mostrando texto**
Aperte `q` para sair.

**Fiz commit direto na `main` sem querer (e ainda não dei push)**
Primeiro garanta que não sobrou nada fora de commit (`git status` limpo), porque o `reset --hard` apaga alterações não salvas:
```bash
git switch -c feat/minha-tarefa     # cria uma branch levando os commits junto
git switch main
git reset --hard origin/main        # volta a main local para igual à do GitHub
git switch feat/minha-tarefa        # continue trabalhando aqui
```

**Mandei a pasta `node_modules` (ou o `.env`) para o Git**
Coloque no `.gitignore` e tire do Git (os arquivos continuam no seu computador):
```bash
git rm -r --cached node_modules
git commit -m "chore: remove node_modules do repositório"
```
Se foi o `.env` com senha/segredo: troque o segredo, porque ele ficou no histórico.

## 14. Regras do time

1. **Ninguém commita direto na `main`.** Tudo entra por Pull Request revisado por outra pessoa.
2. **Uma branch por tarefa**, criada a partir da `main` atualizada.
3. **Antes de começar a programar:** `git switch main` → `git pull` → volta para a sua branch → `git merge main`.
4. **Commits pequenos**, com mensagem no padrão `tipo: descrição`.
5. **PR pequeno:** se o PR mexe em 30 arquivos, ninguém revisa direito. Quebre em partes.
6. **Nunca vão para o GitHub:** `node_modules/`, `.env`, `.env.local`, `*.db`.
7. **Antes de abrir o PR:** rode o projeto e teste o que você fez.
8. **Nada de `git push --force` na `main`.**
9. Travou? **Pergunte no grupo** com o print do erro. Ficar uma hora preso sozinho não ensina mais do que 5 minutos de conversa.

> Se o repositório for público (ou a conta tiver GitHub Pro), dá para obrigar a regra 1 em **Settings → Branches → Add branch protection rule** (ou **Rules → Rulesets**) marcando "Require a pull request before merging" para a `main`.

## 15. Colinha de comandos

```bash
# ── uma vez só ─────────────────────────────────────────────
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
git clone https://github.com/FelipeMFlor/Comunitera.git

# ── começar uma tarefa ─────────────────────────────────────
git switch main
git pull
git switch -c feat/nome-da-tarefa

# ── salvar progresso ───────────────────────────────────────
git status
git add .
git commit -m "feat: descrição do que fez"

# ── enviar ─────────────────────────────────────────────────
git push -u origin feat/nome-da-tarefa   # primeira vez
git push                                 # próximas vezes

# ── atualizar a sua branch com a main ──────────────────────
git switch main
git pull
git switch feat/nome-da-tarefa
git merge main

# ── pegar a branch de um colega ────────────────────────────
git fetch
git switch feat/branch-do-colega

# ── olhar ──────────────────────────────────────────────────
git branch            # branches locais
git branch -a         # todas, inclusive do GitHub
git log --oneline     # histórico (q para sair)
git diff              # o que mudou e ainda não foi para commit

# ── depois do PR aceito ────────────────────────────────────
git switch main
git pull
git branch -d feat/nome-da-tarefa
```

Para aprender mais: o livro oficial e gratuito em português, [Pro Git](https://git-scm.com/book/pt-br/v2) (capítulos 1 a 3 já são suficientes), e o jogo visual [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR).
