const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();

const clientName = document.getElementById('clientName');
const logoutBtn = document.getElementById('logoutBtn');
const fileInput = document.getElementById('fileInput');
const previewGrid = document.getElementById('previewGrid');
const notes = document.getElementById('notes');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const uploadStatus = document.getElementById('uploadStatus');

let currentUser = null;

function saveUploadsToStorage(items) {
  localStorage.setItem('clientUploads', JSON.stringify(items));
}

function loadSavedUploads() {
  const saved = localStorage.getItem('clientUploads');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (Array.isArray(data)) {
      data.forEach(function (item) {
        addPreviewItem(item.name, item.url);
      });
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

function uploadFiles(files) {
  if (!currentUser) return;

  const uploadQueue = Array.from(files || []);
  if (!uploadQueue.length) return;

  uploadStatus.textContent = 'Uploading images...';

  uploadQueue.forEach(function (file) {
    if (!file.type.startsWith('image/')) return;

    const storageRef = storage.ref('client-uploads/' + currentUser.uid + '/' + Date.now() + '-' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', function (snapshot) {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      uploadStatus.textContent = 'Uploading ' + file.name + ' (' + progress + '%)';
    }, function () {
      uploadStatus.textContent = 'Upload failed for ' + file.name;
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
        const saved = JSON.parse(localStorage.getItem('clientUploads') || '[]');
        saved.push({ name: file.name, url: url });
        saveUploadsToStorage(saved);
        addPreviewItem(file.name, url);
        uploadStatus.textContent = 'Uploaded: ' + file.name;
      });
    });
  });
}

auth.onAuthStateChanged(function (user) {
  if (!user) {
    window.location.replace('client-login.html');
    return;
  }

  currentUser = user;
  clientName.textContent = 'Signed in as: ' + (user.email || 'Client');
  localStorage.setItem('clientAccess', 'true');
  localStorage.setItem('clientEmail', user.email || '');
});

logoutBtn.addEventListener('click', function () {
  auth.signOut().then(function () {
    localStorage.removeItem('clientAccess');
    localStorage.removeItem('clientEmail');
    window.location.replace('client-login.html');
  });
});

fileInput.addEventListener('change', function (e) {
  uploadFiles(e.target.files);
});

saveBtn.addEventListener('click', function () {
  const count = previewGrid.children.length;
  alert(count > 0
    ? count + ' photo(s) ready for the team.'
    : 'Please select at least one image first.');
});

clearBtn.addEventListener('click', function () {
  previewGrid.innerHTML = '';
  localStorage.removeItem('clientUploads');
  uploadStatus.textContent = 'Preview cleared.';
});

saveNotesBtn.addEventListener('click', function () {
  localStorage.setItem('clientNotes', notes.value);
  alert('Notes saved successfully.');
});

notes.value = localStorage.getItem('clientNotes') || '';
loadSavedUploads();
