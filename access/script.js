// ===== Runtime config (replace these from server or CMS) =====
const CREDENTIALS = {
  email: 'cartelug7@gmail.com',
  password: 'cartelug10'
};

// ===== State =====
const state = {
  step: 1,
  plan: null,
  device: null
};

// ===== DOM =====
const track = document.getElementById('track');
const steps = Array.from(document.querySelectorAll('.stepper .step'));
const summaryLabel = document.getElementById('summaryLabel');
const nextBtn = document.getElementById('nextBtn');

const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const revealBtn = document.getElementById('reveal');

// init creds
emailEl.textContent = CREDENTIALS.email;
passwordEl.dataset.actual = CREDENTIALS.password;

// helpers
const goTo = (n)=>{
  state.step = n;
  const pct = (n-1)*-33.3333;
  track.style.transform = `translateX(${pct}%)`;
  steps.forEach((s,i)=>{
    s.setAttribute('aria-current', i+1===n ? 'step' : 'false');
  });
  refreshSummary();
};

const formatUGX = n => new Intl.NumberFormat('en-UG', { style:'currency', currency:'UGX', maximumFractionDigits:0}).format(n).replace('UGX','UGX');

const refreshSummary = ()=>{
  let label = '';
  if(!state.plan){
    label = 'Choose a plan to continue';
    nextBtn.disabled = true;
  } else if(state.step === 1){
    label = `${state.plan.name} • ${state.plan.duration} • ${formatUGX(state.plan.price)}`;
    nextBtn.disabled = false;
  } else if(state.step === 2){
    label = `${state.plan.name} • ${state.plan.duration} • ${formatUGX(state.plan.price)}${state.device? ' • '+state.device : ''}`;
    nextBtn.disabled = !state.device;
  } else {
    label = `${state.plan.name} • ${state.plan.duration} • ${formatUGX(state.plan.price)} • ${state.device}`;
    nextBtn.textContent = 'Complete Payment';
    nextBtn.disabled = false;
  }
  summaryLabel.textContent = label;
  nextBtn.textContent = state.step < 3 ? 'Next' : 'Complete Payment';
};

// select plan
document.querySelectorAll('.select-plan').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const card = e.currentTarget.closest('.card');
    state.plan = {
      id: card.dataset.planId,
      name: card.dataset.name,
      duration: card.dataset.duration,
      price: Number(card.dataset.price)
    };
    goTo(2);
  });
});

// device selection
document.querySelectorAll('.device').forEach(el=>{
  el.addEventListener('click', ()=>{
    document.querySelectorAll('.device').forEach(d=>d.setAttribute('aria-checked','false'));
    el.setAttribute('aria-checked','true');
    state.device = el.dataset.device;
    // reflect on login page
    document.getElementById('deviceLabel').textContent = state.device;
    document.querySelectorAll('.device-name').forEach(n=>n.textContent = state.device);
    goTo(3);
  });
});

// nav buttons
document.getElementById('back-to-plans').addEventListener('click',()=>goTo(1));
document.getElementById('back-to-device').addEventListener('click',()=>goTo(2));

nextBtn.addEventListener('click',()=>{
  if(state.step === 1 && state.plan){ goTo(2); return; }
  if(state.step === 2 && state.device){ goTo(3); return; }
  if(state.step === 3){
    // Payment CTA – send prefilled WhatsApp with summary
    const msg = encodeURIComponent(`Hi! I'm ready to pay. Plan: ${state.plan.name} / ${state.plan.duration} (${formatUGX(state.plan.price)}). Device: ${state.device}.`);
    window.open(`https://wa.me/256762193386?text=${msg}`, '_blank');
  }
});

// copy buttons
document.querySelectorAll('[data-copy]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const id = btn.getAttribute('data-copy');
    const text = id === 'email' ? CREDENTIALS.email : CREDENTIALS.password;
    navigator.clipboard?.writeText(text).then(()=>{
      const prev = btn.innerHTML; btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
      setTimeout(()=>btn.innerHTML = prev, 1600);
    }).catch(()=>alert('Copy failed. Please copy manually.'));
  });
});

// reveal password
revealBtn.addEventListener('click',()=>{
  const isSecret = passwordEl.dataset.secret === 'true';
  if(isSecret){
    passwordEl.textContent = passwordEl.dataset.actual;
    passwordEl.dataset.secret = 'false';
    revealBtn.innerHTML = '<i class="fa-regular fa-eye-slash"></i> Hide';
  } else {
    passwordEl.textContent = '••••••••';
    passwordEl.dataset.secret = 'true';
    revealBtn.innerHTML = '<i class="fa-regular fa-eye"></i> Reveal';
  }
});

// initialize
refreshSummary();

// Security: In production, avoid hardcoding real credentials in the frontend.
// Fetch short-lived credentials from your backend and rotate frequently.
