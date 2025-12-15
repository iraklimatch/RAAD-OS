import React, { useState } from 'react';
import { User, Request } from '../types';
import { SupabaseBackend as Backend } from '../services/supabaseBackend';
import { Send, Bot } from 'lucide-react';

interface RequestFormProps {
  user: User;
  onSubmitSuccess: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ user, onSubmitSuccess }) => {
  const [formData, setFormData] = useState<Partial<Request>>({
    department: user.department || '',
    background: '',
    coreQuestion: '',
    goals: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newReq: Request = {
      id: crypto.randomUUID(),
      requesterId: user.id,
      requesterName: user.name,
      department: formData.department!,
      background: formData.background!,
      coreQuestion: formData.coreQuestion!,
      goals: formData.goals!,
      status: 'New',
      submittedAt: new Date().toISOString()
    };

    await Backend.createRequest(newReq);
    setIsSubmitting(false);
    onSubmitSuccess();
  };

  const handleAiAssist = () => {
    // Mock AI refinement for the prototype
    setFormData(prev => ({
        ...prev,
        background: prev.background + " (Refined by Matt AI: Added context about strategic alignment.)",
        coreQuestion: prev.coreQuestion + " (Refined: Made measurable.)"
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">New Analytics Request</h2>
        <p className="text-slate-500 mt-2">Tell us what you need. Matt AI will help route this to the right team.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
            <input 
              type="text" 
              value={formData.department} 
              onChange={e => setFormData({...formData, department: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Transportation"
              required
            />
          </div>

          <div>
            <div className="flex justify-between">
               <label className="block text-sm font-semibold text-slate-700 mb-1">Background / Context</label>
               <button type="button" onClick={handleAiAssist} className="text-xs text-indigo-600 flex items-center hover:underline">
                 <Bot size={12} className="mr-1"/> Refine with AI
               </button>
            </div>
            <textarea 
              value={formData.background}
              onChange={e => setFormData({...formData, background: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-24"
              placeholder="Why is this project being undertaken? What is the problem?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Core Business Question</label>
            <input 
              type="text" 
              value={formData.coreQuestion} 
              onChange={e => setFormData({...formData, coreQuestion: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="What is the single most important question to answer?"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Example: "How can we reduce late bus arrivals by 10%?"</p>
          </div>

           <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Goals & Deliverables</label>
            <textarea 
              value={formData.goals}
              onChange={e => setFormData({...formData, goals: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-24"
              placeholder="What does success look like? (e.g. Dashboard, PDF Report, Dataset)"
              required
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : <><Send size={18} className="mr-2"/> Submit Request</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
