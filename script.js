var loader = document.getElementById('loader');

function dismissLoader() {
  loader.classList.add('out');
}

window.addEventListener('load', function () {
  setTimeout(dismissLoader, 500);
});

setTimeout(dismissLoader, 2500);


// CURSOR
var dot = document.getElementById('dot');
var ring = document.getElementById('ring');

var mx = 0, my = 0;
var rx = 0, ry = 0;

window.addEventListener('mousemove', function (e) {
  mx = e.clientX;
  my = e.clientY;

  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});

function animateCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;

  ring.style.left = rx + "px";
  ring.style.top = ry + "px";

  requestAnimationFrame(animateCursor);
}

animateCursor();


// HOVER
var links = document.querySelectorAll('a, .btn, .svc-item, .proj');

links.forEach(function (el) {
  el.addEventListener('mouseenter', function () {
    document.body.classList.add('hov');
  });

  el.addEventListener('mouseleave', function () {
    document.body.classList.remove('hov');
  });
});


// FLOAT NAV
var floatnav = document.getElementById('floatnav');

window.addEventListener('scroll', function () {

  if (window.scrollY > 300) {
    floatnav.classList.add('show');
  } else {
    floatnav.classList.remove('show');
  }

});


// SCROLL PROGRESS
var prog = document.getElementById('prog');

window.addEventListener('scroll', function () {

  var scrollTop = window.scrollY;
  var height = document.body.scrollHeight - window.innerHeight;

  var progress = (scrollTop / height) * 100;

  prog.style.width = progress + "%";
});


// REVEAL
var reveals = document.querySelectorAll('[data-r]');

function revealOnScroll() {

  var windowHeight = window.innerHeight;

  reveals.forEach(function (el) {

    var top = el.getBoundingClientRect().top;

    if (top < windowHeight - 80) {
      el.classList.add('on');
    }

  });

}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);


// COUNTER
var counters = document.querySelectorAll('[data-count]');

function runCounters() {

  counters.forEach(function (counter) {

    var target = +counter.getAttribute('data-count');
    var count = 0;

    function update() {

      count += Math.ceil(target / 50);

      if (count < target) {
        counter.innerText = count;
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }

    }

    update();

  });

}

setTimeout(runCounters, 1500);


// HERO PARTICLES
var canvas = document.getElementById("hero-canvas");
var ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

var particles = [];

for (var i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4
  });
}

function drawParticles() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(function (p) {

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#b8935a";
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

  });

  requestAnimationFrame(drawParticles);
}

drawParticles();