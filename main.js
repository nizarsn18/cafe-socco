/**
 * Café Socco — Site officiel
 * Three.js 3D scene + interactions
 */

(function () {
  'use strict';

  // ─── LOADER ───
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 1800);
  });

  // ─── THREE.JS 3D BACKGROUND ───
  function init3DScene() {
    const canvas = document.getElementById('scene-3d');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambient = new THREE.AmbientLight(0xc9a227, 0.3);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xe8c547, 1, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x5c3a24, 0.8, 50);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    const objects = [];

    // Coffee bean shape (elongated sphere)
    function createCoffeeBean(x, y, z, scale) {
      const geometry = new THREE.SphereGeometry(0.3, 16, 12);
      geometry.scale(1, 0.6, 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x3d2314,
        shininess: 80,
        specular: 0xc9a227,
      });
      const bean = new THREE.Mesh(geometry, material);
      bean.position.set(x, y, z);
      bean.scale.setScalar(scale || 1);
      bean.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(bean);
      objects.push({ mesh: bean, speed: 0.2 + Math.random() * 0.3 });
      return bean;
    }

    // Golden ring (oriental motif)
    function createGoldRing(x, y, z, radius) {
      const geometry = new THREE.TorusGeometry(radius, 0.03, 8, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0xc9a227,
        emissive: 0x9a7b1a,
        emissiveIntensity: 0.2,
        shininess: 100,
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.position.set(x, y, z);
      scene.add(ring);
      objects.push({ mesh: ring, speed: 0.15 + Math.random() * 0.2, isRing: true });
      return ring;
    }

    // Cup (cylinder + torus handle)
    function createCup3D(x, y, z) {
      const group = new THREE.Group();

      const cupGeo = new THREE.CylinderGeometry(0.4, 0.35, 0.7, 24);
      const cupMat = new THREE.MeshPhongMaterial({
        color: 0x5c3a24,
        shininess: 60,
      });
      const cup = new THREE.Mesh(cupGeo, cupMat);
      group.add(cup);

      const liquidGeo = new THREE.CylinderGeometry(0.35, 0.32, 0.15, 24);
      const liquidMat = new THREE.MeshPhongMaterial({
        color: 0x2a1810,
        emissive: 0x1a0f08,
        emissiveIntensity: 0.3,
      });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = 0.25;
      group.add(liquid);

      const handleGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 16, Math.PI);
      const handleMat = new THREE.MeshPhongMaterial({ color: 0x5c3a24 });
      const handle = new THREE.Mesh(handleGeo, handleMat);
      handle.position.set(0.45, 0, 0);
      handle.rotation.z = -Math.PI / 2;
      group.add(handle);

      group.position.set(x, y, z);
      scene.add(group);
      objects.push({ mesh: group, speed: 0.25 });
      return group;
    }

    // Steam particles
    const steamParticles = [];
    function createSteam(x, y, z) {
      const geo = new THREE.SphereGeometry(0.05, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xe8dcc8,
        transparent: true,
        opacity: 0.15,
      });
      for (let i = 0; i < 5; i++) {
        const p = new THREE.Mesh(geo, mat.clone());
        p.position.set(x + (Math.random() - 0.5) * 0.3, y + i * 0.2, z);
        scene.add(p);
        steamParticles.push({
          mesh: p,
          baseY: y,
          offset: Math.random() * Math.PI * 2,
        });
      }
    }

    // Populate scene
    for (let i = 0; i < 12; i++) {
      createCoffeeBean(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8 - 2,
        0.5 + Math.random() * 1.2
      );
    }

    for (let i = 0; i < 4; i++) {
      createGoldRing(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 3,
        0.5 + Math.random() * 0.8
      );
    }

    createCup3D(-3, 1, -2);
    createCup3D(4, -2, -4);
    createSteam(-3, 1.5, -2);
    createSteam(4, -1.5, -4);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;

      objects.forEach((obj, i) => {
        obj.mesh.rotation.x += 0.003 * obj.speed;
        obj.mesh.rotation.y += 0.005 * obj.speed;
        if (obj.isRing) {
          obj.mesh.rotation.z += 0.002;
        }
        obj.mesh.position.y += Math.sin(time + i) * 0.002;
      });

      steamParticles.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(time * 2 + p.offset) * 0.5 + 0.3;
        p.mesh.material.opacity = 0.08 + Math.sin(time + p.offset) * 0.07;
      });

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  init3DScene();

  // ─── HEADER SCROLL ───
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
  });

  // ─── MOBILE NAV ───
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // ─── ACTIVE NAV ON SCROLL ───
  const sections = document.querySelectorAll('section[id]');
  function setActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link && scrollY >= top && scrollY < top + height) {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveNav);

  // ─── 3D CARD TILT ───
  document.querySelectorAll('.card-3d').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
      card.style.boxShadow = `${-x * 20}px ${y * 20}px 40px rgba(0,0,0,0.4)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  // ─── SCROLL ANIMATIONS (AOS) ───
  const aosElements = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  aosElements.forEach((el) => aosObserver.observe(el));

  // ─── MENU TABS ───
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');

  menuTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      menuTabs.forEach((t) => t.classList.remove('active'));
      menuPanels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${target}`).classList.add('active');
    });
  });

  // ─── GALLERY FILTER ───
  const galleryFilters = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const cat = filter.dataset.filter;
      galleryFilters.forEach((f) => f.classList.remove('active'));
      filter.classList.add('active');
      galleryItems.forEach((item) => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ─── LIGHTBOX ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-overlay span');
      lightboxImg.src = img.src.replace('w=500', 'w=1200').replace('w=800', 'w=1200');
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ─── ENVOI RÉSERVATION / CONTACT (sans FormSubmit — service souvent en panne) ───
  const cfg = window.CAFE_SOCCO_CONFIG || {
    email: 'Jihanemj111@gmail.com',
    whatsapp: '212777498828',
    web3formsKey: '',
  };

  function formDataToText(form) {
    const data = Object.fromEntries(new FormData(form));
    return Object.entries(data)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k.replace(/_/g, ' ')} : ${v}`)
      .join('\n');
  }

  function buildMailto(subject, body) {
    return `mailto:${cfg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function buildWhatsApp(text) {
    return `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  async function tryWeb3Forms(form, subject) {
    if (!cfg.web3formsKey) return false;
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: cfg.web3formsKey,
        subject,
        email: data.Email || data.Email_client || cfg.email,
        name: data.Nom || 'Client',
        message: formDataToText(form),
      }),
    });
    const json = await res.json();
    return res.ok && json.success;
  }

  function showFormSuccess(successEl, subject, body, form, isReservation) {
    const waLink = buildWhatsApp(`*${subject}*\n\n${body}`);
    const mailLink = buildMailto(subject, body);
    const title = isReservation
      ? '✓ Réservation prête à envoyer !'
      : '✓ Message prêt à envoyer !';
    successEl.innerHTML = `
      <p><strong>${title}</strong></p>
      <p>Cliquez sur un bouton pour nous transmettre votre demande :</p>
      <p class="form-actions-row">
        <a href="${mailLink}" class="btn btn-primary btn-3d btn-small">📧 Envoyer par email</a>
        <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-outline btn-3d btn-small">💬 Envoyer par WhatsApp</a>
      </p>
      <p class="form-hint">Puis appuyez sur <strong>Envoyer</strong> dans votre application email ou WhatsApp.</p>
    `;
    successEl.hidden = false;
    form.reset();
  }

  async function handleFormSubmit(form, options) {
    const { successEl, errorEl, submitBtn, subject, defaultBtnText, isReservation } = options;
    const body = formDataToText(form);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
    }
    if (errorEl) errorEl.hidden = true;
    if (successEl) successEl.hidden = true;

    try {
      const sent = await tryWeb3Forms(form, subject);
      if (sent) {
        successEl.innerHTML =
          '<p><strong>✓ Envoyé avec succès !</strong> Nous vous contacterons très bientôt.</p>';
        successEl.hidden = false;
        form.reset();
      } else {
        showFormSuccess(successEl, subject, body, form, isReservation);
      }
    } catch {
      showFormSuccess(successEl, subject, body, form, isReservation);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultBtnText;
      }
    }
  }

  // ─── RESERVATION FORM ───
  const resForm = document.getElementById('reservation-form');
  const resSuccess = document.getElementById('res-success');
  const resError = document.getElementById('res-error');
  const resSubmitBtn = document.getElementById('res-submit-btn');
  const resDateInput = document.getElementById('res-date');

  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.setAttribute('min', today);
  }

  resForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(resForm, {
      successEl: resSuccess,
      errorEl: resError,
      submitBtn: resSubmitBtn,
      subject: 'Réservation Café Socco',
      defaultBtnText: 'Confirmer la réservation',
      isReservation: true,
    });
  });

  // ─── CONTACT FORM ───
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');
  const contactError = document.getElementById('contact-error');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(contactForm, {
      successEl: contactSuccess,
      errorEl: contactError,
      submitBtn: contactSubmitBtn,
      subject: 'Message contact — Café Socco',
      defaultBtnText: 'Envoyer',
      isReservation: false,
    });
  });

  // ─── SMOOTH SCROLL OFFSET FOR FIXED HEADER ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
