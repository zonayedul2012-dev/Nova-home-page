const clock = document.getElementById('clock');
const date = document.getElementById('date');

function updateTime(){
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  date.textContent = now.toLocaleDateString([], {weekday:'short', day:'numeric', month:'short'});
}
updateTime();
setInterval(updateTime, 1000);

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if(!q) return;
  window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(q);
});

const panel = document.getElementById('aiPanel');
const launcher = document.getElementById('aiLauncher');
const close = document.getElementById('aiClose');
launcher.addEventListener('click', () => {
  panel.classList.toggle('open');
  if(panel.classList.contains('open')) document.getElementById('chatInput').focus();
});
close.addEventListener('click', () => panel.classList.remove('open'));

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
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