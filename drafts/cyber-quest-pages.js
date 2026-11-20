const byId = (id) => document.getElementById(id);

const pages = [...document.querySelectorAll('.page')];
const pageNames = {
  mission: 'Cyber Quiz briefing',
  game: 'Cyber Quiz',
  network: 'Network Builder briefing',
  builder: 'Network canvas',
  cable: 'Cable challenge',
  feedback: 'Feedback',
};

function showPage(moveFocus = false) {
  const route = window.location.hash.slice(1);
  const active = pages.find((page) => page.dataset.page === route) ?? pages[0];

  for (const page of pages) page.hidden = page !== active;
  for (const link of document.querySelectorAll('.review nav a')) {
    if (link.getAttribute('href') === '#' + active.dataset.page) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  for (const link of document.querySelectorAll('.site-nav a')) {
    link.toggleAttribute('data-active', link.dataset.area === active.dataset.section);
  }

  document.title = pageNames[active.dataset.page] + ' — Cyber Quest draft';
  window.scrollTo(0, 0);
  if (moveFocus) active.querySelector('h1').focus({ preventScroll: true });
}

document.querySelector('.skip').addEventListener('click', (event) => {
  event.preventDefault();
  byId('content').focus();
});
window.addEventListener('hashchange', () => showPage(true));
showPage();

const dialog = byId('preview-dialog');

function showDialog(title, message, next) {
  byId('dialog-title').textContent = title;
  byId('dialog-message').textContent = message;
  const link = byId('dialog-link');
  link.hidden = !next;
  byId('dialog-dismiss').hidden = Boolean(next);
  if (next) {
    link.textContent = next.label;
    link.href = next.href;
  }
  dialog.showModal();
}

byId('dialog-link').addEventListener('click', () => dialog.close());

function showStatus(id, message, error = false) {
  const status = byId(id);
  status.textContent = message;
  status.toggleAttribute('data-error', error);
}

const questions = [
  {
    prompt: 'What extra step can protect your account if someone learns your password?',
    accepts: ['mfa', '2fa', 'multi factor authentication', 'multifactor authentication', 'two factor authentication', 'two step verification'],
    hint: 'Think of a second sign-in check, such as a code from an authenticator app.',
  },
  {
    prompt: 'What kind of password should you use for each account?',
    accepts: ['unique', 'a unique password', 'unique password', 'different', 'a different password', 'different password', 'strong and unique', 'strong unique password'],
    hint: 'If one service is breached, you want the leaked password to work on that account alone.',
  },
  {
    prompt: 'What is a scam message that tries to trick you into sharing sensitive information called?',
    accepts: ['phishing', 'a phishing message', 'phishing message', 'phishing attack'],
    hint: 'It sounds like someone trying to catch a fish with bait.',
  },
  {
    prompt: 'What should you install regularly to fix known security problems in your apps?',
    accepts: ['updates', 'software updates', 'security updates', 'patches', 'security patches'],
    hint: 'Your device may offer these automatically when new fixes are ready.',
  },
];
const quizForm = byId('quiz-form');
const answer = byId('answer');
const path = [...byId('quiz-path').children];
let solved = 0;

quizForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const normalized = answer.value.toLowerCase().replaceAll('-', ' ').trim().replace(/\s+/g, ' ');
  if (!questions[solved].accepts.includes(normalized)) {
    showStatus('quiz-status', 'Try again or open the hint for a clue.', true);
    answer.focus();
    return;
  }

  solved += 1;
  byId('quiz-count').textContent = solved + ' of ' + questions.length + ' solved';
  byId('quiz-progress').value = solved;
  path.forEach((step, index) => {
    step.toggleAttribute('data-solved', index < solved);
    if (index === solved) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
    step.querySelector('small').textContent = index < solved ? 'Solved' : index === solved ? 'In progress' : 'Locked';
  });

  if (solved === questions.length) {
    byId('question-number').textContent = 'Quiz complete';
    byId('question-text').textContent = 'Challenge unlocked.';
    quizForm.hidden = true;
    byId('quiz-complete').hidden = false;
    byId('finish-quiz').focus();
    return;
  }

  byId('question-number').textContent = 'Question ' + (solved + 1) + ' of ' + questions.length;
  byId('question-text').textContent = questions[solved].prompt;
  showStatus('quiz-status', 'Correct! The next question is unlocked.');
  answer.value = '';
  answer.focus();
});

byId('quiz-hint').addEventListener('click', () => showDialog('Question ' + (solved + 1) + ' hint', questions[solved].hint));
byId('finish-quiz').addEventListener('click', () => {
  showDialog('Quiz complete', 'You’ve unlocked the next mission.', { label: 'Explore Network Builder', href: '#network' });
});

const deviceLayout = {
  Internet: { icon: 'internet', x: .28, y: .28 },
  Router: { icon: 'router', x: .72, y: .28 },
  Switch: { icon: 'switch', x: .72, y: .72 },
  PC: { icon: 'pc', x: .28, y: .72 },
};
const deviceButtons = [...document.querySelectorAll('[data-device]')];
const canvas = byId('network-canvas');
const nodeLayer = byId('network-nodes');
const lineLayer = byId('network-lines');
const cableTool = byId('cable-tool');
const nodeButtons = {};
let devices;
let connections;
let cableMode;
let endpoint;

for (const [name, device] of Object.entries(deviceLayout)) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'node';
  button.style.left = device.x * 100 + '%';
  button.style.top = device.y * 100 + '%';
  const icon = document.createElement('span');
  icon.className = 'device-icon ' + device.icon;
  icon.setAttribute('aria-hidden', 'true');
  button.append(icon, name);
  button.addEventListener('click', () => useDevice(name));
  nodeLayer.append(button);
  nodeButtons[name] = button;
}

function drawConnections() {
  const { clientWidth: width, clientHeight: height } = canvas;
  lineLayer.replaceChildren();

  for (const [from, to] of connections) {
    const start = deviceLayout[from];
    const end = deviceLayout[to];
    const dx = (end.x - start.x) * width;
    const dy = (end.y - start.y) * height;
    const line = document.createElement('span');
    line.className = 'connection';
    line.style.left = start.x * 100 + '%';
    line.style.top = start.y * 100 + '%';
    line.style.width = Math.hypot(dx, dy) + 'px';
    line.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';
    lineLayer.append(line);
  }
}

function updateBuilder() {
  for (const button of deviceButtons) button.disabled = devices.has(button.dataset.device);
  for (const [name, button] of Object.entries(nodeButtons)) {
    button.hidden = !devices.has(name);
    button.setAttribute('aria-pressed', String(endpoint === name));
  }

  cableTool.setAttribute('aria-pressed', String(cableMode));
  byId('node-count').textContent = devices.size + ' devices · ' + connections.length + ' connections';
  drawConnections();
}

function resetBuilder() {
  devices = new Set(['Internet', 'Router', 'Switch']);
  connections = [['Internet', 'Router'], ['Router', 'Switch']];
  cableMode = false;
  endpoint = null;
  updateBuilder();
  showStatus('builder-status', 'Choose a device to add it to the canvas.');
}

function useDevice(name) {
  if (!cableMode) {
    showStatus('builder-status', 'Turn on the cable tool to connect devices.');
  } else if (!endpoint) {
    endpoint = name;
    showStatus('builder-status', name + ' selected. Choose another device.');
  } else if (endpoint === name) {
    endpoint = null;
    showStatus('builder-status', 'Connection cancelled. Select a device to start again.');
  } else {
    const exists = connections.some((pair) => pair.includes(endpoint) && pair.includes(name));
    if (exists) {
      showStatus('builder-status', 'Those devices are already connected.');
    } else {
      connections.push([endpoint, name]);
      showStatus('builder-status', endpoint + ' connected to ' + name + '.');
    }
    endpoint = null;
  }
  updateBuilder();
}

resetBuilder();
new ResizeObserver(drawConnections).observe(canvas);

for (const button of deviceButtons) {
  button.addEventListener('click', () => {
    const name = button.dataset.device;
    devices.add(name);
    updateBuilder();
    cableTool.focus();
    showStatus('builder-status', name + ' added. Use the cable tool to connect it.');
  });
}

cableTool.addEventListener('click', () => {
  cableMode = !cableMode;
  endpoint = null;
  updateBuilder();
  showStatus('builder-status', cableMode ? 'Cable tool on. Select two devices to connect them.' : 'Cable tool off.');
});

byId('builder-hint').addEventListener('click', () => {
  showDialog('Network hint', 'Use the cable tool to connect the PC to the switch. Select the two devices in either order.');
});
byId('reset-builder').addEventListener('click', resetBuilder);
byId('validate-builder').addEventListener('click', () => {
  const pcConnected = connections.some((pair) => pair.includes('PC') && pair.includes('Switch'));
  if (pcConnected && connections.length === 3) {
    showDialog('Network complete', 'You connected the PC to the switch.', { label: 'Try the cable challenge', href: '#cable' });
  } else {
    const message = connections.length > 3 ? 'Reset the board and connect the PC only to the switch.' : 'Add a PC and connect it to the switch first.';
    showStatus('builder-status', message, true);
  }
});

const wires = {
  wo: { name: 'White/orange', color: '#ed8b39', striped: true },
  o: { name: 'Orange', color: '#ed8b39' },
  wg: { name: 'White/green', color: '#56a15d', striped: true },
  g: { name: 'Green', color: '#56a15d' },
  wb: { name: 'White/blue', color: '#6a9fde', striped: true },
  b: { name: 'Blue', color: '#6a9fde' },
  wbr: { name: 'White/brown', color: '#ab7954', striped: true },
  br: { name: 'Brown', color: '#ab7954' },
};
const cableOrder = ['wo', 'o', 'wg', 'b', 'wb', 'g', 'wbr', 'br'];
const slots = Array(8).fill(null);
const wireButtons = {};
let selectedWire = null;

function paintWire(element, wireId) {
  const wire = wires[wireId];
  element.classList.toggle('wire-color', Boolean(wire));
  element.classList.toggle('striped', Boolean(wire?.striped));
  element.style.setProperty('--wire', wire?.color ?? '');
}

const slotButtons = slots.map((_, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'slot';
  button.innerHTML = '<span class="slot-pin" aria-hidden="true"></span><span class="slot-wire" aria-hidden="true"></span>';
  button.append(String(index + 1));
  button.addEventListener('click', () => useSlot(index));
  byId('connector').append(button);
  return button;
});

for (const [id, wire] of Object.entries(wires)) {
  const button = document.createElement('button');
  button.type = 'button';
  const swatch = document.createElement('span');
  swatch.className = 'wire-swatch';
  swatch.setAttribute('aria-hidden', 'true');
  paintWire(swatch, id);
  button.append(swatch, wire.name);
  button.addEventListener('click', () => {
    selectedWire = selectedWire === id ? null : id;
    renderWires();
    showStatus('cable-status', selectedWire ? wire.name + ' selected. Choose a slot.' : 'Choose a wire to place.');
  });
  byId('wire-tray').append(button);
  wireButtons[id] = button;
}

function renderWires() {
  for (const [id, button] of Object.entries(wireButtons)) {
    button.disabled = slots.includes(id);
    button.setAttribute('aria-pressed', String(id === selectedWire));
  }
  slotButtons.forEach((button, index) => {
    const id = slots[index];
    paintWire(button.querySelector('.slot-wire'), id);
    button.setAttribute('aria-label', 'Slot ' + (index + 1) + ', ' + (id ? wires[id].name : 'empty'));
  });
  byId('wire-count').textContent = slots.filter(Boolean).length + ' of 8 placed';
}

function useSlot(index) {
  const previous = slots[index];
  if (selectedWire) {
    slots[index] = selectedWire;
    showStatus('cable-status', wires[selectedWire].name + ' placed in slot ' + (index + 1) + '.');
    selectedWire = null;
  } else if (previous) {
    slots[index] = null;
    showStatus('cable-status', wires[previous].name + ' returned to the tray.');
  } else {
    showStatus('cable-status', 'Select a wire from the tray first.');
  }
  renderWires();
}

renderWires();
byId('reset-wires').addEventListener('click', () => {
  slots.fill(null);
  selectedWire = null;
  renderWires();
  showStatus('cable-status', 'All wires returned to the tray.');
});
byId('validate-wires').addEventListener('click', () => {
  if (slots.includes(null)) {
    showStatus('cable-status', 'Place all eight wires before checking the cable.', true);
  } else if (slots.some((id, index) => id !== cableOrder[index])) {
    showStatus('cable-status', 'The order needs a second look. Try a hint for one pair at a time.', true);
  } else {
    showDialog('Cable challenge complete', 'All eight wires are in the right order.', { label: 'Leave feedback', href: '#feedback' });
  }
});

for (const button of document.querySelectorAll('[data-wire-hint]')) {
  button.addEventListener('click', () => {
    const i = Number(button.dataset.wireHint);
    const first = wires[cableOrder[i]].name;
    const second = wires[cableOrder[i + 1]].name;
    showDialog('Slots ' + (i + 1) + ' and ' + (i + 2), 'Place ' + first.toLowerCase() + ' first, followed by ' + second.toLowerCase() + '.');
  });
}

byId('feedback-form').addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  event.currentTarget.hidden = true;
  byId('feedback-done').hidden = false;
  byId('feedback-done').querySelector('h2').focus();
});
