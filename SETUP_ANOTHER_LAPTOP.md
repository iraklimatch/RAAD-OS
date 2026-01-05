# 🖥️ Setting Up on Another Laptop

This guide will help you access and run RAAD OS from your other laptop.

## Method 1: Using Cursor IDE (Recommended)

### Step 1: Install Cursor
1. Download Cursor from [cursor.sh](https://cursor.sh)
2. Install it on your other laptop

### Step 2: Clone the Repository
Open Cursor and:
1. Click **File → Clone Repository**
2. Enter: `https://github.com/iraklimatch/RAAD-OS.git`
3. Choose where to save it
4. Click **Clone**

**OR** use the terminal in Cursor:
```bash
git clone https://github.com/iraklimatch/RAAD-OS.git
cd RAAD-OS
```

### Step 3: Open in Cursor
1. In Cursor: **File → Open Folder**
2. Select the `RAAD-OS` folder you just cloned

### Step 4: Install Dependencies
Open the terminal in Cursor (`` Ctrl+` `` or `Cmd+`):
```bash
npm install
```

### Step 5: Set Up Environment Variables
1. In Cursor, create a new file called `.env.local` in the root directory
2. Copy the contents from `supabase.env.example`
3. Fill in your actual values:
   ```env
   VITE_SUPABASE_URL=https://jwtgiyprcqzbdxhieoya.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```

### Step 6: Run the App
In the Cursor terminal:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Method 2: Using VS Code or Any Editor

1. **Clone the repo:**
   ```bash
   git clone https://github.com/iraklimatch/RAAD-OS.git
   cd RAAD-OS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local`** with your environment variables

4. **Run:**
   ```bash
   npm run dev
   ```

## Method 3: Deploy to Cloud (Access from Anywhere)

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

## Using Git in Cursor

Cursor has full Git integration:

### View Changes
- Click the **Source Control** icon in the left sidebar (or `Ctrl+Shift+G` / `Cmd+Shift+G`)
- See all modified files

### Commit Changes
1. Stage files by clicking the `+` next to each file
2. Write a commit message
3. Click the checkmark to commit

### Push to GitHub
1. After committing, click the `...` menu
2. Select "Push" or "Push to..."
3. Your changes will sync to GitHub

### Pull Latest Changes
1. Click the `...` menu in Source Control
2. Select "Pull" to get the latest code from GitHub

## Troubleshooting

### "npm: command not found"
- Install Node.js from [nodejs.org](https://nodejs.org)
- Restart Cursor after installing

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
- Use Cursor's AI chat (`Cmd+L` / `Ctrl+L`) to ask questions
- View the codebase structure in the file explorer

---

**Happy coding! 🚀**


