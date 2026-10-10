
// --- 1. Sci-Fi Web Audio Synthesizer ---
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('gkd_audio_enabled') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('gkd_audio_enabled', this.enabled);
    if (this.enabled) {
      this.init();
      this.playTone(880, 'sine', 0.12, 0.08);
    }
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!this.enabled) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  hover() {
    this.playTone(420, 'sine', 0.04, 0.02);
  }

  click() {
    this.playTone(840, 'triangle', 0.06, 0.05);
  }

  success() {
    if (!this.enabled) return;
    this.playTone(660, 'sine', 0.08, 0.05);
    setTimeout(() => this.playTone(990, 'sine', 0.12, 0.05), 90);
  }

  error() {
    if (!this.enabled) return;
    this.playTone(220, 'sawtooth', 0.15, 0.06);
  }
}

const audio = new CyberAudio();

// --- 2. Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Canvas
  const cyberCanvas = new CyberCanvas('bg-canvas');

  // DOM Elements
  const audioBtn = document.getElementById('audio-toggle');
  const terminalModal = document.getElementById('terminal-modal');
  const terminalBtn = document.getElementById('terminal-btn');
  const terminalClose = document.getElementById('terminal-close');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const projectModal = document.getElementById('project-modal');
  const projectModalClose = document.getElementById('project-modal-close');
  const toast = document.getElementById('toast');

  // Setup Audio Button State
  const updateAudioBtnUI = () => {
    if (!audioBtn) return;
    if (audio.enabled) {
      audioBtn.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span><span class="text-cyan-400">AUDIO: ON</span>`;
      audioBtn.classList.add('border-cyan-400');
    } else {
      audioBtn.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-500"></span><span class="text-slate-400">AUDIO: MUTED</span>`;
      audioBtn.classList.remove('border-cyan-400');
    }
  };
  updateAudioBtnUI();

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audio.toggle();
      updateAudioBtnUI();
      showToast(audio.enabled ? "Audio Synthesizer Activated" : "Audio Synthesizer Muted");
    });
  }

  // Global Interactive Audio triggers
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => audio.hover());
    el.addEventListener('click', () => audio.click());
  });

  // Typing Effect in Hero
  const typeText = (element, text, speed = 40) => {
    if (!element) return;
    let i = 0;
    element.innerHTML = '';
    const timer = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  };
  typeText(document.getElementById('hero-title'), PORTFOLIO_DATA.personal.name, 45);

  // Render Skills Matrix
  const renderSkills = () => {
    const container = document.getElementById('skills-container');
    if (!container) return;
    container.innerHTML = '';

    Object.values(PORTFOLIO_DATA.skills).forEach(cat => {
      const card = document.createElement('div');
      card.className = 'cyber-card p-6 rounded-lg tech-grid-bg';
      
      let itemsHtml = cat.items.map(item => `
        <div class="mb-4">
          <div class="flex justify-between items-center text-xs font-mono mb-1">
            <span class="text-slate-200 font-medium">${item.name}</span>
            <span class="text-cyan-400">${item.level}%</span>
          </div>
          <div class="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div class="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-1000" style="width: ${item.level}%"></div>
          </div>
        </div>
      `).join('');

      card.innerHTML = `
        <div class="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
          <div class="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs">
            &gt;_
          </div>
          <div>
            <h3 class="text-base font-semibold text-slate-100 tracking-wide">${cat.category}</h3>
            <p class="text-xs text-slate-400">${cat.description}</p>
          </div>
        </div>
        <div>${itemsHtml}</div>
      `;
      container.appendChild(card);
    });
  };
  renderSkills();

  // Render Projects Grid
  const renderProjects = (filter = 'all') => {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';

    const list = filter === 'all' 
      ? PORTFOLIO_DATA.projects 
      : PORTFOLIO_DATA.projects.filter(p => p.category === filter);

    list.forEach(project => {
      const isFlagship = project.id === 'student-performance-analyzer';
      const card = document.createElement('div');
      card.className = `cyber-card rounded-xl p-6 flex flex-col justify-between ${isFlagship ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-cyan-500/30' : ''}`;
      
      const tagsHtml = project.tags.map(t => 
        `<span class="px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 text-cyan-300 border border-cyan-900/50">${t}</span>`
      ).join('');

      card.innerHTML = `
        <div>
          <div class="flex justify-between items-start mb-3">
            <span class="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase font-semibold rounded ${isFlagship ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50' : 'bg-slate-800 text-slate-400'}">
              ${project.badge}
            </span>
            <span class="text-xs font-mono text-slate-500">ID: #${project.id.slice(0, 7)}</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
            ${project.title}
          </h3>
          <p class="text-sm text-slate-300 mb-4 leading-relaxed">${project.summary}</p>
          <div class="flex flex-wrap gap-2 mb-6">${tagsHtml}</div>
        </div>

        <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button class="cyber-btn-primary px-4 py-2 rounded text-xs inspect-btn flex items-center gap-2" data-id="${project.id}">
            <span>INSPECT ARCHITECTURE</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
          <a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="cyber-btn-secondary px-3 py-2 rounded text-xs flex items-center gap-1.5 hover:text-cyan-400">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>CODE</span>
          </a>
        </div>
      `;
      container.appendChild(card);
    });

    // Attach inspect click handlers
    document.querySelectorAll('.inspect-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openProjectModal(id);
      });
    });
  };
  renderProjects();

  // Filter Buttons
  document.querySelectorAll('.project-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.project-filter-btn').forEach(b => {
        b.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-400');
        b.classList.add('text-slate-400');
      });
      e.currentTarget.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-400');
      e.currentTarget.classList.remove('text-slate-400');
      renderProjects(e.currentTarget.getAttribute('data-filter'));
    });
  });

  // Project Modal Logic
  const openProjectModal = (projectId) => {
    const project = PORTFOLIO_DATA.projects.find(p => p.id === projectId);
    if (!project) return;
    audio.playTone(650, 'sine', 0.1);

    document.getElementById('pm-title').innerText = project.title;
    document.getElementById('pm-badge').innerText = project.badge;
    document.getElementById('pm-tagline').innerText = project.tagline;
    document.getElementById('pm-summary').innerText = project.summary;
    
    // Features
    const featList = document.getElementById('pm-features');
    featList.innerHTML = project.features.map(f => `<li class="flex items-start gap-2"><span class="text-cyan-400 font-mono">▸</span><span>${f}</span></li>`).join('');

    // Architecture
    const archDiv = document.getElementById('pm-architecture');
    archDiv.innerHTML = Object.entries(project.architecture).map(([k, v]) => `
      <div class="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs">
        <span class="text-cyan-400 font-mono uppercase font-bold tracking-wider block mb-1">${k}</span>
        <span class="text-slate-300 font-mono">${v}</span>
      </div>
    `).join('');

    // Code Snippet
    const snippetEl = document.getElementById('pm-snippet');
    if (snippetEl) snippetEl.textContent = project.codeSnippet;

    document.getElementById('pm-github').href = project.links.github;

    projectModal.classList.remove('hidden');
    projectModal.classList.add('flex');
  };

  if (projectModalClose) {
    projectModalClose.addEventListener('click', () => {
      projectModal.classList.add('hidden');
      projectModal.classList.remove('flex');
    });
  }

  // Render Certificates Grid
  const renderCerts = () => {
    const container = document.getElementById('certs-container');
    if (!container) return;
    container.innerHTML = PORTFOLIO_DATA.certificates.map(cert => `
      <div class="cyber-card p-5 rounded-lg border-slate-800 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-2">
            <span class="text-[11px] font-mono text-cyan-400 uppercase">${cert.issuer}</span>
            <span class="text-xs font-mono text-slate-500">${cert.date}</span>
          </div>
          <h4 class="text-base font-bold text-slate-100 mb-2">${cert.title}</h4>
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${cert.skills.map(s => `<span class="px-2 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-400 rounded">${s}</span>`).join('')}
          </div>
        </div>
        <div class="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
          <span class="text-slate-500">ID: ${cert.credentialId}</span>
          <span class="text-emerald-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>VERIFIED
          </span>
        </div>
      </div>
    `).join('');
  };
  renderCerts();

  // Render Timeline
  const renderTimeline = () => {
    const container = document.getElementById('timeline-container');
    if (!container) return;
    container.innerHTML = PORTFOLIO_DATA.timeline.map((item, idx) => `
      <div class="relative pl-8 pb-8 ${idx === PORTFOLIO_DATA.timeline.length - 1 ? '' : 'border-l-2 border-cyan-500/20'}">
        <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
        </div>
        <div class="text-xs font-mono text-cyan-400 mb-1">${item.period}</div>
        <h4 class="text-lg font-bold text-slate-100">${item.title}</h4>
        <div class="text-xs font-mono text-slate-400 mb-2">${item.organization}</div>
        <p class="text-sm text-slate-300 leading-relaxed mb-2">${item.description}</p>
        <div class="inline-block px-2.5 py-0.5 text-xs font-mono bg-purple-950/40 border border-purple-500/30 text-purple-300 rounded">
          ${item.highlight}
        </div>
      </div>
    `).join('');
  };
  renderTimeline();

  // --- 3. Interactive HUD Terminal Emulator ---
  const toggleTerminal = () => {
    if (!terminalModal) return;
    const isHidden = terminalModal.classList.contains('hidden');
    if (isHidden) {
      terminalModal.classList.remove('hidden');
      terminalModal.classList.add('flex');
      terminalInput.focus();
      audio.playTone(550, 'square', 0.08);
    } else {
      terminalModal.classList.add('hidden');
      terminalModal.classList.remove('flex');
    }
  };

  if (terminalBtn) terminalBtn.addEventListener('click', toggleTerminal);
  if (terminalClose) terminalClose.addEventListener('click', toggleTerminal);

  // Global Ctrl + K shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleTerminal();
    }
    if (e.key === 'Escape') {
      if (terminalModal && !terminalModal.classList.contains('hidden')) toggleTerminal();
      if (projectModal && !projectModal.classList.contains('hidden')) {
        projectModal.classList.add('hidden');
        projectModal.classList.remove('flex');
      }
    }
  });

  // Terminal Execution Engine
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        if (!cmd) return;

        // Print input echo
        const echo = document.createElement('div');
        echo.className = 'text-slate-400';
        echo.innerHTML = `<span class="text-cyan-400">govindhu@cyber-node:~$</span> ${cmd}`;
        terminalOutput.appendChild(echo);

        // Process Command
        if (cmd === 'clear') {
          terminalOutput.innerHTML = '';
          return;
        }

        if (cmd === 'matrix') {
          const isMatrix = cyberCanvas.toggleMatrixMode();
          printTerminalOutput(isMatrix ? "[+] MATRIX RAIN MODE ACTIVATED" : "[+] CONSTELLATION MODE RESTORED");
          audio.success();
          return;
        }

        const response = PORTFOLIO_DATA.terminalCommands[cmd];
        if (response) {
          printTerminalOutput(response);
          audio.success();
        } else {
          printTerminalOutput(`[ERROR] Unknown command: '${cmd}'. Type 'help' to view available system instructions.`);
          audio.error();
        }

        // Scroll terminal to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });
  }

  const printTerminalOutput = (text) => {
    const div = document.createElement('div');
    div.className = 'text-cyan-300 font-mono whitespace-pre-wrap leading-relaxed py-1';
    div.textContent = text;
    terminalOutput.appendChild(div);
  };

  // --- 4. Toast Notification Utility ---
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 2800);
  };

  // --- 5. Contact Form Handler ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>TRANSMITTING ENCRYPTED PACKET...</span>`;
      submitBtn.disabled = true;

      audio.playTone(700, 'sine', 0.2);

      setTimeout(() => {
        submitBtn.innerHTML = `<span>PACKET DELIVERED ✓</span>`;
        audio.success();
        showToast("Transmission successful! Packet logged.");
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2500);
      }, 1200);
    });
  }

  // Copy Email Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(PORTFOLIO_DATA.personal.email);
      audio.success();
      showToast(`Copied ${PORTFOLIO_DATA.personal.email} to clipboard!`);
    });
  }

  // Print Dossier (Resume) Button
  const printResumeBtn = document.getElementById('print-resume-btn');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      audio.click();
      window.print();
    });
  }
});