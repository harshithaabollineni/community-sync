// ─── BACKEND SIMULATION ─────────────────────────────────────────────
const DB = { users: [], events: [], feedbacks: [] };

function apiRegister(data) {
  const id = 'CS-' + Math.random().toString(36).substr(2,8).toUpperCase();
  const user = { ...data, id, joinedAt: new Date().toLocaleString(), points: 0, badges: ['🥇 First Join'] };
  DB.users.push(user);
  return { success: true, user };
}

function apiCreateEvent(data) {
  const id = 'EV-' + Math.random().toString(36).substr(2,6).toUpperCase();
  DB.events.push({ ...data, id });
  return { success: true, id };
}

// ─── EXPANDABLE TOGGLE ───────────────────────────────────────────────
function toggle(header) {
  const body = header.nextElementSibling;
  const arrow = header.querySelector('.expandable-arrow');
  body.classList.toggle('open');
  arrow.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : '';
}

// ─── ROLE SELECT (USER MGMT SECTION) ────────────────────────────────
function selectRole(el, name) {
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ─── ROLE SELECT (REGISTER FORM) ─────────────────────────────────────
function selRole(el, val) {
  document.querySelectorAll('.role-opt').forEach(r => r.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('reg-role').value = val;
}

// ─── SKILL TAGS ──────────────────────────────────────────────────────
function toggleSkill(el) { el.classList.toggle('sel'); }

// ─── CATEGORY BUTTONS ────────────────────────────────────────────────
function selectCat(el) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// ─── CHAT ─────────────────────────────────────────────────────────────
function sendChat() {
  const inp = document.getElementById('chat-in');
  if (!inp.value.trim()) return;
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg outgoing';
  div.textContent = inp.value;
  msgs.appendChild(div);
  inp.value = '';
  msgs.scrollTop = msgs.scrollHeight;
}

// ─── EMOJI REACTIONS ──────────────────────────────────────────────────
function addReaction(btn, emoji) {
  const cnt = btn.querySelector('.count');
  cnt.textContent = parseInt(cnt.textContent) + 1;
  btn.style.borderColor = 'var(--accent)';
  btn.style.background = 'rgba(155,127,212,.1)';
}

// ─── STAR RATING ──────────────────────────────────────────────────────
function rate(n) {
  document.querySelectorAll('#stars .star').forEach((s,i) => {
    s.classList.toggle('filled', i < n);
  });
}

// ─── POLL VOTE ────────────────────────────────────────────────────────
function vote(el, pct) {
  document.querySelectorAll('.poll-option').forEach(p => p.classList.remove('voted'));
  el.classList.add('voted');
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────
(function countdown() {
  let d=5, h=14, m=32, s=0;
  setInterval(()=>{
    s--; if(s<0){s=59;m--;} if(m<0){m=59;h--;} if(h<0){h=23;d--;}
    document.getElementById('cd-d').textContent=String(d).padStart(2,'0');
    document.getElementById('cd-h').textContent=String(h).padStart(2,'0');
    document.getElementById('cd-m').textContent=String(m).padStart(2,'0');
    document.getElementById('cd-s').textContent=String(s).padStart(2,'0');
  },1000);
})();

// ─── CREATE EVENT ─────────────────────────────────────────────────────
function createEvent() {
  const name = document.getElementById('ev-name').value || 'Unnamed Event';
  const result = apiCreateEvent({ name, date: document.getElementById('ev-date').value, loc: document.getElementById('ev-loc').value });
  alert(`✅ Event "${name}" created!\nID: ${result.id}`);
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  if (html.getAttribute('data-theme') === 'dark') {
    html.setAttribute('data-theme', 'light');
    btn.innerHTML = '☀️ Light';
  } else {
    html.setAttribute('data-theme', 'dark');
    btn.innerHTML = '🌙 Dark';
  }
}
// Also handle the in-page select (Community & Inclusivity section)
function applyTheme(val) {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  if (val === 'dark') {
    html.setAttribute('data-theme', 'dark');
    btn.innerHTML = '🌙 Dark';
  } else {
    html.setAttribute('data-theme', 'light');
    btn.innerHTML = '☀️ Light';
  }
}

// ─── REGISTER SUBMIT ─────────────────────────────────────────────────
function submitRegister() {
  const fname = document.getElementById('reg-fname').value.trim();
  const lname = document.getElementById('reg-lname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const uname = document.getElementById('reg-uname').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  const terms = document.getElementById('reg-terms').checked;

  if (!fname || !lname || !email || !uname) { alert('Please fill in all required fields.'); return; }
  if (pass !== pass2) { alert('Passwords do not match.'); return; }
  if (!terms) { alert('Please agree to the Terms & Conditions.'); return; }

  const skills = [...document.querySelectorAll('#reg-skills .skill-tag.sel')].map(s => s.textContent).join(', ') || 'None selected';
  const cats   = [...document.querySelectorAll('#reg-cats .checkbox-item input:checked')].map(c => c.value).join(', ') || 'None selected';

  const data = {
    role:   document.getElementById('reg-role').value,
    name:   fname + ' ' + lname,
    email,
    phone:  document.getElementById('reg-phone').value,
    username: uname,
    gender: document.getElementById('reg-gender').value,
    org:    document.getElementById('reg-org').value,
    bio:    document.getElementById('reg-bio').value,
    skills, cats
  };

  const { user } = apiRegister(data);
  showReceipt(user);
}

function showReceipt(u) {
  const modal = document.getElementById('receipt-modal');
  document.getElementById('receipt-content').innerHTML = `
    <div class="receipt-header">
      <div class="receipt-logo">CommunitySync</div>
      <div class="receipt-title">Registration Confirmation</div>
      <div class="receipt-date">Issued: ${u.joinedAt}</div>
    </div>
    <div class="receipt-success">
      <div class="receipt-success-icon">✅</div>
      <div class="receipt-success-text">Successfully Registered!</div>
    </div>
    <div class="receipt-id">Member ID: ${u.id}</div>

    <div class="receipt-section">
      <div class="receipt-section-title">Personal Information</div>
      <div class="receipt-row"><span class="receipt-key">Full Name</span><span class="receipt-val">${u.name}</span></div>
      <div class="receipt-row"><span class="receipt-key">Username</span><span class="receipt-val">${u.username}</span></div>
      <div class="receipt-row"><span class="receipt-key">Email</span><span class="receipt-val">${u.email}</span></div>
      <div class="receipt-row"><span class="receipt-key">Phone</span><span class="receipt-val">${u.phone || 'Not provided'}</span></div>
      <div class="receipt-row"><span class="receipt-key">Gender</span><span class="receipt-val">${u.gender || 'Not specified'}</span></div>
    </div>

    <div class="receipt-section">
      <div class="receipt-section-title">Account Details</div>
      <div class="receipt-row"><span class="receipt-key">Role</span><span class="receipt-val">${u.role}</span></div>
      <div class="receipt-row"><span class="receipt-key">Organisation</span><span class="receipt-val">${u.org || 'Independent'}</span></div>
      <div class="receipt-row"><span class="receipt-key">Member Since</span><span class="receipt-val">${u.joinedAt}</span></div>
      <div class="receipt-row"><span class="receipt-key">Starting Points</span><span class="receipt-val">0 pts</span></div>
      <div class="receipt-row"><span class="receipt-key">Badges</span><span class="receipt-val">${u.badges.join(', ')}</span></div>
    </div>

    <div class="receipt-section">
      <div class="receipt-section-title">Profile</div>
      <div class="receipt-row"><span class="receipt-key">Bio</span><span class="receipt-val">${u.bio || 'Not provided'}</span></div>
      <div class="receipt-row"><span class="receipt-key">Skills</span><span class="receipt-val">${u.skills}</span></div>
      <div class="receipt-row"><span class="receipt-key">Interested In</span><span class="receipt-val">${u.cats}</span></div>
    </div>

    <div style="background:var(--cream);border-radius:10px;padding:1rem;font-size:.8rem;color:var(--muted);text-align:center;">
      Welcome to CommunitySync! Your account is now active.<br/>
      Check your email at <strong>${u.email}</strong> for the confirmation link.
    </div>
    <button class="receipt-close" onclick="document.getElementById('receipt-modal').classList.remove('show')">✓ Close & Go to Dashboard</button>
  `;
  modal.classList.add('show');
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── CLOSE MODAL ON OUTSIDE CLICK ────────────────────────────────────
document.getElementById('receipt-modal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('show');
});
