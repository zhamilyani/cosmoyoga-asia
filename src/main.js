// ===== CosmoYoga App =====
import { initI18n } from './i18n.js';

// --- Particles ---
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${6 + Math.random() * 6}s;
    `;
    container.appendChild(p);
  }
}

// --- Navigation ---
function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links = document.querySelector('.nav__links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  });

  burger.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// --- Quiz ---
const quizState = { step: 0, answers: { wind: 0, bile: 0, phlegm: 0 }, total: 5 };

const lungResults = {
  wind: {
    icon: '🌬',
    title: 'Тип Лунг (Ветер)',
    desc: 'Вы обладаете подвижной энергией. Склонны к тревожности и бессоннице. Вам нужны заземляющие практики.',
    recs: [
      { label: 'Масло', value: 'Сандал, Лаванда' },
      { label: 'Чай', value: 'Успокаивающий сбор' },
      { label: 'Практика', value: 'Заземляющая йога' },
      { label: 'Медитация', value: 'Вечерняя, дыхательная' },
      { label: 'Добавки', value: 'Магний, Ашваганда' },
      { label: 'Благовония', value: 'Наг Чампа' },
    ]
  },
  bile: {
    icon: '🔥',
    title: 'Тип Трипа (Желчь)',
    desc: 'У вас огненная энергия. Склонны к раздражению и перегреву. Вам нужны охлаждающие и балансирующие практики.',
    recs: [
      { label: 'Масло', value: 'Мята, Эвкалипт' },
      { label: 'Чай', value: 'Детокс сбор' },
      { label: 'Практика', value: 'Охлаждающая пранаяма' },
      { label: 'Медитация', value: 'Утренняя, на прощение' },
      { label: 'Добавки', value: 'Куркума, Омега-3' },
      { label: 'Благовония', value: 'Белый шалфей' },
    ]
  },
  phlegm: {
    icon: '🌊',
    title: 'Тип Бекен (Слизь)',
    desc: 'Вы обладаете устойчивой энергией. Склонны к застою и апатии. Вам нужны активизирующие практики.',
    recs: [
      { label: 'Масло', value: 'Мята, Эвкалипт' },
      { label: 'Чай', value: 'Энергетический сбор' },
      { label: 'Практика', value: 'Динамическая йога' },
      { label: 'Медитация', value: 'Утренняя, на мотивацию' },
      { label: 'Добавки', value: 'Куркума, Ашваганда' },
      { label: 'Благовония', value: 'Пало Санто' },
    ]
  }
};

function initQuiz() {
  // Tab switching
  document.querySelectorAll('.quiz-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.quiz-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('lungQuiz').style.display = target === 'lung' ? 'block' : 'none';
      document.getElementById('matrixQuiz').style.display = target === 'matrix' ? 'block' : 'none';
    });
  });

  // Lung quiz options
  document.querySelectorAll('#lungQuiz .quiz__option').forEach(opt => {
    opt.addEventListener('click', () => {
      quizState.answers[opt.dataset.type]++;
      quizState.step++;
      updateQuizProgress();

      if (quizState.step >= quizState.total) {
        showQuizResult();
      } else {
        document.querySelectorAll('.quiz__step').forEach(s => s.classList.remove('active'));
        document.querySelector(`.quiz__step[data-step="${quizState.step}"]`).classList.add('active');
      }
    });
  });

  // Matrix
  document.getElementById('calcMatrix').addEventListener('click', calcMatrix);
}

function updateQuizProgress() {
  const pct = (quizState.step / quizState.total) * 100;
  document.getElementById('quizProgress').style.width = pct + '%';
}

function showQuizResult() {
  document.querySelectorAll('.quiz__step').forEach(s => s.classList.remove('active'));
  document.querySelector('.quiz__progress').style.display = 'none';

  const { wind, bile, phlegm } = quizState.answers;
  let type = 'wind';
  if (bile >= wind && bile >= phlegm) type = 'bile';
  if (phlegm >= wind && phlegm >= bile) type = 'phlegm';

  const result = lungResults[type];
  document.getElementById('resultIcon').textContent = result.icon;
  document.getElementById('resultTitle').textContent = result.title;
  document.getElementById('resultDesc').textContent = result.desc;

  const recsHtml = result.recs.map(r =>
    `<div class="rec"><span class="rec__label">${r.label}</span>${r.value}</div>`
  ).join('');
  document.getElementById('resultRecs').innerHTML = recsHtml;
  document.getElementById('quizResult').style.display = 'block';
}

function calcMatrix() {
  const dateInput = document.getElementById('birthDate');
  if (!dateInput.value) return;

  const date = new Date(dateInput.value);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Simple numerology reduction
  const reduce = n => {
    while (n > 22) n = String(n).split('').reduce((a, b) => a + +b, 0);
    return n;
  };

  const num1 = reduce(day);
  const num2 = reduce(month);
  const num3 = reduce(year);
  const num4 = reduce(num1 + num2 + num3);

  const arcanas = [
    '', 'Маг', 'Жрица', 'Императрица', 'Император', 'Иерофант',
    'Влюблённые', 'Колесница', 'Сила', 'Отшельник', 'Колесо Фортуны',
    'Справедливость', 'Повешенный', 'Смерть', 'Умеренность', 'Дьявол',
    'Башня', 'Звезда', 'Луна', 'Солнце', 'Суд', 'Мир', 'Шут'
  ];

  document.getElementById('matrixTitle').textContent = `Ваш ключевой аркан: ${arcanas[num4] || 'Маг'}`;
  document.getElementById('matrixDesc').textContent =
    `Числа вашей матрицы: ${num1}, ${num2}, ${num3}, ${num4}. На основе этих данных формируются рекомендации по практикам и блокам внимания.`;
  document.getElementById('matrixBlocks').innerHTML = `
    <div style="margin-top:16px;text-align:left;color:var(--text-dim);font-size:0.9rem;">
      <p>✦ <strong>Тело:</strong> Обратите внимание на аркан ${num1} — ${arcanas[num1] || '?'}</p>
      <p>✦ <strong>Эмоции:</strong> Аркан ${num2} — ${arcanas[num2] || '?'}</p>
      <p>✦ <strong>Разум:</strong> Аркан ${num3} — ${arcanas[num3] || '?'}</p>
      <p>✦ <strong>Миссия:</strong> Аркан ${num4} — ${arcanas[num4] || '?'}</p>
    </div>
  `;
  document.getElementById('matrixResult').style.display = 'block';
}

// --- Box customizer ---
function initBox() {
  const prices = {
    lavender: 890, eucalyptus: 790, sandalwood: 1290, peppermint: 690,
    ashwagandha: 1490, turmeric: 890, magnesium: 990, omega3: 1290,
    'nag-champa': 390, 'palo-santo': 590, 'white-sage': 490, frankincense: 690,
    pillow: 3490, belt: 1990, 'sleep-mask': 1290, 'h2-bottle': 4990, 'tea-cup': 1990,
    'calm-tea': 590, 'energy-tea': 590, 'detox-tea': 690, 'meditation-tea': 790,
  };

  const names = {
    lavender: 'Лаванда', eucalyptus: 'Эвкалипт', sandalwood: 'Сандал', peppermint: 'Мята',
    ashwagandha: 'Ашваганда', turmeric: 'Куркума', magnesium: 'Магний', omega3: 'Омега-3',
    'nag-champa': 'Наг Чампа', 'palo-santo': 'Пало Санто', 'white-sage': 'Белый шалфей', frankincense: 'Ладан',
    pillow: 'Подушка', belt: 'Пояс', 'sleep-mask': 'Повязка', 'h2-bottle': 'Водородная бутылка', 'tea-cup': 'Термокружка',
    'calm-tea': 'Успокаивающий чай', 'energy-tea': 'Энергетический чай', 'detox-tea': 'Детокс чай', 'meditation-tea': 'Чай для медитации',
  };

  document.querySelectorAll('.box__item input').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...document.querySelectorAll('.box__item input:checked')];
      if (checked.length === 0) {
        document.getElementById('boxSummary').textContent = 'Выберите элементы выше';
        document.getElementById('boxPrice').textContent = '0';
        return;
      }
      const items = checked.map(c => names[c.value] || c.value);
      const total = checked.reduce((sum, c) => sum + (prices[c.value] || 0), 0);
      document.getElementById('boxSummary').textContent = items.join(' • ');
      document.getElementById('boxPrice').textContent = total.toLocaleString('ru-RU');
    });
  });
}

// --- Chat widget ---
function initChat() {
  const toggle = document.getElementById('chatToggle');
  const close = document.getElementById('chatClose');
  const window_ = document.getElementById('chatWindow');
  const input = document.getElementById('chatInput');
  const send = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');

  toggle.addEventListener('click', () => {
    window_.style.display = window_.style.display === 'none' ? 'flex' : 'none';
  });
  close.addEventListener('click', () => { window_.style.display = 'none'; });

  const botResponses = [
    'Расскажите подробнее, и я помогу подобрать подходящую практику.',
    'Рекомендую начать с диагностики — пройдите тест по лунгам выше.',
    'Для вашего случая подойдёт пакет "С наставником" — там есть персональное сопровождение.',
    'Медитации доступны по времени суток: утренние, дневные и вечерние.',
    'Персональная коробка собирается на основе вашего типа энергетики.',
    'Ретриты проходят ежемесячно. Оффлайн-семинары — 2 раза в год.',
    'AI-бот доступен 24/7 во всех пакетах. Для экстренной поддержки наставник доступен в пакетах "С наставником" и "Полная трансформация".',
  ];

  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `chat__msg chat__msg--${isUser ? 'user' : 'bot'}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = '';
    setTimeout(() => {
      addMessage(botResponses[Math.floor(Math.random() * botResponses.length)], false);
    }, 800);
  }

  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
}

// --- Package terms ---
function initTerms() {
  document.querySelectorAll('.card__terms').forEach(container => {
    container.querySelectorAll('.term').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.term').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

// --- Contact form ---
function initContact() {
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Заявка отправлена! ✓';
    btn.style.background = 'linear-gradient(135deg, #6ee7b7, #34d399)';
    setTimeout(() => {
      btn.textContent = 'Отправить заявку';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// --- Smooth scroll ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initNav();
  initQuiz();
  initBox();
  initChat();
  initTerms();
  initContact();
  initI18n();
});
