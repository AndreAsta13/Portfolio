function togglePw(id, btn) {
      const input = document.getElementById(id);
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.innerHTML = isText
        ? `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    }

    function checkStrength(val) {
      const wrap = document.getElementById('strength-wrap');
      wrap.classList.toggle('show', val.length > 0);
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      const colors = ['#e05050','#e07a20','#e8c430','#4caf70'];
      const labels = ['Muito fraca','Fraca','Boa','Forte'];
      for (let i = 1; i <= 4; i++) {
        document.getElementById('sb'+i).style.background = i <= score ? colors[score-1] : 'var(--divider)';
      }
      const lbl = document.getElementById('strength-label');
      lbl.textContent = score > 0 ? labels[score-1] : '';
      lbl.style.color = score > 0 ? colors[score-1] : 'var(--muted)';
    }

    function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-senha').value;
      if (!email || !senha) { shake('formLogin'); return; }
      const msg = document.getElementById('login-success');
      msg.classList.add('show');
      setTimeout(() => msg.classList.remove('show'), 3000);
    }

    function handleRegister(e) {
      e.preventDefault();
      const nome = document.getElementById('reg-nome').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const senha = document.getElementById('reg-senha').value;
      const confirm = document.getElementById('reg-confirm').value;
      if (!nome || !email || !senha || senha !== confirm) { shake('formRegister'); return; }
      const msg = document.getElementById('register-success');
      msg.classList.add('show');
      setTimeout(() => msg.classList.remove('show'), 3000);
    }

    function shake(id) {
      const el = document.getElementById(id);
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = 'shake 0.4s ease';
    }