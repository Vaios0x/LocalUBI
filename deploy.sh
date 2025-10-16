#!/bin/bash

# LocalUBI México - Deploy Script
# Este script automatiza el deploy completo del proyecto

set -e

echo "🚀 Iniciando deploy de LocalUBI México..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# 1. Instalar dependencias
print_status "Instalando dependencias..."
npm install

# 2. Compilar contratos
print_status "Compilando contratos inteligentes..."
npm run compile

# 3. Deploy a Celo Testnet (Alfajores)
print_status "Desplegando contratos a Celo Alfajores..."
npm run deploy:testnet

# 4. Verificar contratos
print_status "Verificando contratos..."
npm run verify

# 5. Configurar base de datos
print_status "Configurando base de datos..."
npx prisma generate
npx prisma db push

# 6. Build del frontend
print_status "Construyendo aplicación frontend..."
npm run build

# 7. Deploy a Vercel
print_status "Desplegando a Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    print_warning "Vercel CLI no encontrado. Instala con: npm i -g vercel"
    print_status "Deploy manual requerido en https://vercel.com"
fi

print_success "✅ Deploy completado exitosamente!"
print_status "📱 App: https://localubi.mx"
print_status "📄 Contratos: Revisa deployment-celo.json"
print_status "🔗 CeloScan: https://alfajores.celoscan.io"

echo ""
echo "🎉 ¡LocalUBI México está listo para ganar el hackathon!"
echo "💡 Recuerda:"
echo "   - Configurar variables de entorno en Vercel"
echo "   - Actualizar NEXT_PUBLIC_TANDA_ADDRESS"
echo "   - Crear video demo (3 min)"
echo "   - Preparar pitch deck (10 slides)"
