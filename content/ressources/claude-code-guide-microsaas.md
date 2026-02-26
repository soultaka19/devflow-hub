# 🚀 Claude Code — Guide Pro Micro-SaaS B2B
> Indépendant du stack · Solo-builder · 20-30h/semaine · De l'idée au MVP

---

## 1️⃣ Setup Initial Professionnel

### Configuration Terminal (ergonomie)

```bash
# ~/.bashrc ou ~/.zshrc (Linux/Mac)
alias cc="claude"
alias ccc="claude --continue"       # reprendre session précédente
alias ccf="claude --fast"           # mode rapide pour tâches simples
alias ccd="claude --debug"          # debug verbeux
alias ccroot='claude --add-dir $(git rev-parse --show-toplevel)'

# Windows PowerShell — ajouter dans $PROFILE
Set-Alias cc claude
function ccc { claude --continue }
function ccf { claude --fast @args }
```

### Setup IDE (VS Code)

```json
// settings.json
{
  "editor.inlineSuggest.enabled": false,
  "claude-code.autoContext": true,
  "claude-code.defaultModel": "claude-sonnet-4-5"
}
```

---

### `/init` — Générer CLAUDE.md adapté à ton projet

```bash
# Depuis la racine du projet
claude /init
```

**Ce que `/init` fait :** analyse la structure du projet, génère un `CLAUDE.md` automatiquement injecté dans chaque session comme contexte persistant.

**Ensuite, compléter ou écraser le fichier généré avec ce template :**

---

### 📄 Template CLAUDE.md — Stack Agnostique

```markdown
# CLAUDE.md — [NomProjet]

## Identité Projet
- **Nom** : [NomProduit] — [description courte]
- **Cible** : [qui utilise ce produit]
- **Objectif revenu** : [X]€/mois MRR
- **Phase** : MVP / Growth / Scale
- **Solo-builder** : Oui — prioriser vitesse sur perfection

## Stack Technique
- **Frontend** : [ex: Next.js 14, Angular 17, Vue 3...]
- **Backend** : [ex: NestJS, FastAPI, Laravel, Rails...]
- **Base de données** : [ex: PostgreSQL, MySQL, MongoDB...]
- **Auth** : [ex: Supabase Auth, JWT maison, NextAuth...]
- **Storage** : [ex: Supabase Storage, S3, local...]
- **Infra** : [ex: VPS + Docker Compose, Vercel, Railway...]
- **Monorepo** : [structure des dossiers]
- **Branching** : Gitflow — main / develop / feature/xxx / hotfix/xxx

## Architecture [si applicable]
- [Pattern d'isolation multi-tenant si besoin]
- [Pattern auth choisi]
- [Règle de nommage des branches/fichiers]

## Règles de Code
- **TypeScript / langage principal** : strict mode, pas de `any`, interfaces explicites
- **API** : RESTful, versioning `/api/v1/`, pagination cursor-based
- **Validation** : toujours valider les inputs côté backend
- **Requêtes DB** : paramétrées UNIQUEMENT — jamais de concaténation de strings
- **Auth** : vérifier les droits AVANT toute opération sur la donnée

## Priorités MVP
1. Ça marche → 2. C'est sécurisé → 3. C'est lisible → 4. C'est optimisé
- JAMAIS sur-engineerer avant validation marché
- Feature flag avant architecture complexe
- Un seul pattern par couche (pas de mix d'approches)

## Tests
- Tests unitaires sur la logique métier uniquement
- Pas les controllers/routes basiques
- Coverage cible MVP : 60% backend / 40% frontend

## Ce que Claude NE doit PAS faire
- Proposer des microservices ou event sourcing
- Suggérer des outils de cache/queue sans demande explicite
- Réécrire des fichiers fonctionnels pour "refactoriser"
- Ajouter des abstractions non demandées
- Générer tout le projet d'un coup — avancer étape par étape

## Conventions Nommage
- [Tables DB : convention choisie]
- [Endpoints : convention choisie]
- [Composants/fichiers : convention choisie]
- [Env vars : convention choisie]

## Secrets & Sécurité
- Secrets dans `.env` — JAMAIS dans le code
- `.env` dans `.gitignore` — toujours
- Logs : PAS de données personnelles, PAS de tokens, PAS de passwords
```

---

### Configuration des Permissions

```bash
# Afficher les permissions actuelles
claude /permissions

# Développement feature (recommandé)
claude /permissions --allow read,write,bash
claude /permissions --deny network

# Debug production (lecture seule)
claude /permissions --allow read
claude /permissions --deny write,bash

# Session debug uniquement
claude /permissions --allow all --session-only
```

**Règle :** donner le minimum de permissions nécessaires à la tâche en cours.

### Sélection de Modèle

```bash
# Tâches complexes (architecture, debug deep)
claude /model claude-sonnet-4-5

# Tâches simples (rename, docstring, petit fix)
claude /fast

# Vérifier l'état global
claude /doctor
```

**Règle :** `/fast` pour tout ce qui prend < 2 minutes à décrire. Sonnet pour tout le reste.

---

### ✅ Checklist Setup 30 Minutes

```
□ Alias terminal ajoutés (.bashrc / .zshrc / $PROFILE)
□ Extension VS Code configurée
□ claude /init depuis la racine du projet
□ CLAUDE.md complété avec le template ci-dessus
□ claude /permissions configuré
□ claude /doctor → tout vert
□ Test rapide : claude "Décris la structure de ce projet en 5 points"
□ Test /fast : claude /fast "Renomme cette variable [paste]"
```

---

## 2️⃣ Gestion du Contexte (CRITIQUE)

### Commandes de Contexte — Référence Rapide

| Commande | Usage | Quand |
|---|---|---|
| `/add-dir` | Ajouter un dossier au contexte | Début de session ciblée |
| `/context` | Voir ce qui est dans le contexte | Debug / contexte trop lourd |
| `/clear` | Vider tout le contexte | Nouvelle tâche non liée |
| `/compact` | Comprimer l'historique | Après 50+ échanges |
| `/memory` | Gérer la mémoire persistante | Infos stables (arch, conventions) |
| `/rewind` | Revenir en arrière | Mauvaise direction prise |
| `/resume` | Reprendre la session | Lendemain, même tâche |
| `/fork` | Bifurquer la session | Tester deux approches |

---

### `/add-dir` — Cibler son contexte

```bash
# Travailler sur un module uniquement
claude /add-dir ./src/modules/bookings
claude /add-dir ./src/models/booking.ts

# ❌ Ne PAS ajouter tout le projet d'un coup
# claude /add-dir .  ← surcharge immédiate

# ✅ Pattern recommandé : add-dir par couche
claude /add-dir ./src/services/booking.service.ts
claude "Ajoute la logique de calcul de prix avec TVA"
```

**Règle :** ajouter uniquement les fichiers liés à la tâche en cours. Jamais le dossier racine.

### `/context` — Surveiller la charge

```bash
claude /context
# → tokens utilisés, % de la fenêtre, fichiers chargés

# Seuil d'alerte : > 60% → faire /compact
# Seuil critique : > 80% → résultats dégradés → /clear + /resume
```

### `/compact` vs `/clear`

```
/compact → garde le fil, comprime l'historique  → même feature en cours
/clear   → table rase                           → nouvelle feature non liée
```

**Quand `/compact` :** après chaque feature complète, avant de passer à une autre.

### `/memory` — Infos Persistantes

```bash
# Ancrer les conventions du projet
claude /memory add "Pagination cursor-based uniquement, jamais offset"
claude /memory add "userId toujours extrait du JWT, jamais depuis le body"
claude /memory add "Téléchargement = URL signée expirée après 60s"

# Gérer la mémoire
claude /memory list
claude /memory remove <id>
```

**Ce qu'on met en mémoire :** conventions stables, patterns d'architecture, règles métier invariantes.
**Ce qu'on ne met PAS :** état d'une feature en cours, bugs temporaires.

### `/rewind` — Annuler une mauvaise direction

Dès que tu réalises que l'approche est mauvaise — ne pas continuer en espérant rattraper. Utiliser `/rewind`, sélectionner le point de retour, reprendre avec un prompt plus précis.

### `/resume` + `/fork`

```bash
# Reprendre la session précédente (même feature)
claude /resume

# Tester deux approches différentes
claude /fork approach-a
# ... tester A ...
claude /fork approach-b
# ... tester B ...
# Garder le meilleur, abandonner l'autre
```

---

### Stratégie Contexte — Monorepo

**Principe :** travailler en "tunnels", jamais en vision globale.

```bash
# ❌ Mauvais
claude /add-dir .
claude "Améliore l'architecture du projet"

# ✅ Bon — tunnel ciblé
claude /add-dir ./src/services/booking.service.ts
claude /add-dir ./src/models/booking.ts
claude "Ajoute la logique de calcul de prix avec TVA"
```

**Sessions recommandées par type de tâche :**

```
Feature CRUD     → /add-dir controller + model + service
Bug              → /add-dir fichier incriminé + fichier de test
Refactor         → /add-dir dossier ciblé UNIQUEMENT
Review PR        → utiliser /diff directement
Documentation    → /add-dir module concerné
```

---

## 3️⃣ Commandes Stratégiques

### `/diff` — Review Code Avant PR

```bash
git diff develop...feature/ma-feature | claude /diff

# Prompt associé
claude /diff "Vérifie : 1) sécurité/injection 2) isolation des données 3) cohérence du typage"
```

**Erreur courante :** `/diff` sur un diff > 500 lignes → splitter la PR.

---

### `/debug` — Débugger un Bug

```bash
# Pattern efficace :
# 1. /add-dir sur le fichier incriminé uniquement
# 2. Coller le traceback/erreur complet
# 3. Ajouter le contexte de l'appel (endpoint, payload, headers)

claude /add-dir ./src/services/booking.service.ts
claude /debug "
Erreur : [message d'erreur complet]
Contexte : POST /api/v1/bookings
Payload : { service_id: 12, date: '2024-03-15' }
"
```

**Erreur courante :** chercher dans le mauvais fichier. Toujours commencer par l'erreur exacte.

---

### `/hooks` — Automatisation Git

```bash
claude /hooks

# Exemple de prompt pour générer les hooks :
claude "Génère un hook pre-commit qui :
1) Vérifie qu'aucun fichier .env n'est stagé
2) Lance le linter sur les fichiers modifiés
3) Vérifie le format Conventional Commits (feat/fix/chore/docs)"
```

---

### `/install-github-app` — CI/CD

```bash
claude /install-github-app
# Débloque : review auto des PRs, /pr-comments, suggestions inline GitHub
```

**Installer dès le début.** C'est le meilleur ROI du setup.

---

### `/pr-comments` — Traiter les Reviews

```bash
# Depuis la branche feature, après review GitHub
claude /pr-comments
# → lit tous les commentaires de la PR, propose les corrections

# Toujours valider avec /diff après
```

---

### `/config` — Configuration

```bash
claude /config set model claude-sonnet-4-5
claude /config set auto_compact true   # compact auto à 70% fenêtre
```

---

### `/stats` + `/usage` — Monitorer sa Consommation

```bash
claude /stats    # session courante : tokens, coût estimé
claude /usage    # mensuel : budget, tendance, modèles utilisés
```

**Règle budget :** Sonnet pour architecture/debug (~80%). `/fast` pour petites tâches (~20%).

---

### `/mcp` — Model Context Protocol

```bash
claude /mcp list
claude /mcp add postgres postgresql://localhost/mydb   # accès DB locale
claude /mcp add filesystem /chemin/vers/projet
```

**Règle sécurité :** MCP en dev uniquement. Jamais connecter la DB de production.

---

## 4️⃣ Workflow Quotidien Optimal (20–30h/semaine)

### La Boucle Idéale

```
Matin (2h) :    /resume → tâche du jour → implémentation
Midi (30min) :  /diff → review → /pr-comments si PR ouverte
Après-midi :    nouvelle feature → tests → PR
Soir (15min) :  /compact → noter décision dans CLAUDE.md si importante
```

---

### Prompts Types — Prêts à l'emploi

#### CRUD Complet (stack agnostique)

```
Contexte : [description courte du projet et du domaine métier]
Stack : [Frontend] + [Backend] + [DB]

Crée un CRUD complet pour l'entité "[Entité]" avec :

Backend :
- Model/Schema : [liste des champs avec types]
- Endpoints : GET (liste paginée), POST, GET /{id}, PATCH /{id}, DELETE /{id} (soft delete)
- Validation des inputs côté backend
- Vérification des droits : [userId / tenantId] avant toute opération

Frontend :
- Service avec méthodes CRUD typées
- Page liste avec filtres
- Formulaire create/edit
- Gestion erreurs centralisée

Tests :
- 3 tests unitaires sur le service (create, get avec mauvais droits, delete)

Conventions : [référencer CLAUDE.md]
```

---

#### Debug

```
Bug à débugger.

[ERREUR COMPLÈTE]
[coller le message d'erreur / traceback]

[CONTEXTE DE L'APPEL]
Endpoint : [méthode + URL]
Payload : [données envoyées]

[CODE INCRIMINÉ]
[coller la fonction ou le fichier]

Analyse :
1. Cause racine
2. Fix minimal (pas de refactor)
3. Test pour éviter la régression
```

---

#### Refactor Ciblé

```
Refactor UNIQUEMENT la fonction [nom] dans [fichier].
Objectif : [lisibilité / performance / réduire complexité]

Contraintes STRICTES :
- Ne pas changer la signature publique
- Ne pas toucher aux autres fonctions du fichier
- Garder le même comportement observable
- Pas d'abstraction supplémentaire

Code actuel :
[coller la fonction]

Proposer le code refactoré + explication en 3 lignes max.
```

---

#### Test Unitaire

```
Écris les tests unitaires pour cette fonction.

Fonction :
[coller le code]

Tests à couvrir :
1. Cas nominal (données valides)
2. Droits incorrects → doit lever une erreur d'autorisation
3. Données invalides → doit lever une erreur de validation
4. [cas spécifique si connu]

Style : pas de mock excessif, assert clairs, tester le comportement pas l'implémentation.
```

---

#### Documentation Technique

```
Documente ce module pour un développeur qui rejoint le projet.

Format :
- Description du module (2–3 lignes : rôle + ce qu'il ne fait PAS)
- Documentation chaque fonction publique (params, retour, erreurs, exemple si non-évident)
- Commentaires dans le code uniquement pour logique non-évidente

Fichier :
[coller le fichier]

Ton : technique, concis. Pas de "Cette fonction permet de...".
```

---

#### Décision d'Architecture (Anti-Surengineering)

```
J'ai besoin de [fonctionnalité].
Phase : MVP, [X] clients actifs, 20h/semaine solo.

Propose 3 options de complexité croissante :
1. Solution minimale (< 2h dev)
2. Solution robuste (< 1 jour dev)
3. Solution scalable (> 1 jour dev)

Pour chaque option :
- Ce qu'elle fait
- Ce qu'elle ne fait PAS
- Quand elle atteint ses limites

Recommande le minimum sauf si tu justifies pourquoi la robuste est nécessaire maintenant.
```

---

## 5️⃣ Sécurité & Bonnes Pratiques

### Permissions par Contexte

```bash
claude /permissions --allow read,write,bash   # développement feature
claude /permissions --allow read              # analyse / audit
claude /permissions --deny write,bash         # debug production (lecture seule)
```

### Gestion des Secrets

```
✅ Faire :
- Référencer le nom de la variable d'env, pas sa valeur
- Utiliser /memory pour la structure (pas les valeurs)
- .env.example versionné, .env jamais versionné

❌ Ne JAMAIS faire :
- Coller une API key, token JWT ou password dans le prompt
- Partager un fichier .env dans le contexte
- Coller des credentials de DB de production
- Analyser des logs de production contenant des données personnelles
```

**Règle absolue :** si tu hésites à partager quelque chose, ne le partage pas.

### Checklist Anti Data Leak

```
□ .env dans .gitignore — vérifier avant chaque commit
□ Logs sans données personnelles (RGPD)
□ Pas de passwords en clair dans les fixtures de test
□ DB de production jamais connectée via /mcp
□ /diff avant chaque PR pour vérifier l'absence de secrets
□ Hook pre-commit qui scanne les patterns de secrets
```

### Ce qu'il ne faut PAS demander à Claude

```
❌ Accéder à la DB de production pour lire des données clients
❌ Générer des données de test avec de vrais emails/noms
❌ "Voici mon .env complet, utilise-le pour..."
❌ Contourner une validation de sécurité pour tester rapidement
❌ Analyser des logs contenant des données personnelles réelles
```

---

## 6️⃣ Règles d'Or Micro-SaaS B2B

### Anti-Surengineering — Les 5 Questions

```
Avant toute implémentation, demander à Claude :

"Pour [fonctionnalité] :
1. Quelle est la version la plus simple qui pourrait fonctionner ?
2. Quels sont les risques de cette version simple ?
3. À partir de quel volume/nb clients ça pose problème ?
4. Qu'est-ce qu'on ne pourra PAS faire facilement si on choisit le simple ?

Si les risques ne se matérialisent pas avant 50 clients → faire le simple."
```

### Décider Quoi NE PAS Construire

```
"Feature demandée : [description]
Notre produit actuel : [description rapide]
Phase : MVP, [X] clients payants

1. C'est un 'must have' pour signer ou un 'nice to have' ?
2. Temps de dev estimé ?
3. Peut-on simuler cette feature sans la coder (workaround manuel) ?
4. Verdict : maintenant / plus tard / jamais

Sois brutal. 'jamais' avec une raison vaut mieux que 'plus tard' vague."
```

### Garder le MVP Simple

```
Règle des 3 questions avant d'ajouter une abstraction :
1. Est-ce que j'en ai besoin maintenant (pas "un jour") ?
2. Est-ce que j'en aurais dans 3 endroits différents ?
3. Est-ce que ça prend > 30 min à écrire sans l'abstraction ?

Si non à l'une → pas d'abstraction.
```

### Contenu LinkedIn qui Convertit

```
❌ "J'ai construit [feature technique obscure]"

✅ Format qui marche :
"J'ai perdu [X heures] sur [problème concret].
Voici les [N] erreurs que tu feras aussi (et comment les éviter).
+ [ressource téléchargeable en commentaire]"
```

### Copywriting Produit

```
Tu es expert en copywriting B2B SaaS pour [cible].

Produit : [description en 2 lignes]
Prix : [X]€/mois
Client idéal : [profil + problème principal]

Génère :
1. Headline (< 10 mots, bénéfice concret, pas de jargon)
2. Sous-headline (douleur + promesse en 1 phrase)
3. 3 bullet points (format : [Verbe] + [résultat mesurable])
4. CTA (2–4 mots, orienté action)
5. Objection principale + réponse (< 20 mots)
```

### Revue Hebdomadaire (vendredi, 15 min)

```
"Voici ce que j'ai construit cette semaine : [liste]
Feedback clients reçu : [feedback]

1. Qu'est-ce que j'aurais pu NE PAS faire sans impact ?
2. Quelle feature non développée aurait eu le plus d'impact ?
3. Une seule chose à faire lundi matin en priorité absolue."
```

---

### Les 10 Commandes les Plus Utilisées au Quotidien

```bash
1.  claude /resume                       # reprendre où on était
2.  claude /add-dir ./src/[module]       # cibler le contexte
3.  claude /fast "fix: [description]"    # fix rapide
4.  claude /diff                         # review avant PR
5.  claude /compact                      # après chaque feature
6.  claude /debug "[erreur]"             # débugger
7.  claude /pr-comments                  # traiter les reviews
8.  claude /memory add "[convention]"    # ancrer une décision
9.  claude /rewind                       # mauvaise direction
10. claude /usage                        # monitorer le budget
```

---

*Document vivant — mettre à jour CLAUDE.md à chaque décision d'architecture importante.*
*Applicable à tout stack : Next.js, NestJS, FastAPI, Laravel, Rails, Vue, Angular...*
