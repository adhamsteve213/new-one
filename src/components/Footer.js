import React from 'react';
import './Footer.css';

const Footer = ({ language, translations }) => {
  const t = translations[language];
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="footer-content">
        <div className="footer-brand">
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" className="footer-logo-img" />
          <p>{t.footerTagline}</p>
        </div>

        <div className="footer-links">
          <a href="#home">{t.home}</a>
          <a href="#about">{t.about}</a>
          <a href="#skills">{t.skills}</a>
          <a href="#portfolio">{t.portfolio}</a>
          <a href="#ai">{t.ai}</a>
          <a href="#contact">{t.contact}</a>
        </div>

        <div className="footer-social">
          <a href="https://wa.me/2001145029534" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
            <i className="fab fa-whatsapp"></i>
          </a>
          <a href="mailto:adhamsteve21@outlook.com" className="social-icon email-icon">
            <i className="fas fa-envelope"></i>
          </a>
          <a href="https://t.me/Adham_Syntax" target="_blank" rel="noopener noreferrer" className="social-icon telegram">
            <i className="fab fa-telegram"></i>
          </a>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} {language === 'ar' ? 'ادهم شمس' : 'Adham Shams'}. {t.madeWith}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
