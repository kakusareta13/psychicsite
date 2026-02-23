// ===== Элементы DOM =====
const header = document.getElementById('main-header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('nav ul');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

// ===== Изменение шапки при скролле =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Плавная прокрутка =====
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Закрываем мобильное меню если открыто
      if (nav && nav.classList.contains('show')) {
        nav.classList.remove('show');
      }
    }
  });
});

// ===== Мобильное меню =====
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('show');
    
    // Анимация кнопки
    mobileMenuBtn.style.transform = nav.classList.contains('show') ? 'rotate(90deg)' : 'rotate(0)';
  });
}

// ===== Обработка формы =====
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };
    
    // Валидация
    if (!formData.name || !formData.email || !formData.message) {
      showNotification('Пожалуйста, заполните все поля', 'error');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      showNotification('Пожалуйста, введите корректный email', 'error');
      return;
    }
    
    // Здесь можно добавить отправку на сервер
    // Например, через fetch API
    
    showNotification(`Спасибо, ${formData.name}! Я свяжусь с вами в ближайшее время.`, 'success');
    contactForm.reset();
  });
}

// ===== Валидация email =====
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===== Уведомления =====
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 2rem;
    background: ${type === 'success' ? 'var(--gradient-1)' : 'linear-gradient(135deg, #ff6b6b, #f03e3e)'};
    color: white;
    border-radius: 50px;
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// ===== Анимации при скролле =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Наблюдаем за карточками услуг и контактами
document.querySelectorAll('.service-card, .contact-item, .profile-img, .about-text').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// ===== Добавляем стили для анимаций =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  nav ul.show {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    padding: 2rem;
    border-bottom: 1px solid rgba(108, 92, 231, 0.2);
    backdrop-filter: blur(10px);
    z-index: 1000;
  }
  
  .mobile-menu-btn {
    transition: transform 0.3s ease;
  }
`;

document.head.appendChild(style);