
import React, { useState, useEffect } from 'react';
import { Project, PlaybookPhase, PlaybookResponse, P1Definition, P2Definition, P3Definition, P4ADefinition, P4BDefinition, User, StakeholderRole, WidgetDef, FilterDef } from '../types';
import { PLAYBOOK, USERS } from '../constants';
import { CheckCircle2, ChevronDown, ChevronRight, AlertTriangle, Calendar, Users, DollarSign, Target, ShieldAlert, FileSignature, Save, Clock, Database, Layers, Search, Bot, Plus, Trash2, List } from 'lucide-react';

interface PlaybookChecklistProps {
  project: Project;
  currentUser: User;
  onUpdateResponse: (itemId: string, status: PlaybookResponse['status'], notes: string) => void;
  onUpdatePhaseData?: (field: keyof Project, data: any) => void;
  onOpenAi: () => void;
  readOnly: boolean;
}

const DEFAULT_P2: P2Definition = {
  dataSourceId: '', accessNeeded: '', format: '', betterAlternatives: '',
  extractionReproducible: '', reportLevelFilters: '', manipulation: '', automationOpportunity: '',
  cleaningSteps: '', calcFieldsStrategy: '', missingValuesStrategy: '',
  validationSanityCheck: false, validationEdgeCase: false, validationCheckpoint: false,
  completionPercentage: 0
};

const DEFAULT_P3: P3Definition = {
  questionsToAnswer: '', keyDeliverable: '',
  codeReviewDone: false, logicReviewDone: false, adaptations: '',
  deliveryMethod: '',
  completionPercentage: 0
};

const DEFAULT_P4A: P4ADefinition = {
  updateFrequency: '', keyMetricJustification: '', deliveryMethod: '', accessibilityRequirements: '', communicationList: ''
};

const DEFAULT_P4B: P4BDefinition = { 
  functionalityDecision: 'Mockup', prototypeType: '', dataFreshness: '',
  widgets: [], filters: [], engineeringAccess: '', engineeringDataModel: '', userFeedbackAction: '',
  dotsHandoff: { prototypeFile: false, dataSources: false, calcLogic: false, refreshCadence: false, ticketNumber: '' }
};

const DEFAULT_P4 = {
  mode: null as 'A' | 'B' | null,
  p4a: DEFAULT_P4A,
  p4b: DEFAULT_P4B
};

const PlaybookChecklist: React.FC<PlaybookChecklistProps> = ({ project, currentUser, onUpdateResponse, onUpdatePhaseData, onOpenAi, readOnly }) => {
  const [expandedPhase, setExpandedPhase] = useState<string>(project.phase);
  
  // Local state for P1-P4 forms
  const [p1Form, setP1Form] = useState<P1Definition>(project.p1Definition);
  const [p2Form, setP2Form] = useState<P2Definition>(project.p2Definition || DEFAULT_P2);
  const [p3Form, setP3Form] = useState<P3Definition>(project.p3Definition || DEFAULT_P3);
  const [p4Form, setP4Form] = useState(project.p4Definition || DEFAULT_P4);

  const [activeSection, setActiveSection] = useState<number>(1);
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    setP1Form(project.p1Definition);
    setP2Form(project.p2Definition || DEFAULT_P2);
    setP3Form(project.p3Definition || DEFAULT_P3);
    setP4Form(project.p4Definition || DEFAULT_P4);
  }, [project.id]);

  // --- Handlers ---
  const handleP1Change = (field: keyof P1Definition, value: any) => {
    if (readOnly) return;
    setP1Form(prev => ({ ...prev, [field]: value }));
    setUnsaved(true);
  };
  const handleP2Change = (field: keyof P2Definition, value: any) => {
    if (readOnly) return;
    setP2Form(prev => ({ ...prev, [field]: value }));
    setUnsaved(true);
  };
  const handleP3Change = (field: keyof P3Definition, value: any) => {
    if (readOnly) return;
    setP3Form(prev => ({ ...prev, [field]: value }));
    setUnsaved(true);
  };
  // Handle P4 logic (A vs B)
  const handleP4ModeChange = (mode: 'A' | 'B') => {
    if (readOnly) return;
    setP4Form(prev => ({ ...prev, mode }));
    setUnsaved(true);
  };

  const saveAll = () => {
    if (!onUpdatePhaseData) return;
    onUpdatePhaseData('p1Definition', p1Form);
    onUpdatePhaseData('p2Definition', p2Form);
    onUpdatePhaseData('p3Definition', p3Form);
    onUpdatePhaseData('p4Definition', p4Form);
    setUnsaved(false);
  };

  const addWidget = () => {
     const newWidget: WidgetDef = { id: Date.now().toString(), metric: '', chartType: 'Bar', description: '', requiredFields: '' };
     setP4Form(prev => ({ ...prev, p4b: { ...prev.p4b, widgets: [...prev.p4b.widgets, newWidget] } }));
     setUnsaved(true);
  };
  const updateWidget = (id: string, field: keyof WidgetDef, value: string) => {
     setP4Form(prev => ({ ...prev, p4b: { ...prev.p4b, widgets: prev.p4b.widgets.map(w => w.id === id ? { ...w, [field]: value } : w) } }));
     setUnsaved(true);
  };
  const removeWidget = (id: string) => {
     setP4Form(prev => ({ ...prev, p4b: { ...prev.p4b, widgets: prev.p4b.widgets.filter(w => w.id !== id) } }));
     setUnsaved(true);
  };

  // --- RENDERERS ---

  const renderP1 = () => (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Background / Purpose</label>
        <textarea disabled={readOnly} value={p1Form.background} onChange={(e) => handleP1Change('background', e.target.value)} className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Goals</label>
        <textarea disabled={readOnly} value={p1Form.goals} onChange={(e) => handleP1Change('goals', e.target.value)} className="w-full h-20 p-3 border border-slate-300 rounded-lg text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1">Core Question</label>
           <input disabled={readOnly} value={p1Form.coreQuestion} onChange={(e) => handleP1Change('coreQuestion', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm" />
        </div>
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1">Success Definition</label>
           <input disabled={readOnly} value={p1Form.successDefinition} onChange={(e) => handleP1Change('successDefinition', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm" />
        </div>
      </div>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
         <h4 className="font-bold text-sm mb-2">Stakeholders</h4>
         {p1Form.stakeholders.length === 0 && <span className="text-xs text-slate-400">None added</span>}
         {p1Form.stakeholders.map((s, idx) => (
            <div key={idx} className="text-xs flex justify-between py-1 border-b border-slate-200 last:border-0">
               <span>{USERS.find(u => u.id === s.userId)?.name}</span>
               <span className="font-bold text-indigo-600">{s.role}</span>
            </div>
         ))}
      </div>
    </div>
  );

  const renderP2 = () => (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <h4 className="flex items-center font-bold text-slate-800 mb-3"><Database size={16} className="mr-2 text-indigo-500"/> 1. Data Source ID</h4>
           <div className="space-y-3">
             <input disabled={readOnly} placeholder="Data Source Name / Link" value={p2Form.dataSourceId} onChange={(e) => handleP2Change('dataSourceId', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm" />
             <input disabled={readOnly} placeholder="Access Needed?" value={p2Form.accessNeeded} onChange={(e) => handleP2Change('accessNeeded', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm" />
             <input disabled={readOnly} placeholder="Format (CSV, SQL, etc.)" value={p2Form.format} onChange={(e) => handleP2Change('format', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm" />
           </div>
        </div>
        <div>
           <h4 className="flex items-center font-bold text-slate-800 mb-3"><Layers size={16} className="mr-2 text-indigo-500"/> 2. Data Extraction</h4>
           <div className="space-y-3">
             <textarea disabled={readOnly} placeholder="Is Extraction Reproducible? (SQL/Script)" value={p2Form.extractionReproducible} onChange={(e) => handleP2Change('extractionReproducible', e.target.value)} className="w-full h-24 p-2 border border-slate-300 rounded-lg text-sm" />
             <input disabled={readOnly} placeholder="Report-Level Filters" value={p2Form.reportLevelFilters} onChange={(e) => handleP2Change('reportLevelFilters', e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg text-sm" />
           </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
         <div className="flex justify-between items-center mb-3">
            <h4 className="flex items-center font-bold text-slate-800"><Bot size={16} className="mr-2 text-indigo-500"/> 3. Data Cleaning & Transformation</h4>
            <button onClick={onOpenAi} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100">Ask Matt AI for help</button>
         </div>
         <textarea disabled={readOnly} placeholder="Paste your cleaning steps here or ask AI to generate them..." value={p2Form.cleaningSteps} onChange={(e) => handleP2Change('cleaningSteps', e.target.value)} className="w-full h-32 p-3 border border-slate-300 rounded-lg text-sm font-mono bg-slate-50" />
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
         <label className="flex items-center space-x-2 text-sm text-slate-700 font-bold p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
            <input type="checkbox" checked={p2Form.validationSanityCheck} onChange={(e) => handleP2Change('validationSanityCheck', e.target.checked)} />
            <span>Sanity Check Passed</span>
         </label>
         <label className="flex items-center space-x-2 text-sm text-slate-700 font-bold p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
            <input type="checkbox" checked={p2Form.validationEdgeCase} onChange={(e) => handleP2Change('validationEdgeCase', e.target.checked)} />
            <span>Edge Cases Tested</span>
         </label>
      </div>
    </div>
  );

  const renderP3 = () => (
    <div className="space-y-6 p-4">
       <div>
         <label className="block text-sm font-bold text-slate-700 mb-1">Business Need / Impact</label>
         <textarea disabled={readOnly} placeholder="What questions are we ultimately trying to answer?" value={p3Form.questionsToAnswer} onChange={(e) => handleP3Change('questionsToAnswer', e.target.value)} className="w-full h-24 p-3 border border-slate-300 rounded-lg text-sm" />
       </div>
       
       <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-xl">
          <h4 className="font-bold text-indigo-900 mb-4">Decision Fork: Delivery Method</h4>
          <p className="text-sm text-indigo-700 mb-4">Does this project need a Dashboard (Prototype) or is it a Final Report?</p>
          <div className="flex gap-4">
             <button 
               onClick={() => { handleP3Change('deliveryMethod', 'Final Report (P4-A)'); handleP4ModeChange('A'); }}
               className={`flex-1 py-3 px-4 rounded-lg font-bold border ${p3Form.deliveryMethod === 'Final Report (P4-A)' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300'}`}
             >
               Final Report (Static)
             </button>
             <button 
               onClick={() => { handleP3Change('deliveryMethod', 'Dashboard Prototype (P4-B)'); handleP4ModeChange('B'); }}
               className={`flex-1 py-3 px-4 rounded-lg font-bold border ${p3Form.deliveryMethod === 'Dashboard Prototype (P4-B)' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300'}`}
             >
               Dashboard Prototype
             </button>
          </div>
       </div>
       
       <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2 p-3 border rounded-lg">
             <input type="checkbox" checked={p3Form.codeReviewDone} onChange={(e) => handleP3Change('codeReviewDone', e.target.checked)} />
             <span className="font-bold text-sm">Code Review Complete</span>
          </label>
          <label className="flex items-center space-x-2 p-3 border rounded-lg">
             <input type="checkbox" checked={p3Form.logicReviewDone} onChange={(e) => handleP3Change('logicReviewDone', e.target.checked)} />
             <span className="font-bold text-sm">Logic Review Complete</span>
          </label>
       </div>
    </div>
  );

  const renderP4 = () => {
    if (!p4Form.mode) return <div className="p-8 text-center text-slate-400 italic">Please select a Delivery Method in Phase 3 to unlock Phase 4.</div>;
    
    if (p4Form.mode === 'A') {
       // Static Solution
       return (
         <div className="space-y-6 p-4">
            <h4 className="text-lg font-bold text-slate-800 border-b pb-2">P4-A: Static Solution Delivery</h4>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Update Frequency</label>
               <select 
                 value={p4Form.p4a?.updateFrequency} 
                 onChange={(e) => {
                    const val = e.target.value;
                    setP4Form(prev => ({ ...prev, p4a: { ...prev.p4a, updateFrequency: val } }));
                    setUnsaved(true);
                 }}
                 className="w-full p-2 border border-slate-300 rounded-lg text-sm"
               >
                  <option value="">Select...</option>
                  <option value="One-time">One-time</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Delivery Format</label>
               <input 
                 value={p4Form.p4a?.deliveryMethod}
                 onChange={(e) => {
                    const val = e.target.value;
                    setP4Form(prev => ({ ...prev, p4a: { ...prev.p4a, deliveryMethod: val } }));
                    setUnsaved(true);
                 }}
                 placeholder="e.g. Email, Slide Deck, PDF"
                 className="w-full p-2 border border-slate-300 rounded-lg text-sm"
               />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Communication Plan (Who gets what?)</label>
               <textarea 
                 value={p4Form.p4a?.communicationList}
                 onChange={(e) => {
                    const val = e.target.value;
                    setP4Form(prev => ({ ...prev, p4a: { ...prev.p4a, communicationList: val } }));
                    setUnsaved(true);
                 }}
                 className="w-full h-24 p-2 border border-slate-300 rounded-lg text-sm"
               />
            </div>
         </div>
       );
    }

    // P4-B Prototype
    return (
       <div className="space-y-8 p-4">
          <div className="flex justify-between items-center border-b pb-4">
             <h4 className="text-lg font-bold text-slate-800">P4-B: Dashboard Prototype</h4>
             <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p4Form.p4b.functionalityDecision === 'Mockup' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100'}`}>Mockup</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p4Form.p4b.functionalityDecision === 'Functional' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100'}`}>Functional</span>
             </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-slate-700">Widgets & Charts</label>
                <button onClick={addWidget} className="text-xs flex items-center bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold"><Plus size={12} className="mr-1"/> Add Widget</button>
             </div>
             <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                      <tr>
                         <th className="p-3">Metric</th>
                         <th className="p-3">Chart Type</th>
                         <th className="p-3">Description</th>
                         <th className="p-3 w-10"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {p4Form.p4b.widgets.map((w, idx) => (
                         <tr key={w.id}>
                            <td className="p-2"><input value={w.metric} onChange={(e) => updateWidget(w.id, 'metric', e.target.value)} className="w-full p-1 border rounded" /></td>
                            <td className="p-2">
                               <select value={w.chartType} onChange={(e) => updateWidget(w.id, 'chartType', e.target.value)} className="w-full p-1 border rounded">
                                  <option>Bar</option><option>Line</option><option>KPI Card</option><option>Table</option>
                               </select>
                            </td>
                            <td className="p-2"><input value={w.description} onChange={(e) => updateWidget(w.id, 'description', e.target.value)} className="w-full p-1 border rounded" /></td>
                            <td className="p-2 text-center"><button onClick={() => removeWidget(w.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button></td>
                         </tr>
                      ))}
                      {p4Form.p4b.widgets.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-slate-400">No widgets defined.</td></tr>}
                   </tbody>
                </table>
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">Engineering Data Model (Fact/Dim)</label>
             <textarea 
               value={p4Form.p4b.engineeringDataModel}
               onChange={(e) => {
                  const val = e.target.value;
                  setP4Form(prev => ({ ...prev, p4b: { ...prev.p4b, engineeringDataModel: val } }));
                  setUnsaved(true);
               }}
               className="w-full h-32 p-3 border border-slate-300 rounded-lg text-sm font-mono bg-slate-50" 
               placeholder="Define Fact Table Fields, Dimension Tables..."
             />
          </div>
       </div>
    );
  };

  // --- Main Layout ---
  const renderPhaseContent = (phaseId: string) => {
    switch (phaseId) {
      case 'P1': return renderP1();
      case 'P2': return renderP2();
      case 'P3': return renderP3();
      case 'P4': return renderP4();
      default: 
         // Fallback for P5, P6 (Generic Checklist)
         const phase = PLAYBOOK.find(p => p.id === phaseId);
         if (!phase) return null;
         return (
            <div className="p-4 space-y-3">
               {phase.items.map(item => {
                  const response = project.playbookResponses[item.id] || { status: 'Not Started', notes: '' };
                  return (
                     <div key={item.id} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg border">
                        <div>
                           <div className="font-bold text-sm">{item.label}</div>
                           <div className="text-xs text-slate-500">{item.description}</div>
                        </div>
                        <select 
                          value={response.status} 
                          onChange={(e) => onUpdateResponse(item.id, e.target.value as any, response.notes || '')}
                          className="text-xs p-1 rounded border"
                        >
                           <option>Not Started</option><option>Completed</option>
                        </select>
                     </div>
                  );
               })}
            </div>
         );
    }
  };

  return (
    <div className="space-y-4">
       {/* Global Save */}
       {unsaved && (
          <div className="sticky top-0 z-20 bg-indigo-600 text-white p-3 rounded-lg shadow-md flex justify-between items-center mb-4 animate-in slide-in-from-top-2">
             <span className="font-bold text-sm flex items-center"><AlertTriangle size={16} className="mr-2"/> You have unsaved changes in the Playbook.</span>
             <button onClick={saveAll} className="bg-white text-indigo-600 px-4 py-1.5 rounded-md font-bold text-sm hover:bg-indigo-50">Save All Changes</button>
          </div>
       )}

       {PLAYBOOK.map((phase) => (
         <div key={phase.id} className={`border rounded-xl bg-white transition-all ${expandedPhase === phase.id ? 'ring-2 ring-indigo-100 border-indigo-200' : 'border-slate-200'}`}>
            <button 
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? '' : phase.id)}
              className="w-full flex items-center justify-between p-4"
            >
               <div className="flex items-center space-x-3">
                  {expandedPhase === phase.id ? <ChevronDown size={20} className="text-slate-400"/> : <ChevronRight size={20} className="text-slate-400"/>}
                  <div className="text-left">
                     <h3 className={`font-bold ${expandedPhase === phase.id ? 'text-indigo-700' : 'text-slate-700'}`}>{phase.title}</h3>
                     {/* Dynamic Subtitles */}
                     {phase.id === 'P3' && p3Form.deliveryMethod && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded ml-2">{p3Form.deliveryMethod}</span>}
                     {phase.id === 'P4' && p4Form.mode === 'B' && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded ml-2">Prototyping</span>}
                  </div>
               </div>
            </button>
            
            {expandedPhase === phase.id && (
               <div className="border-t border-slate-100">
                  {renderPhaseContent(phase.id)}
               </div>
            )}
         </div>
       ))}
    </div>
  );
};

export default PlaybookChecklist;
