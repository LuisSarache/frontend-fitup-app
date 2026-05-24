#!/bin/bash

# Script para atualizar dependências vulneráveis do FitUp

echo "🔍 Verificando vulnerabilidades..."
npm audit

echo ""
echo "🔧 Atualizando dependências vulneráveis..."

# Atualizar dependências específicas com vulnerabilidades conhecidas
npm install protobufjs@latest
npm install uuid@latest  
npm install ws@latest
npm install braces@latest
npm install postcss@latest

echo ""
echo "✅ Dependências atualizadas!"
echo ""
echo "🔍 Verificando novamente..."
npm audit

echo ""
echo "📝 Para corrigir automaticamente outras vulnerabilidades, execute:"
echo "   npm audit fix"
