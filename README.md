
# RAAD Operations OS

A role-based project management and analytics operating system for Denver Public Schools RAAD team, featuring the Matt AI copilot.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iraklimatch/RAAD-OS.git
   cd RAAD-OS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp supabase.env.example .env.local
   ```
   
   Then edit `.env.local` and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the app:**
   Open your browser to `http://localhost:3000`

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## 🖥️ Accessing from Another Laptop

### Option 1: Clone and Run Locally
1. On your other laptop, clone the repository:
   ```bash
   git clone https://github.com/iraklimatch/RAAD-OS.git
   cd RAAD-OS
   ```

2. Follow the setup instructions above (install dependencies, create `.env.local`)

3. Run `npm run dev` and access at `http://localhost:3000`

### Option 2: Deploy to a Hosting Service
Deploy to Vercel, Netlify, or Cloudflare Pages for access from anywhere:

**Vercel:**
1. Push your code to GitHub (already done)
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!

**Netlify:**
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables
7. Deploy!


## 📁 Project Structure

```
RAAD-OS/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── LoginPage.tsx
│   ├── ProjectList.tsx
│   └── ...
├── services/            # Backend services
│   ├── supabaseBackend.ts
│   ├── supabaseClient.ts
│   └── geminiService.ts
├── types.ts            # TypeScript definitions
├── constants.ts        # App constants
└── App.tsx            # Main app component
```

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase anonymous key |

## 📝 Current Features

- ✅ Role-based authentication (demo mode)
- ✅ Project management with playbook phases (P1-P6)
- ✅ Dashboard with KPIs and status tracking
- ✅ Request intake system
- ✅ Report catalog
- ✅ Matt AI copilot
- ✅ Settings and user management UI

## 🚧 Next Steps for Full Production

See the project documentation for details on:
- Setting up real authentication
- Database schema and migrations
- Row Level Security (RLS) policies
- Production deployment

## 📄 License

Private project for Denver Public Schools RAAD team.
