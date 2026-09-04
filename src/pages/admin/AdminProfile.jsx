import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    role: '',
    bio_short: '',
    bio_long: '',
    avatar_url: '',
    cv_url: '',
    email: '',
    github_url: '',
    linkedin_url: '',
    whatsapp_url: ''
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
      alert('Foto profil berhasil diunggah! Ingat untuk menekan tombol "Simpan Profil" di bawah untuk menyimpan perubahan secara permanen.');
    } catch (error) {
      alert('Gagal mengunggah foto: ' + error.message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    
    // Dapatkan user aktif
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', user.id)
      .limit(1);

    if (!error && data && data.length > 0) {
      const p = data[0];
      setProfileId(p.id);
      setFormData({
        username: p.username || '',
        full_name: p.full_name || '',
        role: p.role || '',
        bio_short: p.bio_short || '',
        bio_long: p.bio_long || '',
        avatar_url: p.avatar_url || '',
        cv_url: p.cv_url || '',
        email: p.email || '',
        github_url: p.github_url || '',
        linkedin_url: p.linkedin_url || '',
        whatsapp_url: p.whatsapp_url || ''
      });
    } else if (error) {
      console.error('Error fetching profile:', error);
    }
    // Jika tidak ada profil, biarkan form kosong dan profileId null
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Validasi username
    if (!formData.username) {
      alert("Username tidak boleh kosong. Username dibutuhkan untuk URL portofolio (VITE_PORTFOLIO_USERNAME).");
      setSaving(false);
      return;
    }

    if (profileId) {
      // Update
      const { error } = await supabase
        .from('profile')
        .update(formData)
        .eq('id', profileId);

      if (!error) {
        alert('Profil berhasil diperbarui!');
        fetchProfile();
      } else {
        alert('Gagal memperbarui profil: ' + error.message);
      }
    } else {
      // Insert new profile
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('profile')
        .insert([{ ...formData, user_id: user.id }]);

      if (!error) {
        alert('Profil berhasil dibuat!');
        fetchProfile();
      } else {
        alert('Gagal membuat profil: ' + error.message);
      }
    }
    
    setSaving(false);
  };

  if (loading) {
    return <p className="text-slate-500 text-center py-8">Memuat data profil...</p>;
  }

  return (
    <div className="glass border border-white/60 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kelola Profil</h2>
          <p className="text-sm text-slate-500 mt-1">Ubah detail profil utama, biografi, serta kontak sosial Anda yang tampil di halaman portofolio.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Row 1: Profile Pic Preview & Name/Role */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center p-6 border border-slate-200/80 rounded-2xl bg-white/60 shadow-sm">
          <div className="flex flex-col items-center gap-4 min-w-[120px]">
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-slate-50 border-4 border-white shadow-md flex items-center justify-center">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-slate-300">👤</span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <svg className="animate-spin h-6 w-6 text-blue-600 mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
              )}
            </div>
            
            <label 
              htmlFor="avatar-upload" 
              className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 text-sm font-semibold rounded-full border border-blue-200 transition-colors shadow-sm whitespace-nowrap"
            >
              Ganti Foto
            </label>
            <input 
              type="file" 
              id="avatar-upload" 
              accept="image/*" 
              onChange={handleAvatarUpload} 
              disabled={uploading} 
              className="hidden" 
            />
          </div>
          <div className="flex-grow w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-slate-700">Username <span className="text-red-500">*</span> <span className="text-xs text-slate-500 font-normal">(Digunakan untuk VITE_PORTFOLIO_USERNAME)</span></label>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
                required 
                placeholder="misal: iccank"
                className="w-full p-3 rounded-lg bg-white/50 border border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">Nama Lengkap</label>
              <input 
                type="text" 
                name="full_name" 
                value={formData.full_name} 
                onChange={handleInputChange} 
                required 
                className="w-full p-3 rounded-lg bg-white/50 border border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">Pekerjaan / Role</label>
              <input 
                type="text" 
                name="role" 
                value={formData.role} 
                onChange={handleInputChange} 
                required 
                placeholder="Cth: Backend Developer"
                className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Row 2: Avatar & CV Urls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Foto Profil URL (Avatar)</label>
            <input 
              type="text" 
              name="avatar_url" 
              value={formData.avatar_url} 
              onChange={handleInputChange} 
              placeholder="https://... (URL gambar)"
              className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Link CV / Resume (PDF)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                name="cv_url" 
                value={formData.cv_url} 
                onChange={handleInputChange} 
                placeholder="https://... (URL file PDF)"
                className="flex-grow p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all" 
              />
              {formData.cv_url && (
                <a 
                  href={formData.cv_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center font-medium transition-all"
                  title="Lihat CV"
                >
                  📄
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bios */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">Biografi Singkat (Tampil di Hero/Depan)</label>
          <textarea 
            name="bio_short" 
            value={formData.bio_short} 
            onChange={handleInputChange} 
            rows="3" 
            className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all resize-none leading-relaxed"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">Biografi Lengkap (Tampil di bagian About)</label>
          <textarea 
            name="bio_long" 
            value={formData.bio_long} 
            onChange={handleInputChange} 
            rows="6" 
            className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all resize-none leading-relaxed"
          ></textarea>
        </div>

        {/* Contact Links */}
        <div className="border-t border-slate-200/80 pt-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Kontak &amp; Link Sosial Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">Email Utama</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">Link WhatsApp</label>
              <input 
                type="text" 
                name="whatsapp_url" 
                value={formData.whatsapp_url} 
                onChange={handleInputChange} 
                placeholder="https://wa.me/..."
                className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">Github Profile Link</label>
              <input 
                type="text" 
                name="github_url" 
                value={formData.github_url} 
                onChange={handleInputChange} 
                placeholder="https://github.com/..."
                className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">LinkedIn Profile Link</label>
              <input 
                type="text" 
                name="linkedin_url" 
                value={formData.linkedin_url} 
                onChange={handleInputChange} 
                placeholder="https://www.linkedin.com/in/..."
                className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-4 pt-6 border-t border-slate-200">
          <button 
            type="submit" 
            disabled={saving} 
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Menyimpan...
              </>
            ) : 'Simpan Profil'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
