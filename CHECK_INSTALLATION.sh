#!/bin/bash

echo "🔍 Verificando instalación de Kibi Frontend..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check files function
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1/"
    return 0
  else
    echo -e "${RED}✗${NC} $1/"
    return 1
  fi
}

total_files=0
found_files=0

echo "📁 Verificando estructura de directorios..."
echo ""

# Check API directories
dirs=(
  "src/features/daily-test/api"
  "src/features/mock-exams/api"
  "src/features/progress/api"
  "src/features/review/api"
  "src/features/achievements/api"
  "src/shared/api"
)

for dir in "${dirs[@]}"; do
  total_files=$((total_files + 1))
  if check_dir "$dir"; then
    found_files=$((found_files + 1))
  fi
done

echo ""
echo "📄 Verificando archivos de API..."
echo ""

# Check API files
files=(
  "src/features/daily-test/api/types.ts"
  "src/features/daily-test/api/dailyTestAPI.ts"
  "src/features/mock-exams/api/types.ts"
  "src/features/mock-exams/api/mockExamsAPI.ts"
  "src/features/progress/api/types.ts"
  "src/features/progress/api/progressAPI.ts"
  "src/features/review/api/types.ts"
  "src/features/review/api/reviewAPI.ts"
  "src/features/achievements/api/types.ts"
  "src/features/achievements/api/achievementsAPI.ts"
  "src/shared/api/apiClient.ts"
)

for file in "${files[@]}"; do
  total_files=$((total_files + 1))
  if check_file "$file"; then
    found_files=$((found_files + 1))
  fi
done

echo ""
echo "🎨 Verificando componentes UI..."
echo ""

# Check UI components
ui_components=(
  "src/shared/ui/ProgressCard.tsx"
  "src/shared/ui/StreakDisplay.tsx"
  "src/shared/ui/AchievementBadge.tsx"
  "src/shared/ui/SubjectEffectiveness.tsx"
  "src/shared/ui/ProjectedScore.tsx"
  "src/shared/ui/TrendIndicator.tsx"
  "src/shared/ui/ReviewCard.tsx"
  "src/shared/ui/TestCard.tsx"
)

for component in "${ui_components[@]}"; do
  total_files=$((total_files + 1))
  if check_file "$component"; then
    found_files=$((found_files + 1))
  fi
done

echo ""
echo "📱 Verificando páginas..."
echo ""

# Check pages
pages=(
  "app/daily-test/page.tsx"
  "app/mock-exams/page.tsx"
  "app/reviews/page.tsx"
  "app/achievements/page.tsx"
  "app/progress/page.tsx"
)

for page in "${pages[@]}"; do
  total_files=$((total_files + 1))
  if check_file "$page"; then
    found_files=$((found_files + 1))
  fi
done

echo ""
echo "🔧 Verificando hooks..."
echo ""

# Check hooks
hooks=(
  "src/features/daily-test/hooks/useDailyTest.ts"
  "src/features/progress/hooks/useProgress.ts"
)

for hook in "${hooks[@]}"; do
  total_files=$((total_files + 1))
  if check_file "$hook"; then
    found_files=$((found_files + 1))
  fi
done

echo ""
echo "📚 Verificando documentación..."
echo ""

# Check documentation
docs=(
  "IMPLEMENTATION_GUIDE.md"
  "IMPLEMENTATION_SUMMARY.md"
  "USAGE_EXAMPLES.md"
)

for doc in "${docs[@]}"; do
  total_files=$((total_files + 1))
  if check_file "$doc"; then
    found_files=$((found_files + 1))
  fi
done

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
percentage=$((found_files * 100 / total_files))

if [ $percentage -eq 100 ]; then
  echo -e "${GREEN}✓ Instalación completa: $found_files/$total_files archivos encontrados${NC}"
elif [ $percentage -ge 80 ]; then
  echo -e "${YELLOW}⚠ Instalación casi completa: $found_files/$total_files archivos encontrados${NC}"
else
  echo -e "${RED}✗ Instalación incompleta: $found_files/$total_files archivos encontrados${NC}"
fi

echo ""
echo "📊 Progreso: $percentage%"
echo ""

if [ $percentage -eq 100 ]; then
  echo "🎉 Todo está listo para usar!"
  echo ""
  echo "Próximos pasos:"
  echo "  1. Configurar variables de entorno (.env.local)"
  echo "  2. Instalar dependencias: npm install"
  echo "  3. Iniciar servidor: npm run dev"
  echo "  4. Visitar: http://localhost:3000"
else
  echo "⚠️  Algunos archivos faltan. Verifica la instalación."
fi

echo ""
