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

# VÍDEO DE DEMONSTRAÇÃO

<a href="https://youtu.be/s_j47s3FI5M?si=72B6TcQZrCsCgGW6">
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/C%C3%B3pia%20de%20FORD%20-%20Apresenta%C3%A7%C3%A3o.jpg" alt="Watch Demo" width="450"/>
</a>

---

![Status](https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-0562D2?style=for-the-badge&labelColor=00142E)
![Version](https://img.shields.io/badge/VERSION-0.0.1-0562D2?style=for-the-badge&labelColor=00142E)
![Platform](https://img.shields.io/badge/PLATFORM-ANDROID%20%7C%20IOS-0562D2?style=for-the-badge&labelColor=00142E)

---

# Sobre o Desafio escolhido

Optamos pelo **Desafio 01 – Inteligência Competitiva Automotiva** por enxergarmos nele uma oportunidade de resolver um problema real e estratégico dentro do mercado automotivo: a análise comparativa entre veículos concorrentes de forma rápida, organizada e confiável.

Atualmente, compreender como os concorrentes se posicionam em relação a preço, motorização, tecnologia e pacotes de equipamentos exige consulta a múltiplas fontes e análise manual de um grande volume de informações. Esse processo pode ser demorado, descentralizado e pouco padronizado.

Pensando nisso, desenvolvemos o **BCI – Beyond Compare Intelligence**, uma plataforma criada para centralizar essas informações e transformar dados técnicos em inteligência competitiva aplicada ao negócio.

Nossa solução permite:

- pesquisar veículos por texto ou VIN;
- visualizar fichas técnicas padronizadas;
- comparar modelos lado a lado;
- identificar diferenciais competitivos entre veículos Ford e concorrentes;
- apoiar análises mais estratégicas para marketing e posicionamento de produto.

A escolha por esse desafio aconteceu porque ele conecta diretamente **tecnologia, dados e estratégia de negócio**, permitindo desenvolver uma solução com aplicação prática e alto valor para a Ford.

Com o BCI, buscamos tornar o processo de análise competitiva mais eficiente, intuitivo e acessível, ajudando equipes internas a tomarem decisões com mais agilidade e embasamento.

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

## Autenticação e Sessão
- Cadastro de usuários
- Login e logout
- Sessão persistente com AsyncStorage
- Edição de perfil
- Alteração de foto de perfil
- Redefinição de senha
- Proteção automática de rotas para usuários não autenticados

### Arquivos relacionados
```txt
_layout.js
login.js
register.js
editProfile.js
password.js
```

---

## Busca Inteligente de Veículos
- Pesquisa por nome do veículo
- Pesquisa direta por VIN
- Interpretação inteligente de busca via IA
- Extração automática de:
  - marca
  - modelo
  - versão
  - ano
- Fallback automático para fichas técnicas

### Arquivos relacionados
```txt
search.js
llamaApi.js
```

---

## Integração com Auto.dev API
- Busca de imagens reais dos veículos
- Busca de dados automotivos por VIN
- Resolução automática de galerias
- Integração com listings automotivos

### Arquivos relacionados
```txt
autoDevApi.js
```



---

## Ficha Técnica Inteligente
- Geração automática de ficha técnica via IA
- Estruturação inteligente de dados automotivos
- Informações detalhadas:
  - motor
  - potência
  - torque
  - consumo
  - segurança
  - tecnologia
  - conforto
  - performance

### Arquivos relacionados
```txt
llamaApi.js
information.js
```

---

## Tela de Informações do Veículo
- Galeria de imagens
- Informações técnicas
- Descrição curta e longa
- Favoritar veículo
- Adicionar aos últimos vistos
- Botão de comparação

### Arquivos relacionados
```txt
information.js
```

---

## Comparação Inteligente de Veículos
- Seleção de dois modelos
- Pesquisa dinâmica de veículos
- Comparação detalhada
- Resumo inteligente gerado por IA
- Destaque automático de vantagens
- Salvamento de comparações

### Arquivos relacionados
```txt
compare.js
detail.js
```

---

## Favoritos e Salvos
- Salvar modelos favoritos
- Salvar comparações
- Persistência local
- Gerenciamento de itens salvos

### Arquivos relacionados
```txt
_layout.js
saved.js
```

---

## Últimos Veículos Visualizados
- Histórico automático de pesquisas
- Limite de até 10 veículos
- Exibição rápida de recentes

### Arquivos relacionados
```txt
_layout.js
search.js
```

---

## Sistema de Anotações em Markdown
- Criar notas
- Pré-visualização em Markdown
- Exclusão de notas
- Persistência local temporária

### Arquivos relacionados
```txt
notes.js
```

---

## Navegação e Home
- Navegação por abas
- Tela inicial interativa
- Carrossel automático de destaque
- Ações rápidas:
  - perfil
  - salvos
  - anotações

### Arquivos relacionados
```txt
home.js
```

---

## UI/UX e Design System
- Fontes customizadas via Expo Fonts
- Sistema centralizado de cores
- Tokens visuais reutilizáveis
- Interface responsiva

### Arquivos relacionados
```txt
theme.js
```

---

## Integração com APIs Externas
- Integração com Groq/Llama
- Integração com Auto.dev
- Requisições HTTP assíncronas
- Tratamento de erros
- Parsing automático de JSON

### Arquivos relacionados
```txt
llamaApi.js
autoDevApi.js
```

---

# Inteligência Artificial

O sistema utiliza IA para:

- interpretar pesquisas do usuário
- identificar veículos automaticamente
- converter buscas em VINs válidos
- encontrar veículos compatíveis
- alimentar serviços externos de imagens e dados automotivos

Fluxo:

```txt
Usuário → Interface → IA (Llama/Groq) → VIN → Auto.dev API → Imagens e Dados
```

---

# Preview

<p align="start">
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/login.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/cadastro.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/home.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/perfil0.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/perfil.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/redefinicao.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/pesquisa.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/saiba_mais.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/info.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/comparar.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/detalhes.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/notes.jpeg" width="150"/>
  <img src="https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/preview1/salvos.jpeg" width="150"/>
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
## Stack Escolhida

### Plataforma

O projeto foi desenvolvido utilizando **JavaScript / Node.js**, escolha definida pela compatibilidade com toda a base já adotada pela equipe e pelo ecossistema utilizado no desenvolvimento.

A presença de arquivos como `package.json` e `index.js` reforça essa decisão, permitindo gerenciamento simples de dependências, scripts de execução e integração com bibliotecas externas.

---

### Frontend Mobile e Navegação

Para a camada mobile, utilizamos **React Native com Expo**, com estrutura de rotas baseada em arquivos através do **Expo Router**.

A organização por pasta `app/` com `_layout.js` permite:

- navegação estruturada entre telas;
- separação clara entre fluxos autenticados e não autenticados;
- melhor manutenção da aplicação;
- escalabilidade para inclusão de novas rotas no futuro.

Essa abordagem torna o roteamento previsível, modular e alinhado às boas práticas modernas do ecossistema Expo.

---

### Justificativa da Escolha

A escolha por uma stack totalmente baseada em JavaScript foi estratégica, principalmente por:

- reduzir fricção entre frontend e integrações externas;
- acelerar o desenvolvimento com uma linguagem única em toda a aplicação;
- facilitar manutenção e onboarding do time;
- aproveitar o ecossistema consolidado de **React Native**, **Expo** e **Node.js**;
- permitir integração simples com APIs externas já utilizadas no projeto.

---

## Organização por Domínio

A aplicação foi estruturada separando responsabilidades por contexto e funcionalidade.

### `app/`
Responsável pelas telas e roteamento da aplicação.

Contém divisões como:

- `auth/` → autenticação (login, cadastro, edição de perfil)
- `screen/` → telas funcionais do sistema
- `tabs/` → navegação principal da aplicação

Cada tela possui seu próprio arquivo, tornando o projeto mais organizado e fácil de manter.

---

### `services/`
Centraliza toda comunicação com APIs externas.

Principais integrações:

- `autoDevApi.js`
- `llamaApi.js`

Essa separação evita lógica de rede dentro das telas e melhora a reutilização de código.

---

### `assets/`
Armazena recursos estáticos como:

- imagens
- ícones
- logos
- arquivos visuais da interface

---

### `theme.js`
Arquivo responsável pela centralização do tema global da aplicação.

Define:

- cores
- tipografia
- tamanhos
- estilos reutilizáveis

Isso garante consistência visual em toda a interface.

---

### Arquivos de entrada

#### `index.js`
Responsável pelo bootstrap inicial da aplicação.

#### `app.json`
Contém configurações gerais do Expo como:

- nome do app
- slug
- versão
- splash screen
- configurações Android/iOS

---

# Integrações Realizadas

## Llama API (IA)

A integração com IA foi implementada através do arquivo `llamaApi.js`.

Responsabilidades:

- realizar chamadas HTTP para o serviço de IA;
- autenticação via chave de acesso;
- envio e formatação de payloads;
- tratamento da resposta recebida.

A IA é utilizada principalmente para:

- interpretar pesquisas em linguagem natural;
- extrair marca, modelo e versão;
- auxiliar na geração estruturada de fichas técnicas.

---

## AutoDev API

A integração com a AutoDev foi centralizada em `autoDevApi.js`.

Responsável por:

- consulta por VIN;
- busca de imagens dos veículos;
- obtenção de dados técnicos;
- normalização dos retornos recebidos pela API.

Essa integração alimenta diretamente as telas de detalhes e comparação de veículos.

---

## Configuração Mobile (Expo)

O `app.json` também concentra integrações relacionadas ao ambiente mobile, como:

- configuração de build Android e iOS;
- splash screen;
- identidade visual do app;
- compatibilidade com Expo Go para testes.

---

# Decisões de Arquitetura

## Single Responsibility Principle

Cada camada possui uma responsabilidade específica:

- **Telas:** renderização da interface
- **Services:** comunicação com APIs
- **Theme:** identidade visual
- **Contexts:** gerenciamento de estado global

Essa separação reduz acoplamento e facilita manutenção.

---

## Roteamento Baseado em Arquivos

A adoção do `Expo Router` com `_layout.js` oferece:

- estrutura previsível;
- escalabilidade;
- melhor organização entre fluxos de navegação.

---

## Theming Centralizado

Com `theme.js`, qualquer alteração visual global pode ser feita de forma centralizada, sem necessidade de editar múltiplas telas individualmente.

Isso melhora:

- padronização visual
- reaproveitamento de estilos
- produtividade do time

---

## Arquitetura Orientada a Serviços

Cada integração externa foi isolada em um arquivo específico dentro de `services`.

Essa abordagem facilita:

- manutenção
- testes unitários
- criação de mocks
- substituição futura de provedores externos sem impacto direto na UI

---

## Escalabilidade

A estrutura atual permite expansão futura com facilidade, incluindo:

- novos módulos e telas;
- novas integrações externas;
- cache local;
- gerenciamento global de estado com Context API ou Redux;
- persistência de dados local;
- melhorias futuras de performance.

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

> [!NOTE]
> O projeto utiliza o **Expo SDK 54** para garantir compatibilidade com o **Expo Go** em dispositivos móveis físicos durante os testes e desenvolvimento da aplicação.
>
> Isso permite executar o app diretamente no celular sem necessidade de builds nativas locais.

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

# Roadmap do Projeto

### Fase 1 — Planejamento e Design

- [x] Pesquisa inicial sobre o desafio de negócio proposto pela Ford
- [x] Definição do escopo funcional da solução
- [x] Estruturação da identidade visual do projeto
- [x] Criação dos wireframes e protótipos no Figma
- [x] Definição do fluxo de navegação entre telas
- [x] Definição da arquitetura inicial da aplicação

---

### Fase 2 — Desenvolvimento Frontend

- [x] Implementação do layout em React Native com Expo
- [x] Estruturação das rotas com Expo Router
- [x] Desenvolvimento da tela de login
- [x] Desenvolvimento da tela de cadastro
- [x] Desenvolvimento da tela de busca de veículos
- [x] Desenvolvimento da tela de detalhes do veículo
- [x] Desenvolvimento da tela de comparação
- [x] Desenvolvimento da área de perfil do usuário
- [x] Implementação da tela de salvos
- [x] Implementação do histórico de últimos vistos

---

### Fase 3 — Integrações e Dados

- [x] Integração com Llama via Groq para interpretação de busca em linguagem natural
- [x] Geração de fichas técnicas estruturadas com IA
- [x] Integração com Auto.dev API para carregamento de imagens dos veículos
- [x] Integração com consulta por VIN
- [x] Exibição de informações técnicas detalhadas por veículo

---

### Fase 4 — Inteligência Competitiva

- [x] Sistema de comparação entre dois modelos
- [x] Exibição lado a lado das especificações técnicas
- [x] Inclusão de dados completos de ambos os veículos na comparação
- [x] Estrutura para análise comparativa inteligente entre modelos
- [ ] Destaque automático dos diferenciais competitivos gerado por IA
- [ ] Geração automática de insights estratégicos para apoio ao marketing

---

### Fase 5 — Personalização e Experiência do Usuário

- [x] Sistema de favoritos / veículos salvos
- [x] Persistência local com AsyncStorage
- [x] Histórico de navegação por veículos visualizados
- [ ] Sistema de anotações por veículo
- [ ] Organização de comparações salvas por usuário

---

### Próximas Evoluções

- [ ] Integração com IA própria especializada em análise automotiva
- [ ] Sistema de referências das fontes consultadas
- [ ] Notificações inteligentes
- [ ] Alertas personalizados com base em veículos monitorados
- [ ] Sistema de autenticação com biometria
- [ ] Verificação avançada de usuário
- [ ] Dashboard com insights comparativos
- [ ] Painel com tendências de mercado e benchmarking competitivo

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
