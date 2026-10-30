/* Consent manager: Meta Pixel only after explicit marketing opt-in. */
(()=>{
 'use strict';
 const KEY='dream_cookie_consent_v1', PIXEL_ID='1734861030937993';
 let consent=null, pixelLoaded=false, banner, settings, marketingInput, quickButton;
 try {
   const saved=JSON.parse(localStorage.getItem(KEY));
   if(saved && saved.version===1 && typeof saved.marketing==='boolean') consent=saved.marketing;
 }catch(e){}
 function erasePixelCookies(){
   const host=location.hostname,parts=host.split('.'),domains=['',host,'.'+host];
   for(let i=1;i<parts.length-1;i++)domains.push('.'+parts.slice(i).join('.'));
   ['_fbp','_fbc'].forEach(name=>domains.forEach(domain=>{
     document.cookie=name+'=; Max-Age=0; path=/; SameSite=Lax'+(domain?'; domain='+domain:'');
   }));
 }
 function loadPixel(){
   if(consent!==true||pixelLoaded)return;
   pixelLoaded=true;
   !function(f,b,e,v,n,t,s){
     if(f.fbq)return;
     n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
     if(!f._fbq)f._fbq=n;
     n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
     t=b.createElement(e);t.async=!0;t.src=v;
     s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
   }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
   fbq('init',PIXEL_ID);
   fbq('track','PageView');
 }
 function closeBanner(){
   banner.hidden=true;settings.hidden=true;
 }
 function saveConsent(marketing){
   consent=marketing===true;
   try{localStorage.setItem(KEY,JSON.stringify({version:1,marketing:consent,savedAt:new Date().toISOString()}));}catch(e){}
   if(!consent){
     erasePixelCookies();
     if(pixelLoaded){location.reload();return;}
   } else loadPixel();
   closeBanner();
 }
 function openPreferences(){
   banner.hidden=false;settings.hidden=false;marketingInput.checked=consent===true;
   marketingInput.focus({preventScroll:true});
 }
 function setup(){
   const root=document.createElement('div');
   root.innerHTML=[
     '<button type="button" class="cookie-floating" data-cookie-open aria-label="Modifica preferenze cookie">Cookie</button>',
     '<section class="cookie-banner" data-cookie-banner aria-label="Preferenze privacy e cookie" role="region" hidden>',
       '<div class="cookie-inner">',
         '<button type="button" class="cookie-close" data-cookie-reject aria-label="Chiudi e rifiuta i cookie facoltativi">×</button>',
         '<div class="cookie-heading">Privacy e cookie</div>',
         '<p>Utilizziamo strumenti tecnici necessari al sito. <strong>Solo con il tuo consenso</strong> attiviamo il Meta Pixel per misurare le visite e le campagne pubblicitarie. Se rifiuti, il Pixel non viene caricato.</p>',
         '<p class="cookie-links"><a href="privacy.html">Privacy Policy</a> · <a href="cookie-policy.html">Cookie Policy</a></p>',
         '<div class="cookie-settings" data-cookie-settings-panel hidden>',
           '<label><input type="checkbox" checked disabled> Tecnici e preferenze (necessari)</label>',
           '<label><input type="checkbox" data-cookie-marketing> Marketing e misurazione – Meta Pixel (facoltativi)</label>',
           '<p>Puoi cambiare idea in qualsiasi momento. I cookie marketing sono disattivati per impostazione predefinita.</p>',
           '<button type="button" class="cookie-action" data-cookie-save>Salva preferenze</button>',
         '</div>',
         '<div class="cookie-actions">',
           '<button type="button" class="cookie-action" data-cookie-reject>Rifiuta</button>',
           '<button type="button" class="cookie-action cookie-customize" data-cookie-customize>Personalizza</button>',
           '<button type="button" class="cookie-action" data-cookie-accept>Accetta</button>',
         '</div>',
       '</div>',
     '</section>'
   ].join('');
   document.body.appendChild(root);
   quickButton=root.querySelector('[data-cookie-open]');
   banner=root.querySelector('[data-cookie-banner]');
   settings=root.querySelector('[data-cookie-settings-panel]');
   marketingInput=root.querySelector('[data-cookie-marketing]');
   quickButton.addEventListener('click',openPreferences);
   document.querySelectorAll('[data-cookie-settings]').forEach(b=>b.addEventListener('click',openPreferences));
   root.querySelectorAll('[data-cookie-reject]').forEach(b=>b.addEventListener('click',()=>saveConsent(false)));
   root.querySelector('[data-cookie-accept]').addEventListener('click',()=>saveConsent(true));
   root.querySelector('[data-cookie-customize]').addEventListener('click',openPreferences);
   root.querySelector('[data-cookie-save]').addEventListener('click',()=>saveConsent(marketingInput.checked));
   if(consent===null)banner.hidden=false;
   else if(consent===true)loadPixel();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
 else setup();
})();