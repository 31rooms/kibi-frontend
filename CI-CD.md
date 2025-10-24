# 🚀 CI/CD - Kibi Frontend

Guía completa del sistema de CI/CD con Vercel y GitHub Actions.

---

## 📊 Información del Proyecto

```bash
Usuario:            ops@kibi.mx
Proyecto:           kibi
URL Producción:     https://kibi-five.vercel.app
Node Version:       22.x
Organización:       kibis-projects-fe1ff294

# IDs (configurados en GitHub Secrets)
VERCEL_ORG_ID:      team_hI9VwjWCMHUeGgcPbaWfwTfp
VERCEL_PROJECT_ID:  prj_yQLZxlAVGgO5IV5sxbQupkAx54Jd
VERCEL_TOKEN:       mMUbL81os9Cya4SjVS7M1vd2
```

---

## ✅ Configuración Completada

### GitHub Secrets ✓

Los siguientes secrets ya están configurados en:
`https://github.com/31rooms/kibi-frontend/settings/secrets/actions`

- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

### GitHub Actions Workflows ✓

- `.github/workflows/ci.yml` - Validación (lint, type-check, build, security)
- `.github/workflows/vercel-production.yml` - Deploy automático a producción
- `.github/workflows/vercel-preview.yml` - Preview deployments para PRs

### Configuración Vercel ✓

- `vercel.json` - Build config, security headers, funciones
- `.vercelignore` - Exclusiones de deployment

---

## 🔄 Flujo de Trabajo

### Deploy a Producción

```bash
# 1. Hacer cambios en código
git checkout main
# ... editar archivos ...

# 2. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 3. Automáticamente se ejecuta:
# ✓ GitHub Actions CI (lint, type-check, build)
# ✓ GitHub Actions Deploy (vercel deploy --prod)
# ✓ Vercel deployment
# ✓ App actualizada en https://kibi-five.vercel.app
```

### Preview Deployment (Pull Requests)

```bash
# 1. Crear feature branch
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios
# ... editar archivos ...

# 3. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub
# → GitHub Actions valida código
# → Vercel crea preview deployment
# → Bot comenta URL de preview en el PR
# → URL temporal: https://kibi-git-feature-*.vercel.app

# 5. Revisar, aprobar y mergear PR
# → Deploy automático a producción
```

---

## 🔐 Variables de Entorno

### Configurar en Vercel

**IMPORTANTE:** Configura estas variables antes del primer deployment.

#### 1. NEXT_PUBLIC_API_URL ✅ CONFIGURADA

URL del backend API:

```bash
# Via CLI (ya configurado)
vercel env add NEXT_PUBLIC_API_URL production
# Valor: http://ec2-18-118-194-177.us-east-2.compute.amazonaws.com

# Via Dashboard
https://vercel.com/kibis-projects-fe1ff294/kibi/settings/environment-variables
```

**Valores configurados:**
- Production: `http://ec2-18-118-194-177.us-east-2.compute.amazonaws.com` ✅
- Preview: `http://ec2-18-118-194-177.us-east-2.compute.amazonaws.com` ✅
- Development: `http://localhost:3000` ✅

#### 2. NEXTAUTH_SECRET

Clave secreta para autenticación:

```bash
# Generar secret seguro
openssl rand -base64 32

# Agregar a Vercel
vercel env add NEXTAUTH_SECRET production
# Pegar el valor generado
```

**Configurar en:**
- ✅ Production
- ✅ Preview
- ❌ Development (usar .env.local)

#### 3. NEXTAUTH_URL

URL de la aplicación:

```bash
vercel env add NEXTAUTH_URL production
# Valor: https://kibi-five.vercel.app
```

**Valores por ambiente:**
- Production: `https://kibi-five.vercel.app`
- Preview: (auto-generado por Vercel)
- Development: `http://localhost:3001`

### Desarrollo Local

Crear archivo `.env.local` (no commitear):

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3001

# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

---

## 🛠️ Comandos Útiles

### Vercel CLI

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Ver variables de entorno
vercel env ls

# Agregar variable
vercel env add VARIABLE_NAME production

# Descargar variables localmente
vercel env pull .env.local

# Ver deployments
vercel ls

# Ver logs de producción
vercel logs kibi-five.vercel.app

# Deploy manual (solo si es necesario)
vercel --prod
```

### Git Workflow

```bash
# Crear feature branch
git checkout -b feature/nombre-funcionalidad

# Commits semánticos
git commit -m "feat: añadir funcionalidad"
git commit -m "fix: corregir bug"
git commit -m "docs: actualizar documentación"
git commit -m "chore: actualizar dependencias"

# Push y crear PR
git push origin feature/nombre-funcionalidad

# Merge a main (después de aprobar PR)
git checkout main
git pull origin main
git merge feature/nombre-funcionalidad
git push origin main  # → Auto-deploy
```

---

## 🔍 Verificación y Monitoreo

### GitHub Actions

```
https://github.com/31rooms/kibi-frontend/actions
```

Verifica que los workflows pasen:
- ✅ CI (Continuous Integration)
- ✅ Deploy Production
- ✅ Deploy Preview (en PRs)

### Vercel Dashboard

```
https://vercel.com/kibis-projects-fe1ff294/kibi
```

Monitorea:
- Deployments recientes
- Build logs
- Runtime logs
- Analytics (si está habilitado)

### Producción

```
https://kibi-five.vercel.app
```

Verifica que la app esté funcionando correctamente.

---

## 🐛 Troubleshooting

### Build Falla en Vercel

**Problema:** Deployment falla en Vercel

**Solución:**
```bash
# 1. Probar build local
npm install
npm run build

# 2. Si falla, arreglar errores de TypeScript/ESLint
# 3. Si funciona local, verificar variables en Vercel
vercel env ls

# 4. Ver logs detallados
vercel logs <deployment-url>
```

### GitHub Actions Falla

**Problema:** Workflow falla en GitHub Actions

**Solución:**
```bash
# 1. Verificar secrets en GitHub
https://github.com/31rooms/kibi-frontend/settings/secrets/actions

# Debe tener:
# - VERCEL_TOKEN
# - VERCEL_ORG_ID
# - VERCEL_PROJECT_ID

# 2. Ver logs en GitHub Actions
https://github.com/31rooms/kibi-frontend/actions

# 3. Re-run workflow si es error temporal
```

### Variables No Se Inyectan

**Problema:** Variables de entorno no están disponibles en runtime

**Solución:**
```bash
# Variables del cliente DEBEN empezar con NEXT_PUBLIC_
# ✅ NEXT_PUBLIC_API_URL
# ❌ API_URL (no funcionará en el cliente)

# Verificar en Vercel
vercel env ls

# Variables de servidor no necesitan NEXT_PUBLIC_
# pero solo están disponibles en API routes/server components
```

### Preview Deployment No Se Crea

**Problema:** PR no genera preview deployment

**Solución:**
```bash
# 1. Verificar que GitHub Actions esté habilitado
# 2. Verificar que el PR sea hacia main o develop
# 3. Verificar secrets en GitHub
# 4. Re-run workflow manualmente
```

---

## 📋 Checklist Post-Configuración

Verifica que todo esté configurado correctamente:

### GitHub
- [x] Secrets agregados (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- [ ] Workflows funcionando (.github/workflows/*.yml)
- [ ] Test de deployment a producción exitoso
- [ ] Test de preview deployment exitoso

### Vercel
- [ ] Variables de entorno configuradas (NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
- [ ] Conexión con Git configurada (opcional)
- [ ] Dominio personalizado configurado (opcional)
- [ ] Analytics habilitado (opcional)

### Local
- [ ] Archivo .env.local creado (no commitear)
- [ ] Vercel CLI instalado y configurado
- [ ] Build local funciona correctamente

---

## 🎯 Próximos Pasos Opcionales

### Configuración Adicional

```bash
# 1. Dominio personalizado
# Vercel Dashboard → Domains → Add Domain

# 2. Vercel Analytics
# Vercel Dashboard → Analytics → Enable

# 3. Environment variables adicionales (si aplica)
vercel env add GOOGLE_CLIENT_ID production
vercel env add SMTP_HOST production
vercel env add SENTRY_DSN production
```

### Mejoras al Pipeline

- [ ] Agregar tests unitarios (Jest + React Testing Library)
- [ ] Implementar tests e2e (Playwright)
- [ ] Configurar Lighthouse CI para performance
- [ ] Agregar notificaciones (Slack/Discord)
- [ ] Crear ambiente de staging (rama develop)

---

## 📞 Recursos

### Dashboards

- **Vercel Project:** https://vercel.com/kibis-projects-fe1ff294/kibi
- **GitHub Actions:** https://github.com/31rooms/kibi-frontend/actions
- **GitHub Secrets:** https://github.com/31rooms/kibi-frontend/settings/secrets/actions
- **Production App:** https://kibi-five.vercel.app

### Documentación Oficial

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **GitHub Actions:** https://docs.github.com/actions
- **Vercel CLI:** https://vercel.com/docs/cli

### Archivos del Proyecto

- `vercel.json` - Configuración de Vercel
- `.vercelignore` - Exclusiones de deployment
- `.env.example` - Plantilla de variables de entorno
- `.github/workflows/` - GitHub Actions workflows

---

## ⚠️ Importante

### Seguridad

- ✅ **NUNCA** commitees archivos `.env` o `.env.local`
- ✅ **NUNCA** expongas `VERCEL_TOKEN` en código público
- ✅ **Rota secretos** periódicamente (cada 3-6 meses)
- ✅ **Usa .env.example** para documentar variables necesarias

### Deployment

- ✅ Push a `main` = Deploy automático a producción
- ✅ Pull Request = Preview deployment automático
- ✅ Variables se inyectan automáticamente en build time
- ✅ Vercel cachea builds para deployments más rápidos

---

**¡Sistema CI/CD listo y funcionando!** 🎉
