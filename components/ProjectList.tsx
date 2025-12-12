import React, { useState } from 'react';
import { Project, User } from '../types';
import { Search, Filter } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  user: User;
  onSelectProject: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, user, onSelectProject }) => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(filter.toLowerCase()) || p.department.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
         <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="relative">
               <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
               <select 
                 className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
               >
                 <option value="All">All Statuses</option>
                 <option value="In Progress">In Progress</option>
                 <option value="In Discovery">In Discovery</option>
                 <option value="Completed">Completed</option>
                 <option value="On Hold">On Hold</option>
               </select>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
               <th className="px-6 py-4">Project Name</th>
               <th className="px-6 py-4">Department</th>
               <th className="px-6 py-4">Phase</th>
               <th className="px-6 py-4">Status</th>
               <th className="px-6 py-4">Target Date</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No projects found.</td>
                </tr>
             ) : (
               filtered.map(p => (
                 <tr 
                   key={p.id} 
                   onClick={() => onSelectProject(p.id)}
                   className="hover:bg-slate-50 cursor-pointer transition-colors"
                 >
                   <td className="px-6 py-4">
                     <div className="font-semibold text-slate-800">{p.name}</div>
                     <div className="text-xs text-slate-500">{p.type}</div>
                   </td>
                   <td className="px-6 py-4 text-sm text-slate-600">{p.department}</td>
                   <td className="px-6 py-4">
                     <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">{p.phase}</span>
                   </td>
                   <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        p.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {p.status}
                      </span>
                   </td>
                   <td className="px-6 py-4 text-sm text-slate-500">{p.targetEndDate}</td>
                 </tr>
               ))
             )}
           </tbody>
         </table>
      </div>
    </div>
  );
};

export default ProjectList;
