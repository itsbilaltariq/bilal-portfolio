/* ==========================================
   Muhammad Bilal Tariq - Portfolio JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTyping();
  initCanvas();
  
  // Load dynamic projects, then init the rest of components requiring DOM elements
  initProjects().then(() => {
    initTerminal();
    initScrollAnimations();
    init3DTilt();
  });
});

/* ==========================================
   1. Navbar & Navigation Functionality
   ========================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksList = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add shadow and shrink header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy: Update active link
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (menuToggle && navLinksList) {
    menuToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('active');
      menuToggle.classList.toggle('open');
      // Toggle menu indicator states
      const spans = menuToggle.querySelectorAll('span');
      if (menuToggle.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('active');
        menuToggle.classList.remove('open');
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(s => s.style.transform = 'none');
        spans[1].style.opacity = '1';
      });
    });
  }
}

/* ==========================================
   2. Typing Effect (Hero Section)
   ========================================== */
function initTyping() {
  const typedTextSpan = document.getElementById('typed-text');
  if (!typedTextSpan) return;

  const roles = [
    "Full-Stack Web Developer",
    "NUST Computer Science Student",
    "Machine Learning Explorer",
    "Systems & Database Designer",
    "Cybersecurity Enthusiast"
  ];
  
  const typingSpeed = 100;
  const erasingSpeed = 50;
  const newRoleDelay = 2000; // Delay between roles
  let roleIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < roles[roleIndex].length) {
      typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newRoleDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, typingSpeed + 500);
    }
  }

  // Start the typing animation
  setTimeout(type, 1000);
}

/* ==========================================
   3. Canvas Particles System
   ========================================== */
function initCanvas() {
  const canvas = document.getElementById('canvas-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particlesArray = [];
  const numberOfParticles = 80;
  const connectionDistance = 110;

  // Track mouse coordinates
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle window resizing
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  // Define particle structure
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Check collision with screen boundaries
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Check mouse interaction (repel particles slightly)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 2;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 2;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 2;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 2;
          }
        }
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  // Populate particles
  function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray = [];
    
    // Gradient accent colors to match the theme
    const colors = [
      'rgba(99, 102, 241, 0.25)',  // electric indigo
      'rgba(6, 182, 212, 0.25)',   // neon cyan
      'rgba(168, 85, 247, 0.2)'    // cosmic violet
    ];

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * (window.innerWidth - size * 2) + size * 2);
      let y = (Math.random() * (window.innerHeight - size * 2) + size * 2);
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      let color = colors[Math.floor(Math.random() * colors.length)];

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Draw connecting lines between close particles
  function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          // Fade opacity out as distance increases
          let opacityValue = 1 - (distance / connectionDistance);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.08})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
}

/* ==========================================
   3.5. Dynamic Projects Loading
   ========================================== */
let projectsData = [];

async function initProjects() {
  try {
    const response = await fetch('projects.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch projects.json: ${response.statusText}`);
    }
    projectsData = await response.json();
    renderProjects(projectsData);
  } catch (error) {
    console.error('Error loading projects:', error);
    const grid = document.querySelector('.projects-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="error-loading" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #ff4d4d;">
          <p>Failed to load projects. Please try refreshing the page.</p>
        </div>
      `;
    }
  }
}

function renderProjects(projects) {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  projects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'project-card glass-card';
    
    let linksHtml = '';
    if (proj.githubUrl) {
      linksHtml += `
        <a href="${proj.githubUrl}" target="_blank" class="project-link" title="View GitHub Code">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
      `;
    }
    if (proj.liveUrl) {
      linksHtml += `
        <a href="${proj.liveUrl}" target="_blank" class="project-link" title="Live Preview">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      `;
    }
    
    const tagsHtml = proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    const featuresHtml = proj.features.map(feat => `<li>${feat}</li>`).join('');
    
    card.innerHTML = `
      <div class="project-glow"></div>
      <div class="project-meta">
        <span class="project-year">${proj.year || ''}</span>
        <div class="project-links">
          ${linksHtml}
        </div>
      </div>
      
      <h3 class="project-title">${proj.title}</h3>
      <p class="project-desc">${proj.desc}</p>
      
      <div class="project-tags">
        ${tagsHtml}
      </div>
      
      <button class="project-details-btn" onclick="toggleDetails(this)">
        <span>Explore Features</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      
      <div class="project-details-panel">
        <ul>
          ${featuresHtml}
        </ul>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

/* ==========================================
   4. Terminal Emulator Functionality
   ========================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  const terminalHistory = document.getElementById('terminal-history');

  if (!terminalInput || !terminalBody) return;

  // Focus input on terminal card click
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });

  // Handle Command Submit
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim();
      terminalInput.value = '';
      if (command) {
        processCommand(command);
      }
    }
  });

  // Pre-load welcoming instructions in console log
  console.log("Terminal ready. Type 'help' for options.");
}

// Commands Directory Data
const terminalCommands = {
  help: `Available Commands:
  ------------------------------------
  about       - Get profile overview & education
  skills      - Show details on tech stacks (with visual levels)
  projects    - Summary details & repos of my projects
  contact     - Display direct contact channels and location
  clear       - Wipe output history
  help        - Display this menu`,

  about: `PROFILE OVERVIEW:
  ------------------------------------
  Computer Science student at National University of Sciences & Technology (NUST), Islamabad.
  Focused on full-stack engineering, secure APIs, databases, and ML training pipelines.
  
  EDUCATION:
  ------------------------------------
  BS Computer Science (2024 - Present)
  National University of Sciences & Technology (NUST), H-12, Islamabad
  * Coursework: Data Structures, Algorithms, OOP, Database Systems, Operating Systems.
  * Extracurriculars: Collaborating on departmental systems and secure tools.`,

  skills: `TECHNICAL EXPERTISE LEVELS:
  ------------------------------------
  Languages      [██████████████░░░] 82%
                 Python, C++, Java, JavaScript (ES6)
  
  Web/Frameworks [████████████░░░░░] 75%
                 HTML5, CSS3, React, Express, Node.js
  
  Databases      [█████████████░░░░] 80%
                 MySQL, MongoDB, JDBC, Normalized Schemas
  
  AI/ML & Core   [████████████░░░░░] 75%
                 PyTorch, TensorFlow, scikit-learn, DSA, OOP`,

  projects: () => {
    let projectsStr = "FEATURED PROJECTS SUMMARY:\n  ------------------------------------\n";
    projectsData.forEach((proj, idx) => {
      const tagsStr = proj.tags.slice(0, 4).join(', ');
      projectsStr += `  ${idx + 1}. ${proj.title} (${tagsStr})\n`;
      if (proj.features && proj.features.length > 0) {
        proj.features.slice(0, 2).forEach(feat => {
          projectsStr += `     * ${feat}\n`;
        });
      } else {
        projectsStr += `     * ${proj.desc}\n`;
      }
      projectsStr += "\n";
    });
    projectsStr += "  * Use 'contact' to get links to my repositories.";
    return projectsStr;
  },

  contact: `CONNECT PATHWAYS:
  ------------------------------------
  Email    : iambilaltariq2005@gmail.com
  GitHub   : https://github.com/itsbilaltariq
  LinkedIn : https://linkedin.com/in/bilaltariq
  Location : Islamabad, Pakistan`
};

function processCommand(cmd) {
  const terminalHistory = document.getElementById('terminal-history');
  const terminalBody = document.getElementById('terminal-body');
  if (!terminalHistory || !terminalBody) return;

  // Append user command line
  const cmdLine = document.createElement('div');
  cmdLine.className = 'terminal-line input-cmd';
  cmdLine.textContent = ` ${cmd}`;
  terminalHistory.appendChild(cmdLine);

  const cleanCmd = cmd.toLowerCase().trim();

  // Create response container
  const responseLine = document.createElement('div');
  responseLine.className = 'terminal-line output';

  if (cleanCmd === 'clear') {
    terminalHistory.innerHTML = '';
    return;
  }

  if (terminalCommands.hasOwnProperty(cleanCmd)) {
    responseLine.className += ' info';
    const outputText = typeof terminalCommands[cleanCmd] === 'function'
      ? terminalCommands[cleanCmd]()
      : terminalCommands[cleanCmd];
    responseLine.innerHTML = outputText.replace(/\n/g, '<br>');
  } else {
    responseLine.className += ' error';
    responseLine.innerHTML = `command not found: "${cmd}". Type 'help' for suggestions.`;
  }

  terminalHistory.appendChild(responseLine);

  // Auto scroll to bottom
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Trigger shortcut commands from preset buttons
function executeShortcut(command) {
  const terminalInput = document.getElementById('terminal-input');
  if (!terminalInput) return;
  terminalInput.value = command;
  processCommand(command);
  terminalInput.value = '';
  terminalInput.focus();
}

/* ==========================================
   5. Projects Grid - Toggle Details Panels
   ========================================== */
function toggleDetails(button) {
  const card = button.closest('.project-card');
  const panel = card.querySelector('.project-details-panel');
  
  // Close other open project detail panels
  document.querySelectorAll('.project-details-panel').forEach(otherPanel => {
    if (otherPanel !== panel && otherPanel.classList.contains('expanded')) {
      otherPanel.classList.remove('expanded');
      const otherBtn = otherPanel.closest('.project-card').querySelector('.project-details-btn');
      otherBtn.classList.remove('active');
      otherBtn.querySelector('span').textContent = 'Explore Features';
    }
  });

  // Toggle active state
  panel.classList.toggle('expanded');
  button.classList.toggle('active');

  const btnText = button.querySelector('span');
  if (panel.classList.contains('expanded')) {
    btnText.textContent = 'Collapse Features';
  } else {
    btnText.textContent = 'Explore Features';
  }
}

/* ==========================================
   6. Scroll-Triggered Fade-In Animations
   ========================================== */
function initScrollAnimations() {
  const fadeSections = document.querySelectorAll('.fade-in-section');
  if (fadeSections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  fadeSections.forEach(section => {
    observer.observe(section);
  });
}

/* ==========================================
   7. Form Submission Mockup
   ========================================== */
function handleContactSubmit(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  
  // Disable button and show sending status
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  submitBtn.innerHTML = 'Sending Secure Message...';

  const name = document.getElementById('form-name').value;
  const email = document.getElementById('form-email').value;
  const subject = document.getElementById('form-subject').value;
  const message = document.getElementById('form-message').value;

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: '2f2fb2e4-dc5c-412f-9085-baba0be983fb',
      name: name,
      email: email,
      subject: subject,
      message: message,
      from_name: `${name} (via Portfolio)`
    })
  })
  .then(async (response) => {
    const data = await response.json();
    if (data.success) {
      alert(`Thank you, ${name}! Your secure message has been sent directly to Bilal's Gmail in real life.`);
      event.target.reset();
    } else {
      alert(`Error: ${data.message || 'Could not send message. Please try again.'}`);
    }
  })
  .catch((error) => {
    console.error('Contact Form Error:', error);
    alert('Network error occurred. Please verify your connection and try again.');
  })
  .finally(() => {
    // Re-enable button and restore state
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.innerHTML = originalBtnText;
  });
}

/* ==========================================
   8. 3D Tilt Effect on Cards & Terminal
   ========================================== */
function init3DTilt() {
  // Select all glass cards and the interactive terminal card
  const elements = document.querySelectorAll('.glass-card, .terminal-card');

  elements.forEach(el => {
    // Mouse move: Calculate cursor relative coordinates and apply perspective rotate
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // cursor x relative to card
      const y = e.clientY - rect.top;  // cursor y relative to card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Tilt intensity (max degrees of rotation)
      const maxTilt = 8;
      const rotateX = ((centerY - y) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Apply 3D perspective and rotate transform dynamically
      el.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    // Mouse enter: Disable transitions to make live tracking responsive
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
      
      // Select elements inside for parallax translate depth
      const titles = el.querySelectorAll('.project-title, .skills-category-title, .interest-header');
      const texts = el.querySelectorAll('.project-desc, .skill-badge, .interest-desc, .project-tags');
      
      titles.forEach(t => {
        t.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        t.style.transform = 'translateZ(25px)';
      });
      texts.forEach(tx => {
        tx.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        tx.style.transform = 'translateZ(15px)';
      });
    });

    // Mouse leave: Restore transitions and animate smoothly back to identity matrix
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      
      // Reset parallax depths
      const parallaxChildren = el.querySelectorAll('.project-title, .skills-category-title, .interest-header, .project-desc, .skill-badge, .interest-desc, .project-tags');
      parallaxChildren.forEach(c => {
        c.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        c.style.transform = 'translateZ(0px)';
      });
    });
  });
}

