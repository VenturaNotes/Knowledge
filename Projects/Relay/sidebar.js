const sidebar = document.getElementById('sidebar');
const addBtn = document.getElementById('add-btn');
const modal = document.getElementById('add-modal');
const nameInput = document.getElementById('service-name');
const urlInput = document.getElementById('service-url');
const modalCancel = document.getElementById('modal-cancel');
const modalSubmit = document.getElementById('modal-submit');

let currentServices = []; // last list received from main, in display order
let draggedId = null;

// ── Render service buttons whenever main process pushes a new list ─────
window.relay.onServices((services, activeId) => {
  currentServices = services;

  sidebar.querySelectorAll('.service-btn').forEach((el) => el.remove());

  services.forEach((service) => {
    const btn = document.createElement('div');
    btn.className = 'service-btn' + (service.id === activeId ? ' active' : '');
    btn.title = service.name;
    btn.draggable = true;

    renderIcon(btn, service);

    btn.addEventListener('click', () => {
      sidebar.querySelectorAll('.service-btn.active').forEach((el) => el.classList.remove('active'));
      btn.classList.add('active');
      window.relay.switchService(service.id);
    });

    // Right-click to remove — no separate edit mode needed for a single action.
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (confirm(`Remove ${service.name}? (Its login session is kept in case you re-add it.)`)) {
        window.relay.removeService(service.id);
      }
    });

    attachDragHandlers(btn, service);

    sidebar.insertBefore(btn, addBtn);
  });
});

// ── Icon rendering: real favicon when we have one, letter as fallback ──
function renderIcon(btn, service) {
  btn.innerHTML = '';

  if (service.favicon) {
    const img = document.createElement('img');
    img.src = service.favicon;
    img.alt = '';
    img.className = 'service-icon-img';
    img.draggable = false; // let the parent .service-btn own drag, not the image itself
    img.onerror = () => {
      // Site's favicon URL stopped resolving — fall back to the letter icon
      // rather than showing a broken image.
      btn.textContent = service.icon;
    };
    btn.appendChild(img);
  } else {
    btn.textContent = service.icon;
  }
}

// ── Drag-to-reorder ─────────────────────────────────────────────────
function attachDragHandlers(btn, service) {
  btn.addEventListener('dragstart', (e) => {
    draggedId = service.id;
    e.dataTransfer.effectAllowed = 'move';
    btn.classList.add('dragging');
  });

  btn.addEventListener('dragend', () => {
    btn.classList.remove('dragging');
    draggedId = null;
    sidebar.querySelectorAll('.service-btn').forEach((el) => el.classList.remove('drag-over'));
  });

  btn.addEventListener('dragover', (e) => {
    e.preventDefault(); // required to allow a drop
    if (draggedId && draggedId !== service.id) btn.classList.add('drag-over');
  });

  btn.addEventListener('dragleave', () => btn.classList.remove('drag-over'));

  btn.addEventListener('drop', (e) => {
    e.preventDefault();
    btn.classList.remove('drag-over');
    if (!draggedId || draggedId === service.id) return;

    const ids = currentServices.map((s) => s.id);
    const fromIdx = ids.indexOf(draggedId);
    const toIdx = ids.indexOf(service.id);
    if (fromIdx === -1 || toIdx === -1) return;

    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, draggedId);
    window.relay.reorderServices(ids); // main persists this and re-broadcasts
  });
}

// ── Add-service modal ───────────────────────────────────────────────
function openModal() {
  nameInput.value = '';
  urlInput.value = '';
  modal.classList.add('open');
  window.relay.setModalOpen(true); // tells main to detach the active webview
  nameInput.focus();
}

function closeModal() {
  modal.classList.remove('open');
  window.relay.setModalOpen(false); // main reattaches whichever service is active
}

async function submitModal() {
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  if (!name || !url) return;
  await window.relay.addService({ name, url });
  closeModal();
}

addBtn.addEventListener('click', openModal);
modalCancel.addEventListener('click', closeModal);
modalSubmit.addEventListener('click', submitModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal(); // click on the dim backdrop
});

[nameInput, urlInput].forEach((el) => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitModal();
    if (e.key === 'Escape') closeModal();
  });
});
