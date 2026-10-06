# Planning App

Een moderne, gestroomlijnde task management en planningsapplicatie. Ontworpen om teams gefocust te houden op hun prioriteiten door middel van een minimalistische, snelle interface.

![Schermafbeelding van de app](https://nextjs.org/icons/next.svg) <!-- Vervang dit later eventueel door een echte screenshot van je app -->

## 🌐 Live Demo (Test de app)

Je kunt deze applicatie zelf uitproberen via de live demo op Vercel. Gebruik hiervoor het volgende testaccount:
- **E-mail:** `demo@fakeaccount.nl`
- **Wachtwoord:** `5,-SwDjR^F7U.Ca`

*(Let op: Dit account heeft beperkte rechten. Respecteer de data van anderen in de demo-omgeving).*

## 🚀 Functionaliteiten

- **Realtime Dashboard:** Direct inzicht in openstaande taken, geschatte uren en naderende deadlines.
- **Taakbeheer:** Snel taken aanmaken, bewerken, archiveren en definitief verwijderen via Server Actions.
- **Uren Inschatting:** Uren toewijzen en plannen per specifieke taak.
- **Premium Design:** Een "Linear-stijl" interface met subtiele animaties, dark-mode ondersteuning en perfecte weergave op mobiel.
- **Veilig & Schaalbaar:** Volledige authenticatie en Row Level Security (RLS) op database niveau.

## 🛠️ Tech Stack

Deze applicatie is gebouwd met de meest moderne web-technologieën van dit moment:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Database & Authenticatie:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Iconen:** [Heroicons](https://heroicons.com/)
- **Hosting & Deployment:** [Vercel](https://vercel.com)

## 📦 Installatie & Lokaal draaien

Wil je de code lokaal op je eigen machine draaien of forken? Volg deze stappen:

### 1. Clone de repository
```bash
git clone https://github.com/EdwinSchipper/planning-app.git
cd planning-app
```

### 2. Installeer dependencies
```bash
npm install
```

### 3. Supabase Database Instellen
1. Maak een nieuw project aan op [Supabase](https://supabase.com).
2. Maak de benodigde tabellen aan (`db_tasks` en `profiles`). 
3. *Let op: zorg ervoor dat Row Level Security (RLS) is ingeschakeld en dat je de SQL-trigger hebt draaien die automatisch een profiel aanmaakt wanneer een nieuwe gebruiker zich registreert.*
4. Haal je Project URL en Anon Key op uit de Supabase instellingen (Project Settings > API).

### 4. Environment Variables configureren
Maak een `.env.local` bestand aan in de hoofdmap (root) van het project en vul je Supabase gegevens in:
```env
NEXT_PUBLIC_SUPABASE_URL=jouw_supabase_url_hier
NEXT_PUBLIC_SUPABASE_ANON_KEY=jouw_supabase_anon_key_hier
```

### 5. Start de applicatie
```bash
npm run dev
```
Open je browser en navigeer naar [http://localhost:3000](http://localhost:3000).

## 🚀 Live zetten (Vercel)

Dit project is geoptimaliseerd om binnen 1 minuut live te zetten via Vercel:
1. Push je (geforkte) code naar een eigen GitHub repository.
2. Importeer het project in je [Vercel](https://vercel.com) dashboard.
3. Vul de `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_ANON_KEY` in bij het tabblad **Environment Variables**.
4. Klik op **Deploy**!

---

*Ontwikkeld door [Edwin Schipper](https://edwinschipper.nl/)*
