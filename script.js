const clock = document.getElementById('clock');
const date = document.getElementById('date');
const year = document.getElementById('year');

function updateTime(){
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  date.textContent = now.toLocaleDateString([], {weekday:'short', day:'numeric', month:'short'});
  if(year) year.textContent = now.getFullYear();
}
updateTime();
setInterval(updateTime, 1000);

// Lightweight background stars: decorative only, no external libraries.
const stars = document.getElementById('stars');
if(stars){
  const count = Math.min(55, Math.floor(window.innerWidth / 20));
  for(let i = 0; i < count; i++){
    const star = document.createElement('i');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = (Math.random() * 4) + 's';
    star.style.animationDuration = (3 + Math.random() * 4) + 's';
    stars.appendChild(star);
  }
}

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if(!q) return;
  const looksLikeUrl = /^(https?:\/\/|www\.)|\.[a-z]{2,}(\/|$)/i.test(q);
  if(looksLikeUrl){
    window.location.href = q.startsWith('http') ? q : 'https://' + q;
  }else{
    window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(q);
  }
});

// Press / to focus search, like a modern browser homepage.
document.addEventListener('keydown', e => {
  if(e.key === '/' && document.activeElement !== searchInput && document.activeElement !== chatInput){
    e.preventDefault();
    searchInput.focus();
  }
  if(e.key === 'Escape' && panel.classList.contains('open')) panel.classList.remove('open');
});

const panel = document.getElementById('aiPanel');
const launcher = document.getElementById('aiLauncher');
const close = document.getElementById('aiClose');
const chatInput = document.getElementById('chatInput');

launcher.addEventListener('click', () => {
  panel.classList.toggle('open');
  if(panel.classList.contains('open')) setTimeout(() => chatInput.focus(), 120);
});
close.addEventListener('click', () => panel.classList.remove('open'));

const chatForm = document.getElementById('chatForm');
const messages = document.getElementById('messages');
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if(!text) return;
  addMessage(text, 'user');
  chatInput.value = '';
  setTimeout(() => addMessage(getDemoReply(text), 'bot'), 350);
});

function addMessage(text, type){
  const el = document.createElement('div');
  el.className = 'message ' + type;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function getDemoReply(text){
  const q = text.toLowerCase();
  if(q.includes('hello') || q.includes('hi')) return 'Hello. NOVA AI is currently running in demo mode.';
  if(q.includes('time')) return 'The current time is ' + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) + '.';
  if(q.includes('google')) return 'Use the main search bar to search Google instantly.';
  return 'I am only a local demo right now. Connect an AI backend later to enable real AI responses.';
}