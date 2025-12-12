
import React from 'react';
import { LayoutDashboard, FolderKanban, FilePlus2, Library, LogOut, Menu, X, Activity, Settings } from 'lucide-react';
import { User, Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, activeTab, onNavigate, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const NavItem = ({ id, label, icon: Icon, allowedRoles }: { id: string, label: string, icon: any, allowedRoles: Role[] }) => {
    if (!allowedRoles.includes(user.role) && !allowedRoles.includes('ADMIN')) return null;
    
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => onNavigate(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'hidden' : 'block'}`} />
        <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'} />
        {sidebarOpen && <span className="font-medium tracking-wide z-10">{label}</span>}
        {isActive && sidebarOpen && <div className="absolute right-0 h-full w-1 bg-indigo-300 rounded-l-full shadow-[0_0_10px_rgba(129,140,248,0.5)]" />}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-900 flex flex-col transition-all duration-300 shadow-2xl z-20 relative border-r border-slate-800`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800/50">
          <div className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
             <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
               <Activity size={20} className="text-white" />
             </div>
             <div>
               <h1 className="font-bold text-lg text-white tracking-tight leading-none">RAAD OS</h1>
               <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Analytics</span>
             </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <Menu size={20} /> : <Menu size={24} className="mx-auto" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} allowedRoles={['RAAD_ANALYST', 'RAAD_MANAGER', 'DEPARTMENT_CUSTOMER', 'ADMIN']} />
          <NavItem id="projects" label="Projects" icon={FolderKanban} allowedRoles={['RAAD_ANALYST', 'RAAD_MANAGER', 'ADMIN']} />
          <NavItem id="intake" label="New Request" icon={FilePlus2} allowedRoles={['DEPARTMENT_CUSTOMER', 'RAAD_MANAGER', 'ADMIN', 'RAAD_ANALYST']} />
          <NavItem id="reports" label="Report Catalog" icon={Library} allowedRoles={['RAAD_ANALYST', 'RAAD_MANAGER', 'DEPARTMENT_CUSTOMER', 'ADMIN']} />
          
          <div className="my-4 border-t border-slate-800 mx-2"></div>
          
          {/* Updated allowedRoles to include DEPARTMENT_CUSTOMER */}
          <NavItem id="settings" label="Settings" icon={Settings} allowedRoles={['RAAD_MANAGER', 'ADMIN', 'RAAD_ANALYST', 'DEPARTMENT_CUSTOMER']} />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="relative group cursor-pointer">
              <img src={user.avatarUrl} alt="User" className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-indigo-500 transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            
            {sidebarOpen && (
              <div className="flex-1 min-w-0 transition-opacity duration-200">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate capitalize">{user.role.replace('RAAD_', '').replace('_', ' ').toLowerCase()}</p>
              </div>
            )}
            
            {sidebarOpen && (
              <button 
                onClick={onLogout} 
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col bg-slate-50/50">
         {/* Background Decoration */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3"></div>
         </div>

        <div className="flex-1 overflow-auto relative z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto p-6 md:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
