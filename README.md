# CorreJa

> *Seu próximo passo começa agora.*

O **CorreJa** é um aplicativo mobile e web para corrida que vai **muito além de apenas registrar quilômetros**. Ele atua como um guia inteligente e inclusivo que ensina o corredor a dosar a intensidade de cada treino por meio da percepção corporal e do teste da fala, organizando a constância e acompanhando a evolução desde o primeiro trote até provas de 5 km, 10 km e meia maratona.

---

## 🔥 Introdução

Aplicativos tradicionais como Strava focam em estatísticas, rotas e ritmo bruto, muitas vezes intimidando quem está começando ou levando corredores iniciantes ao sobretreino e lesões por correrem rápido demais nos dias leves.

O **CorreJa** preenche essa lacuna com os seguintes objetivos e diferenciais:

* **Educação por Zonas de Treino (Z1 a Z5):** Ensinar a importância de cada intensidade sem exigir smartwatches caros ou sensores de frequência cardíaca no início, usando a percepção de esforço (escala 1 a 10) e o **Teste da Fala** (ex: conseguir conversar em frases completas na Z2).
* **Constância & Hábito:** Visualização clara da consistência semanal por blocos de treino, estimulando disciplina e recuperação adequada em vez de apenas volume de quilômetros.
* **Planos Graduais Orientados:** Programas desenhados para cada nível (Comece do Zero, Primeiros 5 km, Evolução para 10 km e Meia Maratona), com propósitos explicados para cada sessão.
* **Experiência Multiplataforma:** Interface mobile-first desenvolvida em Angular e Ionic, preparada para publicação nativa no Android e iOS via Capacitor.
* **Modo Demonstração (Guest Mode):** Permite explorar os treinos, metodologias e guia de zonas sem a obrigatoriedade imediata de cadastro.

---

### ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina (Windows, macOS ou Linux):

* **Node.js** (versão 20.x LTS ou superior): [nodejs.org](https://nodejs.org/)
* **npm** (geralmente instalado junto com o Node.js — versão 10.x+)
* **Git**: [git-scm.com](https://git-scm.com/)
* **Navegador Web** (Google Chrome, Edge ou Brave recomendados para simulação mobile)
* **Ionic CLI** instalado globalmente:

```bash
npm install -g @ionic/cli
```

---

### 🔨 Guia de Instalação

Siga o passo a passo abaixo para clonar, instalar dependências e rodar o projeto em ambiente de desenvolvimento local:

#### 1. Clonar o repositório
```bash
git clone https://github.com/SEU-USUARIO/correja.git
cd correja
```

#### 2. Instalar as dependências do projeto
```bash
npm install
```

#### 3. Executar o servidor de desenvolvimento
```bash
npx ionic serve
```

O projeto será compilado automaticamente e abrirá no seu navegador no endereço:
```
http://localhost:8100/
```

#### 4. Dica de Visualização (Simulador Mobile)
Para visualizar a interface no formato mobile exato com as safe areas do celular:
1. No navegador, pressione `F12` (Ferramentas do Desenvolvedor).
2. Pressione `Ctrl + Shift + M` (no Windows) ou `Cmd + Shift + M` (no macOS) para alternar a emulação de dispositivos.
3. Selecione um aparelho como **iPhone 14 Pro** ou **Pixel 7**.

---

## 📦 Tecnologias Usadas

* **[Angular](https://angular.dev/):** Framework web moderno utilizando componentes *Standalone*, reatividade com *Signals* e tipagem estrita com TypeScript.
* **[Ionic Framework](https://ionicframework.com/):** Biblioteca de componentes de interface móvel e design system otimizado para iOS e Android.
* **[Capacitor](https://capacitorjs.com/):** Camada de integração nativa que prepara a aplicação para empacotamento em APK (Android) e IPA (iOS).
* **[Ionicons](https://ionic.io/ionicons):** Pacote de ícones esportivos e de navegação.
* **[SCSS / CSS3](https://sass-lang.com/):** Estilização mobile-first com variáveis de cores dedicadas para as Zonas de Treino (Z1 a Z5), efeitos de *frosted glass* e suporte a *safe areas* (`env(safe-area-inset-top)`).
* **[TypeScript](https://www.typescriptlang.org/):** Tipagem forte e segura com verificação de tipos estritos (`@typescript-eslint/consistent-type-imports`).
* **[ESLint](https://eslint.org/):** Padronização e qualidade de código com regras rigorosas de ordenação de módulos.
