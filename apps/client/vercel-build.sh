#!/bin/bash
echo "Current directory: $(pwd)"
echo "Listing directory contents:"
ls -la

# Instalar pnpm globalmente
npm install -g pnpm

# Instalar dependências na raiz
pnpm install

# Navegar para o diretório do cliente e fazer o build
cd apps/client
pnpm build
