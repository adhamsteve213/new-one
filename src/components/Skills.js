import React, { useState } from 'react';
import './Skills.css';

const Skills = ({ language, translations }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('frontend');

  const frontendSkills = [
    { name: 'HTML5', icon: 'fab fa-html5', color: '#e34f26', bg: 'rgba(227, 79, 38, 0.1)', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { name: 'CSS3', icon: 'fab fa-css3-alt', color: '#1572b6', bg: 'rgba(21, 114, 182, 0.1)', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
    { name: 'JavaScript', icon: 'fab fa-js-square', color: '#f7df1e', bg: 'rgba(247, 223, 30, 0.1)', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { name: 'TypeScript', icon: 'fab fa-js', color: '#3178c6', bg: 'rgba(49, 120, 198, 0.1)', link: 'https://www.typescriptlang.org/' },
    { name: 'React.js', icon: 'fab fa-react', color: '#61dafb', bg: 'rgba(97, 218, 251, 0.1)', link: 'https://react.dev/' },
    { name: 'Next.js', icon: 'fab fa-react', color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', link: 'https://nextjs.org/' },
    { name: 'Vue.js', icon: 'fab fa-vuejs', color: '#4fc08d', bg: 'rgba(79, 192, 141, 0.1)', link: 'https://vuejs.org/' },
    { name: 'Nuxt.js', icon: 'fab fa-vuejs', color: '#00dc82', bg: 'rgba(0, 220, 130, 0.1)', link: 'https://nuxt.com/' },
    { name: 'Tailwind CSS', icon: 'fab fa-css3', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', link: 'https://tailwindcss.com/' },
    { name: 'SASS', icon: 'fab fa-sass', color: '#cc6699', bg: 'rgba(204, 102, 153, 0.1)', link: 'https://sass-lang.com/' },
    { name: 'Bootstrap', icon: 'fab fa-bootstrap', color: '#7952b3', bg: 'rgba(121, 82, 179, 0.1)', link: 'https://getbootstrap.com/' },
  ];

  const backendSkills = [
    { name: 'Node.js', icon: 'fab fa-node-js', color: '#68a063', bg: 'rgba(104, 160, 99, 0.1)', link: 'https://nodejs.org/' },
    { name: 'Express.js', icon: 'fab fa-node', color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', link: 'https://expressjs.com/' },
    { name: 'MongoDB', icon: 'fas fa-database', color: '#47a248', bg: 'rgba(71, 162, 72, 0.1)', link: 'https://www.mongodb.com/' },
    { name: 'Python', icon: 'fab fa-python', color: '#3776ab', bg: 'rgba(55, 118, 171, 0.1)', link: 'https://www.python.org/' },
    { name: 'Django', icon: 'fab fa-python', color: '#092e20', bg: 'rgba(9, 46, 32, 0.3)', link: 'https://www.djangoproject.com/' },
    { name: 'MySQL', icon: 'fas fa-database', color: '#4479a1', bg: 'rgba(68, 121, 161, 0.1)', link: 'https://www.mysql.com/' },
    { name: 'PHP', icon: 'fab fa-php', color: '#777bb4', bg: 'rgba(119, 123, 180, 0.1)', link: 'https://www.php.net/' },
    { name: 'Laravel', icon: 'fab fa-laravel', color: '#ff2d20', bg: 'rgba(255, 45, 32, 0.1)', link: 'https://laravel.com/' },
    { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791', bg: 'rgba(51, 103, 145, 0.1)', link: 'https://www.postgresql.org/' },
    { name: 'Firebase', icon: 'fas fa-fire', color: '#ffca28', bg: 'rgba(255, 202, 40, 0.1)', link: 'https://firebase.google.com/' },
    { name: 'Redis', icon: 'fas fa-server', color: '#dc382d', bg: 'rgba(220, 56, 45, 0.1)', link: 'https://redis.io/' },
    { name: 'GraphQL', icon: 'fas fa-project-diagram', color: '#e535ab', bg: 'rgba(229, 53, 171, 0.1)', link: 'https://graphql.org/' },
  ];

  const skills = activeTab === 'frontend' ? frontendSkills : backendSkills;

  return (
    <section id="skills" className={`skills ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t.skillsTag}</span>
          <h2 className="section-title">{t.skillsTitle}</h2>
          <div className="section-line"></div>
          <p className="section-subtitle">{t.skillsSubtitle}</p>
        </div>

        <div className="skills-tabs">
          <button 
            className={`tab-btn ${activeTab === 'frontend' ? 'active' : ''}`}
            onClick={() => setActiveTab('frontend')}
          >
            <i className="fas fa-palette"></i>
            {t.frontend}
            <span className="tab-count">{frontendSkills.length}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'backend' ? 'active' : ''}`}
            onClick={() => setActiveTab('backend')}
          >
            <i className="fas fa-server"></i>
            {t.backend}
            <span className="tab-count">{backendSkills.length}</span>
          </button>
        </div>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <a 
              href={skill.link}
              target="_blank"
              rel="noopener noreferrer"
              className="skill-card" 
              key={skill.name}
              style={{ 
                '--skill-color': skill.color,
                '--skill-bg': skill.bg,
                '--delay': `${index * 0.1}s`
              }}
            >
              <div className="skill-icon">
                <i className={skill.icon}></i>
              </div>
              <div className="skill-glow"></div>
              <h3 className="skill-name">{skill.name}</h3>
              <div className="skill-3d-effect"></div>
            </a>
          ))}
        </div>

        <div className="skills-decoration">
          <div className="deco-circle deco-1"></div>
          <div className="deco-circle deco-2"></div>
          <div className="deco-circle deco-3"></div>
        </div>
      </div>
      <div className="section-number">03</div>
    </section>
  );
};

export default Skills;
