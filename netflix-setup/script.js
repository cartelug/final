/* =================================================== */
/* ==================== script.js ==================== */
/* =================================================== */
/* ================= PROJECT CONFIG ================= */
const NETFLIX_EMAIL     = "carteluganda10@gmail.com";
const NETFLIX_PASSWORD  = "thecartelug";
const WHATSAPP_NUMBER   = "256762193386"; // no + sign
/* ================================================= */
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
// Year in footer
$('#year').textContent = new Date().getFullYear();
// Mobile nav toggle
$('#navToggle').addEventListener('click',()=>$('#nav ul').classList.toggle('show'));
// Step navigation
$$('[data-next],[data-back]').forEach(el=>el.addEventListener('click',()=>switchStep(el.dataset.next||el.dataset.back)));
function switchStep(id){$$('.step').forEach(s=>s.classList.toggle('active',s.id===id));$('#setupCard').scrollIntoView({behavior:'smooth',block:'start'});} 
// Insert credentials
['M','N'].forEach(s=>{$('#email'+s).textContent=NETFLIX_EMAIL;$('#pass'+s).textContent=NETFLIX_PASSWORD});
// WhatsApp links
const pinMsg   = encodeURIComponent(`Hi Accessug Team, I'm at the Who's Watching screen for Netflix (${NETFLIX_EMAIL}). Please send my PIN.`);
const codeMsg  = encodeURIComponent("Hi Accessug Team, I'm signing into Netflix on my Smart TV. Here is the code:");
$('#waMobile').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${pinMsg}`;
$('#waNormal').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${pinMsg}`;
$('#waSmart' ).href = `https://wa.me/${WHATSAPP_NUMBER}?text=${codeMsg}`;
// ClipboardJS
new ClipboardJS('.copy',{text:t=>$('#'+t.dataset.copy).textContent}).on('success',e=>{const btn=e.trigger;btn.innerHTML='<i class="fas fa-check"></i> Copied!';btn.disabled=true;setTimeout(()=>{btn.innerHTML='<i class="far fa-copy"></i> Copy';btn.disabled=false;},1500)});
