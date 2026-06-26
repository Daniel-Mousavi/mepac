/* ============================================================
   MEEP — shared site behaviours (inner pages)
   Injects the global nav + footer, builds the dot-mosaic logo,
   handles scroll-aware nav, dropdowns (CSS) + mobile menu, reveals.
   Pages set <body data-page="issues"> to mark the active nav item.
   ============================================================ */
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page') || '';

  /* ---- nav model ---- */
  var NAV = [
    { label:'About', href:'about.html', page:'about', sub:[
      ['Who We Are','about.html#who-we-are'],['Our Mission','about.html#mission'],['How We Work','about.html#how-we-work'],
      ['Our Leadership','about.html#leadership'],['Our Base','about.html#base'],['Press Information','about.html#press'] ] },
    { label:'Issues', href:'issues.html', page:'issues' },
    { label:'Publications', href:'publications.html', page:'publications', sub:[
      ['Policy Briefs','publications.html#policy-briefs'],['Annual Reports','publications.html#annual-reports'],
      ['News','publications.html#news'],['Stories','publications.html#stories'] ] },
    { label:'Events', href:'events.html', page:'events' },
    { label:'Scorecards', href:'scorecards.html', page:'scorecards', sub:[
      ['Scorecards','scorecards.html#scorecards'],['Key Votes','scorecards.html#key-votes'] ] },
    { label:'Candidates', href:'candidates.html', page:'candidates', sub:[
      ['Endorsed Candidates','candidates.html#endorsed'],['Recent Elections','candidates.html#elections'] ] }
  ];

  function esc(s){ return s.replace(/&/g,'&amp;'); }

  function brandHTML(markId){
    return '<a class="brand" href="index.html" aria-label="Michigan Economic Empowerment PAC home">'
      + '<span class="brand__mark" id="'+markId+'" aria-hidden="true"></span>'
      + '<span class="brand__word"><span class="brand__line navy">Michigan</span><span class="brand__line navy">Economic</span>'
      + '<span class="brand__line teal">Empowerment</span><span class="brand__rule"></span>'
      + '<span class="brand__legal">Political Action Committee</span></span></a>';
  }

  function navLinksHTML(){
    return NAV.map(function(it){
      var cur = (it.page === page) ? ' current' : '';
      if(it.sub){
        var drop = it.sub.map(function(s){ return '<a href="'+s[1]+'">'+esc(s[0])+'</a>'; }).join('');
        return '<span class="navitem'+cur+'"><a href="'+it.href+'">'+esc(it.label)+'<i class="caret"></i></a><div class="dropdown">'+drop+'</div></span>';
      }
      return '<a class="lnk'+cur+'" href="'+it.href+'">'+esc(it.label)+'</a>';
    }).join('');
  }

  function navHTML(){
    return '<header class="nav" id="nav"><div class="nav__inner">'
      + brandHTML('mark-header')
      + '<nav class="links" aria-label="Primary">'+navLinksHTML()+'</nav>'
      + '<div class="nav__cta"><a class="btn btn--gold btn--sm" href="donate.html">Donate</a>'
      + '<button class="menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false">'
      + '<svg width="22" height="15" viewBox="0 0 22 15" fill="none"><path d="M0 1.5h22M0 7.5h22M0 13.5h22" stroke="currentColor" stroke-width="1.7"/></svg></button></div>'
      + '</div></header>';
  }

  function mobileHTML(){
    var items = NAV.map(function(it){
      var s = it.sub ? '<div class="sub">'+it.sub.map(function(x){ return '<a href="'+x[1]+'">'+esc(x[0])+'</a>'; }).join('')+'</div>' : '';
      return '<a href="'+it.href+'">'+esc(it.label)+'</a>'+s;
    }).join('');
    return '<div class="mobile-menu" id="mobileMenu">'
      + '<button class="mobile-close" id="mobileClose" aria-label="Close menu"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M1 1l18 18M19 1L1 19" stroke="currentColor" stroke-width="1.7"/></svg></button>'
      + items + '<a href="donate.html">Donate</a></div>';
  }

  function footerHTML(){
    var social = '<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4V21H3zM9 8.98h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.35c0-1.28-.02-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.83V21H9z"/></svg></a>'
      + '<a href="#" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.9 2H22l-7.5 8.6L23.3 22h-6.9l-5.4-7-6.2 7H1.7l8-9.2L1 2h7l4.9 6.5L18.9 2zm-2.4 18h1.9L7.6 4H5.6z"/></svg></a>'
      + '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg></a>'
      + '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16z"/></svg></a>';
    return '<footer class="ft"><div class="wrap"><div class="ft__top">'
      + '<div class="ft__brand">'+brandHTML('mark-footer')+'<p class="blurb">Building political power and influence that advance inclusive economic growth, opportunity, and prosperity for all Michiganders.</p></div>'
      + '<div class="ftcol"><h4>About</h4><a href="about.html#who-we-are">Who We Are</a><a href="about.html#mission">Our Mission</a><a href="about.html#leadership">Leadership</a><a href="about.html#press">Press</a></div>'
      + '<div class="ftcol"><h4>Our Work</h4><a href="issues.html">Issues</a><a href="scorecards.html">Scorecards</a><a href="candidates.html">Candidates</a><a href="publications.html">Publications</a></div>'
      + '<div class="ftcol"><h4>Get Involved</h4><a href="donate.html">Donate</a><a href="events.html">Events</a><a href="about.html#base">Our Base</a></div>'
      + '<div class="ftcol"><h4>Connect</h4><p>123 W. Allegan St., Suite 1000<br/>Lansing, MI 48933</p><a href="mailto:info@mepac.org">info@mepac.org</a><a href="tel:5175550123">517-555-0123</a>'
      + '<div class="ft__social" aria-label="Social media">'+social+'</div></div>'
      + '</div><div class="ft__bottom">'
      + '<!-- TODO: confirm exact FEC / Michigan Bureau of Elections disclaimer with counsel before publishing. -->'
      + '<span>Paid for by Michigan Economic Empowerment PAC. Not authorized by any candidate or candidate’s committee.</span>'
      + '<span>&copy; 2025 Michigan Economic Empowerment PAC. All rights reserved.</span>'
      + '</div></div></footer>';
  }

  /* ---- dot-mosaic logo ---- */
  function buildMark(el, palette, animate){
    if(!el) return;
    var N=7, cell=7.6, max=5.2, cx=3, cy=3, maxD=Math.sqrt(cx*cx+cy*cy), size=N*cell;
    var svg='<svg viewBox="0 0 '+size+' '+size+'" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
    for(var r=0;r<N;r++){ for(var c=0;c<N;c++){
      var d=Math.sqrt((c-cx)*(c-cx)+(r-cy)*(r-cy)), f=1-(d/maxD)*0.82;
      if(f<=0.12) continue;
      var s=Math.max(1.3,max*f), x=c*cell+(cell-s)/2, y=r*cell+(cell-s)/2;
      var teal=(c-r===0)||(c-r===1)||(r===1&&c===4)||(r===5&&c===2);
      var delay=animate?' style="animation-delay:'+(d*0.06).toFixed(3)+'s"':'';
      svg+='<rect x="'+x.toFixed(2)+'" y="'+y.toFixed(2)+'" width="'+s.toFixed(2)+'" height="'+s.toFixed(2)+'" fill="'+(teal?palette.teal:palette.navy)+'" rx="0.4"'+delay+'/>';
    }}
    el.innerHTML=svg+'</svg>';
  }

  /* ---- inject chrome ---- */
  var skip=document.createElement('a'); skip.className='skip'; skip.href='#main'; skip.textContent='Skip to content';
  document.body.insertBefore(skip, document.body.firstChild);
  document.body.insertAdjacentHTML('afterbegin', navHTML());
  document.body.insertAdjacentHTML('beforeend', mobileHTML());
  document.body.insertAdjacentHTML('beforeend', footerHTML());
  buildMark(document.getElementById('mark-header'), {navy:'#16294C', teal:'#2C7A78'}, !reduce);
  buildMark(document.getElementById('mark-footer'), {navy:'#EEF2F5', teal:'#4FB3AE'}, false);

  /* ---- scroll-aware nav ---- */
  var nav=document.getElementById('nav');
  function onScroll(){ var y=window.scrollY||window.pageYOffset; if(y>64){ nav.classList.add('solid'); } else if(y<24){ nav.classList.remove('solid'); } }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  /* ---- mobile menu ---- */
  var mb=document.getElementById('menuBtn'), mm=document.getElementById('mobileMenu'), mc=document.getElementById('mobileClose');
  function openMenu(o){ mm.classList.toggle('open', o); mb.setAttribute('aria-expanded', o?'true':'false'); document.body.style.overflow=o?'hidden':''; }
  if(mb) mb.addEventListener('click', function(){ openMenu(!mm.classList.contains('open')); });
  if(mc) mc.addEventListener('click', function(){ openMenu(false); });
  if(mm) mm.addEventListener('click', function(e){ if(e.target.tagName==='A') openMenu(false); });
  window.addEventListener('keydown', function(e){ if(e.key==='Escape') openMenu(false); });
  window.addEventListener('resize', function(){ if(window.innerWidth>1080) openMenu(false); });

  /* ---- reveal on scroll ---- */
  var revs=document.querySelectorAll('.reveal');
  if(reduce || !('IntersectionObserver' in window)){ revs.forEach(function(el){ el.classList.add('in'); }); }
  else { var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:.14});
    revs.forEach(function(el){ io.observe(el); }); }
})();
