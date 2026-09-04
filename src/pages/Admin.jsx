import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import AdminProjects from './admin/AdminProjects';
import AdminExperiences from './admin/AdminExperiences';
import AdminCertificates from './admin/AdminCertificates';
import AdminAchievements from './admin/AdminAchievements';
import AdminProfile from './admin/AdminProfile';

const Admin = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email atau password salah.');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-800 p-4 relative z-10">
        <div className="glass p-8 rounded-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Admin Portfolio</h1>
          <p className="text-slate-600 mb-6">Masuk untuk mengelola project dan pengalaman</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 rounded bg-white/50 border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 rounded bg-white/50 border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium mt-2">Masuk</button>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 py-12 px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Kelola Portfolio</h1>
            <p className="text-slate-600">{session.user.email}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded text-slate-700">Keluar</button>
        </div>

        <div className="flex gap-2 mb-8 pb-2 overflow-x-auto custom-scrollbar">
          {['projects', 'experiences', 'certificates', 'achievements', 'profile'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl capitalize whitespace-nowrap font-medium transition-all duration-300 ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'glass hover:bg-white/40 text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'experiences' && <AdminExperiences />}
        {activeTab === 'certificates' && <AdminCertificates />}
        {activeTab === 'achievements' && <AdminAchievements />}
        {activeTab === 'profile' && <AdminProfile />}
        {activeTab !== 'projects' && activeTab !== 'experiences' && activeTab !== 'certificates' && activeTab !== 'achievements' && activeTab !== 'profile' && (
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 capitalize text-slate-800">Kelola {activeTab}</h2>
            <p className="text-slate-600">Modul pengelolaan {activeTab} sedang dalam proses migrasi ke arsitektur React secara penuh. Anda dapat menambahkan data langsung melalui Supabase Dashboard untuk sementara.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
