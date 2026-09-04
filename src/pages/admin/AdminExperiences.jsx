import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Reorder } from 'framer-motion';

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    period: '',
    achievements: '', // will be converted to array
    sort_order: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });
    
    if (!error && data) {
      setExperiences(data);
    } else if (error) {
      console.error('Error fetching experiences:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (exp = null) => {
    if (exp) {
      setEditingId(exp.id);
      setFormData({
        position: exp.position || '',
        company: exp.company || '',
        period: exp.period || '',
        achievements: exp.achievements ? exp.achievements.join('\n') : '',
        sort_order: exp.sort_order || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        position: '',
        company: '',
        period: '',
        achievements: '',
        sort_order: experiences.length > 0 ? (experiences[experiences.length - 1].sort_order || 0) + 1 : 1
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Parse arrays (split by newline for achievements)
    const parsedData = {
      ...formData,
      achievements: formData.achievements ? formData.achievements.split('\n').map(s => s.trim()).filter(Boolean) : [],
      sort_order: parseInt(formData.sort_order, 10) || 0
    };

    if (editingId) {
      // Update
      const { error } = await supabase
        .from('experiences')
        .update(parsedData)
        .eq('id', editingId);
        
      if (!error) {
        fetchExperiences();
        closeModal();
      } else {
        alert('Gagal mengupdate: ' + error.message);
      }
    } else {
      // Insert
      const { error } = await supabase
        .from('experiences')
        .insert([parsedData]);
        
      if (!error) {
        fetchExperiences();
        closeModal();
      } else {
        alert('Gagal menambah: ' + error.message);
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengalaman ini?')) {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
        
      if (!error) {
        fetchExperiences();
      } else {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    
    // Update each exp's sort_order based on their current index in the array
    const updates = experiences.map((exp, index) => {
      return supabase
        .from('experiences')
        .update({ sort_order: index + 1 })
        .eq('id', exp.id);
    });

    try {
      await Promise.all(updates);
      await fetchExperiences();
      alert('Urutan berhasil disimpan!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Gagal menyimpan urutan');
    }
    setSavingOrder(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold capitalize text-slate-800">Kelola Pengalaman (Experiences)</h2>
          <p className="text-sm text-slate-500 mt-1">Seret (drag) kartu di bawah untuk mengubah urutan tampilan pengalaman.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleSaveOrder}
            disabled={savingOrder || experiences.length === 0}
            className="flex-1 sm:flex-none px-4 py-2 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded font-medium transition-colors disabled:opacity-50"
          >
            {savingOrder ? 'Menyimpan...' : 'Simpan Urutan'}
          </button>
          <button 
            onClick={() => openModal()}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            + Tambah Pengalaman
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 text-center py-8">Memuat data pengalaman...</p>
      ) : experiences.length === 0 ? (
        <div className="glass p-8 rounded-2xl text-center border border-white/40">
          <p className="text-slate-500">Belum ada pengalaman.</p>
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={experiences} 
          onReorder={setExperiences}
          className="flex flex-col gap-5"
        >
          {experiences.map((exp) => (
            <Reorder.Item 
              key={exp.id} 
              value={exp}
              className="group glass border border-white/60 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 cursor-grab active:cursor-grabbing hover:bg-white/50 transition-all duration-300 relative shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4 w-full">
                {/* Drag handle icon */}
                <div className="text-slate-400 hover:text-slate-600 transition-colors cursor-grab active:cursor-grabbing p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">{exp.position}</h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100 shadow-sm">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-base text-blue-600 font-semibold mb-2">
                    @ {exp.company}
                  </div>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                      • {exp.achievements[0]} {exp.achievements.length > 1 && ` (+${exp.achievements.length - 1} lainnya)`}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 self-center sm:self-auto ml-auto" onPointerDown={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => openModal(exp)}
                    className="p-2.5 bg-white hover:bg-blue-500 text-slate-600 hover:text-white rounded-xl transition-all duration-200 border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow"
                    title="Edit Pengalaman"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(exp.id)}
                    className="p-2.5 bg-white hover:bg-red-500 text-slate-600 hover:text-white rounded-xl transition-all duration-200 border border-slate-200 hover:border-red-500 shadow-sm hover:shadow"
                    title="Hapus Pengalaman"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="glass border border-white/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-slate-800">{editingId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}</h3>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Posisi / Pekerjaan</label>
                    <input type="text" name="position" value={formData.position} onChange={handleInputChange} required className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Sort Order (Urutan)</label>
                    <input type="number" name="sort_order" value={formData.sort_order} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Perusahaan</label>
                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} required className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Periode (Cth: Jan 2022 - Skrg)</label>
                    <input type="text" name="period" value={formData.period} onChange={handleInputChange} required className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Pencapaian / Job Deskripsi (Tiap baris jadi 1 point bullet)</label>
                  <textarea 
                    name="achievements" 
                    value={formData.achievements} 
                    onChange={handleInputChange} 
                    rows="6" 
                    placeholder="Membuat fitur X dengan React...&#10;Meningkatkan performa web sebesar 30%..."
                    className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-200">
                  <button type="button" onClick={closeModal} className="px-6 py-2.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                    Batal
                  </button>
                  <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Menyimpan...
                      </>
                    ) : 'Simpan Pengalaman'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExperiences;
