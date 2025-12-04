# Breaking Dynamics

**Survey Marketing Tool** - Validiere deinen Market-Fit in 48h mit LinkedIn-Umfragen.

---

## 📁 Projektstruktur

```
breaking-dynamics/
│
├── 📄 Konfiguration
│   ├── .env.example          # Environment Template (→ kopieren zu .env)
│   ├── .gitignore            # Git-Ignorierte Dateien
│   ├── package.json          # Dependencies & Scripts
│   ├── vite.config.js        # Vite Build Config
│   ├── tailwind.config.js    # Tailwind Config
│   ├── postcss.config.js     # PostCSS Config
│   └── vercel.json           # Deployment Config
│
├── 📄 Entry Points
│   └── index.html            # HTML Template
│
├── 📂 public/
│   └── favicon.svg           # App Icon
│
├── 📂 src/
│   ├── main.jsx              # React Entry Point
│   ├── App.jsx               # Hauptkomponente (Views + Logic)
│   ├── index.css             # Tailwind Imports
│   │
│   └── 📂 lib/
│       ├── AuthContext.jsx   # Auth State (useAuth Hook)
│       └── supabase.js       # Supabase Client + DB Helper
│
└── 📂 supabase/
    └── schema.sql            # Datenbank Schema + RLS Policies
```

---

## 🛠 Tech Stack

| Technologie | Version | Verwendung |
|-------------|---------|------------|
| React | 18.2 | Frontend Framework |
| Vite | 5.1 | Build Tool & Dev Server |
| Tailwind CSS | 3.4 | Utility-First Styling |
| Supabase | 2.39 | Auth + PostgreSQL |
| Lucide React | 0.263 | Icon Library |

---

## 🚀 Quick Start

### 1. Dependencies installieren

```bash
npm install
```

### 2. Environment einrichten

```bash
cp .env.example .env
```

Dann `.env` bearbeiten:

```env
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key
```

> **Keys findest du unter:** [supabase.com/dashboard](https://supabase.com/dashboard) → Projekt → Settings → API

### 3. Datenbank einrichten

1. Gehe zu **SQL Editor** in Supabase
2. Führe `supabase/schema.sql` aus

### 4. Entwicklungsserver starten

```bash
npm run dev
```

App läuft auf `http://localhost:5173`

---

## 🔒 Security

> ⚠️ **NIEMALS `.env` committen!**

Falls Keys exposed wurden:

1. Supabase Dashboard → Settings → API
2. "Regenerate" klicken
3. Neue Keys in `.env` und Vercel eintragen
4. Git History prüfen: `git log --all --full-history -- .env`

---

## 📦 Scripts

| Command | Beschreibung |
|---------|--------------|
| `npm run dev` | Entwicklungsserver starten |
| `npm run build` | Production Build erstellen |
| `npm run preview` | Production Build lokal testen |

---

## 🚢 Deployment (Vercel)

1. Repository auf GitHub pushen
2. In Vercel importieren
3. Environment Variables setzen:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

---

## 💾 Datenbank Schema

### `surveys` Tabelle

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key → auth.users |
| title | VARCHAR | Umfrage-Titel |
| question | TEXT | Poll-Frage |
| blocks | INTEGER | Anzahl Blöcke |
| text | TEXT | Generierter LinkedIn Post |
| block_data | JSONB | Block Editor Daten |
| validation_challenge | TEXT | Interne Hypothese |
| scheduled_at | TIMESTAMPTZ | Geplanter Zeitpunkt |
| created_at | TIMESTAMPTZ | Erstellt am |
| updated_at | TIMESTAMPTZ | Aktualisiert am |

### `feedback` Tabelle

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primary Key |
| user_id | UUID | Optional: User Reference |
| type | VARCHAR | 'bug', 'feature', 'general' |
| message | TEXT | Feedback Inhalt |
| email | VARCHAR | Kontakt E-Mail |
| page_url | TEXT | Seite des Feedbacks |
| status | VARCHAR | 'new', 'in_progress', 'resolved' |

---

## 🔐 Row Level Security

- **Surveys:** User sehen nur eigene Umfragen
- **Feedback:** Jeder kann senden, nur Admins sehen alles

---

## 📚 API Verwendung

```javascript
import { db } from './lib/supabase';

// Survey erstellen
await db.createSurvey({
  title: 'Meine Umfrage',
  question: 'Was denkt ihr?',
  blocks: 4,
  text: 'Generierter Text...',
  blockData: [...],
  validation_challenge: 'Hypothese'
});

// Alle Surveys laden
const surveys = await db.getSurveys();

// Survey aktualisieren
await db.updateSurvey(id, { title: 'Neuer Titel' });

// Survey löschen
await db.deleteSurvey(id);

// Feedback senden
await db.submitFeedback({
  type: 'bug',
  message: 'Bug gefunden...',
  email: 'user@example.com'
});
```

---

## 📝 License

MIT
