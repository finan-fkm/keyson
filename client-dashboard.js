const isLoggedIn = localStorage.getItem('clientAccess') === 'true';
if (!isLoggedIn) {
  window.location.replace('client-login.html');
}

const clientEmail = localStorage.getItem('clientEmail') || 'Client';
const clientName = document.getElementById('clientName');
clientName.textContent = `Signed in as: ${clientEmail}`;

document.getElementById('logoutBtn').addEventListener('click', function () {
  localStorage.removeItem('clientAccess');
  localStorage.removeItem('clientEmail');
  window.location.replace('client-login.html');
});

const fileInput = document.getElementById('fileInput');
const previewGrid = document.getElementById('previewGrid');
const notes = document.getElementById('notes');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');

function loadSavedUploads() {
  const saved = localStorage.getItem('clientUploads');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (Array.isArray(data)) {
      data.forEach(item => addPreviewItem(item.name, item.url));
    }
  } catch (e) {
    console.error('Could not load saved uploads:', e);
  }
}

function addPreviewItem(name, url) {
  const item = document.createElement('div');
  item.className = 'preview-item';
  item.innerHTML = `
    <img src="${url}" alt="${name}" />
    <p>${name}</p>
  `;
  previewGrid.appendChild(item);
}

fileInput.addEventListener('change', function () {
  const files = Array.from(fileInput.files || []);
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      addPreviewItem(file.name, e.target.result);
      const saved = JSON.parse(localStorage.getItem('clientUploads') || '[]');
      saved.push({ name: file.name, url: e.target.result });
      localStorage.setItem('clientUploads', JSON.stringify(saved));
    };
    reader.readAsDataURL(file);
  });
});

saveBtn.addEventListener('click', function () {
  const count = previewGrid.children.length;
  alert(count > 0
    ? `${count} photo(s) ready for the team.`
    : 'Please select at least one image first.');
});

clearBtn.addEventListener('click', function () {
  previewGrid.innerHTML = '';
  localStorage.removeItem('clientUploads');
});

saveNotesBtn.addEventListener('click', function () {
  localStorage.setItem('clientNotes', notes.value);
  alert('Notes saved successfully.');
});

notes.value = localStorage.getItem('clientNotes') || '';
loadSavedUploads();
