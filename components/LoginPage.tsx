
import React, { useState } from 'react';
import { USERS } from '../constants';
import { User } from '../types';
import { Lock, ArrowRight, Activity, ShieldCheck, Users, LineChart } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      onLogin(user);
    } else {
      setError('User not found. Try the demo buttons below.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 p-4">
        
        {/* Left Side: Brand & Visuals */}
        <div className="hidden lg:flex flex-col justify-center p-8 lg:p-12 text-white">
          <div className="mb-6 inline-flex items-center space-x-3">
             <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
               <Activity size={32} className="text-white" />
             </div>
             <h1 className="text-3xl font-bold tracking-tight">RAAD OS</h1>
          </div>
          <h2 className="text-4xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100">
            The Operating System for Analytics.
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Manage projects, track operational KPIs, and leverage Matt AI to streamline your analytics workflow across Denver Public Schools.
          </p>
          
          <div className="space-y-4">
             <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="text-green-400" />
                <div>
                   <h3 className="font-semibold">Secure Access</h3>
                   <p className="text-sm text-slate-400">Role-based permissions & SSO integration.</p>
                </div>
             </div>
             <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <LineChart className="text-blue-400" />
                <div>
                   <h3 className="font-semibold">Performance Tracking</h3>
                   <p className="text-sm text-slate-400">Real-time dashboards & insights.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 lg:p-10 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Sign In</h3>
              <p className="text-slate-500 mt-2">Access your workspace</p>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="name@dps.k12.org"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button 
                type="submit" 
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Lock size={18} />
                <span>Secure Login</span>
              </button>
            </form>

            <div className="relative mb-8">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-slate-200"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-white text-slate-400">Or use a demo account</span>
               </div>
            </div>

            <div className="space-y-3">
              <button onClick={() => onLogin(USERS[0])} className="w-full group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all bg-white">
                 <div className="flex items-center space-x-3">
                    <img src={USERS[0].avatarUrl} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar"/>
                    <div className="text-left">
                       <p className="text-sm font-bold text-slate-800">Sarah Manager</p>
                       <p className="text-xs text-slate-500">RAAD Manager</p>
                    </div>
                 </div>
                 <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors"/>
              </button>
              
              <button onClick={() => onLogin(USERS[1])} className="w-full group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all bg-white">
                 <div className="flex items-center space-x-3">
                    <img src={USERS[1].avatarUrl} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar"/>
                    <div className="text-left">
                       <p className="text-sm font-bold text-slate-800">Alex Analyst</p>
                       <p className="text-xs text-slate-500">RAAD Analyst</p>
                    </div>
                 </div>
                 <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors"/>
              </button>

              <button onClick={() => onLogin(USERS[2])} className="w-full group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all bg-white">
                 <div className="flex items-center space-x-3">
                    <img src={USERS[2].avatarUrl} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar"/>
                    <div className="text-left">
                       <p className="text-sm font-bold text-slate-800">Jordan Customer</p>
                       <p className="text-xs text-slate-500">Department Customer</p>
                    </div>
                 </div>
                 <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 transition-colors"/>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
