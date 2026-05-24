# 🔧 Guia de Troubleshooting - FitUp

## ❌ Problema: App crashando com "apresentando falhas continuamente"

### Causas Possíveis:
1. Cache corrompido
2. Dependências desatualizadas
3. Erro em código JavaScript/TypeScript
4. Módulos nativos incompatíveis

---

## ✅ Soluções

### Solução 1: Limpar Cache (Mais Rápido)
```bash
# Limpar cache do Expo
npx expo start --clear

# OU usar o script automático
reset-and-start.bat
```

### Solução 2: Reinstalar Dependências
```bash
# Deletar node_modules e reinstalar
rd /s /q node_modules
del package-lock.json
npm install
```

### Solução 3: Limpar Cache do Dispositivo
**No Android:**
1. Abra Configurações
2. Apps → FitUp (ou Expo Go)
3. Armazenamento → Limpar cache
4. Limpar dados (se necessário)

### Solução 4: Verificar Logs de Erro
```bash
# Ver logs detalhados
npx expo start

# No terminal, pressione:
# - 'a' para abrir no Android
# - 'i' para abrir no iOS
# - 'w' para abrir no navegador
```

---

## 🐛 Mudanças Recentes que Podem Causar Problemas

### 1. HomeScreen.tsx
**Mudança:** Adicionado import do LinearGradient
**Risco:** Baixo
**Revertido:** ❌ Não (necessário)

### 2. analytics.ts
**Mudança:** Sanitização de logs
**Risco:** Baixo
**Revertido:** ❌ Não (melhoria de segurança)

### 3. App.tsx - NavigationBar
**Mudança:** Tentativa de usar expo-navigation-bar
**Risco:** Alto (módulo nativo)
**Revertido:** ✅ Sim

---

## 📱 Como Testar

### Opção 1: Expo Go (Recomendado para testes rápidos)
```bash
npx expo start --clear
```
- Escaneie o QR code
- **Limitação:** Não funciona com Firebase

### Opção 2: Build de Desenvolvimento
```bash
npx expo run:android
```
- **Requer:** Android Studio instalado
- **Vantagem:** Funciona com todos os módulos

### Opção 3: Web (Para testes de UI)
```bash
npm run web
```
- Abre no navegador
- **Limitação:** Sem notificações nativas

---

## 🔍 Verificar Erros Específicos

### Ver logs do Metro Bundler:
```bash
npx expo start --clear
```

### Ver logs do dispositivo Android:
```bash
# Se tiver Android Studio instalado
adb logcat | findstr "ReactNativeJS"
```

### Verificar erros de TypeScript:
```bash
npm run typecheck
```

---

## 🚨 Se Nada Funcionar

### Reset Completo:
```bash
# 1. Limpar tudo
rd /s /q node_modules .expo
del package-lock.json

# 2. Reinstalar
npm install

# 3. Iniciar limpo
npx expo start --clear --reset-cache
```

### Voltar para versão anterior:
```bash
git log --oneline
git checkout <commit-hash-anterior>
```

---

## 📊 Status Atual do Projeto

✅ TypeScript: Sem erros
✅ Dependências: Instaladas
✅ Estrutura: Correta
⚠️ NavigationBar: Removido temporariamente
⚠️ Firebase: Requer build nativo

---

## 💡 Dicas

1. **Sempre limpe o cache** antes de testar mudanças
2. **Use Expo Go** para desenvolvimento rápido
3. **Faça build nativo** apenas quando necessário
4. **Commit frequente** para poder reverter facilmente

---

## 📞 Próximos Passos

1. Execute: `reset-and-start.bat`
2. Escaneie o QR code no Expo Go
3. Se crashar, veja os logs no terminal
4. Reporte o erro específico para correção

---

**Última atualização:** ${new Date().toLocaleDateString('pt-BR')}
