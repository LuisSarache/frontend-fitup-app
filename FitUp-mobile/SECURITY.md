# Guia de Segurança - FitUp

## 🔐 Credenciais e Secrets

### Arquivos Sensíveis

Os seguintes arquivos contêm credenciais e **NÃO devem ser commitados**:

- `google-services.json` (Android)
- `GoogleService-Info.plist` (iOS)
- `.env` (variáveis de ambiente)

Estes arquivos já estão no `.gitignore`.

### Configuração do Google Services

1. **Android**: Baixe `google-services.json` do Firebase Console e coloque em:
   - `android/app/google-services.json`

2. **iOS**: Baixe `GoogleService-Info.plist` do Firebase Console e coloque em:
   - Raiz do projeto: `GoogleService-Info.plist`

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Configure as variáveis conforme necessário.

## 🛡️ Boas Práticas

### Storage Keys

As chaves do AsyncStorage em `src/storage/storage.ts` usam prefixo `@fitup:` para evitar conflitos. Estas chaves são seguras e não contêm credenciais hardcoded.

### Log Injection

O código foi protegido contra log injection:
- Sanitização de mensagens de erro em `api.ts`
- Sanitização de eventos de analytics em `analytics.ts`
- Remoção de caracteres `\r` e `\n` antes de logar

### Dependências

Execute regularmente:

```bash
npm audit
npm audit fix
```

Para atualizar dependências vulneráveis.

## 🚨 Vulnerabilidades Conhecidas

### Dependências com Vulnerabilidades

Atualize as seguintes dependências:

```bash
npm install protobufjs@latest
npm install uuid@latest
npm install ws@latest
```

## 📝 Checklist de Segurança

- [ ] Arquivos `google-services.json` e `GoogleService-Info.plist` no `.gitignore`
- [ ] Arquivo `.env` no `.gitignore`
- [ ] Dependências atualizadas (`npm audit`)
- [ ] Tokens de autenticação armazenados apenas no AsyncStorage
- [ ] Logs sanitizados (sem `\r\n`)
- [ ] API keys não expostas no código-fonte

## 🔗 Recursos

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [React Native Security](https://reactnative.dev/docs/security)
- [Expo Security](https://docs.expo.dev/guides/security/)
