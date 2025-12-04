# Breaking Dynamics - Survey Marketing

Validiere deinen Market-Fit in 48h mit LinkedIn-Umfragen.

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth + Database)
- **Deployment:** Vercel

## 🔒 Security

> ⚠️ **WICHTIG:** Committe NIEMALS deine `.env` Datei!

Die `.env` Datei enthält sensible API-Keys. Falls du versehentlich Keys veröffentlicht hast:

1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API
2. Klicke auf "Regenerate" beim anon key
3. Update deine `.env` mit dem neuen Key
4. Prüfe deine Git-History: `git log --all --full-history -- .env`

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Erstelle ein neues Projekt auf [supabase.com](https://supabase.com)
2. Gehe zu **Settings > API** und kopiere:
   - Project URL
   - anon/public key

3. Erstelle `.env` Datei:

```bash
cp .env.example .env
```

4. Füge deine Supabase Credentials ein:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Database

1. Gehe zu **SQL Editor** in Supabase
2. Führe das Schema aus: `supabase/schema.sql`

Das erstellt:
- `surveys` Tabelle
- `feedback` Tabelle
- Row Level Security Policies
- Triggers für `updated_at`

### 4. Run Development Server

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── App.jsx              # Main app component
├── main.jsx             # Entry point with AuthProvider
├── index.css            # Tailwind imports
└── lib/
    ├── supabase.js      # Supabase client & helpers
    └── AuthContext.jsx  # React auth context
```

## 🔐 Authentication

Die App verwendet Supabase Auth mit Email/Password:

```javascript
import { useAuth } from './lib/AuthContext';

const { user, signIn, signUp, signOut, isAuthenticated } = useAuth();
```

## 💾 Database

### Surveys Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| title | VARCHAR | Survey title |
| question | TEXT | Poll question |
| blocks | INTEGER | Number of blocks |
| text | TEXT | Generated LinkedIn post |
| block_data | JSONB | Block editor data |
| validation_challenge | TEXT | Internal hypothesis |
| scheduled_at | TIMESTAMPTZ | Optional schedule |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Updated timestamp |

### Feedback Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Optional user reference |
| type | VARCHAR | 'bug', 'feature', 'general' |
| message | TEXT | Feedback content |
| email | VARCHAR | Contact email |
| page_url | TEXT | Page where feedback was given |
| user_agent | TEXT | Browser info |
| status | VARCHAR | 'new', 'in_progress', 'resolved' |
| created_at | TIMESTAMPTZ | Created timestamp |

## 🚢 Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

> 💡 **Tipp:** Nutze Vercel's Environment Variables UI - niemals in vercel.json!

## 📝 API Usage

```javascript
import { db } from './lib/supabase';

// Create survey
await db.createSurvey({
  title: 'My Survey',
  question: 'What do you think?',
  blocks: 4,
  text: 'Generated text...',
  blockData: [...],
  validation_challenge: 'My hypothesis'
});

// Get all surveys
const surveys = await db.getSurveys();

// Update survey
await db.updateSurvey(id, { title: 'New Title' });

// Delete survey
await db.deleteSurvey(id);

// Submit feedback
await db.submitFeedback({
  type: 'bug',
  message: 'Found a bug...',
  email: 'user@example.com'
});
```

## 🛡️ Row Level Security

Die App nutzt Supabase RLS für Datenschutz:

- **Surveys:** User können nur eigene Surveys sehen/bearbeiten
- **Feedback:** Jeder kann Feedback senden, nur Admins sehen alles

## License

MIT
