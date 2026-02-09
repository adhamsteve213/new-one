import React from 'react';
import './About.css';

const About = ({ language, translations }) => {
  const t = translations[language];

  const calculateAge = () => {
    const birthDate = new Date('2005-09-21');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <section id="about" className={`about ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t.aboutTag}</span>
          <h2 className="section-title">{t.aboutTitle}</h2>
          <div className="section-line"></div>
        </div>

        <div className="about-content">
          <div className="about-image">
            <div className="image-wrapper">
              <div className="profile-picture">
                <img src={process.env.PUBLIC_URL + "/profile pic.jpeg"} alt={language === 'ar' ? 'ادهم شمس' : 'Adham Shams'} />
              </div>
              <div className="image-border"></div>
              <div className="experience-badge">
                <span className="exp-number">3+</span>
                <span className="exp-text">{t.yearsExp}</span>
              </div>
            </div>
          </div>

          <div className="about-text">
            <h3>{t.whoAmI}</h3>
            <p className="about-description">
              {t.aboutDescription}
            </p>
            
            <div className="about-info">
              <div className="info-item">
                <i className="fas fa-user"></i>
                <div>
                  <span className="info-label">{t.name}</span>
                  <span className="info-value">{language === 'ar' ? 'ادهم شمس' : 'Adham Shams'}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-calendar"></i>
                <div>
                  <span className="info-label">{t.age}</span>
                  <span className="info-value">{calculateAge()} {t.years}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-briefcase"></i>
                <div>
                  <span className="info-label">{t.status}</span>
                  <span className="info-value highlight">{t.freelancer}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <span className="info-label">{t.from}</span>
                  <span className="info-value">{t.fromValue}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-code"></i>
                <div>
                  <span className="info-label">{t.experience}</span>
                  <span className="info-value">3+ {t.years}</span>
                </div>
              </div>
            </div>

            <div className="about-highlights">
              <div className="highlight-card">
                <div className="highlight-icon frontend">
                  <i className="fas fa-palette"></i>
                </div>
                <h4>{t.frontendDev}</h4>
                <p>{t.frontendDesc}</p>
              </div>
              <div className="highlight-card">
                <div className="highlight-icon backend">
                  <i className="fas fa-server"></i>
                </div>
                <h4>{t.backendDev}</h4>
                <p>{t.backendDesc}</p>
              </div>
              <div className="highlight-card">
                <div className="highlight-icon fullstack">
                  <i className="fas fa-layer-group"></i>
                </div>
                <h4>{t.fullstackDev}</h4>
                <p>{t.fullstackDesc}</p>
              </div>
            </div>

            <a href="#contact" className="btn btn-primary about-btn">
              {t.letsWork}
              <i className="fas fa-handshake"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="section-number">02</div>
    </section>
  );
};

export default About;
