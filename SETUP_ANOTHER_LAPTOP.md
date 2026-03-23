# 🖥️ Setting Up on Another Laptop

This guide will help you access and run RAAD OS from your other laptop.

## Method 1: Using VS Code or Any Editor

1. **Clone the repo:**
   ```bash
   git clone https://github.com/iraklimatch/RAAD-OS.git
   cd RAAD-OS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a new file called `.env.local` in the root directory:
   ```bash
   cp supabase.env.example .env.local
   ```
   Fill in your actual values:
   ```env
   VITE_SUPABASE_URL=https://jwtgiyprcqzbdxhieoya.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```

4. **Run:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## Method 2: Deploy to Cloud (Access from Anywhere)

### Deploy to Vercel (Free & Easy)

1. **Push your code to GitHub** (already done ✅)

2. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with GitHub

3. **Import Project:**
   - Click "Add New Project"
   - Select `iraklimatch/RAAD-OS`
   - Click "Import"

4. **Configure Environment Variables:**
   - In the project settings, add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `GEMINI_API_KEY` (optional)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-app.vercel.app`

**Now you can access it from ANY laptop or device!** 🎉

## Troubleshooting

### "npm: command not found"
- Install Node.js from [nodejs.org](https://nodejs.org)

### "Port 3000 already in use"
- Change the port in `vite.config.ts` or kill the process using port 3000

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### Environment variables not working
- Make sure `.env.local` is in the root directory
- Restart the dev server after changing `.env.local`
- Check that variable names start with `VITE_` for Vite to expose them

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Install dependencies | `npm install` |
| View git status | `git status` |
| Pull latest code | `git pull` |
| Push changes | `git push` |

## Need Help?

- Check the main [README.md](README.md) for more details
- View the codebase structure in the file explorer

---

**Happy coding! 🚀**
