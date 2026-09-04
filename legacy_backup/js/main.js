    // (Project Settings -> API di dashboard Supabase)

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var navbar = document.getElementById('navbar');
    var backToTop = document.getElementById('backToTop'); // Optional floating button
    var lastScrollTop = 0;
    var heroVisual = document.querySelector('.hero-visual');
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (navbar) {
        navbar.classList.toggle('scrolled', y > 40);
      }
      if (backToTop) backToTop.classList.toggle('show', y > 600);
      
      if (!reduceMotion && heroVisual) {
        var scale = 1 + (y * 0.0005);
        if (scale > 1.15) scale = 1.15;
        heroVisual.style.transform = 'translateY(' + (y * 0.2) + 'px) scale(' + scale + ')';
      }
      
      lastScrollTop = y;
    });
    if (backToTop) {
      backToTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }

    // New footer back to top button
    var footerBackToTop = document.querySelector('.footer-v3-back-to-top');
    if (footerBackToTop) {
      footerBackToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }

    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('[data-nav]');
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          var active = document.querySelector('[data-nav][href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(function (s) { spyObserver.observe(s); });

    var revealEls = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    var counters = document.querySelectorAll('.counter');
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var duration = reduceMotion ? 0 : 1300;
          var start = null;
          function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          if (duration === 0) { el.textContent = target; }
          else requestAnimationFrame(step);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObserver.observe(c); });

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str == null ? '' : str;
      return div.innerHTML;
    }

    /* ---------- Project Modal Logic ---------- */
    var pmModal = document.getElementById('projectModal');
    var pmClose = document.getElementById('pmClose');
    var pmMainImage = document.getElementById('pmMainImage');
    var pmTitle = document.getElementById('pmTitle');
    var pmDesc = document.getElementById('pmDesc');
    var pmTags = document.getElementById('pmTags');
    var pmLink = document.getElementById('pmLink');
    var pmThumbs = document.getElementById('pmThumbs');
    var pmToggleInfo = document.getElementById('pmToggleInfo');
    var pmOverlay = document.getElementById('pmOverlay');
    var pmInfoCol = document.getElementById('pmInfoCol');
    var pmHideTimeout;
    
    if (pmToggleInfo) {
      pmToggleInfo.addEventListener('click', function() {
        clearTimeout(pmHideTimeout);
        pmInfoCol.classList.toggle('info-hidden');
        pmOverlay.classList.toggle('info-hidden');
        pmToggleInfo.classList.toggle('dimmed');
      });
    }
    var isThumbDown = false, thumbStartX, thumbScrollLeft;
    if (pmThumbs) {
      pmThumbs.addEventListener('mousedown', function(e) {
        isThumbDown = true;
        thumbStartX = e.pageX - pmThumbs.offsetLeft;
        thumbScrollLeft = pmThumbs.scrollLeft;
      });
      pmThumbs.addEventListener('mouseleave', function() { isThumbDown = false; });
      pmThumbs.addEventListener('mouseup', function() { isThumbDown = false; });
      pmThumbs.addEventListener('mousemove', function(e) {
        if (!isThumbDown) return;
        e.preventDefault();
        pmThumbs.scrollLeft = thumbScrollLeft - (e.pageX - pmThumbs.offsetLeft - thumbStartX) * 1.5;
      });
    }

    var pmThumbPrev = document.getElementById('pmThumbPrev');
    var pmThumbNext = document.getElementById('pmThumbNext');

    if (pmThumbPrev) {
      pmThumbPrev.addEventListener('click', function() {
        if (pmThumbs) pmThumbs.scrollBy({ left: -200, behavior: 'smooth' });
      });
    }
    if (pmThumbNext) {
      pmThumbNext.addEventListener('click', function() {
        if (pmThumbs) pmThumbs.scrollBy({ left: 200, behavior: 'smooth' });
      });
    }

    if (pmClose) {
      pmClose.addEventListener('click', function() { pmModal.classList.remove('show'); });
      pmModal.addEventListener('click', function(e) {
        if (e.target === pmModal) pmModal.classList.remove('show');
      });
    }

    document.addEventListener('keydown', function(e) {
      if (!pmModal.classList.contains('show')) return;
      
      if (e.key === 'Escape') {
        pmModal.classList.remove('show');
        return;
      }

      var thumbs = pmThumbs.querySelectorAll('.pm-thumb');
      if (thumbs.length <= 1) return;
      
      var activeIndex = -1;
      thumbs.forEach(function(t, i) { if (t.classList.contains('active')) activeIndex = i; });
      if (activeIndex === -1) return;

      var targetIndex = activeIndex;
      if (e.key === 'ArrowLeft') {
        targetIndex = (activeIndex - 1 + thumbs.length) % thumbs.length;
      } else if (e.key === 'ArrowRight') {
        targetIndex = (activeIndex + 1) % thumbs.length;
      }
      
      if (targetIndex !== activeIndex) {
        thumbs[targetIndex].click();
        var targetThumb = thumbs[targetIndex];
        var thumbRect = targetThumb.getBoundingClientRect();
        var containerRect = pmThumbs.getBoundingClientRect();
        if (thumbRect.left < containerRect.left) {
          pmThumbs.scrollBy({ left: thumbRect.left - containerRect.left - 20, behavior: 'smooth' });
        } else if (thumbRect.right > containerRect.right) {
          pmThumbs.scrollBy({ left: thumbRect.right - containerRect.right + 20, behavior: 'smooth' });
        }
      }
    });

    function openProjectModal(p) {
      var images = p.image_urls && p.image_urls.length > 0 ? p.image_urls : (p.thumbnail_url ? [p.thumbnail_url] : []);

      pmTitle.textContent = p.title;
      pmDesc.textContent = p.description;
      pmTags.innerHTML = (p.tags || []).map(function(t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('');

      if (p.project_link && p.project_link.trim() !== '') {
        pmLink.href = p.project_link;
        pmLink.style.display = 'inline-block';
      } else {
        pmLink.style.display = 'none';
      }

      pmThumbs.innerHTML = '';
      if (images.length > 0) {
        pmMainImage.style.backgroundImage = 'url(' + escapeHtml(images[0]) + ')';
        if (images.length > 1) {
          images.forEach(function(img, idx) {
            var thumb = document.createElement('div');
            thumb.className = 'pm-thumb' + (idx === 0 ? ' active' : '');
            thumb.style.backgroundImage = 'url(' + escapeHtml(img) + ')';
            thumb.addEventListener('click', function() {
              pmMainImage.style.backgroundImage = 'url(' + escapeHtml(img) + ')';
              pmThumbs.querySelectorAll('.pm-thumb').forEach(function(t) { t.classList.remove('active'); });
              thumb.classList.add('active');
            });
            pmThumbs.appendChild(thumb);
          });
        }
      } else {
        pmMainImage.style.backgroundImage = 'none';
        pmMainImage.style.backgroundColor = 'var(--c-primary)';
      }

      pmModal.classList.add('show');
      
      // Auto-hide info overlay after a few seconds
      pmInfoCol.classList.remove('info-hidden');
      pmOverlay.classList.remove('info-hidden');
      if(pmToggleInfo) pmToggleInfo.classList.remove('dimmed');
      
      clearTimeout(pmHideTimeout);
      pmHideTimeout = setTimeout(function() {
        pmInfoCol.classList.add('info-hidden');
        pmOverlay.classList.add('info-hidden');
        if(pmToggleInfo) pmToggleInfo.classList.add('dimmed');
      }, 3500);
    }

    function loadProjects() {
      var grid = document.getElementById('projectGrid');
      var status = document.getElementById('projectStatus');
      supa.from('projects').select('*').order('sort_order', { ascending: true })
        .then(function (res) {
          if (res.error) { status.textContent = 'Project belum bisa dimuat.'; return; }
          var rows = res.data || [];
          if (rows.length === 0) { status.textContent = 'Belum ada project ditambahkan.'; return; }
          status.remove();
          rows.forEach(function (p) {
            var tags = (p.tags || []).map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('');
            var link = p.project_link ? p.project_link : '#';
            
            var images = p.image_urls && p.image_urls.length > 0 ? p.image_urls : (p.thumbnail_url ? [p.thumbnail_url] : []);
            var thumbHtml = '';
            if (images.length > 0) {
              thumbHtml = '<div class="project-slider">';
              images.forEach(function(img) {
                thumbHtml += '<div class="project-slide" style="background-image:url(' + escapeHtml(img) + ');"></div>';
              });
              thumbHtml += '</div>';
              /* Removed slider-hint */
            } else {
              thumbHtml = '<div class="project-slide" style="background:var(--c-primary);"></div>';
            }

            var card = document.createElement('div');
            card.className = 'project-card glass reveal reveal-up';
            card.innerHTML =
              '<div class="project-thumb">' + thumbHtml + '</div>' +
              '<div class="project-body">' +
              '<div>' +
              '<h3>' + escapeHtml(p.title) + '</h3>' +
              '<p>' + escapeHtml(p.description) + '</p>' +
              '<div class="tag-row">' + tags + '</div>' +
              '</div>' +
              '<button class="btn view-detail-btn project-detail-btn">Lihat Detail →</button>' +
              '</div>';
            
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
              e.preventDefault();
              openProjectModal(p);
            });

            grid.appendChild(card);
            revealObserver.observe(card);
          });
        });
    }

    function loadExperiences() {
      var list = document.getElementById('timelineList');
      var status = document.getElementById('experienceStatus');
      supa.from('experiences').select('*').order('sort_order', { ascending: true })
        .then(function (res) {
          if (res.error) { status.textContent = 'Pengalaman belum bisa dimuat.'; return; }
          var rows = res.data || [];
          if (rows.length === 0) { status.textContent = 'Belum ada pengalaman ditambahkan.'; return; }
          status.remove();
          rows.forEach(function (e) {
            var points = (e.achievements || []).map(function (a) { return '<li>' + escapeHtml(a) + '</li>'; }).join('');
            var item = document.createElement('div');
            item.className = 'timeline-item reveal reveal-up';
            item.innerHTML =
              '<div class="timeline-dot"></div>' +
              '<div class="timeline-card glass">' +
              '<h3>' + escapeHtml(e.position) + ' — ' + escapeHtml(e.company) + '</h3>' +
              '<div class="meta">' + escapeHtml(e.period) + '</div>' +
              '<ul>' + points + '</ul>' +
              '</div>';
            list.appendChild(item);
            revealObserver.observe(item);
          });
        });
    }

    /* ---------- Achievement Modal Logic ---------- */
    var amModal = document.getElementById('achievementModal');
    var amClose = document.getElementById('amClose');
    var amCoverFlow = document.getElementById('amCoverFlow');
    var amTitle = document.getElementById('amTitle');
    var amMeta = document.getElementById('amMeta');
    var amDesc = document.getElementById('amDesc');
    var achievementData = [];
    var amCurrentIndex = 0;
    var masonryColors = ['#f97316', '#22c55e', '#eab308', '#3b82f6', '#14b8a6', '#f43f5e'];

    if (amClose) {
      amClose.addEventListener('click', function() { amModal.classList.remove('show'); });
      amModal.addEventListener('click', function(e) {
        if (e.target === amModal) amModal.classList.remove('show');
      });
    }
    
    function updateCoverFlow(totalLength, activeItem) {
      var cards = amCoverFlow.querySelectorAll('.am-card');
      cards.forEach(function(card, idx) {
        var offset = idx - amCurrentIndex;
        var absOffset = Math.abs(offset);
        
        var scale = 1 - (absOffset * 0.1);
        if (scale < 0) scale = 0;
        
        var tx = offset * 220;
        var tz = -absOffset * 100;
        
        card.style.transform = 'translate3d(' + tx + 'px, 0, ' + tz + 'px) scale(' + scale + ')';
        card.style.zIndex = 100 - absOffset;
        card.style.opacity = absOffset > 2 ? 0 : (1 - absOffset * 0.15);
      });
      
      if (activeItem) {
        amTitle.textContent = activeItem.title;
        amMeta.textContent = activeItem.issuer + ' · ' + activeItem.date;
        amDesc.textContent = activeItem.description || '';
      }
    }
    
    var amDragListenersAdded = false;
    function openAchievementModal(achievement) {
      amCoverFlow.innerHTML = '';
      
      var urls = (achievement.image_urls && achievement.image_urls.length > 0) ? achievement.image_urls : (achievement.image_url ? [achievement.image_url] : []);
      if (urls.length === 0) urls = ['color'];
      
      amCurrentIndex = Math.floor(urls.length / 2);
      var totalLength = urls.length;
      
      urls.forEach(function(url, idx) {
        var card = document.createElement('div');
        card.className = 'am-card';
        if (url !== 'color') {
          card.style.backgroundImage = 'url(' + escapeHtml(url) + ')';
        } else {
          card.style.backgroundColor = masonryColors[0];
          card.innerHTML = '🏆';
        }
        
        card.addEventListener('click', function() {
          if (amCurrentIndex === idx) return;
          amCurrentIndex = idx;
          updateCoverFlow(totalLength, achievement);
        });
        
        amCoverFlow.appendChild(card);
      });
      
      if (!amDragListenersAdded) {
        amDragListenersAdded = true;
        var isCFDragging = false, startCFX;
        amCoverFlow.addEventListener('mousedown', function(e) {
          isCFDragging = true; startCFX = e.pageX;
        });
        window.addEventListener('mouseup', function(e) {
          if (isCFDragging) {
            isCFDragging = false;
            var diff = e.pageX - startCFX;
            if (diff > 50 && amCurrentIndex > 0) { amCurrentIndex--; updateCoverFlow(totalLength, achievement); }
            else if (diff < -50 && amCurrentIndex < amCoverFlow.children.length - 1) { amCurrentIndex++; updateCoverFlow(totalLength, achievement); }
          }
        });
        
        amCoverFlow.addEventListener('touchstart', function(e) {
          isCFDragging = true; startCFX = e.touches[0].pageX;
        });
        window.addEventListener('touchend', function(e) {
          if (isCFDragging) {
            isCFDragging = false;
            var diff = e.changedTouches[0].pageX - startCFX;
            if (diff > 50 && amCurrentIndex > 0) { amCurrentIndex--; updateCoverFlow(totalLength, achievement); }
            else if (diff < -50 && amCurrentIndex < amCoverFlow.children.length - 1) { amCurrentIndex++; updateCoverFlow(totalLength, achievement); }
          }
        });
      }
      
      // Animasi masuk (Fly-out dari tengah)
      var cardsForAnim = amCoverFlow.querySelectorAll('.am-card');
      cardsForAnim.forEach(function(c) {
        c.style.transform = 'translate3d(0, 0, -200px) scale(0)';
        c.style.opacity = 0;
      });
      
      setTimeout(function() {
        updateCoverFlow(totalLength, achievement);
      }, 50);
      
      amModal.classList.add('show');
    }

    function loadAchievements() {
      var list = document.getElementById('achievementList');
      if (!list) return;
      var status = list.querySelector('.data-status');

      supa.from('achievements').select('*').order('sort_order', { ascending: true })
        .then(function (res) {
          if (res.error) { if(status) status.textContent = 'Pencapaian belum bisa dimuat.'; return; }
          var rows = res.data || [];
          if (rows.length === 0) { if(status) status.textContent = 'Belum ada pencapaian ditambahkan.'; return; }
          if(status) status.remove();

          achievementData = rows;
          var heights = [320, 420, 280, 480, 360, 400];

          rows.forEach(function (a, idx) {
            var item = document.createElement('div');
            item.className = 'achievement-item reveal reveal-up';
            
            var h = heights[idx % heights.length];
            item.style.height = h + 'px';
            
            var bgStyle = '';
            var firstImg = (a.image_urls && a.image_urls.length > 0) ? a.image_urls[0] : (a.image_url || '');
            if (firstImg) {
              bgStyle = 'background-image:url(' + escapeHtml(firstImg) + ');';
            } else {
              bgStyle = 'background-color:' + masonryColors[idx % masonryColors.length] + ';';
            }

            var arrowIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';

            item.innerHTML =
              '<div class="achievement-item-img" style="' + bgStyle + '"></div>' +
              '<div class="achievement-item-overlay">' +
                '<h3>' + escapeHtml(a.title) + '</h3>' +
                '<p>' + escapeHtml(a.issuer) + '</p>' +
                '<div class="achievement-btn">' + arrowIcon + '</div>' +
              '</div>';

            item.addEventListener('click', function() {
              openAchievementModal(a);
            });

            list.appendChild(item);
            revealObserver.observe(item);
          });
        });
    }

    loadProjects();
    loadExperiences();
    loadProfile();
    loadCertificates();
    loadAchievements();

    function loadProfile() {
      supa.from('profile').select('*').limit(1).then(function (res) {
        if (res.error || !res.data || res.data.length === 0) return;
        var p = res.data[0];

        var cvBtn = document.getElementById('heroCvBtn');
        if (cvBtn) {
          if (p.cv_url) {
            cvBtn.href = p.cv_url;
            cvBtn.target = '_blank';
            cvBtn.style.display = 'inline-flex';
          } else {
            cvBtn.style.display = 'none';
          }
        }
        document.title = escapeHtml(p.full_name) + ' — ' + escapeHtml(p.role);
        var navLogo = document.getElementById('navLogo');
        if(navLogo) navLogo.innerHTML = escapeHtml(p.full_name) + '<span>.</span>';
        
        var heroRole = document.getElementById('heroRoleText');
        if(heroRole) heroRole.textContent = p.role;
        var heroBioShort = document.getElementById('heroBioShortText');
        if(heroBioShort) heroBioShort.textContent = p.bio_short;
        var aboutRole = document.getElementById('aboutRoleText');
        if(aboutRole) aboutRole.textContent = p.role;
        var aboutBioLong = document.getElementById('aboutBioLongText');
        if(aboutBioLong) {
          aboutBioLong.innerHTML = p.bio_long.split('\n').map(function(para) {
            return '<p>' + escapeHtml(para) + '</p>';
          }).join('');
        }

        var initials = (p.full_name || 'C').charAt(0).toUpperCase();
        var avatarHtml = p.avatar_url ? '<img src="' + escapeHtml(p.avatar_url) + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">' : initials;
        
        var heroAvatar = document.getElementById('heroAvatar');
        if(heroAvatar) heroAvatar.innerHTML = avatarHtml;
        var aboutAvatar = document.getElementById('aboutAvatar');
        if(aboutAvatar) aboutAvatar.innerHTML = avatarHtml;
        var footerAvatar = document.querySelector('.footer-avatar');
        if(footerAvatar) footerAvatar.innerHTML = avatarHtml;

        var footerName = document.getElementById('footerText');
        if(footerName) footerName.textContent = p.full_name;

        var footerRole = document.querySelector('.footer-role');
        if(footerRole) footerRole.textContent = p.role;

        var footerSocials = document.getElementById('footerSocials');
        if(footerSocials) {
          var fsHtml = '';
          if(p.email) {
            fsHtml += '<a href="mailto:' + escapeHtml(p.email) + '" class="footer-v3-social-btn" aria-label="Email"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>';
          }
          if(p.linkedin_url && p.linkedin_url !== '#') {
            fsHtml += '<a href="' + escapeHtml(p.linkedin_url) + '" target="_blank" class="footer-v3-social-btn" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>';
          }
          // Set user's requested Instagram URL explicitly, or fallback to database if valid
          var igUrl = (p.instagram_url && p.instagram_url !== '#') ? p.instagram_url : 'https://www.instagram.com/iiccnk/';
          fsHtml += '<a href="' + escapeHtml(igUrl) + '" target="_blank" class="footer-v3-social-btn" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>';
          
          if(p.github_url && p.github_url !== '#') {
            fsHtml += '<a href="' + escapeHtml(p.github_url) + '" target="_blank" class="footer-v3-social-btn" aria-label="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>';
          }
          footerSocials.innerHTML = fsHtml;
        }
      });
    }

    function loadCertificates() {
      var grid = document.querySelector('.cert-grid');
      var status = document.createElement('p');
      status.className = 'data-status';
      status.textContent = 'Memuat sertifikat...';
      grid.innerHTML = '';
      grid.appendChild(status);

      supa.from('certificates').select('*').order('sort_order', { ascending: true })
        .then(function (res) {
          if (res.error) { status.textContent = 'Sertifikat belum bisa dimuat.'; return; }
          var rows = res.data || [];
          if (rows.length === 0) { status.textContent = 'Belum ada sertifikat ditambahkan.'; return; }
          status.remove();
          grid.innerHTML = '';
          rows.forEach(function (c) {
            var card = document.createElement('div');
            card.className = 'premium-card reveal reveal-up';
            
            var urlObj = c.image_url ? escapeHtml(c.image_url) : null;
            var isPdf = urlObj && urlObj.toLowerCase().split('?')[0].endsWith('.pdf');
            
            var imgHtml = '<div class="cert-icon-fallback">📄</div>';
            if (urlObj) {
              if (isPdf) {
                imgHtml = '<div style="position:relative; width:100%; height:100%; overflow:hidden;">' +
                            '<iframe src="' + urlObj + '#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH" style="position:absolute; top:-10%; left:-5%; width:110%; height:120%; border:none; pointer-events:none;" tabindex="-1"></iframe>' +
                            '<div style="position:absolute; inset:0; z-index:10;"></div>' +
                          '</div>';
              } else {
                imgHtml = '<img src="' + urlObj + '" alt="' + escapeHtml(c.title) + '">';
              }
            }
            
            var iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
            if (escapeHtml(c.title).toLowerCase().includes('mobile') || escapeHtml(c.title).toLowerCase().includes('web')) {
              iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>';
            } else if (escapeHtml(c.title).toLowerCase().includes('data')) {
              iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>';
            }

            card.innerHTML =
              '<div class="premium-img-wrapper">' + imgHtml + '</div>' +
              '<div class="premium-info">' +
                '<div class="premium-icon-circle">' + iconSvg + '</div>' +
                '<div class="premium-text-col">' +
                  '<h3 class="premium-title">' + escapeHtml(c.title) + '</h3>' +
                  '<span class="premium-issuer">' + escapeHtml(c.issuer) + '</span>' +
                '</div>' +
                '<div class="premium-action">Lihat Detail &rarr;</div>' +
              '</div>';
            
            card.addEventListener('click', function () {
              document.getElementById('lightboxTitle').textContent = c.title;
              document.getElementById('lightboxIssuer').textContent = c.issuer;
              var imgContainer = document.getElementById('lightboxImage');
              if(c.image_url) {
                var urlObj = escapeHtml(c.image_url);
                if (urlObj.toLowerCase().split('?')[0].endsWith('.pdf')) {
                  imgContainer.innerHTML = 
                    '<div style="position:relative; width:100%; aspect-ratio:1.414/1; margin-top:16px; border-radius:12px; overflow:hidden;">' +
                      '<iframe src="' + urlObj + '#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH" style="position:absolute; top:-10%; left:-5%; width:110%; height:120%; border:none; background:#fff; pointer-events:none;" tabindex="-1"></iframe>' +
                      '<div style="position:absolute; inset:0; z-index:10;"></div>' +
                    '</div>';
                } else {
                  imgContainer.innerHTML = '<img src="' + urlObj + '" style="max-width:100%;max-height:60vh;border-radius:8px;margin-top:16px;">';
                }
              } else {
                imgContainer.innerHTML = '<p style="margin-top:16px;color:#94a3b8;">Tidak ada lampiran.</p>';
              }
              document.getElementById('lightbox').classList.add('show');
            });
            
            grid.appendChild(card);
            revealObserver.observe(card);
          });
        });
    }

    var form = document.getElementById('contactForm');
    var successBox = document.getElementById('successBox');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      ['name', 'email', 'message'].forEach(function (id) {
        var input = document.getElementById(id);
        var field = input.closest('.field-v2');
        if (!input.value.trim()) {
          valid = false;
          field.classList.add('error');
          setTimeout(function () { field.classList.remove('error'); }, 400);
        }
      });
      if (!valid) return;

      // Disable button & show loading state
      var btn = form.querySelector('button[type="submit"]');
      var originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Mengirim...';

      var payload = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
      };

      supa.from('profile').select('whatsapp_url').limit(1).then(function(res) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        
        var waUrl = '';
        if (!res.error && res.data && res.data.length > 0 && res.data[0].whatsapp_url) {
          var url = res.data[0].whatsapp_url;
          waUrl = url.split('?')[0];
        }
        
        if (!waUrl || waUrl === '#') {
          alert('Nomor WhatsApp belum diatur di profil.');
          return;
        }

        var text = "Halo, saya " + payload.name + " (" + payload.email + ").\n\n" + payload.message;
        var finalUrl = waUrl + (waUrl.includes('?') ? '&' : '?') + "text=" + encodeURIComponent(text);
        
        window.open(finalUrl, '_blank');
        
        form.reset();
        form.style.display = 'none';
        successBox.classList.add('show');
      });
    });

    var lightbox = document.getElementById('lightbox');
    var lightboxTitle = document.getElementById('lightboxTitle');
    var lightboxIssuer = document.getElementById('lightboxIssuer');
    document.getElementById('lightboxClose').addEventListener('click', function () {
      lightbox.classList.remove('show');
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.classList.remove('show');
    });

    if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var dot = document.getElementById('cursorDot');
      window.addEventListener('mousemove', function (e) {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        document.body.style.setProperty('--mouse-x', e.clientX + 'px');
        document.body.style.setProperty('--mouse-y', e.clientY + 'px');
      });
      document.querySelectorAll('a, button, .glass').forEach(function (el) {
        el.addEventListener('mouseenter', function () { dot.classList.add('hovering'); });
        el.addEventListener('mouseleave', function () { dot.classList.remove('hovering'); });
      });
    } else {
      document.getElementById('cursorDot').style.display = 'none';
    }
