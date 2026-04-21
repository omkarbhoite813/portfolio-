/* ============================================================
   ÀKANNÍ SMM — main.js
   Social Media Management Studio · akanni.co.in
   ============================================================
   01. Loader Dismiss
   02. Custom Cursor
   03. Scroll Progress Bar
   04. Floating Nav — show/hide on scroll
   05. Three.js Hero Canvas (social-themed particles)
   06. Scroll Reveal (IntersectionObserver)
   07. Count-Up Animations
   08. Service Cards — scroll reveal + 3D tilt (desktop)
   09. Hero Mouse Parallax
   ============================================================ */

// ── 01. Loader ──
var loader = document.getElementById('loader');
function dismissLoader() { loader.classList.add('out'); }
window.addEventListener('load', function() { setTimeout(dismissLoader, 300); });
setTimeout(dismissLoader, 2500);

// ── 02. Cursor ──
var dot = document.getElementById('dot');
var ring = document.getElementById('ring');
var mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', function(e) {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function rf() {
  rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(rf);
})();
document.querySelectorAll('a, button, .svc-card, .wc, .tc, .av, .proj').forEach(function(el) {
  el.addEventListener('mouseenter', function() { document.body.classList.add('hov'); });
  el.addEventListener('mouseleave', function() { document.body.classList.remove('hov'); });
});

// ── 03. Progress Bar ──
window.addEventListener('scroll', function() {
  var pct = scrollY / (document.body.scrollHeight - innerHeight) * 100;
  document.getElementById('prog').style.width = pct + '%';
});

// ── 04. Floating Nav ──
var floatnav = document.getElementById('floatnav');
window.addEventListener('scroll', function() {
  floatnav.classList.toggle('show', scrollY > window.innerHeight * 0.6);
});
setTimeout(function() { floatnav.classList.add('show'); }, 3000);

// ── 05. Three.js Hero — social media themed ──
var canvas = document.getElementById('hero-canvas');
var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0, 0);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.z = 6;

function resizeCanvas() {
  var w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resizeCanvas();
new ResizeObserver(resizeCanvas).observe(canvas);

// Purple accent lines
var colors = [0x7c5cfc, 0xf7477c, 0x00d4aa, 0xffb830];
var allLines = [];
for (var i = 0; i < 20; i++) {
  var pts = [];
  for (var j = 0; j < 80; j++) {
    var t = j / 79;
    pts.push(new THREE.Vector3(
      Math.sin(t * Math.PI * 2 + i * 0.38) * (2 + Math.sin(i * 0.6) * 0.8),
      Math.cos(t * Math.PI * 1.6 + i * 0.24) * (1.4 + Math.cos(i * 0.4) * 0.6),
      Math.sin(t * Math.PI + i * 0.5) * 1.6
    ));
  }
  var col = colors[i % colors.length];
  var mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.1 });
  var geo = new THREE.BufferGeometry().setFromPoints(pts);
  var line = new THREE.Line(geo, mat);
  line._rx = 0.05 + i * 0.002;
  line._ry = 0.025 + i * 0.0015;
  scene.add(line);
  allLines.push(line);
}

// Particles
var N = 500, ppos = new Float32Array(N * 3);
for (var k = 0; k < N * 3; k += 3) {
  ppos[k]     = (Math.random() - 0.5) * 22;
  ppos[k + 1] = (Math.random() - 0.5) * 22;
  ppos[k + 2] = (Math.random() - 0.5) * 10;
}
var pg = new THREE.BufferGeometry();
pg.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
var particles = new THREE.Points(pg, new THREE.PointsMaterial({
  color: 0x7c5cfc, size: 0.04, transparent: true, opacity: 0.3
}));
scene.add(particles);

var T = 0;
(function tick() {
  T += 0.003;
  for (var li = 0; li < allLines.length; li++) {
    allLines[li].rotation.y = T * allLines[li]._ry;
    allLines[li].rotation.x = T * allLines[li]._rx;
  }
  particles.rotation.y = T * 0.05;
  particles.rotation.x = T * 0.02;
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
})();

// ── 06. Scroll Reveal ──
var revealEls = document.querySelectorAll('[data-r]');
var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('on');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -64px 0px' });
revealEls.forEach(function(el) { io.observe(el); });

// ── 07. Count-Up ──
document.querySelectorAll('[data-count]').forEach(function(el) {
  var counted = false;
  var cio = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      var target = parseInt(el.dataset.count);
      var step = target / 60;
      var c = 0;
      var ti = setInterval(function() {
        c = Math.min(c + step, target);
        el.textContent = Math.floor(c) + '+';
        if (c >= target) clearInterval(ti);
      }, 22);
    }
  }, { threshold: 0.7 });
  cio.observe(el);
});

// ── 08. Service Cards — reveal + 3D tilt ──
document.querySelectorAll('.svc-card').forEach(function(card) {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { card.classList.add('on'); obs.unobserve(card); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  obs.observe(card);
});

var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (!isTouch) {
  document.querySelectorAll('.svc-card').forEach(function(card) {
    var inner = card.querySelector('.svc-card-inner');
    var shine = card.querySelector('.svc-card-shine');

    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2, cy = rect.height / 2;
      var rotX = ((y - cy) / cy) * -10;
      var rotY = ((x - cx) / cx) * 10;
      inner.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale3d(1.02,1.02,1.02)';
      var sx = (x / rect.width) * 100;
      var sy = (y / rect.height) * 100;
      shine.style.background = 'radial-gradient(circle at ' + sx + '% ' + sy + '%, rgba(255,255,255,.08) 0%, transparent 60%)';
    });

    card.addEventListener('mouseleave', function() {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      inner.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), box-shadow .4s';
      setTimeout(function() { inner.style.transition = 'transform .1s linear, box-shadow .4s'; }, 600);
    });

    card.addEventListener('mouseenter', function() {
      inner.style.transition = 'transform .1s linear, box-shadow .4s';
    });
  });
}

// ── 09. Hero Parallax ──
var brand = document.querySelector('.hero-brand');
document.getElementById('hero').addEventListener('mousemove', function(e) {
  var r = e.currentTarget.getBoundingClientRect();
  var x = ((e.clientX - r.left) / r.width - 0.5) * 12;
  var y = ((e.clientY - r.top) / r.height - 0.5) * 12;
  brand.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.25) + 'px)';
});
document.getElementById('hero').addEventListener('mouseleave', function() {
  brand.style.transform = '';
});
