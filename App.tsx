
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import RequestForm from './components/RequestForm';
import ReportCatalog from './components/ReportCatalog';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import { User } from './types';
import { MockBackend } from './services/mockBackend';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Initial Data Load
  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  const refreshData = async () => {
    setLoading(true);
    const [p, r] = await Promise.all([
      MockBackend.getProjects(),
      MockBackend.getRequests()
    ]);
    setProjects(p);
    setRequests(r);
    setLoading(false);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProjectId(null);
    setActiveTab('dashboard');
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setSelectedProjectId(null);
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
  };

  const renderContent = () => {
    if (loading && !selectedProjectId) {
      return (
         <div className="flex h-[80vh] items-center justify-center">
            <div className="text-center">
               <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-slate-400 font-medium">Loading Workspace...</p>
            </div>
         </div>
      );
    }

    if (selectedProjectId) {
      return (
        <ProjectDetail 
          projectId={selectedProjectId} 
          currentUser={currentUser!} 
          onBack={() => setSelectedProjectId(null)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={currentUser!} projects={projects} requests={requests} onNavigate={handleNavigate} />;
      case 'projects':
        return <ProjectList projects={projects} user={currentUser!} onSelectProject={handleProjectSelect} />;
      case 'intake':
        return <RequestForm user={currentUser!} onSubmitSuccess={() => { handleNavigate('dashboard'); refreshData(); }} />;
      case 'reports':
        return <ReportCatalog />;
      case 'settings':
        return <SettingsPage currentUser={currentUser!} />;
      default:
        return <div>Not found</div>;
    }
  };

  // Auth Guard
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={currentUser} 
      activeTab={selectedProjectId ? 'projects' : activeTab} 
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
