/* ================================================
   TABS / FORMULÁRIO
================================================ */
const tabConfig = {
  email:    { type: 'email', placeholder: 'seu@email.com' },
  telefone: { type: 'tel',   placeholder: '(11) 99999-9999' },
  link:     { type: 'url',   placeholder: 'https://seusite.com.br' }
};

function switchTab(btn, type) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const inp = document.getElementById('register-input');
  inp.type        = tabConfig[type].type;
  inp.placeholder = tabConfig[type].placeholder;
  inp.value       = '';
  document.getElementById('success-msg').style.display = 'none';
}

function handleSubmit() {
  const val = document.getElementById('register-input').value.trim();
  if (!val) { document.getElementById('register-input').focus(); return; }
  document.getElementById('register-input').value = '';
  document.getElementById('name-input').value     = '';
  const msg = document.getElementById('success-msg');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 4000);
}

/* ================================================
   SCROLL — Logo
================================================ */
const logo = document.querySelector('.nav-logo');
const nav  = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    logo.classList.add('scrolled');
    nav.classList.add('nav-scroll');
  } else {
    logo.classList.remove('scrolled');
    nav.classList.remove('nav-scroll');
  }
});

/* ════════════════════════════════════════════
   ASIDE — Acessibilidade
════════════════════════════════════════════ */
const FONT_MIN  = 12;
const FONT_MAX  = 24;
const FONT_STEP = 2;

let fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

document.querySelector('[title="Aumentar fonte"]').addEventListener('click', () => {
  if (fontSize >= FONT_MAX) return;
  fontSize += FONT_STEP;
  document.documentElement.style.fontSize = fontSize + 'px';
});

document.querySelector('[title="Diminuir fonte"]').addEventListener('click', () => {
  if (fontSize <= FONT_MIN) return;
  fontSize -= FONT_STEP;
  document.documentElement.style.fontSize = fontSize + 'px';
});

const btnContraste = document.querySelector('[title="Alto contraste"]');
btnContraste.addEventListener('click', () => {
  document.documentElement.classList.toggle('tema-claro');
  const ativo = document.documentElement.classList.contains('tema-claro');
  btnContraste.setAttribute('aria-pressed', ativo);
  btnContraste.title = ativo ? 'Tema escuro' : 'Alto contraste';
});

/* ════════════════════════════════════════════
   ASIDE — Toggle
════════════════════════════════════════════ */
const asideLeft   = document.querySelector('.aside-left');
const asideToggle = document.querySelector('.aside-toggle');

asideToggle.addEventListener('click', () => {
  const aberto = asideLeft.classList.toggle('aberto');
  asideToggle.textContent = aberto ? '✕' : '☰';
  asideToggle.title       = aberto ? 'Fechar painel' : 'Abrir painel';
  asideToggle.setAttribute('aria-expanded', aberto);
});

document.addEventListener('click', e => {
  if (!asideLeft.contains(e.target)) {
    asideLeft.classList.remove('aberto');
    asideToggle.textContent = '☰';
    asideToggle.setAttribute('aria-expanded', false);
  }
});

/* ════════════════════════════════════════════
   AVALIAÇÃO
════════════════════════════════════════════ */
const FORMSPREE_URL = 'https://formspree.io/f/xvzyyzvo';
const respostas = {};

document.querySelectorAll('.avaliacao-opcoes').forEach(grupo => {
  grupo.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const pergunta = grupo.dataset.pergunta;
      const valor    = parseInt(btn.dataset.valor);

      grupo.querySelectorAll('button').forEach(b => b.classList.remove('selecionado'));
      btn.classList.add('selecionado');
      respostas[pergunta] = valor;

      const feedback = document.querySelector('.avaliacao-feedback');
      feedback.hidden = !Object.values(respostas).some(v => v < 5);

      document.querySelector('.avaliacao-enviar').disabled = Object.keys(respostas).length < 5;
    });
  });
});

document.querySelector('.avaliacao-form').addEventListener('submit', async e => {
  e.preventDefault();

  const feedback   = document.querySelector('#feedbackTexto')?.value || '';
  const todasCinco = Object.values(respostas).every(v => v === 5);
  const obrigado   = document.querySelector('.avaliacao-obrigado');
  const enviar     = document.querySelector('.avaliacao-enviar');

  enviar.disabled    = true;
  enviar.textContent = 'Enviando...';

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json'
      },
      body: JSON.stringify({
        'Design Visual':           respostas['1'],
        'Clareza das Informações': respostas['2'],
        'Facilidade de Navegação': respostas['3'],
        'Qualidade dos Projetos':  respostas['4'],
        'Recomendaria':            respostas['5'],
        'Feedback':                feedback || '—'
      })
    });

    if (!res.ok) throw new Error('Falha no envio');

    document.querySelector('.avaliacao-form').hidden = true;
    obrigado.hidden = false;
    obrigado.querySelector('span').textContent = todasCinco
      ? '🎉 Obrigado pela avaliação perfeita!'
      : '🙏 Obrigado! Seu feedback foi registrado.';

  } catch (err) {
    enviar.disabled    = false;
    enviar.textContent = 'Enviar';
    alert('Erro ao enviar. Tente novamente.');
  }
});

/* ════════════════════════════════════════════
   FILTRO DALTONISMO
════════════════════════════════════════════ */
const mainBtn  = document.getElementById("pcd-main-btn");
const options  = document.querySelectorAll(".pcd-option");
const filtroAlvo = document.getElementById("pcd-filtered-area");

function aplicarFiltro(filtro) {
  filtroAlvo.classList.remove("protanopia", "deuteranopia", "tritanopia");
  if (filtro !== "normal") filtroAlvo.classList.add(filtro);

  const texto = [...options].find(btn => btn.dataset.filter === filtro).textContent;
  mainBtn.textContent = texto + " ▼";
  localStorage.setItem("filtroDaltonismo", filtro);
}

options.forEach(botao => {
  botao.addEventListener("click", () => aplicarFiltro(botao.dataset.filter));
});

aplicarFiltro(localStorage.getItem("filtroDaltonismo") || "normal");

/* ════════════════════════════════════════════
   ANIMAÇÃO DE ENTRADA DAS SEÇÕES
════════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visivel");
  });
}, { threshold: 0.80 });

document.querySelectorAll("section").forEach(s => observer.observe(s));

/* ════════════════════════════════════════════
   SCROLL POR SEÇÃO
════════════════════════════════════════════ */
const secoes = Array.from(document.querySelectorAll("main section, footer"));
let secaoAtual = 0;
let bloqueado = false;

const syncObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = secoes.indexOf(entry.target);
      if (index !== -1) secaoAtual = index;
    }
  });
}, { threshold: 0.5 });

secoes.forEach(s => syncObserver.observe(s));

window.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (bloqueado) return;
  bloqueado = true;

  if (e.deltaY > 0 && secaoAtual < secoes.length - 1) secaoAtual++;
  else if (e.deltaY < 0 && secaoAtual > 0) secaoAtual--;

  secoes[secaoAtual].scrollIntoView({ behavior: "smooth" });
  setTimeout(() => { bloqueado = false; }, 800);
}, { passive: false });

document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const id = link.getAttribute('href').replace('#', '');
  if (!id) return;

  const alvo = document.getElementById(id);
  if (!alvo) return;

  e.preventDefault();

  const index = secoes.indexOf(alvo);
  if (index !== -1) secaoAtual = index;

  alvo.scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll(".feature-card").forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    const destino = card.getAttribute("href");
    document.body.classList.add("saindo");
    setTimeout(() => { window.location.href = destino; }, 500);
  });
});
/* ════════════════════════════════════════════
   FEATURE CARDS — transição de página
════════════════════════════════════════════ */
document.querySelectorAll(".feature-card").forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    const destino = card.getAttribute("href");
    document.body.classList.add("saindo");
    setTimeout(() => { window.location.href = destino; }, 500);
  });
});