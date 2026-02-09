import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ language, setLanguage, translations }) => {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const t = translations[language];

  const navItems = [
    { href: '#home', label: t.home, icon: 'fas fa-home' },
    { href: '#about', label: t.about, icon: 'fas fa-user' },
    { href: '#skills', label: t.skills, icon: 'fas fa-code' },
    { href: '#portfolio', label: t.portfolio, icon: 'fas fa-briefcase' },
    { href: '#ai', label: t.ai, icon: 'fas fa-robot' },
    { href: '#contact', label: t.contact, icon: 'fas fa-envelope' },
  ];

  return (
    <>
      {/* Desktop / Tablet Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${language === 'ar' ? 'rtl' : ''}`}>
        <div className="nav-container">
          <a href="#home" className="logo">
            <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" className="logo-img" />
          </a>

          <div className="nav-links-desktop">
            {navItems.map(item => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </div>

          <div className="nav-actions">
            <div className="nav-social-links">
              <a href="https://github.com/adhamsteve213" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.instagram.com/adhamsyntax01/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>

            <div className="language-switcher">
              <button 
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <button 
                className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
                onClick={() => setLanguage('ar')}
              >
                عربي
              </button>
            </div>

            <a href="#contact" className="nav-hire-btn">
              {t.hireMeNav}
            </a>

            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <span className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      {/* Mobile Sidebar */}
      <aside className={`mobile-sidebar ${sidebarOpen ? 'open' : ''} ${language === 'ar' ? 'rtl' : ''}`}>
        <div className="sidebar-header">
          <a href="#home" className="sidebar-logo" onClick={() => setSidebarOpen(false)}>
            <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" className="logo-img" />
          </a>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <a key={item.href} href={item.href} className="sidebar-link" onClick={() => setSidebarOpen(false)}>
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-divider"></div>

        <div className="sidebar-extras">
          <div className="sidebar-lang">
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
              onClick={() => setLanguage('ar')}
            >
              عربي
            </button>
          </div>

          <a href="#contact" className="sidebar-hire-btn" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-paper-plane"></i> {t.hireMeNav}
          </a>

          <div className="sidebar-social">
            <a href="https://github.com/adhamsteve213" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.instagram.com/adhamsyntax01/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
