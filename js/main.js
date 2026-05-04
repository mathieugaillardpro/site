document.addEventListener('DOMContentLoaded', function () {

  /* =====================================================
     NAV — hamburger + scroll shadow
  ===================================================== */
  var nav = document.querySelector('.nav');
  var hamburger = document.querySelector('.nav-hamburger');
  var mobile = document.querySelector('.nav-mobile');

  if (hamburger && mobile) {
    hamburger.addEventListener('click', function () {
      mobile.classList.toggle('active');
      var spans = hamburger.querySelectorAll('span');
      if (mobile.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
        document.body.classList.add('menu-open');
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
        document.body.classList.remove('menu-open');
      }
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobile.classList.remove('active');
        document.body.classList.remove('menu-open');
        var spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      });
    });
  }

  window.addEventListener('scroll', function () {
    if (nav) {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    updateScrollBar();
  }, { passive: true });

  /* =====================================================
     SCROLL PROGRESS BAR (fine ligne en haut de page)
  ===================================================== */
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  function updateScrollBar() {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* =====================================================
     PAGE TRANSITION — fondu d'entrée / sortie
  ===================================================== */
  document.body.classList.add('page-enter');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add('page-visible');
    });
  });

document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    
    // Ne pas intercepter : les ancres, les emails, les tel, les target blank, et les liens externes
    if (href.indexOf('#') === 0 || href.indexOf('mailto:') === 0 ||
        href.indexOf('tel:') === 0 || a.target === '_blank' ||
        (a.hostname !== window.location.hostname && a.hostname !== '')) return;

        a.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          var dest = a.href;
          document.body.classList.remove('page-visible');
          document.body.classList.remove('cursor-hover');
          document.body.classList.add('cursor-hide');
          setTimeout(function () { 
            location.href = dest; 
            setTimeout(function() { document.body.classList.add('page-visible'); }, 500);
          }, 280);
        });
      });
    
      /* FIX BFCache iOS/Safari : Force l'affichage systématiquement */
      window.addEventListener('pageshow', function () {
        document.body.classList.add('page-visible');
      });
  });

    
  /* =====================================================
     PORTFOLIO — clic ouvre YouTube
  ===================================================== */
  document.querySelectorAll('.portfolio-item[data-video]').forEach(function (item) {
    item.addEventListener('click', function () {
      var vid = this.getAttribute('data-video');
      if (vid) window.open('https://www.youtube.com/watch?v=' + vid, '_blank');
    });
  });

  var reviewGroups = document.querySelectorAll('.reviews-group');
  if (reviewGroups.length > 0) {
    var currentReview = 0;
    setInterval(function () {
      reviewGroups[currentReview].classList.remove('active');
      currentReview = (currentReview + 1) % reviewGroups.length;
      reviewGroups[currentReview].classList.add('active');
    }, 5000);
  }

  /* =====================================================
     SCROLL REVEAL — système propre, une seule fois
  ===================================================== */

  // Éléments à animer individuellement
  var SOLO = [
    '.section-label',
    '.section-title',
    '.section-desc',
    '.about-row',
    '.cta-box',
    '.contact-card',
    '.reviews-header',
    '.reviews-cta',
    '.hero-content',
    '.project-title',
    '.project-type',
    '.project-block',
    '.about-content',
    '.about-photo',
    '.about-name',
    '.about-subtitle',
    '.about-text',
    '.about-gear-title',
    '.about-gear-grid',
    '.about-pills',
    '.about-tools-grid',
    '.contact-item',
    '.video-wrapper',
    '.page-hero .container',
    '.brands-strip',
    '.feature'
  ];

  // Grilles dont les enfants se staggerent
  var GRIDS = [
    '.portfolio-grid',
    '.services-grid',
    '.reviews-grid',
    '.stats-row',
    '.features-grid',
    '.photo-grid',
    '.features',
    '.about-gear-grid',
    '.contact-grid',
    '.madere-collage',
    '.footer-inner'
  ];

  var MAX_STAGGER = 0.25; // secondes

  // Appliquer data-reveal aux éléments solo
  SOLO.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.setAttribute('data-reveal', '');
    });
  });

  // Ajouter les délais séquentiels dans chaque section (label → titre → desc)
  document.querySelectorAll('.section, .hero').forEach(function (sec) {
    var label = sec.querySelector('.section-label');
    var title = sec.querySelector('.section-title');
    var desc  = sec.querySelector('.section-desc');
    if (label) label.setAttribute('data-delay', '0');
    if (title) title.setAttribute('data-delay', '1');
    if (desc)  desc.setAttribute('data-delay', '2');
  });

  // Appliquer data-reveal aux enfants des grilles avec stagger
  GRIDS.forEach(function (sel) {
    // Services-grid: step plus serré pour que les dernières cards arrivent aussi vite
    var step = (sel === '.services-grid') ? 0.035 : 0.05;
    var maxDelay = (sel === '.services-grid') ? 0.18 : MAX_STAGGER;
    document.querySelectorAll(sel).forEach(function (grid) {
      Array.from(grid.children).forEach(function (child, i) {
        child.setAttribute('data-reveal', '');
        child.style.transitionDelay = Math.min(i * step, maxDelay) + 's';
      });
    });
  });

  // Certains éléments isolés : service cards, faq items
  ['service-card', 'faq-item', 'review-card', 'stat'].forEach(function (cls) {
    document.querySelectorAll('.' + cls).forEach(function (el) {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', '');
      }
    });
  });

  // Observer — bidirectionnel : apparaît en scrollant vers le bas, disparaît en remontant
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 80px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObs.observe(el);
  });

  /* =====================================================
     CURSEUR PERSONNALISÉ avec lerp (desktop only)
  ===================================================== */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var cursorDot  = document.createElement('div');
    cursorDot.className  = 'cursor-dot';
    var cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    
// Cache le curseur au chargement de la page
    document.body.classList.add('cursor-hide');
    // À mettre dans la partie curseur de main.js
var cMx = -100, cMy = -100;
var cRx = -100, cRy = -100;

var cMx = -100, cMy = -100;
    var cRx = -100, cRy = -100;

    var iframeIdleTimer = null;
    document.addEventListener('mousemove', function (e) {
      cMx = e.clientX; cMy = e.clientY;
      cursorDot.style.left = cMx + 'px';
      cursorDot.style.top  = cMy + 'px';
      // Show cursor when mouse moves on page
      document.body.classList.remove('cursor-hide');
      // Hide cursor if mouse stays still (likely over iframe or left window)
      clearTimeout(iframeIdleTimer);
      iframeIdleTimer = setTimeout(function () {
        document.body.classList.add('cursor-hide');
      }, 600);
    });

    document.addEventListener('mouseleave', function () {
      document.body.classList.add('cursor-hide');
    });
    document.addEventListener('mouseenter', function () {
      document.body.classList.remove('cursor-hide');
    });

    // Hover detection sur éléments interactifs
    document.querySelectorAll('a, button, .portfolio-item, .service-card, .review-card, .nav-cta').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });

    // Lerp ring — suit avec retard fluide
    (function lerpCursor() {
      cRx += (cMx - cRx) * 0.11;
      cRy += (cMy - cRy) * 0.11;
      cursorRing.style.left = (Math.round(cRx * 100) / 100) + 'px';
      cursorRing.style.top  = (Math.round(cRy * 100) / 100) + 'px';
      requestAnimationFrame(lerpCursor);
    }());
  }

  /* =====================================================
     HERO MOUSE PARALLAX
  ===================================================== */
  var heroSection = document.querySelector('.hero');
  var heroContent = document.querySelector('.hero-content');
  if (heroSection && heroContent) {
    document.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      if (e.clientY > rect.bottom) return; // hors hero
      var x = (e.clientX / window.innerWidth  - 0.5) * 16;
      var y = (e.clientY / window.innerHeight - 0.5) * 10;
      heroContent.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }, { passive: true });
  }

  /* =====================================================
     PORTFOLIO CARD 3D TILT
  ===================================================== */
  document.querySelectorAll('.portfolio-item').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var nx = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
      var ny = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s';
      card.style.transform  = 'perspective(700px) rotateY(' + (nx * 10) + 'deg) rotateX(' + (-ny * 7) + 'deg) scale(1.025)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s';
      card.style.transform  = '';
    });
  });

  /* =====================================================
     MAGNETIC BUTTONS (légère attraction)
  ===================================================== */
  document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var dx = (e.clientX - rect.left - rect.width  / 2) * 0.22;
      var dy = (e.clientY - rect.top  - rect.height / 2) * 0.22;
      btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.25s, color 0.25s';
      btn.style.transform  = '';
      // Reset transition après retour
      setTimeout(function () { btn.style.transition = ''; }, 500);
    });
  });

  /* =====================================================
     ANIMATED COUNTERS (stat-number / data-count)
  ===================================================== */
  document.querySelectorAll('.stat-number, .stat-value, [data-count]').forEach(function (el) {
    var raw    = el.getAttribute('data-count') || el.textContent;
    var target = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!target || isNaN(target)) return;
    var suffix = raw.replace(/^[\d.]+/, '').trim(); // garde le + ou le k
    var done   = false;

    var cntObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || done) return;
        done = true; cntObs.unobserve(entry.target);
        var start = null;
        var dur   = 1600;
        (function tick(ts) {
          if (!start) start = ts;
          var p    = Math.min((ts - start) / dur, 1);
          var ease = 1 - Math.pow(1 - p, 4); // quartic ease-out
          var val  = Number.isInteger(target)
            ? Math.round(ease * target)
            : Math.round(ease * target * 10) / 10;
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }(performance.now()));
      });
    }, { threshold: 0.6 });
    cntObs.observe(el);
  });

  /* =====================================================
     SECTION LINES (trait accent qui se dessine)
     Observer séparé — seuil plus strict pour éviter
     le déclenchement prématuré au chargement de page
  ===================================================== */
  var lineObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.8, rootMargin: '0px 0px -120px 0px' });

  document.querySelectorAll('.section-line').forEach(function (line) {
    lineObs.observe(line);
  });

  /* =====================================================
     // MODIF: lightbox photos avec navigation par projet
  ===================================================== */
  var projectBlocks = document.querySelectorAll('.project-block');
  if (projectBlocks.length) {
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML =
      '<div class="lightbox-content">' +
        '<div class="lightbox-main">' +
          '<button class="lightbox-close" type="button" aria-label="Fermer">×</button>' +
          '<button class="lightbox-prev" type="button" aria-label="Photo précédente">‹</button>' +
          '<img src="" alt="Photo agrandie">' +
          '<button class="lightbox-next" type="button" aria-label="Photo suivante">›</button>' +
          '<div class="lightbox-counter">1 / 1</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector('img');
    var lbCounter = lightbox.querySelector('.lightbox-counter');
    var lbPrev = lightbox.querySelector('.lightbox-prev');
    var lbNext = lightbox.querySelector('.lightbox-next');
    var currentList = [];
    var currentIndex = 0;

    function renderLightbox() {
      if (!currentList.length) return;
      var item = currentList[currentIndex];
      lbImg.src = item.src;
      lbImg.alt = item.alt || 'Photo projet';
      lbCounter.textContent = (currentIndex + 1) + ' / ' + currentList.length;
    }
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
    function openLightbox(list, index) {
      currentList = list;
      currentIndex = index;
      renderLightbox();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function nextPhoto() {
      currentIndex = (currentIndex + 1) % currentList.length;
      renderLightbox();
    }
    function prevPhoto() {
      currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
      renderLightbox();
    }

    projectBlocks.forEach(function (block) {
      var imgs = Array.from(block.querySelectorAll('img'));
      if (!imgs.length) return;
      var list = imgs.map(function (img) { return { src: img.src, alt: img.alt }; });
      imgs.forEach(function (img, index) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () {
          openLightbox(list, index);
        });
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', nextPhoto);
    lbPrev.addEventListener('click', prevPhoto);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    });
  }

  /* =====================================================
     BEFORE / AFTER SLIDERS
  ===================================================== */
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var after   = slider.querySelector('.ba-after');
    var divider = slider.querySelector('.ba-divider');
    var handle  = slider.querySelector('.ba-handle');
    var dragging = false;

    // Initialize at 50% (milieu pile)
    after.style.clipPath = 'inset(0 50% 0 0)';
    divider.style.left   = '50%';
    if (handle) handle.style.left = '50%';

    function setPos(x) {
      var r   = slider.getBoundingClientRect();
      var pct = Math.max(2, Math.min(98, (x - r.left) / r.width * 100));
      after.style.clipPath   = 'inset(0 ' + (100 - pct) + '% 0 0)';
      divider.style.left     = pct + '%';
      if (handle) handle.style.left = pct + '%';
    }

    slider.addEventListener('mousedown', function (e) {
      dragging = true; setPos(e.clientX); e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (dragging) setPos(e.clientX);
    });
    document.addEventListener('mouseup', function () { dragging = false; });

    slider.addEventListener('touchstart', function (e) {
      dragging = true; setPos(e.touches[0].clientX); e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', function (e) {
      if (dragging) setPos(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', function () { dragging = false; });
  });

  /* =====================================================
     PAGE HERO — Animation canvas dynamique
  ===================================================== */
  document.querySelectorAll('.page-hero').forEach(function (hero) {
    var canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    hero.insertBefore(canvas, hero.firstChild);
    var ctx = canvas.getContext('2d');
    var w, h, particles = [], t = 0;
    var mouseX = 0, mouseY = 0, targetMX = 0, targetMY = 0;

    function resize() {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
      mouseX = w / 2; mouseY = h / 2;
      targetMX = w / 2; targetMY = h / 2;
    }

    /* Orbes de lumière */
    var orbs = [
      { rx: 0.18, ry: 0.55, rad: 0.32, r: 94, g: 125, b: 255, alpha: 0.16, sx: 0.00025, sy: 0.00018, px: 0 }, /* // MODIF */
      { rx: 0.82, ry: 0.38, rad: 0.26, r: 94, g: 125, b: 255, alpha: 0.11, sx: 0.00032, sy: 0.00022, px: Math.PI }, /* // MODIF */
      { rx: 0.55, ry: 0.78, rad: 0.20, r: 94, g: 125, b: 255, alpha: 0.08, sx: 0.00018, sy: 0.00014, px: Math.PI * 0.7 } /* // MODIF */
    ];

    /* Particules */
    function Particle() {
      this.reset = function () {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.sz = Math.random() * 1.2 + 0.3;
        this.op = Math.random() * 0.5 + 0.1;
        this.life = Math.floor(Math.random() * 200);
        this.maxLife = Math.floor(Math.random() * 250 + 200);
        this.cr = Math.random() > 0.5 ? '74,158,255' : '74,158,255'; /* // MODIF */
      };
      this.reset();
    }

    resize();
    for (var i = 0; i < 55; i++) particles.push(new Particle());

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      targetMX = e.clientX - rect.left;
      targetMY = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', function () {
      targetMX = w / 2; targetMY = h / 2;
    });

    var animId;
    function draw() {
      t++;
      /* parallaxe souris lissée */
      mouseX += (targetMX - mouseX) * 0.04;
      mouseY += (targetMY - mouseY) * 0.04;
      var dx = (mouseX - w / 2) / w;
      var dy = (mouseY - h / 2) / h;

      ctx.clearRect(0, 0, w, h);

      /* Orbes */
      orbs.forEach(function (o) {
        var cx = o.rx * w + Math.sin(t * o.sx + o.px) * w * 0.06 + dx * w * 0.025;
        var cy = o.ry * h + Math.cos(t * o.sy + o.px) * h * 0.05 + dy * h * 0.025;
        var rad = o.rad * Math.max(w, h);
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.alpha + ')');
        g.addColorStop(0.4, 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + (o.alpha * 0.4) + ')');
        g.addColorStop(1, 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',0)');
        ctx.beginPath();
        ctx.ellipse(cx, cy, rad, rad * 0.65, 0, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      /* Particules */
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.life++;
        if (p.life > p.maxLife || p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) p.reset();
        var fadeIn = p.life < 60 ? p.life / 60 : 1;
        var fadeOut = p.life > p.maxLife - 60 ? (p.maxLife - p.life) / 60 : 1;
        var alpha = fadeIn * fadeOut * p.op;
        if (alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.cr + ',' + alpha + ')';
        ctx.fill();
      });

      /* Ligne de scan horizontale */
      var scanY = ((t * 0.4) % (h + 40)) - 20;
      var scanGrad = ctx.createLinearGradient(0, scanY - 10, 0, scanY + 10);
      scanGrad.addColorStop(0, 'rgba(255,255,255,0)');
      scanGrad.addColorStop(0.5, 'rgba(255,255,255,0.025)');
      scanGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 10, w, 20);

      animId = requestAnimationFrame(draw);
    }

   /* Correction du bug "Page Blanche" au retour arrière (BFCache) */
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      document.body.classList.add('page-visible');
    }
  });
    draw();
  });
