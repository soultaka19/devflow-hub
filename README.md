# DevFlow Hub

> Plateforme de ressources téléchargeables pour développeurs débutants et intermédiaires.
> Templates, guides, prompts et checklists — prêts à l'emploi.

---

## Stack

| Couche | Technologie |
|---|---|
| Frontend + SSR | Next.js 14 (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Backend API | NestJS (TypeScript) |
| Base de données | PostgreSQL via Supabase |
| Auth | Supabase Auth (JWT) |
| Storage | Supabase Storage |
| ORM | Prisma |
| Infra | VPS + Docker Compose |

---

## Lancer le projet en local

### Prérequis

- Node.js 20+
- Docker & Docker Compose
- Un projet Supabase (URL + clés)

### 1. Variables d'environnement

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
# Remplir les valeurs Supabase dans chaque fichier
```

### 2. Frontend (port 3000)

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend (port 3001)

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```

### 4. Avec Docker

```bash
docker-compose up -d
```

---

## Structure

```
devflow-hub/
├── frontend/      # Next.js App Router
├── backend/       # NestJS + Prisma
├── content/       # Ressources Markdown locales
├── infra/         # Docker Compose
└── CLAUDE.md
```
"test claude integration" 
