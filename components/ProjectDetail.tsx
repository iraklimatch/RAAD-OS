
import React, { useState, useEffect } from 'react';
import { Project, User, ProjectStatus, PlaybookResponse, P1Definition, P2Definition, P3Definition } from '../types';
import { SupabaseBackend as Backend } from '../services/supabaseBackend';
import PlaybookChecklist from './PlaybookChecklist';
import MattAIPanel from './MattAIPanel';
import { ArrowLeft, Bot, Calendar, Users, BarChart2, Save, MoreHorizontal, FileText, CheckSquare, MessageSquare, ShieldCheck } from 'lucide-react';
import { USERS } from '../constants';

interface ProjectDetailProps {
  projectId: string;
  currentUser: User;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, currentUser, onBack }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'playbook' | 'comments'>('overview');

  useEffect(() => {
    const fetch = async () => {
      const p = await Backend.getProjectById(projectId);
      setProject(p || null);
      setLoading(false);
    };
    fetch();
  }, [projectId]);

  const handleUpdatePlaybook = async (itemId: string, status: PlaybookResponse['status'], notes: string) => {
    if (!project) return;
    const updatedResponses = {
      ...project.playbookResponses,
      [itemId]: { itemId, status, notes, completedBy: currentUser.id, completedAt: new Date().toISOString() }
    };
    const updatedProject = { ...project, playbookResponses: updatedResponses };
    setProject(updatedProject);
    await Backend.updateProject(updatedProject);
  };

  const handleUpdatePhaseData = async (field: keyof Project, data: any) => {
    if (!project) return;
    const updatedProject = { ...project, [field]: data };
    setProject(updatedProject);
    await Backend.updateProject(updatedProject);
  };

  const canEdit = currentUser.role === 'RAAD_ANALYST' || currentUser.role === 'RAAD_MANAGER' || currentUser.role === 'ADMIN';

  if (loading) return <div className="flex h-96 items-center justify-center text-slate-400 font-medium animate-pulse">Loading project data...</div>;
  if (!project) return <div className="p-8 text-center text-red-500">Project not found</div>;

  return (
    <div className="relative min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 transition font-medium">
          <ArrowLeft size={20} className="mr-2"/> Back to Projects
        </button>
        <div className="flex items-center space-x-3">
          {canEdit && (
            <button 
              onClick={() => setIsAiOpen(!isAiOpen)}
              className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-slate-700 hover:border-indigo-500 group"
            >
              <Bot size={18} className="text-indigo-400 group-hover:text-white transition-colors" />
              <span className="font-semibold">Ask Matt AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                 <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider border border-indigo-100">{project.type}</span>
                 <span className="text-slate-300 text-sm">|</span>
                 <span className="text-slate-500 text-sm font-medium">{project.department}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{project.name}</h1>
              <p className="text-slate-600 max-w-3xl text-lg leading-relaxed">{project.description}</p>
            </div>
            <div className="flex flex-col items-end">
               <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-sm shadow-sm border ${
                  project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                  project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  'bg-slate-50 text-slate-700 border-slate-200'
               }`}>
                  <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                    project.status === 'In Progress' ? 'bg-blue-500 animate-pulse' : 
                    project.status === 'Completed' ? 'bg-emerald-500' :
                    'bg-slate-400'
                  }`}></div>
                  {project.status}
               </div>
               <p className="text-xs text-slate-400 mt-3 font-medium">Last updated: {project.lastUpdated}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-100">
             <div className="group">
               <div className="flex items-center text-slate-400 mb-2 space-x-2">
                  <Users size={16} className="text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Lead Analyst</span>
               </div>
               <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                    <img src={USERS.find(u => u.id === project.analyticsLeadId)?.avatarUrl || "https://picsum.photos/201/201"} alt="Lead" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {USERS.find(u => u.id === project.analyticsLeadId)?.name || 'Unassigned'}
                  </span>
               </div>
             </div>
             <div>
               <div className="flex items-center text-slate-400 mb-2 space-x-2">
                  <Calendar size={16} className="text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Target Date</span>
               </div>
               <span className="text-sm font-bold text-slate-800">{project.targetEndDate}</span>
             </div>
             <div>
               <div className="flex items-center text-slate-400 mb-2 space-x-2">
                  <BarChart2 size={16} className="text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Phase</span>
               </div>
               <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">{project.phase}</span>
             </div>
             <div>
                <div className="flex items-center text-slate-400 mb-2 space-x-2">
                  <Save size={16} className="text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Progress</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                 <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${project.progress}%` }}></div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-slate-200 mb-8 px-2">
        {[
          { id: 'overview', label: 'Overview', icon: FileText },
          { id: 'playbook', label: 'Playbook & Tasks', icon: CheckSquare },
          { id: 'comments', label: 'Discussion', icon: MessageSquare }
        ].map(tab => {
           const Icon = tab.icon;
           const isActive = activeTab === tab.id;
           return (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`pb-4 text-sm font-bold transition-all relative flex items-center space-x-2 ${
                 isActive 
                   ? 'text-indigo-600' 
                   : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               <Icon size={18} />
               <span>{tab.label}</span>
               {isActive && (
                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full shadow-[0_-2px_6px_rgba(79,70,229,0.3)]"></span>
               )}
             </button>
           );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Current Status</h3>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="text-xs uppercase text-slate-400 font-bold mb-2 tracking-wider">Current Step</h4>
                    <p className="text-slate-800 font-medium">{project.currentStep}</p>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl border border-blue-100">
                    <h4 className="text-xs uppercase text-indigo-500 font-bold mb-2 tracking-wider flex items-center">
                      <Bot size={14} className="mr-1.5" /> Next Steps
                    </h4>
                    <p className="text-indigo-900 font-medium">{project.nextSteps}</p>
                  </div>
                </div>
              </div>

              {/* Stakeholders Section (Based on P1 Data) */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-lg text-slate-800">Key Stakeholders</h3>
                   <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                     project.p1Definition.clientSignOff.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                   }`}>
                     Sign-off: {project.p1Definition.clientSignOff.status}
                   </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.p1Definition.stakeholders.length === 0 ? (
                    <p className="text-slate-400 text-sm">No stakeholders defined in Playbook P1.</p>
                  ) : (
                    project.p1Definition.stakeholders.map((s, idx) => {
                       const user = USERS.find(u => u.id === s.userId);
                       return (
                         <div key={idx} className="flex items-center p-3 border border-slate-100 rounded-xl bg-slate-50">
                            <img src={user?.avatarUrl} className="w-10 h-10 rounded-full bg-slate-200 mr-3" alt="avatar" />
                            <div>
                               <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                               <p className="text-xs text-indigo-600 font-semibold uppercase">{s.role}</p>
                            </div>
                         </div>
                       );
                    })
                  )}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Project Notes</h3>
                <div className="prose prose-slate max-w-none">
                   <p className="text-slate-600 whitespace-pre-line leading-relaxed">{project.notes || "No additional notes recorded."}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <h3 className="font-bold text-lg text-slate-800 mb-4">Documents</h3>
                 {project.documents.length > 0 ? (
                   <ul className="space-y-3">
                     {project.documents.map((doc, i) => (
                       <li key={i} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group border border-transparent hover:border-blue-100">
                         <div className="p-2 bg-white rounded-md shadow-sm mr-3">
                            <FileText size={16} className="text-blue-500" />
                         </div>
                         <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{doc.name}</span>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                     <p className="text-slate-400 text-sm">No documents attached.</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'playbook' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
             <div className="mb-8 p-6 bg-indigo-600 text-white rounded-2xl shadow-lg flex items-start space-x-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
               <Bot className="text-indigo-200 mt-1 flex-shrink-0 relative z-10" size={24} />
               <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-1">Playbook Assistant</h3>
                 <p className="text-indigo-100 opacity-90 leading-relaxed max-w-2xl">
                   Follow the RAAD Standard Operating Procedure. I can help you validate your work before moving to the next phase. 
                   Open the <button onClick={() => setIsAiOpen(true)} className="underline hover:text-white font-semibold">AI Panel</button> to check readiness.
                 </p>
               </div>
             </div>
             <PlaybookChecklist 
               project={project} 
               currentUser={currentUser}
               onUpdateResponse={handleUpdatePlaybook} 
               onUpdatePhaseData={handleUpdatePhaseData}
               onOpenAi={() => setIsAiOpen(true)}
               readOnly={!canEdit} 
             />
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="max-w-3xl mx-auto text-center py-20 text-slate-400 animate-in fade-in duration-300">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={24} className="text-slate-300" />
             </div>
             <p className="text-lg font-medium text-slate-600">No comments yet</p>
             <p className="text-sm mt-2">Start the discussion by adding a note.</p>
          </div>
        )}
      </div>

      <MattAIPanel project={project} isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
};

export default ProjectDetail;
