import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = ({ language, translations }) => {
  const t = translations[language];
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const texts = t.typingTexts;
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        
        if (charIndex + 1 === currentText.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setTypedText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, t.typingTexts]);

  return (
    <section id="home" className={`hero ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="hero-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="grid-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          <p className="greeting">{t.greeting}</p>
          <h1 className="name">
            <span className="first-name">{language === 'ar' ? 'ادهم' : 'Adham'}</span>
            <span className="last-name">{language === 'ar' ? 'شمس' : 'Shams'}</span>
          </h1>
          <div className="title-wrapper">
            <h2 className="title">
              <span className="typed-text">{typedText}</span>
              <span className="cursor">|</span>
            </h2>
          </div>
          <p className="description">{t.description}</p>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">3+</span>
              <span className="stat-label">{t.yearsExp}</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">{t.projectsCompleted}</span>
            </div>
            <div className="stat">
              <span className="stat-number">30+</span>
              <span className="stat-label">{t.happyClients}</span>
            </div>
          </div>

          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary">
              {t.hireMe}
              <i className="fas fa-arrow-right"></i>
            </a>
            <a href="#portfolio" className="btn btn-secondary">
              {t.viewWork}
              <i className="fas fa-eye"></i>
            </a>
          </div>

          <div className="social-links">
            <a href="https://wa.me/2001145029534" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="mailto:adhamsteve21@outlook.com" target="_blank" rel="noopener noreferrer" className="social-link email">
              <i className="fas fa-envelope"></i>
            </a>
            <a href="https://t.me/Adham_Syntax" target="_blank" rel="noopener noreferrer" className="social-link telegram">
              <i className="fab fa-telegram"></i>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-profile-card">
            <div className="hero-profile-image">
              <img src={process.env.PUBLIC_URL + "/profile pic.jpeg"} alt={language === 'ar' ? 'ادهم شمس' : 'Adham Shams'} />
            </div>
            <div className="hero-profile-glow"></div>
            <div className="hero-badge badge-fast">
              <i className="fas fa-bolt"></i>
              <span>{t.fastDelivery}</span>
            </div>
            <div className="hero-badge badge-rated">
              <i className="fas fa-star"></i>
              <span>{t.topRated}</span>
            </div>
          </div>
          <div className="orbit-container">
            <div className="orbit orbit-1">
              <div className="orbit-icon"><i className="fab fa-react"></i></div>
            </div>
            <div className="orbit orbit-2">
              <div className="orbit-icon"><i className="fab fa-node-js"></i></div>
            </div>
            <div className="orbit orbit-3">
              <div className="orbit-icon"><i className="fab fa-python"></i></div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-number">01</div>

      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <p>{t.scrollDown}</p>
      </div>
    </section>
  );
};

export default Hero;
