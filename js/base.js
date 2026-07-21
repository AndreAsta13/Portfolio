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
Acessibilidade
================================================ */
const toggle = document.querySelector('.pcd-toggle');
const opcoes = document.querySelector('.pcd-opcoes');
let fecharTimeout;

function abrirPainel() {
    opcoes.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    reiniciarTimer();
}

function fecharPainel() {
    opcoes.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    clearTimeout(fecharTimeout);
}

function reiniciarTimer() {
    clearTimeout(fecharTimeout);
    fecharTimeout = setTimeout(fecharPainel, 6000); // fecha após 4 segundos
}

toggle.addEventListener('click', () => {
    const aberto = toggle.getAttribute('aria-expanded') === 'true';
    aberto ? fecharPainel() : abrirPainel();
});

// reinicia o timer se o usuário clicar em algum botão dentro do painel
opcoes.addEventListener('click', reiniciarTimer);




/* ================================================
   SCROLL — Logo
================================================ */
const logo = document.querySelector('.nav-logo');
const nav  = document.querySelector('.nav-menu');

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
   ASIDE — Acessibilidade (fonte adaptativa)
════════════════════════════════════════════ */
const SCALE_MIN  = 0.5;
const SCALE_MED  = 1;
const SCALE_MAX  = 1.6;
const SCALE_STEP = 0.05;

// recupera preferência salva, ou usa o padrão
let fontScale = parseFloat(localStorage.getItem('fontScale')) || SCALE_MED;
document.documentElement.style.setProperty('--font-scale', fontScale);

function aplicarEscala(valor) {
  fontScale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, valor));
  document.documentElement.style.setProperty('--font-scale', fontScale);
  localStorage.setItem('fontScale', fontScale);
}

document.querySelector('[title="Aumentar fonte"]').addEventListener('click', () => {
  aplicarEscala(fontScale + SCALE_STEP);
});

document.querySelector('[title="Fonte média"]').addEventListener('click', () => {
  aplicarEscala(SCALE_MED);
});

document.querySelector('[title="Diminuir fonte"]').addEventListener('click', () => {
  aplicarEscala(fontScale - SCALE_STEP);
});

const btnContraste = document.querySelector('[title="Alto contraste"]');
btnContraste.addEventListener('click', () => {
  document.documentElement.classList.remove('tema-neutro'); 
  document.documentElement.classList.toggle('tema-claro');
  const ativo = document.documentElement.classList.contains('tema-claro');
  btnContraste.setAttribute('aria-pressed', ativo);
  btnContraste.title = ativo ? 'Tema escuro' : 'Alto contraste';
});

const btnSemContraste = document.querySelector('[title="Sem contraste"]');
btnSemContraste.addEventListener('click', () => {
  document.documentElement.classList.remove('tema-claro'); // desliga o outro modo
  document.documentElement.classList.toggle('tema-neutro');
  const ativo = document.documentElement.classList.contains('tema-neutro');
  btnSemContraste.setAttribute('aria-pressed', ativo);
  btnSemContraste.title = ativo ? 'Contraste normal' : 'Sem contraste';
});

/* ════════════════════════════════════════════
   ASIDE — Toggle
════════════════════════════════════════════ */
const asideLeft   = document.querySelector('.aside-left');
const asideToggle = document.querySelector('.aside-toggle');

asideToggle.addEventListener('click', (e) => {
  // Evita que o clique no botão suba para o 'document'
  e.stopPropagation(); 
  
  const aberto = asideLeft.classList.toggle('aberto');
  asideToggle.textContent = aberto ? '✕' : '☰';
  asideToggle.title       = aberto ? 'Fechar painel' : 'Abrir painel';
  asideToggle.setAttribute('aria-expanded', aberto);
});

document.addEventListener('click', e => {
  // Se o menu estiver aberto E o clique for fora do menu E fora do botão toggle...
  if (!asideLeft.contains(e.target) && !asideToggle.contains(e.target)) {
    asideLeft.classList.remove('aberto');
    asideToggle.textContent = '☰';
    asideToggle.title       = 'Abrir painel';
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

const mainBtn = document.getElementById("pcd-main-btn");
const options = document.querySelectorAll(".pcd-option");
const filtroAlvo = document.getElementById("pcd-filtered-area"); 

function aplicarFiltro(filtro) {
    filtroAlvo.classList.remove("protanopia", "deuteranopia", "tritanopia"); 

    if (filtro !== "normal") {
        filtroAlvo.classList.add(filtro); 
    }

    const texto = [...options]
        .find(btn => btn.dataset.filter === filtro)
        .textContent;

    mainBtn.textContent = texto + " ▼";
    localStorage.setItem("filtroDaltonismo", filtro);
}

options.forEach(botao => {
    botao.addEventListener("click", () => {
        aplicarFiltro(botao.dataset.filter);
    });
});

const filtroSalvo = localStorage.getItem("filtroDaltonismo") || "normal";
aplicarFiltro(filtroSalvo);
const pcdContainer = document.querySelector('.pcd-container');
const pcdDropdown = document.querySelector('.pcd-dropdown');

mainBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  pcdDropdown.classList.toggle('aberto');
});

document.addEventListener('click', (e) => {
  if (!pcdContainer.contains(e.target)) {
    pcdDropdown.classList.remove('aberto');
  }
});

/* ════════════════════════════════════════════
   Hero
════════════════════════════════════════════ */
function splitIntoLetters(el, baseDelay = 0, delayStep = 0.03) {
  let i = 0;

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      const words = node.textContent.split(' ');

      words.forEach((word, wIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        [...word].forEach(char => {
          const letterSpan = document.createElement('span');
          letterSpan.className = 'letter';
          letterSpan.textContent = char;
          letterSpan.style.animationDelay = `${baseDelay + i * delayStep}s`;
          wordSpan.appendChild(letterSpan);
          i++;
        });

        frag.appendChild(wordSpan);

        // adiciona espaço real entre palavras (exceto na última)
        if (wIndex < words.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'letter space';
          spaceSpan.textContent = ' ';
          spaceSpan.style.animationDelay = `${baseDelay + i * delayStep}s`;
          frag.appendChild(spaceSpan);
          i++;
        }
      });

      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      [...node.childNodes].forEach(processNode);
    }
  }

  [...el.childNodes].forEach(processNode);
}
document.addEventListener('DOMContentLoaded', () => {
  const h1 = document.querySelector('.hero-content h1');
  const sub = document.querySelector('.hero-content .hero-sub');

  if (h1) splitIntoLetters(h1, 0.1, 0.03);
  if (sub) splitIntoLetters(sub, 1.0, 0.01);
});
/* ════════════════════════════════════════════
   RECURSOS — vídeos em sequência + play/pause
════════════════════════════════════════════ */
const videoAcessibilidade = document.getElementById('video-acessibilidade');
const videoSom            = document.getElementById('video-som');

videoAcessibilidade.addEventListener('ended', () => {
  videoAcessibilidade.currentTime = 0;
  videoSom.play();
});

videoSom.addEventListener('ended', () => {
  videoSom.currentTime = 0;
  videoAcessibilidade.play();
});

// Só inicia a sequência quando a seção #recursos entrar na tela
const secaoRecursos = document.getElementById('recursos');
let sequenciaIniciada = false;

const recursosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !sequenciaIniciada) {
      sequenciaIniciada = true;
      videoAcessibilidade.play();
    }
  });
}, { threshold: 0.3 });

recursosObserver.observe(secaoRecursos);

// Botões de play/pause (funciona nos 3 vídeos, incluindo o de "Em Breve")
document.querySelectorAll('.video-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();   // impede que o clique no botão siga o link do <a>
    e.stopPropagation();

    const video = document.getElementById(btn.dataset.target);

    if (video.paused) {
      video.play();
      btn.textContent = '❚❚';
      btn.setAttribute('aria-label', 'Pausar vídeo');
    } else {
      video.pause();
      btn.textContent = '►';
      btn.setAttribute('aria-label', 'Reproduzir vídeo');
    }
  });
});
const featuresGrid = document.querySelector(".features-grid");
const featureCards = Array.from(document.querySelectorAll(".feature-card"));

function ativarCard(index) {
  featureCards.forEach((card, i) => {
    card.classList.toggle('video-ativo', i === index);
  });
   const ehGridHorizontal = window.matchMedia('(min-width: 1801px)').matches;
   if (window.matchMedia('(min-width: 1801px)').matches) {
    const colunas = featureCards.map((_, i) => (i === index ? "2.4fr" : "0.6fr"));
    featuresGrid.style.gridTemplateColumns = colunas.join(" ");
  } else {
    featuresGrid.style.gridTemplateColumns = ""; // limpa o inline style, volta pro CSS (1 coluna)
  }
}



// Só os vídeos da sequência disputam o destaque (o de loop fica fixo)
[videoAcessibilidade, videoSom].forEach(video => {
  video.addEventListener("play", () => {
    const card = video.closest(".feature-card");
    const index = featureCards.indexOf(card);
    if (index !== -1) ativarCard(index);
  });
});

// estado inicial: Acessibilidade já começa "ativo"
ativarCard(0);

featureCards.slice(0, 2).forEach((card, index) => {
  const link = card.querySelector('a');
  const video = card.querySelector('video');

  link.addEventListener('click', (e) => {
    if (card.classList.contains('video-ativo')) {
      return; // já ativo, deixa os botões internos (toggle/restart) agirem
    }

    e.preventDefault();
    e.stopPropagation();

    featureCards.slice(0, 2).forEach(c => {
      const v = c.querySelector('video');
      if (v !== video) v.pause();
    });

    video.play();
    ativarCard(index);
  });
});
document.querySelectorAll('.video-restart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const video = document.getElementById(btn.dataset.target);
    video.currentTime = 0;
    video.play();

    // sincroniza o botão de play/pause, já que reiniciar sempre retoma o play
    const toggleBtn = document.querySelector(`.video-toggle[data-target="${btn.dataset.target}"]`);
    if (toggleBtn) {
      toggleBtn.textContent = '❚❚';
      toggleBtn.setAttribute('aria-label', 'Pausar vídeo');
    }
  });
});
document.querySelectorAll('.video-mute').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const video = document.getElementById(btn.dataset.target);
    video.muted = !video.muted;

    btn.textContent = video.muted ? '🔇' : '🔊';
    btn.setAttribute('aria-label', video.muted ? 'Ativar som' : 'Silenciar vídeo');
  });
});
window.addEventListener('resize', () => {
  const cardAtivo = featureCards.findIndex(c => c.classList.contains('video-ativo'));
  if (cardAtivo !== -1) ativarCard(cardAtivo);
});