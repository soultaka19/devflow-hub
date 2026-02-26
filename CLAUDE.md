# CLAUDE.md — DevFlow Hub

> Plateforme de ressources pour développeurs débutants et intermédiaires.
> Builder : Souleymane — Solo, 20h/semaine max.

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Frontend + SSR | Next.js (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Backend API | NestJS(TypeScript) |
| Base de données | PostgreSQL via Supabase |
| Auth | Supabase Auth (JWT) |
| Storage | Supabase Storage (buckets) |
| ORM | Prisma |
| Infra | VPS + Docker Compose |

---

## Structure Monorepo

```
devflow-hub/
├── frontend/                   # Next.js App Router
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx        # Home
│   │   │   ├── library/page.tsx
│   │   │   └── resources/[slug]/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── (dashboard)/
│   │       └── dashboard/page.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui
│   │   ├── resource-card.tsx
│   │   └── resource-viewer.tsx # rendu markdown
│   ├── lib/
│   │   ├── supabase/client.ts
│   │   └── supabase/server.ts
│   └── middleware.ts
│
├── backend/                    # NestJS
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── resources/
│   │   ├── auth/
│   │   └── prisma/
│   └── prisma/schema.prisma
│
├── content/resources/          # fichiers .md locaux
├── infra/docker-compose.yml
└── CLAUDE.md
```

---

## Modèle Prisma

```prisma
model Resource {
  id            String       @id @default(cuid())
  slug          String       @unique
  title         String
  description   String
  type          ResourceType
  stack         String[]
  level         Level
  isPremium     Boolean      @default(false)
  isPublished   Boolean      @default(false)
  storagePath   String
  downloadCount Int          @default(0)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  downloads     Download[]
}

model Download {
  id           String   @id @default(cuid())
  resourceId   String
  resource     Resource @relation(fields: [resourceId], references: [id])
  userId       String?
  downloadedAt DateTime @default(now())
}

enum ResourceType { template  prompt  guide  checklist }
enum Level        { debutant  intermediaire  avance }
```

---

## Règles Métier Critiques

- Fichiers .md dans Supabase Storage bucket `resources`
- DB = métadonnées uniquement + storagePath
- NestJS lit le .md depuis Storage → retourne contenu brut
- Next.js rend le markdown avec react-markdown
- Téléchargement = URL signée Supabase (expire 60s)
- Admin = metadata Supabase `{ is_admin: true }`

---

## Variables d'Environnement

```bash
# frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:3001

# backend/.env
DATABASE_URL=postgresql://...
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

---

## Priorités MVP (ordre strict)

```
1.  Setup monorepo + Git + GitHub
2.  Supabase : projet, bucket Storage, variables env
3.  NestJS : init + Prisma + première migration
4.  Endpoints : GET /resources + GET /resources/:slug/content
5.  Next.js : init + shadcn/ui + Tailwind configurés
6.  Pages : bibliothèque + fiche avec rendu markdown
7.  Auth Supabase : login / register / middleware
8.  Téléchargement via URL signée
9.  Interface admin : publier une ressource
10. Docker Compose final
```

---

## Règles de Code

- TypeScript strict, pas de `any`
- App Router uniquement — jamais Pages Router
- Server Components par défaut — `'use client'` si interaction UI seulement
- shadcn/ui — ne pas réinventer les composants existants
- NestJS : DTOs validés avec class-validator
- Prisma : toujours `prisma migrate dev` — jamais `prisma db push` en prod
- Avancer étape par étape — pas de génération en bloc

---

## Ce que Claude NE doit PAS faire

- Stocker le markdown en base de données
- Utiliser le Pages Router
- Créer Server Actions pour les mutations (NestJS gère l'API)
- Proposer Zustand/Redux en MVP
- Proposer Nx ou Turborepo
- Générer tout le projet d'un coup
- Utiliser `prisma db push` en prod

---

## Commandes

```bash
# Frontend
cd frontend && npm run dev              # port 3000
npx shadcn@latest add [component]

# Backend
cd backend && npm run start:dev         # port 3001
npx prisma migrate dev --name "init"
npx prisma studio

# Docker
docker-compose up -d
```

---

## Conventions

- Fichiers : kebab-case (`resource-card.tsx`)
- Composants : PascalCase (`ResourceCard`)
- Endpoints : `/api/v1/resources`, `/api/v1/resources/:slug/content`
- Markdown : kebab-case (`claude-code-guide-microsaas.md`)
- Branches : `feature/`, `fix/`, `chore/` depuis `develop`

---

## Module Organisation (Builder Dashboard)

> Usage double : outil perso pour toi + feature premium pour les membres.

### Pages

```
/dashboard/
├── overview/           # Vue globale : projets actifs, ressources publiées, stats
├── projects/           # Liste de tes projets
│   └── [id]/          # Fiche projet détaillée
├── resources/new/      # Créer une nouvelle ressource téléchargeable
└── distribute/         # Checklist de distribution (LinkedIn, etc.)
```

### Modèle Prisma — Module Organisation

```prisma
model Project {
  id            String        @id @default(cuid())
  userId        String        # Supabase Auth user ID
  name          String
  description   String?
  stack         String[]
  status        ProjectStatus
  repoUrl       String?
  liveUrl       String?
  revenue       Float         @default(0)   # revenu généré (MRR)
  hoursSpent    Int           @default(0)
  isPublic      Boolean       @default(false) # visible sur /projects public
  docs          ProjectDoc[]
  todos         Todo[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model ProjectDoc {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  title     String
  content   String   # markdown stocké en DB pour les docs perso (pas public)
  section   DocSection
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id          String      @id @default(cuid())
  projectId   String?
  project     Project?    @relation(fields: [projectId], references: [id])
  userId      String
  title       String
  description String?
  status      TodoStatus
  priority    Priority
  dueDate     DateTime?
  createdAt   DateTime    @default(now())
}

enum ProjectStatus { idea  in_progress  launched  paused  archived }
enum DocSection    { architecture  decisions  todo  retro  notes }
enum TodoStatus    { backlog  in_progress  done }
enum Priority      { low  medium  high }
```

### Endpoints NestJS — Module Organisation

```
# Projets
GET    /api/v1/dashboard/projects              # mes projets
POST   /api/v1/dashboard/projects              # créer un projet
GET    /api/v1/dashboard/projects/:id          # détail projet
PATCH  /api/v1/dashboard/projects/:id          # modifier
DELETE /api/v1/dashboard/projects/:id          # supprimer

# Documentation projet
GET    /api/v1/dashboard/projects/:id/docs     # docs du projet
POST   /api/v1/dashboard/projects/:id/docs     # créer une doc
PATCH  /api/v1/dashboard/projects/:id/docs/:docId

# Todos
GET    /api/v1/dashboard/todos                 # tous mes todos
POST   /api/v1/dashboard/todos                 # créer
PATCH  /api/v1/dashboard/todos/:id             # update statut/priorité

# Stats overview
GET    /api/v1/dashboard/stats                 # projets actifs, ressources publiées, downloads total
```

> Toutes ces routes sont protégées par AuthGuard — userId extrait du JWT Supabase.

### Règles Métier Organisation

- Le contenu des `ProjectDoc` est en markdown stocké **en base de données** (usage privé uniquement)
- Un projet avec `isPublic: true` apparaît sur la page `/projects` publique
- Les todos sans `projectId` sont des todos globaux (non liés à un projet)
- Le dashboard est accessible uniquement aux utilisateurs connectés
- Pas de partage de docs entre users en MVP

### Ce que Claude NE doit PAS faire (module organisation)

- Ajouter un éditeur markdown WYSIWYG complexe (textarea suffit en MVP)
- Créer un système de tags ou labels élaboré
- Proposer du drag-and-drop pour les todos
- Synchroniser avec GitHub API en MVP
