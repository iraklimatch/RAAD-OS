
import React, { useState } from 'react';
import { User, AuditLog, PlaybookPhase, PlaybookItem } from '../types';
import { USERS, PLAYBOOK, AUDIT_LOGS } from '../constants';
import { 
  User as UserIcon, Shield, Settings, Database, Bell, 
  Trash2, Plus, Edit2, CheckCircle2, AlertCircle, Key, 
  BookOpen, FileText, ToggleLeft, ToggleRight, History,
  Save, X, ArrowUp, ArrowDown, Check, Loader2
} from 'lucide-react';

interface SettingsPageProps {
  currentUser: User;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [users, setUsers] = useState(USERS);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // --- Notification Settings State ---
  const [notifications, setNotifications] = useState({
    emailAssigned: true,
    emailMention: true,
    weeklyDigest: false
  });
  const [generalSaving, setGeneralSaving] = useState(false);

  // --- System Config State ---
  const [departments, setDepartments] = useState(['Transportation', 'Food Services', 'Facilities', 'Academics', 'Safety', 'Technology']);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [isAddingDept, setIsAddingDept] = useState(false);

  // --- Playbook Settings State ---
  const [playbookConfig, setPlaybookConfig] = useState<PlaybookPhase[]>(JSON.parse(JSON.stringify(PLAYBOOK))); // Deep copy
  const [playbookSaving, setPlaybookSaving] = useState(false);

  // --- Handlers: Notifications ---
  const handleToggleNotify = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveGeneral = () => {
    setGeneralSaving(true);
    // Simulate API call
    setTimeout(() => {
      setGeneralSaving(false);
      alert('Preferences saved successfully!');
    }, 800);
  };

  // --- Handlers: System Config ---
  const handleAddDepartment = () => {
    if (newDeptName.trim()) {
      setDepartments([...departments, newDeptName.trim()]);
      setNewDeptName('');
      setIsAddingDept(false);
    }
  };

  const handleDeleteDepartment = (dept: string) => {
    if (window.confirm(`Are you sure you want to remove the ${dept} department? This may affect existing projects.`)) {
      setDepartments(departments.filter(d => d !== dept));
    }
  };

  // --- Handlers: Playbook ---
  const handlePlaybookTaskChange = (phaseId: string, taskId: string, field: keyof PlaybookItem, value: any) => {
    setPlaybookConfig(prev => prev.map(phase => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        items: phase.items.map(item => item.id === taskId ? { ...item, [field]: value } : item)
      };
    }));
  };

  const handleAddTask = (phaseId: string) => {
    const newTask: PlaybookItem = {
      id: `new_${Date.now()}`,
      label: 'New Task',
      description: 'Description of the new task',
      required: false
    };
    setPlaybookConfig(prev => prev.map(phase => {
      if (phase.id !== phaseId) return phase;
      return { ...phase, items: [...phase.items, newTask] };
    }));
  };

  const handleRemoveTask = (phaseId: string, taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setPlaybookConfig(prev => prev.map(phase => {
      if (phase.id !== phaseId) return phase;
      return { ...phase, items: phase.items.filter(i => i.id !== taskId) };
    }));
  };

  const handleSavePlaybook = () => {
    setPlaybookSaving(true);
    // Simulate API call to save new config
    setTimeout(() => {
      setPlaybookSaving(false);
      alert('Playbook configuration updated! These changes will apply to new projects.');
    }, 800);
  };

  // Mock Invite Handler
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteModalOpen(false);
    alert('Invitation sent! (Simulation)');
  };

  const allTabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'users', label: 'Team Members', icon: UserIcon },
    { id: 'config', label: 'System Config', icon: Database },
    { id: 'playbook', label: 'Playbook', icon: BookOpen },
    { id: 'integrations', label: 'Integrations', icon: Key },
    { id: 'audit', label: 'Audit Log', icon: History },
  ];

  // Role-based Tab Filtering
  const visibleTabs = currentUser.role === 'DEPARTMENT_CUSTOMER'
    ? allTabs.filter(tab => tab.id === 'general')
    : allTabs;

  // Helper Toggle Component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage users, integrations, and global configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0 space-y-2">
          {visibleTabs.map(tab => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive 
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-100 ring-1 ring-indigo-50' 
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
             );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[500px]">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-8 max-w-2xl">
               <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <UserIcon size={20} className="mr-2 text-slate-400"/> My Profile
                  </h3>
                  <div className="flex items-center space-x-4 mb-6">
                    <img src={currentUser.avatarUrl} className="w-20 h-20 rounded-full border-4 border-slate-50" alt="Profile"/>
                    <div>
                       <button className="text-sm font-bold text-indigo-600 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">Change Avatar</button>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-1">Display Name</label>
                       <input type="text" defaultValue={currentUser.name} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                       <input type="email" defaultValue={currentUser.email} disabled className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500 cursor-not-allowed" />
                    </div>
                  </div>
               </div>
               
               <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <Bell size={20} className="mr-2 text-slate-400"/> Notifications
                  </h3>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-700">Assignments</p>
                          <p className="text-xs text-slate-500">Email me when a project is assigned to me</p>
                        </div>
                        <ToggleSwitch checked={notifications.emailAssigned} onChange={() => handleToggleNotify('emailAssigned')} />
                     </div>
                     <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-700">Mentions</p>
                          <p className="text-xs text-slate-500">Email me when someone mentions me in a comment</p>
                        </div>
                        <ToggleSwitch checked={notifications.emailMention} onChange={() => handleToggleNotify('emailMention')} />
                     </div>
                     <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-700">Weekly Digest</p>
                          <p className="text-xs text-slate-500">Receive a summary of activity every Monday</p>
                        </div>
                        <ToggleSwitch checked={notifications.weeklyDigest} onChange={() => handleToggleNotify('weeklyDigest')} />
                     </div>
                  </div>
               </div>
               
               <div className="pt-6">
                 <button 
                   onClick={handleSaveGeneral}
                   disabled={generalSaving}
                   className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center disabled:opacity-70"
                 >
                   {generalSaving ? 'Saving...' : 'Save Changes'}
                 </button>
               </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && currentUser.role !== 'DEPARTMENT_CUSTOMER' && (
            <div>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Team Members</h3>
                  <button 
                    onClick={() => setInviteModalOpen(true)}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition shadow-sm"
                  >
                    <Plus size={16} /> <span>Invite User</span>
                  </button>
               </div>
               
               <div className="overflow-hidden border border-slate-200 rounded-xl">
                 <table className="min-w-full divide-y divide-slate-200">
                   <thead className="bg-slate-50">
                     <tr>
                       <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                       <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                       <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                       <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-slate-200">
                     {users.map((user) => (
                       <tr key={user.id} className="hover:bg-slate-50">
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center">
                             <img className="h-8 w-8 rounded-full bg-slate-200" src={user.avatarUrl} alt="" />
                             <div className="ml-4">
                               <div className="text-sm font-bold text-slate-900">{user.name}</div>
                               <div className="text-xs text-slate-500">{user.email}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 text-indigo-700">
                             {user.role}
                           </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                           {user.department || '-'}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <button className="text-indigo-600 hover:text-indigo-900 mr-3"><Edit2 size={16}/></button>
                           <button className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>

               {/* Mock Invite Modal */}
               {inviteModalOpen && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-[400px] shadow-2xl">
                       <h3 className="text-xl font-bold mb-4">Invite New User</h3>
                       <form onSubmit={handleInvite} className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                            <input type="email" required className="w-full border border-slate-300 rounded-lg p-2" placeholder="colleague@dps.k12.org"/>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                            <select className="w-full border border-slate-300 rounded-lg p-2">
                               <option>RAAD_ANALYST</option>
                               <option>DEPARTMENT_CUSTOMER</option>
                               <option>RAAD_MANAGER</option>
                            </select>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setInviteModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold">Cancel</button>
                            <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-bold">Send Invite</button>
                          </div>
                       </form>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* CONFIG TAB */}
          {activeTab === 'config' && currentUser.role !== 'DEPARTMENT_CUSTOMER' && (
             <div className="space-y-8 max-w-2xl">
                <div>
                   <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                     <Database size={20} className="mr-2 text-slate-400"/> Departments
                   </h3>
                   <div className="space-y-2">
                      {departments.map(dept => (
                        <div key={dept} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg bg-slate-50 group hover:border-slate-300 transition-colors">
                           <span className="font-medium text-slate-700">{dept}</span>
                           <button 
                             onClick={() => handleDeleteDepartment(dept)} 
                             className="text-slate-300 hover:text-red-500 transition-colors p-1"
                             title="Delete Department"
                           >
                             <Trash2 size={16}/>
                           </button>
                        </div>
                      ))}
                      
                      {isAddingDept ? (
                        <div className="flex items-center gap-2 p-2 border border-indigo-200 rounded-lg bg-indigo-50 animate-in fade-in zoom-in-95 duration-200">
                           <input 
                             type="text" 
                             value={newDeptName}
                             onChange={(e) => setNewDeptName(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && handleAddDepartment()}
                             autoFocus
                             className="flex-1 bg-white border border-indigo-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                             placeholder="Department Name"
                           />
                           <button 
                             onClick={handleAddDepartment}
                             className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition"
                           >
                             <Check size={16} />
                           </button>
                           <button 
                             onClick={() => setIsAddingDept(false)}
                             className="text-slate-500 hover:text-slate-700 p-1.5"
                           >
                             <X size={16} />
                           </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setIsAddingDept(true); setNewDeptName(''); }}
                          className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 font-bold text-sm transition-all"
                        >
                          + Add Department
                        </button>
                      )}
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                   <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                     <Shield size={20} className="mr-2 text-slate-400"/> Global Settings
                   </h3>
                   <div className={`flex items-center justify-between p-4 border rounded-xl transition-all duration-300 ${maintenanceMode ? 'bg-amber-50 border-amber-300 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
                      <div>
                         <h4 className={`font-bold ${maintenanceMode ? 'text-amber-800' : 'text-slate-700'}`}>Maintenance Mode</h4>
                         <p className={`text-xs ${maintenanceMode ? 'text-amber-600' : 'text-slate-500'}`}>Prevents non-admin users from logging in.</p>
                      </div>
                      <ToggleSwitch checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
                   </div>
                   {maintenanceMode && (
                     <div className="mt-2 text-xs text-amber-600 font-medium flex items-center">
                       <AlertCircle size={12} className="mr-1" /> System is currently locked for standard users.
                     </div>
                   )}
                </div>
             </div>
          )}

          {/* PLAYBOOK TAB (EDITABLE) */}
          {activeTab === 'playbook' && currentUser.role !== 'DEPARTMENT_CUSTOMER' && (
            <div className="space-y-6">
               <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Playbook Configuration</h3>
                    <p className="text-sm text-slate-500">Edit the phases and standard tasks for all projects.</p>
                  </div>
                  <button 
                    onClick={handleSavePlaybook}
                    disabled={playbookSaving}
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-700 flex items-center disabled:opacity-70"
                  >
                    <Save size={16} className="mr-2" />
                    {playbookSaving ? 'Saving...' : 'Save Config'}
                  </button>
               </div>
               
               <div className="space-y-6">
                  {playbookConfig.map(phase => (
                     <div key={phase.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                           <div>
                              <h4 className="font-bold text-slate-700">{phase.id}: {phase.title}</h4>
                              {phase.id === 'P1' && <span className="text-xs text-indigo-600 font-medium ml-2">(Rich Form Managed)</span>}
                           </div>
                           <span className="text-xs font-mono text-slate-400">{phase.items.length} Tasks</span>
                        </div>
                        
                        {phase.id === 'P1' ? (
                          <div className="p-4 text-sm text-slate-400 italic bg-slate-50/50">
                             Phase 1 is managed by a structured P1 Definition Form and cannot be edited as a simple list.
                          </div>
                        ) : (
                          <div className="p-4 space-y-3">
                             {phase.items.map((item, idx) => (
                               <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg group border border-transparent hover:border-slate-200 transition-all">
                                  <div className="pt-2 text-slate-400">
                                    <span className="font-mono text-xs">{idx + 1}.</span>
                                  </div>
                                  
                                  <div className="flex-1 space-y-2">
                                     <input 
                                       type="text" 
                                       value={item.label}
                                       onChange={(e) => handlePlaybookTaskChange(phase.id, item.id, 'label', e.target.value)}
                                       className="w-full bg-transparent font-bold text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded px-1 outline-none border border-transparent focus:border-indigo-300"
                                     />
                                     <input 
                                       type="text" 
                                       value={item.description}
                                       onChange={(e) => handlePlaybookTaskChange(phase.id, item.id, 'description', e.target.value)}
                                       className="w-full bg-transparent text-xs text-slate-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded px-1 outline-none border border-transparent focus:border-indigo-300"
                                     />
                                  </div>

                                  <div className="flex items-center gap-2">
                                     <button 
                                       onClick={() => handlePlaybookTaskChange(phase.id, item.id, 'required', !item.required)}
                                       className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-colors ${item.required ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                                     >
                                       {item.required ? 'REQUIRED' : 'OPTIONAL'}
                                     </button>
                                     <button 
                                        onClick={() => handleRemoveTask(phase.id, item.id)}
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Remove Task"
                                     >
                                        <Trash2 size={14}/>
                                     </button>
                                  </div>
                               </div>
                             ))}
                             
                             <button 
                               onClick={() => handleAddTask(phase.id)}
                               className="mt-2 w-full py-2 border border-dashed border-indigo-300 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center"
                             >
                               <Plus size={14} className="mr-1"/> Add Task to {phase.id}
                             </button>
                          </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === 'integrations' && currentUser.role !== 'DEPARTMENT_CUSTOMER' && (
             <div className="max-w-3xl space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <Key size={20} className="mr-2 text-slate-400"/> API Keys
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h4 className="font-bold text-slate-800">Matt AI (Gemini)</h4>
                           <p className="text-sm text-slate-500">Google Generative AI connection.</p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Connected</span>
                     </div>
                     <div className="flex gap-2">
                        <input type="password" value="************************" disabled className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-400" />
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-bold text-sm text-slate-700 hover:bg-slate-50">Rotate Key</button>
                     </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                   <h3 className="text-lg font-bold text-slate-800 mb-4">Connected Data Sources</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Snowflake DW', 'Power BI Tenant', 'Infinite Campus', 'Salesforce'].map(src => (
                        <div key={src} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition cursor-pointer flex items-center justify-between group">
                           <span className="font-bold text-slate-700">{src}</span>
                           <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-125 transition"></div>
                        </div>
                      ))}
                      <div className="p-4 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center justify-center text-slate-500 font-bold text-sm">
                         + Add Source
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* AUDIT TAB */}
          {activeTab === 'audit' && currentUser.role !== 'DEPARTMENT_CUSTOMER' && (
             <div>
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">System Audit Log</h3>
                  <button className="text-sm text-indigo-600 font-bold hover:underline">Export CSV</button>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                   <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                           <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">User</th>
                           <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Action</th>
                           <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                         {AUDIT_LOGS.map(log => (
                           <tr key={log.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center">
                                    <span className="text-sm font-bold text-slate-700">{log.user}</span>
                                    <span className="ml-2 text-[10px] bg-slate-100 px-1 rounded text-slate-500">{log.role}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-indigo-600">{log.action}</td>
                              <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{log.details}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
