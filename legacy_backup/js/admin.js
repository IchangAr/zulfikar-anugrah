
  function showToast(msg, type){
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + (type || 'success');
    setTimeout(function(){ t.classList.remove('show'); }, 2500);
  }
  function escapeHtml(str){
    var div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
  }

  // ---------- Auth ----------
  var loginView = document.getElementById('loginView');
  var appView = document.getElementById('appView');
  var loginForm = document.getElementById('loginForm');
  var loginError = document.getElementById('loginError');

  function checkSession(){
    supa.auth.getSession().then(function(res){
      if(res.data.session){
        loginView.style.display = 'none';
        appView.style.display = 'block';
        document.getElementById('userEmail').textContent = res.data.session.user.email;
        loadProjects();
        loadExperiences();
        loadCertificates();
        loadAchievements();
        loadProfile();
      } else {
        loginView.style.display = 'block';
        appView.style.display = 'none';
      }
    });
  }

  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    loginError.classList.remove('show');
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;
    supa.auth.signInWithPassword({email:email, password:password}).then(function(res){
      if(res.error){ loginError.classList.add('show'); return; }
      checkSession();
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', function(){
    supa.auth.signOut().then(checkSession);
  });

  checkSession();

  // ---------- Tabs ----------
  document.querySelectorAll('.tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-projects').style.display = btn.dataset.tab === 'projects' ? 'block' : 'none';
      document.getElementById('tab-experiences').style.display = btn.dataset.tab === 'experiences' ? 'block' : 'none';
      document.getElementById('tab-certificates').style.display = btn.dataset.tab === 'certificates' ? 'block' : 'none';
      document.getElementById('tab-achievements').style.display = btn.dataset.tab === 'achievements' ? 'block' : 'none';
      document.getElementById('tab-profile').style.display = btn.dataset.tab === 'profile' ? 'block' : 'none';
    });
  });

  // ---------- Upload Helpers ----------
  function uploadFile(file) {
    if (!file) return Promise.resolve(null);
    var ext = file.name.split('.').pop();
    var fileName = Math.random().toString(36).substring(2) + '-' + Date.now() + '.' + ext;
    return supa.storage.from('portfolio').upload(fileName, file).then(function(res) {
      if (res.error) throw res.error;
      return supa.storage.from('portfolio').getPublicUrl(fileName).data.publicUrl;
    });
  }

  function uploadFiles(files) {
    if (!files || files.length === 0) return Promise.resolve([]);
    var promises = Array.from(files).map(uploadFile);
    return Promise.all(promises);
  }

  // ---------- Projects CRUD ----------
  var projectForm = document.getElementById('projectForm');
  var pCancelEdit = document.getElementById('pCancelEdit');
  var pThumbnail = document.getElementById('pThumbnail');
  var pThumbnailPreview = document.getElementById('pThumbnailPreview');
  var projectImages = [];

  function renderImagePreview() {
    pThumbnailPreview.innerHTML = '';
    projectImages.forEach(function(imgObj, idx) {
      var item = document.createElement('div');
      item.className = 'image-preview-item';
      
      var imgSrc = imgObj.type === 'url' ? imgObj.val : imgObj.preview;
      item.innerHTML = '<img src="' + escapeHtml(imgSrc) + '">';
      
      var actions = document.createElement('div');
      actions.className = 'image-preview-actions';
      actions.style.justifyContent = 'center';
      
      var btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = 'del-btn';
      btnDel.textContent = 'Hapus';
      btnDel.onclick = function() {
        projectImages.splice(idx, 1);
        renderImagePreview();
      };
      
      actions.appendChild(btnDel);
      item.appendChild(actions);
      pThumbnailPreview.appendChild(item);
    });
  }

  if (window.Sortable) {
    Sortable.create(pThumbnailPreview, {
      animation: 150,
      onEnd: function(evt) {
        var movedItem = projectImages.splice(evt.oldIndex, 1)[0];
        projectImages.splice(evt.newIndex, 0, movedItem);
        // We call renderImagePreview again to ensure DOM and array are perfectly in sync
        renderImagePreview();
      }
    });
  }

  pThumbnail.addEventListener('change', function(e) {
    var files = e.target.files;
    for (var i = 0; i < files.length; i++) {
      projectImages.push({
        type: 'file',
        val: files[i],
        preview: URL.createObjectURL(files[i])
      });
    }
    renderImagePreview();
    pThumbnail.value = ''; // Reset input to allow selecting same files again
  });

  function resetProjectForm(){
    projectForm.reset();
    document.getElementById('projectId').value = '';
    projectImages = [];
    renderImagePreview();
    pCancelEdit.style.display = 'none';
  }

  function loadProjects(){
    var list = document.getElementById('projectList');
    supa.from('projects').select('*').order('sort_order', {ascending:true}).then(function(res){
      if(res.error){ list.innerHTML = '<p class="empty">Gagal memuat project.</p>'; return; }
      var rows = res.data || [];
      if(rows.length === 0){ list.innerHTML = '<p class="empty">Belum ada project.</p>'; return; }
      list.innerHTML = '';
      rows.forEach(function(p){
        var item = document.createElement('div');
        item.className = 'glass list-item';
        item.dataset.id = p.id;
        item.innerHTML =
          '<div style="display:flex; align-items:center;">' +
            '<div class="sort-number" style="background:rgba(255,255,255,0.1); padding:4px 12px; border-radius:12px; margin-right:16px; font-size:14px; font-weight:bold;">#' + (p.sort_order || 0) + '</div>' +
            '<div><h3>' + escapeHtml(p.title) + '</h3><p>' + escapeHtml((p.tags||[]).join(', ')) + '</p></div>' +
          '</div>' +
          '<div class="list-actions">' +
            '<button class="btn btn-ghost" data-edit="' + p.id + '">Edit</button>' +
            '<button class="btn btn-danger" data-delete="' + p.id + '">Hapus</button>' +
          '</div>';
        item.querySelector('[data-edit]').addEventListener('click', function(){
          document.getElementById('projectId').value = p.id;
          document.getElementById('pTitle').value = p.title || '';
          document.getElementById('pDescription').value = p.description || '';
          document.getElementById('pTags').value = (p.tags || []).join(', ');
          
          var existingUrls = p.image_urls && p.image_urls.length > 0 ? p.image_urls : (p.thumbnail_url ? [p.thumbnail_url] : []);
          projectImages = existingUrls.map(function(url) {
            return { type: 'url', val: url };
          });
          renderImagePreview();
          
          document.getElementById('pLink').value = p.project_link || '';
          document.getElementById('pOrder').value = p.sort_order || 0;
          pCancelEdit.style.display = 'inline-block';
          window.scrollTo({top:0, behavior:'smooth'});
        });
        item.querySelector('[data-delete]').addEventListener('click', function(){
          if(!confirm('Hapus project "' + p.title + '"?')) return;
          supa.from('projects').delete().eq('id', p.id).then(function(res){
            if(res.error){ showToast('Gagal menghapus.', 'error'); return; }
            showToast('Project dihapus.');
            loadProjects();
          });
        });
        list.appendChild(item);
      });
      
      if (window.Sortable) {
        Sortable.create(list, {
          animation: 150,
          onEnd: function(evt) {
            var items = list.querySelectorAll('.list-item');
            var promises = [];
            items.forEach(function(item, index) {
              var id = item.dataset.id;
              if (id) {
                item.querySelector('.sort-number').textContent = '#' + index;
                promises.push(supa.from('projects').update({ sort_order: index }).eq('id', id));
              }
            });
            Promise.all(promises).then(function() {
              showToast('Urutan project disimpan.');
            }).catch(function() {
              showToast('Gagal menyimpan urutan.', 'error');
            });
          }
        });
      }
    });
  }

  projectForm.addEventListener('submit', function(e){
    e.preventDefault();
    var id = document.getElementById('projectId').value;
    var btn = projectForm.querySelector('button[type="submit"]');
    var oldText = btn.textContent;
    btn.textContent = 'Mengunggah...';
    btn.disabled = true;

    var uploadPromises = projectImages.map(function(imgObj) {
      if (imgObj.type === 'url') {
        return Promise.resolve(imgObj.val);
      } else {
        return uploadFile(imgObj.val);
      }
    });

    Promise.all(uploadPromises).then(function(urls) {
      var payload = {
        title: document.getElementById('pTitle').value,
        description: document.getElementById('pDescription').value,
        tags: document.getElementById('pTags').value.split(',').map(function(t){ return t.trim(); }).filter(Boolean),
        image_urls: urls,
        thumbnail_url: urls.length > 0 ? urls[0] : null,
        project_link: document.getElementById('pLink').value,
        sort_order: parseInt(document.getElementById('pOrder').value, 10) || 0
      };
      var query = id ? supa.from('projects').update(payload).eq('id', id) : supa.from('projects').insert(payload);
      return query;
    }).then(function(res){
      btn.textContent = oldText;
      btn.disabled = false;
      if(res.error){ showToast('Gagal menyimpan.', 'error'); return; }
      showToast('Project tersimpan.');
      resetProjectForm();
      loadProjects();
    }).catch(function(err) {
      btn.textContent = oldText;
      btn.disabled = false;
      showToast('Terjadi kesalahan saat mengunggah.', 'error');
    });
  });
  pCancelEdit.addEventListener('click', resetProjectForm);

  // ---------- Experiences CRUD ----------
  var experienceForm = document.getElementById('experienceForm');
  var eCancelEdit = document.getElementById('eCancelEdit');

  function resetExperienceForm(){
    experienceForm.reset();
    document.getElementById('experienceId').value = '';
    eCancelEdit.style.display = 'none';
  }

  function loadExperiences(){
    var list = document.getElementById('experienceList');
    supa.from('experiences').select('*').order('sort_order', {ascending:true}).then(function(res){
      if(res.error){ list.innerHTML = '<p class="empty">Gagal memuat pengalaman.</p>'; return; }
      var rows = res.data || [];
      if(rows.length === 0){ list.innerHTML = '<p class="empty">Belum ada pengalaman.</p>'; return; }
      list.innerHTML = '';
      rows.forEach(function(e){
        var item = document.createElement('div');
        item.className = 'glass list-item';
        item.dataset.id = e.id;
        item.innerHTML =
          '<div style="display:flex; align-items:center;">' +
            '<div class="sort-number" style="background:rgba(255,255,255,0.1); padding:4px 12px; border-radius:12px; margin-right:16px; font-size:14px; font-weight:bold;">#' + (e.sort_order || 0) + '</div>' +
            '<div><h3>' + escapeHtml(e.position) + ' — ' + escapeHtml(e.company) + '</h3><p>' + escapeHtml(e.period) + '</p></div>' +
          '</div>' +
          '<div class="list-actions">' +
            '<button class="btn btn-ghost" data-edit="' + e.id + '">Edit</button>' +
            '<button class="btn btn-danger" data-delete="' + e.id + '">Hapus</button>' +
          '</div>';
        item.querySelector('[data-edit]').addEventListener('click', function(){
          document.getElementById('experienceId').value = e.id;
          document.getElementById('ePosition').value = e.position || '';
          document.getElementById('eCompany').value = e.company || '';
          document.getElementById('ePeriod').value = e.period || '';
          document.getElementById('eAchievements').value = (e.achievements || []).join('\n');
          document.getElementById('eOrder').value = e.sort_order || 0;
          eCancelEdit.style.display = 'inline-block';
          window.scrollTo({top:0, behavior:'smooth'});
        });
        item.querySelector('[data-delete]').addEventListener('click', function(){
          if(!confirm('Hapus pengalaman "' + e.position + '"?')) return;
          supa.from('experiences').delete().eq('id', e.id).then(function(res){
            if(res.error){ showToast('Gagal menghapus.', 'error'); return; }
            showToast('Pengalaman dihapus.');
            loadExperiences();
          });
        });
        list.appendChild(item);
      });

      if (window.Sortable) {
        Sortable.create(list, {
          animation: 150,
          onEnd: function(evt) {
            var items = list.querySelectorAll('.list-item');
            var promises = [];
            items.forEach(function(item, index) {
              var id = item.dataset.id;
              if (id) {
                item.querySelector('.sort-number').textContent = '#' + index;
                promises.push(supa.from('experiences').update({ sort_order: index }).eq('id', id));
              }
            });
            Promise.all(promises).then(function() {
              showToast('Urutan pengalaman disimpan.');
            }).catch(function() {
              showToast('Gagal menyimpan urutan.', 'error');
            });
          }
        });
      }
    });
  }

  experienceForm.addEventListener('submit', function(e){
    e.preventDefault();
    var id = document.getElementById('experienceId').value;
    var payload = {
      position: document.getElementById('ePosition').value,
      company: document.getElementById('eCompany').value,
      period: document.getElementById('ePeriod').value,
      achievements: document.getElementById('eAchievements').value.split('\n').map(function(a){ return a.trim(); }).filter(Boolean),
      sort_order: parseInt(document.getElementById('eOrder').value, 10) || 0
    };
    var query = id ? supa.from('experiences').update(payload).eq('id', id) : supa.from('experiences').insert(payload);
    query.then(function(res){
      if(res.error){ showToast('Gagal menyimpan.', 'error'); return; }
      showToast('Pengalaman tersimpan.');
      resetExperienceForm();
      loadExperiences();
    });
  });
  eCancelEdit.addEventListener('click', resetExperienceForm);

  // ---------- Certificates CRUD ----------
  var certificateForm = document.getElementById('certificateForm');
  var cCancelEdit = document.getElementById('cCancelEdit');

  function resetCertificateForm(){
    certificateForm.reset();
    document.getElementById('certificateId').value = '';
    document.getElementById('cImage').dataset.existing = '';
    document.getElementById('cImageHint').textContent = '';
    cCancelEdit.style.display = 'none';
  }

  function loadCertificates(){
    var list = document.getElementById('certificateList');
    supa.from('certificates').select('*').order('sort_order', {ascending:true}).then(function(res){
      if(res.error){ list.innerHTML = '<p class="empty">Gagal memuat sertifikat.</p>'; return; }
      var rows = res.data || [];
      if(rows.length === 0){ list.innerHTML = '<p class="empty">Belum ada sertifikat.</p>'; return; }
      list.innerHTML = '';
      rows.forEach(function(c){
        var item = document.createElement('div');
        item.className = 'glass list-item';
        item.dataset.id = c.id;
        item.innerHTML =
          '<div style="display:flex; align-items:center;">' +
            '<div class="sort-number" style="background:rgba(255,255,255,0.1); padding:4px 12px; border-radius:12px; margin-right:16px; font-size:14px; font-weight:bold;">#' + (c.sort_order || 0) + '</div>' +
            '<div><h3>' + escapeHtml(c.title) + '</h3><p>' + escapeHtml(c.issuer) + '</p></div>' +
          '</div>' +
          '<div class="list-actions">' +
            '<button class="btn btn-ghost" data-edit="' + c.id + '">Edit</button>' +
            '<button class="btn btn-danger" data-delete="' + c.id + '">Hapus</button>' +
          '</div>';
        item.querySelector('[data-edit]').addEventListener('click', function(){
          document.getElementById('certificateId').value = c.id;
          document.getElementById('cTitle').value = c.title || '';
          document.getElementById('cIssuer').value = c.issuer || '';
          
          document.getElementById('cImage').dataset.existing = c.image_url || '';
          document.getElementById('cImageHint').textContent = c.image_url ? 'Gambar saat ini sudah tersimpan. Pilih file baru untuk mengganti.' : '';

          document.getElementById('cOrder').value = c.sort_order || 0;
          cCancelEdit.style.display = 'inline-block';
          window.scrollTo({top:0, behavior:'smooth'});
        });
        item.querySelector('[data-delete]').addEventListener('click', function(){
          if(!confirm('Hapus sertifikat "' + c.title + '"?')) return;
          supa.from('certificates').delete().eq('id', c.id).then(function(res){
            if(res.error){ showToast('Gagal menghapus.', 'error'); return; }
            showToast('Sertifikat dihapus.');
            loadCertificates();
          });
        });
        list.appendChild(item);
      });

      if (window.Sortable) {
        Sortable.create(list, {
          animation: 150,
          onEnd: function(evt) {
            var items = list.querySelectorAll('.list-item');
            var promises = [];
            items.forEach(function(item, index) {
              var id = item.dataset.id;
              if (id) {
                item.querySelector('.sort-number').textContent = '#' + index;
                promises.push(supa.from('certificates').update({ sort_order: index }).eq('id', id));
              }
            });
            Promise.all(promises).then(function() {
              showToast('Urutan sertifikat disimpan.');
            }).catch(function() {
              showToast('Gagal menyimpan urutan.', 'error');
            });
          }
        });
      }
    });
  }

  certificateForm.addEventListener('submit', function(e){
    e.preventDefault();
    var id = document.getElementById('certificateId').value;
    var btn = certificateForm.querySelector('button[type="submit"]');
    var oldText = btn.textContent;
    btn.textContent = 'Mengunggah...';
    btn.disabled = true;

    var fileInput = document.getElementById('cImage');
    var existingUrl = fileInput.dataset.existing;
    var uploadPromise = fileInput.files.length > 0 ? uploadFile(fileInput.files[0]) : Promise.resolve(existingUrl);

    uploadPromise.then(function(url) {
      var payload = {
        title: document.getElementById('cTitle').value,
        issuer: document.getElementById('cIssuer').value,
        image_url: url || null,
        sort_order: parseInt(document.getElementById('cOrder').value, 10) || 0
      };
      var query = id ? supa.from('certificates').update(payload).eq('id', id) : supa.from('certificates').insert(payload);
      return query;
    }).then(function(res){
      btn.textContent = oldText;
      btn.disabled = false;
      if(res.error){ showToast('Gagal menyimpan.', 'error'); return; }
      showToast('Sertifikat tersimpan.');
      resetCertificateForm();
      loadCertificates();
    }).catch(function(err) {
      btn.textContent = oldText;
      btn.disabled = false;
      showToast('Terjadi kesalahan saat mengunggah.', 'error');
    });
  });
  cCancelEdit.addEventListener('click', resetCertificateForm);

  // ---------- Achievements CRUD ----------
  var achievementForm = document.getElementById('achievementForm');
  var aCancelEdit = document.getElementById('aCancelEdit');

  var aThumbnail = document.getElementById('aImage');
  var aThumbnailPreview = document.getElementById('aThumbnailPreview');
  var achievementImages = [];

  function renderAchievementImagePreview() {
    aThumbnailPreview.innerHTML = '';
    achievementImages.forEach(function(imgObj, idx) {
      var item = document.createElement('div');
      item.className = 'image-preview-item';
      
      var imgSrc = imgObj.type === 'url' ? imgObj.val : imgObj.preview;
      item.innerHTML = '<img src="' + escapeHtml(imgSrc) + '">';
      
      var actions = document.createElement('div');
      actions.className = 'image-preview-actions';
      actions.style.justifyContent = 'center';
      
      var btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = 'del-btn';
      btnDel.textContent = 'Hapus';
      btnDel.onclick = function() {
        achievementImages.splice(idx, 1);
        renderAchievementImagePreview();
      };
      
      actions.appendChild(btnDel);
      item.appendChild(actions);
      aThumbnailPreview.appendChild(item);
    });
  }

  if (window.Sortable) {
    Sortable.create(aThumbnailPreview, {
      animation: 150,
      onEnd: function(evt) {
        var movedItem = achievementImages.splice(evt.oldIndex, 1)[0];
        achievementImages.splice(evt.newIndex, 0, movedItem);
        renderAchievementImagePreview();
      }
    });
  }

  aThumbnail.addEventListener('change', function(e) {
    var files = e.target.files;
    for (var i = 0; i < files.length; i++) {
      // Limit total to 5
      if (achievementImages.length >= 5) break;
      achievementImages.push({
        type: 'file',
        val: files[i],
        preview: URL.createObjectURL(files[i])
      });
    }
    renderAchievementImagePreview();
    aThumbnail.value = '';
  });

  function resetAchievementForm(){
    achievementForm.reset();
    document.getElementById('achievementId').value = '';
    achievementImages = [];
    renderAchievementImagePreview();
    aCancelEdit.style.display = 'none';
  }

  function loadAchievements(){
    var list = document.getElementById('achievementList');
    supa.from('achievements').select('*').order('sort_order', {ascending:true}).then(function(res){
      if(res.error){ list.innerHTML = '<p class="empty">Gagal memuat pencapaian.</p>'; return; }
      var rows = res.data || [];
      if(rows.length === 0){ list.innerHTML = '<p class="empty">Belum ada pencapaian.</p>'; return; }
      list.innerHTML = '';
      rows.forEach(function(r){
        var item = document.createElement('div');
        item.className = 'glass list-item';
        item.dataset.id = r.id;
        var firstImg = (r.image_urls && r.image_urls.length > 0) ? r.image_urls[0] : (r.image_url || '');
        var imgHtml = firstImg ? '<img src="' + escapeHtml(firstImg) + '" style="height:40px; border-radius:4px; margin-right:12px; object-fit:cover;">' : '';
        item.innerHTML = '<div style="display:flex;align-items:center;">' + 
          '<div class="sort-number" style="background:rgba(255,255,255,0.1); padding:4px 12px; border-radius:12px; margin-right:16px; font-size:14px; font-weight:bold;">#' + (r.sort_order || 0) + '</div>' + imgHtml +
          '<div><strong>' + escapeHtml(r.title) + '</strong><div class="meta">' + escapeHtml(r.issuer) + ' — ' + escapeHtml(r.date) + '</div></div></div>' +
          '<div class="list-actions"><button class="btn btn-ghost edit-btn">Edit</button><button class="btn btn-danger del-btn">Hapus</button></div>';
        
        item.querySelector('.edit-btn').addEventListener('click', function(){
          document.getElementById('achievementId').value = r.id;
          document.getElementById('aTitle').value = r.title;
          document.getElementById('aIssuer').value = r.issuer;
          document.getElementById('aDate').value = r.date;
          document.getElementById('aDescription').value = r.description || '';
          document.getElementById('aOrder').value = r.sort_order || 0;
          var urls = (r.image_urls && r.image_urls.length > 0) ? r.image_urls : (r.image_url ? [r.image_url] : []);
          achievementImages = urls.map(function(url) {
            return { type: 'url', val: url };
          });
          renderAchievementImagePreview();
          aCancelEdit.style.display = 'inline-block';
          window.scrollTo(0,0);
        });

        item.querySelector('.del-btn').addEventListener('click', function(){
          if(confirm('Hapus pencapaian ini?')){
            supa.from('achievements').delete().eq('id', r.id).then(function(delRes){
              if(delRes.error) showToast('Gagal menghapus', 'error');
              else { showToast('Berhasil dihapus'); loadAchievements(); }
            });
          }
        });
        list.appendChild(item);
      });

      if (window.Sortable) {
        Sortable.create(list, {
          animation: 150,
          onEnd: function(evt) {
            var items = list.querySelectorAll('.list-item');
            var promises = [];
            items.forEach(function(item, index) {
              var id = item.dataset.id;
              if (id) {
                item.querySelector('.sort-number').textContent = '#' + index;
                promises.push(supa.from('achievements').update({ sort_order: index }).eq('id', id));
              }
            });
            Promise.all(promises).then(function() {
              showToast('Urutan pencapaian disimpan.');
            }).catch(function() {
              showToast('Gagal menyimpan urutan.', 'error');
            });
          }
        });
      }
    });
  }

  achievementForm.addEventListener('submit', function(e){
    e.preventDefault();
    var id = document.getElementById('achievementId').value;
    var btn = achievementForm.querySelector('button[type="submit"]');
    var originalText = btn.textContent;
    btn.textContent = 'Menyimpan...';
    btn.disabled = true;

    var uploadPromises = achievementImages.map(function(imgObj) {
      if (imgObj.type === 'url') {
        return Promise.resolve(imgObj.val);
      } else {
        return uploadFile(imgObj.val);
      }
    });

    Promise.all(uploadPromises).then(function(urls) {
      if (urls.length > 5) urls = urls.slice(0, 5); // Limit max 5
      var payload = {
        title: document.getElementById('aTitle').value,
        issuer: document.getElementById('aIssuer').value,
        date: document.getElementById('aDate').value,
        description: document.getElementById('aDescription').value,
        image_url: urls.length > 0 ? urls[0] : null,
        image_urls: urls,
        sort_order: parseInt(document.getElementById('aOrder').value) || 0
      };

      var query = id ? supa.from('achievements').update(payload).eq('id', id) : supa.from('achievements').insert(payload);
      return query;
    }).then(function(res){
      btn.textContent = originalText;
      btn.disabled = false;
      if(res.error){ showToast('Gagal menyimpan', 'error'); return; }
      showToast('Berhasil disimpan');
      resetAchievementForm();
      loadAchievements();
    }).catch(function(err) {
      btn.textContent = originalText;
      btn.disabled = false;
      showToast('Gagal upload gambar', 'error');
    });
  });

  aCancelEdit.addEventListener('click', resetAchievementForm);

  // ---------- Profile CRUD ----------
  var profileForm = document.getElementById('profileForm');

  function loadProfile(){
    supa.from('profile').select('*').limit(1).then(function(res){
      if(res.error || !res.data || res.data.length === 0) return;
      var p = res.data[0];
      document.getElementById('profileId').value = p.id;
      document.getElementById('prName').value = p.full_name || '';
      document.getElementById('prRole').value = p.role || '';
      document.getElementById('prBioShort').value = p.bio_short || '';
      document.getElementById('prBioLong').value = p.bio_long || '';
      
      document.getElementById('prAvatar').dataset.existing = p.avatar_url || '';
      document.getElementById('prAvatarHint').textContent = p.avatar_url ? 'Foto saat ini sudah tersimpan. Pilih file baru untuk mengganti.' : '';

      document.getElementById('prCv').dataset.existing = p.cv_url || '';
      document.getElementById('prCvHint').textContent = p.cv_url ? 'File CV saat ini sudah tersimpan. Pilih file baru untuk mengganti.' : '';

      document.getElementById('prEmail').value = p.email || '';
      document.getElementById('prGithub').value = p.github_url || '';
      document.getElementById('prLinkedin').value = p.linkedin_url || '';
      document.getElementById('prWhatsapp').value = p.whatsapp_url || '';
    });
  }

  profileForm.addEventListener('submit', function(e){
    e.preventDefault();
    var id = document.getElementById('profileId').value;
    var btn = profileForm.querySelector('button[type="submit"]');
    var oldText = btn.textContent;
    btn.textContent = 'Mengunggah...';
    btn.disabled = true;

    var fileInput = document.getElementById('prAvatar');
    var existingUrl = fileInput.dataset.existing;
    var uploadPromise = fileInput.files.length > 0 ? uploadFile(fileInput.files[0]) : Promise.resolve(existingUrl);

    var cvInput = document.getElementById('prCv');
    var existingCvUrl = cvInput.dataset.existing;
    var cvUploadPromise = cvInput.files.length > 0 ? uploadFile(cvInput.files[0]) : Promise.resolve(existingCvUrl);

    Promise.all([uploadPromise, cvUploadPromise]).then(function(urls) {
      var avatarUrl = urls[0];
      var cvUrl = urls[1];

      var payload = {
        full_name: document.getElementById('prName').value,
        role: document.getElementById('prRole').value,
        bio_short: document.getElementById('prBioShort').value,
        bio_long: document.getElementById('prBioLong').value,
        avatar_url: avatarUrl || null,
        cv_url: cvUrl || null,
        email: document.getElementById('prEmail').value,
        github_url: document.getElementById('prGithub').value,
        linkedin_url: document.getElementById('prLinkedin').value,
        whatsapp_url: document.getElementById('prWhatsapp').value,
        updated_at: new Date().toISOString()
      };
      var query = id ? supa.from('profile').update(payload).eq('id', id) : supa.from('profile').insert(payload);
      return query;
    }).then(function(res){
      btn.textContent = oldText;
      btn.disabled = false;
      if(res.error){ showToast('Gagal menyimpan profil.', 'error'); return; }
      showToast('Profil tersimpan.');
      if(!id) loadProfile(); // reload to grab the new ID
    }).catch(function(err) {
      btn.textContent = oldText;
      btn.disabled = false;
      showToast('Terjadi kesalahan saat mengunggah.', 'error');
    });
  });
