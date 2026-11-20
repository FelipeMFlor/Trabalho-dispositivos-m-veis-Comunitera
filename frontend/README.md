# Comunitera — App (React Native + Expo)

App do Diretório Acadêmico TERA feito a partir das telas do Figma:
Página inicial, Calendário, Eventos, Vagas, Hub TERA (carteirinha digital) e o Painel do D.A. (só para o admin).

Feito com **Expo** e **Expo Router**, seguindo o passo a passo da aula. Os dados vêm do servidor em
[`../backend`](../backend), que precisa estar ligado.

## Como o projeto foi criado

```bash
npx create-expo-app@latest frontend          # projeto novo (template padrão)
cd frontend
npm run reset-project                        # limpa as telas de exemplo do template
npx expo install expo-router
npx expo install react-native-safe-area-context react-native-screens
npx expo install @expo/vector-icons
npx expo install @react-native-async-storage/async-storage   # guarda o login no celular
```

## Como rodar

Primeiro ligue o backend (veja o README dele). Depois, nesta pasta:

```bash
npm install        # só na primeira vez
npx expo start
```

| Tecla | O que faz |
|-------|-----------|
| QR code | Abre no celular pelo app **Expo Go** (precisa estar no mesmo Wi-Fi) |
| `a` | Abre no emulador Android (Android Studio) |
| `w` | Abre no navegador (modo web) |
| `r` | Recarrega o app |
| `j` | Abre o debugger |
| `m` | Mostra/esconde o menu do Expo |

### Endereço do servidor

No celular, `localhost` é o próprio celular, e não o computador. Por isso o [`src/api.ts`](src/api.ts)
pega o IP do computador pelo endereço do Expo (o mesmo do QR code) e chama `http://<IP>:3000/api`.

Se não funcionar (rede da faculdade, emulador, etc.), crie um arquivo `.env` nesta pasta com o endereço certo
e rode o `npx expo start` de novo:

```
EXPO_PUBLIC_API_URL=http://192.168.1.14:3000/api
```

## Estrutura

```
src/
├── app/                    telas (cada arquivo vira uma rota do Expo Router)
│   ├── _layout.tsx         raiz: ProvedorDeDados e escolha entre login e abas
│   ├── login.tsx           entrar / criar conta
│   └── (abas)/             telas com a barra de navegação embaixo
│       ├── _layout.tsx     a barra roxa com os ícones (Tabs)
│       ├── index.tsx       Página inicial
│       ├── calendario.tsx
│       ├── eventos.tsx
│       ├── vagas.tsx
│       ├── hub.tsx         Hub TERA (carteirinha + sair)
│       └── admin.tsx       Painel do D.A. (só o admin vê)
├── components/             Botao, Campo, Opcoes, JanelaModal, Tela, CartaoEvento, ItemAdmin
│   └── admin/              formulários do painel: eventos, vagas, avisos, aulas, calendário
├── contexto/               DadosContexto: login, dados do servidor e ações (useDados)
├── constants/              cores e estilos que se repetem
├── utils/                  AsyncStorage, datas, máscaras de data/hora e caixinhas de aviso
├── api.ts                  conversa com o servidor (fetch + token)
├── links.ts                links fixos (WhatsApp, Instagram, Ouvidoria)
└── types.ts                tipos (formatos dos dados)
```

## O que mudou em relação à versão web (Vite)

| Antes (site React) | Agora (React Native) |
|--------------------|----------------------|
| `<div>`, `<p>`, `<button>`, `<input>` | `<View>`, `<Text>`, `<Pressable>`, `<TextInput>` |
| CSS em `index.css` | `StyleSheet.create` em cada arquivo + `constants/` |
| `telaAtual` no `App.tsx` | Expo Router: um arquivo por tela em `src/app` |
| Props saindo do `App.tsx` | Contexto (`useDados()`) |
| `localStorage` | `AsyncStorage` |
| `<select>` e checkbox | `Opcoes` (botões) e `Switch` |
| `<input type="date">` | campo de texto com máscara `DD/MM/AAAA` |
| `alert()` / `confirm()` | `Alert.alert` (no modo web continua `alert`/`confirm`) |
| emojis na barra | ícones do `@expo/vector-icons` |
