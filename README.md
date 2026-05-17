<p align="center">
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/logo.png" width="220" />
</p>

# BCI - Beyond Compare Intelligence

<p align="start">
<b>
Plataforma mobile de inteligência competitiva desenvolvida para auxiliar equipes estratégicas na análise, comparação e pesquisa de veículos automotivos através de IA e APIs especializadas.
</b>
</p>

---

![Status](https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-0562D2?style=for-the-badge&labelColor=00142E)
![Version](https://img.shields.io/badge/VERSION-1.0.0-0562D2?style=for-the-badge&labelColor=00142E)
![Platform](https://img.shields.io/badge/PLATFORM-ANDROID%20%7C%20IOS-0562D2?style=for-the-badge&labelColor=00142E)

---

# Sobre o Projeto

O **BCI - Beyond Compare Intelligence** é uma aplicação mobile construída com React Native e Expo, focada em pesquisa automotiva inteligente.

A plataforma utiliza inteligência artificial para interpretar buscas, encontrar veículos compatíveis e consumir APIs automotivas externas para exibir informações técnicas, imagens reais e comparações detalhadas entre modelos.

O projeto foi desenvolvido com foco em:
- experiência visual moderna
- performance
- integração com IA
- pesquisa inteligente
- comparação estratégica de veículos

---

# Funcionalidades

-  Busca inteligente de informações técnicas com IA (Llama/Groq)
-  Pesquisa de veículos por nome 
-  Integração com Auto.dev Photos API
-  Comparação entre veículos
-  Sistema de salvos
-  Sistema de anotações com Markdown
-  Perfil do usuário
-  Login e cadastro

---

# Inteligência Artificial

O sistema utiliza IA para:

- interpretar pesquisas do usuário
- identificar veículos automaticamente
- converter buscas em VINs válidos
- encontrar veículos compatíveis
- alimentar serviços externos de imagens e dados automotivos

Fluxo da pesquisa:

```txt
Usuário → IA (Llama/Groq) → VIN → Auto.dev API → Imagens e Dados
```

---

# Preview

<p align="start">
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/login.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/cadastro.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/home.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/perfil0.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/perfil.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/redefinicao.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/pesquisa.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/saiba_mais.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/info.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/comparar.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/detalhes.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/notes.jpeg" width="200"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/salvos.jpeg" width="200"/>
</p>





---

# Tecnologias

## Frontend

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=F7DF1E&labelColor=000000)](https://www.google.com/search?q=javascript)

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=000000)](https://www.google.com/search?q=react+native)

[![Expo](https://img.shields.io/badge/Expo-ffffff?style=for-the-badge&logo=expo&logoColor=FFFFFF&labelColor=000000)](https://www.google.com/search?q=expo)

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=339933&labelColor=000000)](https://www.google.com/search?q=node+js)

---

## APIs & Serviços

### Ficha técnica
[![Groq](https://img.shields.io/badge/Groq-0562D2?style=for-the-badge&labelColor=000000)](https://groq.com)


### Imagens
[![Auto.dev](https://img.shields.io/badge/Auto.dev-0562D2?style=for-the-badge&labelColor=000000)](https://auto.dev)

---

## Design

Conheça o design base da nossa aplicação!

[![Figma](https://img.shields.io/badge/Figma-8F3985?style=for-the-badge&logo=figma&logoColor=8F3985&labelColor=000000)](https://www.figma.com/design/IUr7lhd6lPTnnz91kwbpo9/Ford?node-id=0-1&t=v3MVyi2Z36XYTLXn-1)

---

# Estrutura do Projeto

```txt
app/
├── auth/
│   ├── login.js
│   └── register.js
│
├── screen/
│   ├── detail.js
│   ├── editProfile.js
│   ├── information.js
│   ├── notes.js
│   ├── password.js
│   ├── profile.js
│   └── saved.js
│
├── tab/
│   ├── _layout.js
│   ├── compare.js
│   ├── home.js
│   └── search.js
│
├── _layout.js
└── index.js

services/
├── autoDevApi.js
└── llamaApi.js

style/
└── theme.js

assets/
.env
app.json
package.json
README.md
```

---

# Como Rodar o Projeto

## Pré-requisitos

- Node.js
- npm ou yarn
- Expo CLI
- Git

---

## Instalação

```bash
git clone https://github.com/seu-usuario/seu-repo.git

cd seu-repo

npm install
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_GROQ_API_KEY=SUA_API_KEY
EXPO_PUBLIC_AUTO_DEV_API_KEY=SUA_API_KEY
```

---

## Execução

```bash
npx expo start
```

---

# Funcionalidades Visuais

## Home dinâmica
- rotação automática de veículos
- interface interativa
- menu flutuante

## Busca inteligente
- pesquisa por texto
- IA interpretando veículos
- imagens reais via API

## Comparação
- comparação entre modelos
- seleção dinâmica
- cards compactos

## Sistema de notas
- editor de anotações
- suporte a Markdown

---

# Roadmap

- [x] Design inicial no Figma
- [x] Implemntação do layout em React Native
- [x] Integração com o Llama via Groq para dados das Fichas técnicas
- [x] Integração com API Auto Dev para Imagens dos modelos
- [x] Sistema de comparação e análise da IA entre dois modelos
- [x] Sistema de anotações e salvos
- [ ] Adicionar informações de ambos os carros na comparação
- [ ] Integração com IA própria
- [ ] Implementação de referências, notificações, verificação e biometria

---

# Segurança

- Uso de variáveis de ambiente
- Chaves protegidas via `.env`
- `.env` ignorado no Git
- Consumo seguro de APIs externas

---

# Como Contribuir

1. Faça um Fork do projeto
2. Crie uma branch

```bash
git checkout -b feature/minha-feature
```

3. Commit suas alterações

```bash
git commit -m "feat: minha feature"
```

4. Push para o repositório

```bash
git push origin feature/minha-feature
```

5. Abra um Pull Request

---

<h2>
  Conheça o time
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/logo-lumen.png" width="200" align="center" />
</h2>

| Foto | Nome | RM |
|------|------|----|
| <img src="https://avatars.githubusercontent.com/AnaTorresLoureiro" width="80"> | [Ana Laura Torres Loureiro](https://github.com/AnaTorresLoureiro) | RM 554375 |
| <img src="https://avatars.githubusercontent.com/MuriloCngp" width="80"> | [Murilo Cordeiro Ferreira](https://github.com/MuriloCngp) | RM 556727 |
| <img src="https://avatars.githubusercontent.com/Geronimo-augusto" width="80"> | [Geronimo Augusto Nascimento Santos](https://github.com/Geronimo-augusto) | RM 557170 |
| <img src="https://avatars.githubusercontent.com/iannyrfs" width="80"> | [Ianny Raquel Ferreira De Souza](https://github.com/iannyrfs) | RM 559096 |
| <img src="https://avatars.githubusercontent.com/Vitorr-AF" width="80"> | [Vitor Augusto França de Oliveira](https://github.com/Vitorr-AF) | RM 555469 |

---

<p align="center">
  Built Beyond Comparison 🚘
</p>
