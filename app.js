/* Minimal SPA navigation + reveal on scroll */
(function(){
  const links = document.querySelectorAll('[data-link]');
  const pages = document.querySelectorAll('.page');
  const navItems = document.querySelectorAll('.nav-item');

  function showPage(id){
    pages.forEach(p => {
      if (p.id === id) p.classList.add('page--active');
      else p.classList.remove('page--active');
    });
    navItems.forEach(n => n.classList.toggle('active', n.getAttribute('data-link')===id));
    // ensure scroll top for container pages
    const container = document.querySelector('#' + id + ' .container');
    if(container) container.scrollTop = 0;
    // Small micro-interaction: focus reveal
    triggerReveal();
  }

  links.forEach(l => {
    l.addEventListener('click', (e) => {
      const id = l.getAttribute('data-link');
      if(id) showPage(id);
    });
  });

  // trigger reveal animations on scroll with IntersectionObserver
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  }, {threshold:0.08});

  function triggerReveal(){
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }

  // initial
  triggerReveal();

  // keyboard navigation: left/right to switch pages
  const order = ['home','history','tuning','gallery'];
  document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowLeft' || e.key==='ArrowRight'){
      const active = Array.from(pages).find(p=>p.classList.contains('page--active')).id;
      let i = order.indexOf(active);
      if(e.key==='ArrowLeft') i = (i-1+order.length)%order.length;
      else i = (i+1)%order.length;
      showPage(order[i]);
    }
  });

  // allow clicking gallery images to view in a simple lightbox
  document.addEventListener('click', (e)=>{
    const img = e.target.closest('.gallery-grid img, .card-media img, .hero-img');
    if(!img) return;
    openLightbox(img.src, img.alt);
  });

  function openLightbox(src, alt=''){
    const lb = document.createElement('div');
    lb.style.position='fixed';
    lb.style.inset=0;
    lb.style.background='rgba(2,2,2,0.92)';
    lb.style.display='flex';
    lb.style.alignItems='center';
    lb.style.justifyContent='center';
    lb.style.zIndex=80;
    lb.style.cursor='zoom-out';
    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    image.style.maxWidth='92%';
    image.style.maxHeight='92%';
    image.style.boxShadow='0 30px 80px rgba(0,0,0,.9)';
    image.style.borderRadius='6px';
    lb.appendChild(image);
    document.body.appendChild(lb);
    lb.addEventListener('click', ()=> lb.remove());
  }

  // Ensure initial page shows
  showPage('home');
})();