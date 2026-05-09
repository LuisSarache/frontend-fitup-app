# FitUp 💪

**Aplicativo mobile de treinos em casa** — React Native + Expo

Treinos personalizados por nível (Iniciante, Intermediário, Avançado), sistema de streak, conquistas e acompanhamento de progresso.

---

## 📱 Funcionalidades

- ✅ **Autenticação** — Login, cadastro e recuperação de senha
- ✅ **Onboarding** — Coleta de dados do usuário (nome, peso, altura, data de nascimento, sexo)
- ✅ **Seleção de nível** — Iniciante, Intermediário ou Avançado
- ✅ **Treinos personalizados** — 14 treinos diferentes (3 para Iniciante, 4 para Intermediário, 5 para Avançado)
- ✅ **Sistema de streak** — Sequência de dias consecutivos treinando
- ✅ **Conquistas** — 5 conquistas desbloqueáveis por streak (3, 7, 14, 30, 100 dias)
- ✅ **Histórico de treinos** — Visualização de todos os treinos completados
- ✅ **Perfil** — Edição de dados, cálculo de IMC, TMB e peso ideal
- ✅ **Notificações** — Lembretes diários de treino
- ✅ **Navegação por tabs** — Home, Progresso, Conquistas, Perfil
- ✅ **Modo offline** — Funciona sem internet (mock local de autenticação)

---

## 🛠️ Stack

| Tecnologia | Versão |
|---|---|
| React Native | 0.81.5 |
| Expo | ~54.0.33 |
| TypeScript | ~5.9.2 |
| React Navigation | ^7.2.2 |
| Axios | ^1.15.2 |
| AsyncStorage | 2.2.0 |
| Expo Haptics | ~15.0.8 |
| Expo Notifications | ~0.32.17 |
| Lucide React Native | ^1.14.0 |

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js 20+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go no celular (iOS/Android) ou emulador

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/frontend-fitup-app.git
cd frontend-fitup-app/FitUp-mobile

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env se necessário

# Inicie o servidor de desenvolvimento
npm start
```

### Rodando no dispositivo

1. Abra o Expo Go no celular
2. Escaneie o QR code que aparece no terminal
3. O app será carregado automaticamente

### Rodando no emulador

```bash
# Android
npm run android

# iOS (apenas macOS)
npm run ios
```

---

## 🌐 Deploy na Vercel (versão web)

O app pode rodar como PWA na web:

1. Conecte o repositório na [Vercel](https://vercel.com)
2. A Vercel detecta automaticamente o `vercel.json`
3. Deploy automático a cada push

Ou via CLI:
```bash
npm install -g vercel
vercel
```

> **Nota:** A versão web tem limitações (sem notificações push nativas, sem haptics). Para experiência completa, use o app mobile.

---

## 📂 Estrutura do projeto

```
FitUp-mobile/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── BackButton.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── RestTimerModal.tsx
│   │   ├── TabBar.tsx
│   │   └── WorkoutScreen.tsx
│   ├── context/           # Context API (estado global)
│   │   └── AppContext.tsx
│   ├── data/              # Dados estáticos (treinos)
│   │   └── workouts.ts
│   ├── hooks/             # Custom hooks
│   │   ├── useHaptics.ts
│   │   └── useRestTimer.ts
│   ├── navigation/        # Tipos de navegação
│   │   └── types.ts
│   ├── screens/           # Telas do app
│   │   ├── AchievementsScreen.tsx
│   │   ├── ChangeLevelScreen.tsx
│   │   ├── CompletionScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LevelSelectionScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── SplashScreen.tsx
│   │   └── WorkoutSelectionScreen.tsx
│   ├── services/          # Serviços externos
│   │   ├── analytics.ts
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── notifications.ts
│   ├── storage/           # AsyncStorage
│   │   └── storage.ts
│   ├── types/             # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/             # Funções utilitárias
│   │   ├── apiErrors.ts
│   │   ├── health.ts
│   │   ├── history.ts
│   │   ├── streak.ts
│   │   └── validation.ts
│   └── theme.ts           # Cores e fontes
├── App.tsx                # Componente raiz
├── index.ts               # Entry point
├── .env                   # Variáveis de ambiente
├── package.json
└── tsconfig.json
```

---

## 🔐 Autenticação

O app funciona em **modo mock** por padrão (sem backend). Para conectar ao backend real:

1. Configure o `.env`:
```
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_API_URL=https://sua-api.com
```

2. Implemente os endpoints conforme o [guia do backend](../BACKEND_GUIDE.md)

---

## 🎨 Design

- **Tema dark** com gradientes
- **Cores principais:**
  - Verde: `#22C55E` (ações primárias)
  - Background: `#0A0F1E`
  - Cards: `#111827`
  - Texto: `#FFFFFF` / `#9CA3AF`

- **Ícones:** Lucide React Native
- **Animações:** Expo Haptics + Animated API

---

## 📊 Dados dos treinos

Os treinos estão em `src/data/workouts.ts`:

- **3 treinos para Iniciante** (25 min cada)
  - Treino A: Peito & Tríceps
  - Treino B: Costas & Bíceps
  - Treino C: Pernas & Core

- **4 treinos para Intermediário** (30-35 min cada)
  - Treino A: Peito & Tríceps
  - Treino B: Costas & Bíceps
  - Treino C: Pernas & Core
  - Treino D: Full Body

- **5 treinos para Avançado** (30-45 min cada)
  - Treino A: Peito & Tríceps
  - Treino B: Costas & Bíceps
  - Treino C: Pernas & Core
  - Treino D: Full Body
  - Treino E: Mobilidade

---

## 🏆 Sistema de conquistas

| Conquista | Emoji | Streak necessário |
|---|---|---|
| Primeira Sequência | 🌱 | 3 dias |
| Uma Semana Forte | 🔥 | 7 dias |
| Duas Semanas | ⚡ | 14 dias |
| Um Mês Imparável | 🏆 | 30 dias |
| Centenário | 💎 | 100 dias |

---

## 🧪 Scripts disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run android    # Roda no emulador Android
npm run ios        # Roda no emulador iOS
npm run web        # Roda no navegador
npm run typecheck  # Verifica erros de TypeScript
npm run lint       # Roda o ESLint
npm run format     # Formata o código com Prettier
npm run doctor     # Diagnóstico do Expo
```

---

## 🐛 Troubleshooting

### Erro "Unable to resolve module"
```bash
npm install
npx expo start --clear
```

### Erro de permissão de notificações
As notificações só funcionam em dispositivos físicos. No emulador, o app continua funcionando normalmente sem notificações.

### Erro de build no Android
```bash
cd android
./gradlew clean
cd ..
npm run android
```

---

## 📝 Roadmap

- [ ] Integração com backend real
- [ ] OAuth (Google, Facebook)
- [ ] Vídeos dos exercícios
- [ ] Modo escuro/claro
- [ ] Compartilhamento de progresso
- [ ] Desafios entre amigos
- [ ] Integração com Apple Health / Google Fit
- [ ] Planos de treino personalizados por IA

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com 💚 por [Seu Nome](https://github.com/seu-usuario)

---

## 📚 Documentação adicional

- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
