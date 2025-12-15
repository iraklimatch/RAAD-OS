import React, { useState, useEffect } from 'react';
import { Report } from '../types';
import { SupabaseBackend as Backend } from '../services/supabaseBackend';
import { ExternalLink, Search } from 'lucide-react';

const ReportCatalog: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    Backend.getReports().then(setReports);
  }, []);

  const filtered = reports.filter(r => 
    r.name.toLowerCase().includes(filter.toLowerCase()) || 
    r.department.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Report Catalog</h2>
          <p className="text-slate-500">Access all standardized dashboards and reports.</p>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Search catalog..." 
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(report => (
          <div key={report.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">{report.department}</span>
              {report.active ? (
                <span className="w-2 h-2 bg-green-500 rounded-full" title="Active"></span>
              ) : (
                <span className="w-2 h-2 bg-red-500 rounded-full" title="Inactive"></span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{report.name}</h3>
            <div className="space-y-2 text-sm text-slate-500 mb-6">
               <div className="flex justify-between">
                 <span>Frequency:</span>
                 <span className="font-medium text-slate-700">{report.frequency}</span>
               </div>
               <div className="flex justify-between">
                 <span>Type:</span>
                 <span className="font-medium text-slate-700">{report.type}</span>
               </div>
               <div className="flex justify-between">
                 <span>Last Updated:</span>
                 <span className="font-medium text-slate-700">{report.lastUpdated}</span>
               </div>
            </div>
            <a 
              href={report.link} 
              className="block w-full text-center py-2 border border-blue-200 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              Open Report <ExternalLink size={16} className="ml-2"/>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCatalog;
