
import React from 'react';
import { Project, User, Request } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, AlertCircle, CheckCircle, ArrowRight, Zap, Target, ArrowUpRight, Bell, FileSignature, Users } from 'lucide-react';

interface DashboardProps {
  user: User;
  projects: Project[];
  requests: Request[];
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, projects, requests, onNavigate }) => {
  // --- Data Prep ---
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
  const priorityProjects = projects.filter(p => p.priority === 'Weekly Priority');
  const myProjects = projects.filter(p => 
    p.analyticsLeadId === user.id || p.supportingAnalystIds.includes(user.id)
  );

  // Identify Action Items (Pending Invites or Sign-offs)
  const pendingInvites = projects.filter(p => 
    p.p1Definition.stakeholders.some(s => s.userId === user.id && s.status === 'Pending')
  );
  
  const pendingSignOffs = projects.filter(p => 
    p.p1Definition.clientSignOff.status === 'Pending' && 
    p.p1Definition.stakeholders.some(s => s.userId === user.id && s.role === 'Client')
  );

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3 group-hover:bg-${color}-500/10 transition-colors`}></div>
      <div className="flex items-start justify-between relative z-10">
        <div>
           <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
           <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
           {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  // --- Customer View ---
  if (user.role === 'DEPARTMENT_CUSTOMER') {
    const myRequests = requests.filter(r => r.requesterId === user.id);
    const myDeptProjects = projects.filter(p => p.department === user.department);

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, {user.name}</h1>
          <p className="text-slate-500 mt-2 text-lg">Analytics overview for <span className="font-semibold text-indigo-600">{user.department}</span>.</p>
        </header>

        {/* Customer Action Items */}
        {(pendingInvites.length > 0 || pendingSignOffs.length > 0) && (
          <div className="bg-white border-l-4 border-amber-500 rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                 <Bell size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-slate-800 text-lg">Action Required</h3>
                 <p className="text-slate-600">
                   You have <span className="font-bold">{pendingInvites.length} invites</span> and <span className="font-bold">{pendingSignOffs.length} sign-offs</span> pending.
                 </p>
               </div>
             </div>
             <button 
               onClick={() => onNavigate('projects')} 
               className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
             >
               View Projects
             </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatCard 
             title="Active Projects" 
             value={myDeptProjects.filter(p => p.status === 'In Progress').length} 
             icon={Zap} 
             color="indigo" 
           />
           <StatCard 
             title="Pending Requests" 
             value={myRequests.filter(r => r.status === 'New').length} 
             icon={Clock} 
             color="amber" 
           />
           
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-xl shadow-blue-900/20 text-white flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-2">Need Insights?</h3>
               <p className="text-blue-100 mb-6">Start a new analytics project or dashboard request.</p>
               <button 
                 onClick={() => onNavigate('intake')} 
                 className="bg-white text-blue-700 py-3 px-6 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg flex items-center"
               >
                 Create Request <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform"/>
               </button>
             </div>
           </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
             <h2 className="text-xl font-bold text-slate-800">Active Projects</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {myDeptProjects.length === 0 ? (
              <div className="p-10 text-center text-slate-500">No active projects found.</div>
            ) : (
              myDeptProjects.map(p => (
                <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                      {p.p1Definition.clientSignOff.status === 'Approved' && (
                        <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Signed Off</span>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">{p.currentStep}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                       p.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                       p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                       'bg-slate-100 text-slate-700'
                     }`}>
                       {p.status}
                     </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Manager / Analyst View ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {user.role === 'RAAD_MANAGER' ? 'Command Center' : 'My Workspace'}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            {user.role === 'RAAD_MANAGER' 
              ? 'Operational oversight and team performance.' 
              : `You have ${myProjects.length} active projects assigned.`}
          </p>
        </div>
        <div className="text-right bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Current Cycle</p>
           <p className="text-xl font-bold text-indigo-600">Spring 2024</p>
        </div>
      </header>

      {/* Action Items for Staff */}
      {(pendingInvites.length > 0 || pendingSignOffs.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {pendingInvites.map(p => (
             <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Users size={18}/></div>
                   <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Project Invite</p>
                      <p className="font-bold text-slate-800">{p.name}</p>
                   </div>
                </div>
                <button onClick={() => onNavigate('projects')} className="text-sm font-semibold text-blue-600 hover:underline">Review</button>
             </div>
           ))}
           {pendingSignOffs.map(p => (
             <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-amber-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="bg-amber-100 p-2 rounded-full text-amber-600"><FileSignature size={18}/></div>
                   <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Sign-off Requested</p>
                      <p className="font-bold text-slate-800">{p.name}</p>
                   </div>
                </div>
                <button onClick={() => onNavigate('projects')} className="text-sm font-semibold text-amber-600 hover:underline">Review</button>
             </div>
           ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="In Progress" 
            value={projects.filter(p => p.status === 'In Progress').length} 
            icon={Zap} 
            color="indigo"
        />
        <StatCard 
            title="New Requests" 
            value={requests.filter(r => r.status === 'New').length} 
            icon={AlertCircle} 
            color="amber"
        />
        <StatCard 
            title="Completed YTD" 
            value={projects.filter(p => p.status === 'Completed').length} 
            icon={Target} 
            color="emerald"
        />

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
           <div className="relative z-10">
             <div className="flex items-center space-x-2 mb-4">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
               <span className="text-xs font-mono text-indigo-200 uppercase tracking-widest">System Online</span>
             </div>
             <h3 className="text-xl font-bold mb-1">Matt AI Copilot</h3>
             <p className="text-indigo-200 text-sm mb-4">Playbook compliance active.</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full mr-3"></span>
            Project Status Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Priorities */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <span className="w-1.5 h-6 bg-rose-500 rounded-full mr-3"></span>
              Weekly Priorities
            </h3>
            <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg uppercase">High Impact</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {priorityProjects.length === 0 && <p className="text-slate-400 text-sm italic">No weekly priorities set.</p>}
            {priorityProjects.map(p => (
              <div 
                key={p.id} 
                className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all cursor-pointer group" 
                onClick={() => onNavigate('projects')}
              >
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider border border-rose-200 px-1.5 py-0.5 rounded">Priority</span>
                   <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{p.phase}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.currentStep}</p>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate('projects')} className="mt-6 w-full py-3 text-sm text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center group">
            View All Projects <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
