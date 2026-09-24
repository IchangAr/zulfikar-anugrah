import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Reorder } from 'framer-motion';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    image_urls: [], // array for gallery
    sort_order: 0
  });
  
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });
    
    if (!error && data) {
      setAchievements(data);
    } else if (error) {
      console.error('Error fetching achievements:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingGallery(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `ach-gallery-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('portfolio').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, image_urls: [...(prev.image_urls || []), data.publicUrl] }));
    } catch (err) {
      alert('Gagal mengunggah foto: ' + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const openModal = (ach = null) => {
    if (ach) {
      setEditingId(ach.id);
      setFormData({
        title: ach.title || '',
        issuer: ach.issuer || '',
        date: ach.date || '',
        description: ach.description || '',
        image_urls: ach.image_urls ? [...ach.image_urls] : [],
        sort_order: ach.sort_order || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        issuer: '',
        date: '',
        description: '',
        image_urls: [],
        sort_order: achievements.length > 0 ? (achievements[achievements.length - 1].sort_order || 0) + 1 : 1
      });
    }
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const parsedData = {
      ...formData,
      image_urls: formData.image_urls,
      sort_order: parseInt(formData.sort_order, 10) || 0
    };

    if (editingId) {
      // Update
      const { error } = await supabase
        .from('achievements')
        .update(parsedData)
        .eq('id', editingId);
        
      if (!error) {
        fetchAchievements();
        closeModal();
      } else {
        alert('Gagal mengupdate: ' + error.message);
      }
    } else {
      // Insert
      const { error } = await supabase
        .from('achievements')
        .insert([parsedData]);
        
      if (!error) {
        fetchAchievements();
        closeModal();
      } else {
        alert('Gagal menambah: ' + error.message);
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pencapaian ini?')) {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);
        
      if (!error) {
        fetchAchievements();
      } else {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    
    const updates = achievements.map((ach, index) => {
      return supabase
        .from('achievements')
        .update({ sort_order: index + 1 })
        .eq('id', ach.id);
    });

    try {
      await Promise.all(updates);
      await fetchAchievements();
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
          <h2 className="text-xl font-semibold capitalize text-slate-800">Kelola Pencapaian</h2>
          <p className="text-sm text-slate-500 mt-1">Seret (drag) kartu di bawah untuk mengubah urutan tampilan pencapaian.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleSaveOrder}
            disabled={savingOrder || achievements.length === 0}
            className="flex-1 sm:flex-none px-4 py-2 border border-blue-500/50 text-blue-600 hover:bg-blue-500/10 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {savingOrder ? 'Menyimpan...' : 'Simpan Urutan'}
          </button>
          <button 
            onClick={() => openModal()}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            + Tambah Pencapaian
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 text-center py-8">Memuat data pencapaian...</p>
      ) : achievements.length === 0 ? (
        <div className="glass p-8 rounded-2xl text-center border border-white/40">
          <p className="text-slate-500">Belum ada pencapaian.</p>
        </div>
      ) : (
        <Reorder.Group 
          axis="y" 
          values={achievements} 
          onReorder={setAchievements}
          className="flex flex-col gap-5"
        >
          {achievements.map((ach) => {
            const firstImg = ach.image_urls && ach.image_urls.length > 0 ? ach.image_urls[0] : '';
            return (
              <Reorder.Item 
                key={ach.id} 
                value={ach}
                className="group glass border border-white/60 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 cursor-grab active:cursor-grabbing hover:bg-white/50 transition-all duration-300 relative shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4 w-full">
                  {/* Drag handle icon */}
                  <div className="text-slate-400 hover:text-slate-600 transition-colors cursor-grab active:cursor-grabbing p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
                  </div>

                  {/* Image Preview (Bukan URL) */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/80 border border-slate-200/60 flex items-center justify-center shadow-inner">
                    {firstImg ? (
                      <img src={firstImg} alt={ach.title} className="w-full h-full object-cover" draggable={false} />
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">NO IMG</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">{ach.title}</h3>
                      {ach.date && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100 shadow-sm">
                          {ach.date}
                        </span>
                      )}
                    </div>
                    <div className="text-base text-blue-600 font-semibold mb-2">
                      Penyelenggara: {ach.issuer || 'Tidak Diketahui'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 self-center sm:self-auto ml-auto" onPointerDown={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => openModal(ach)}
                      className="p-2.5 bg-white hover:bg-blue-500 text-slate-600 hover:text-white rounded-xl transition-all duration-200 border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow"
                      title="Edit Pencapaian"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(ach.id)}
                      className="p-2.5 bg-white hover:bg-red-500 text-slate-600 hover:text-white rounded-xl transition-all duration-200 border border-slate-200 hover:border-red-500 shadow-sm hover:shadow"
                      title="Hapus Pencapaian"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="glass border border-white/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-slate-800">{editingId ? 'Edit Pencapaian' : 'Tambah Pencapaian'}</h3>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Nama Pencapaian</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Penyelenggara / Institusi</label>
                    <input type="text" name="issuer" value={formData.issuer} onChange={handleInputChange} required placeholder="Cth: Kementerian Pendidikan, Google, Universitas Indonesia" className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Waktu / Tanggal</label>
                    <input type="text" name="date" value={formData.date} onChange={handleInputChange} required placeholder="Cth: Januari 2025" className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Urutan Tampilan</label>
                    <input type="number" name="sort_order" value={formData.sort_order} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Deskripsi Lengkap</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all resize-none"></textarea>
                </div>

                <div className="border-slate-300/50 rounded-lg p-4 bg-white/30">
                  <label className="block mb-3 text-sm font-medium text-slate-700">Daftar Foto Pencapaian (Drag & Drop untuk mengatur urutan)</label>
                  
                  {/* Reorderable Image List */}
                  {formData.image_urls && formData.image_urls.length > 0 ? (
                    <Reorder.Group 
                      axis="x" 
                      values={formData.image_urls} 
                      onReorder={(newOrder) => setFormData(prev => ({ ...prev, image_urls: newOrder }))}
                      className="flex flex-wrap gap-3 mb-4"
                    >
                      {formData.image_urls.map((url, idx) => (
                        <Reorder.Item 
                          key={url + idx} 
                          value={url}
                          className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-300/50 group cursor-grab active:cursor-grabbing"
                        >
                          <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== idx) }))}
                            className="absolute top-1 right-1 p-1 bg-red-600/80 text-white rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  ) : (
                    <p className="text-sm text-slate-500 mb-4">Belum ada foto tambahan.</p>
                  )}

                  {/* Add Image Input */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      value={newImageUrl} 
                      onChange={(e) => setNewImageUrl(e.target.value)} 
                      placeholder="https://... (Paste URL gambar baru di sini)" 
                      className="flex-grow p-3 rounded-lg bg-white/50 border-slate-300/50 text-slate-800 focus:border-blue-500 focus:outline-none transition-all text-sm" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newImageUrl.trim()) {
                          setFormData(prev => ({ ...prev, image_urls: [...(prev.image_urls || []), newImageUrl.trim()] }));
                          setNewImageUrl('');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap text-sm"
                    >
                      + Tambah URL
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">atau</span>
                      <label className={`px-4 py-2 ${uploadingGallery ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'} rounded-lg font-medium transition-colors whitespace-nowrap text-sm flex items-center gap-2`}>
                        {uploadingGallery ? (
                           <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Mengunggah...</>
                        ) : (
                           <>+ Upload File</>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                      </label>
                    </div>
                  </div>
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
                    ) : 'Simpan Pencapaian'}
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

export default AdminAchievements;
