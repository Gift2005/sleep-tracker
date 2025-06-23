const form = document.getElementById('sleepForm');
const logList = document.getElementById('logList');

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark');
}

function formatTimeDiff(start, end) {
  let [h1, m1] = start.split(':').map(Number);
  let [h2, m2] = end.split(':').map(Number);
  let startMins = h1 * 60 + m1;
  let endMins = h2 * 60 + m2;
  if (endMins <= startMins) endMins += 24 * 60;
  const diff = endMins - startMins;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours}h ${minutes}m`;
}

function saveLog(e) {
  e.preventDefault();
  const start = document.getElementById('start-time').value;
  const end = document.getElementById('end-time').value;
  const notes = document.getElementById('notes').value;

  if (!start || !end) return;

  const duration = formatTimeDiff(start, end);
  const log = {
    date: new Date().toLocaleDateString(),
    start,
    end,
    duration,
    notes
  };

  const logs = JSON.parse(localStorage.getItem('sleepLogs') || '[]');
  logs.unshift(log);
  localStorage.setItem('sleepLogs', JSON.stringify(logs));
  form.reset();
  renderLogs();
}

function renderLogs() {
  const logs = JSON.parse(localStorage.getItem('sleepLogs') || '[]');
  if (!logList) return;
  logList.innerHTML = logs.map(log => `
    <div class="log-entry">
      <strong>${log.date}</strong><br/>
      💤 ${log.start} → ${log.end} (${log.duration})<br/>
      📝 ${log.notes || 'No notes'}
    </div>
  `).join('');
}

function clearLogs() {
  if (confirm("Clear all logs?")) {
    localStorage.removeItem('sleepLogs');
    renderLogs();
  }
}

if (form) {
  form.addEventListener('submit', saveLog);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderLogs();
});
