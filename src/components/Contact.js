import React from 'react';
import './Contact.css';

const Contact = ({ language, translations }) => {
  const t = translations[language];

  const contactCategories = [
    {
      title: t.whatsapp || 'WhatsApp',
      icon: 'fab fa-whatsapp',
      color: '#25D366',
      bg: 'rgba(37, 211, 102, 0.1)',
      items: [
        { value: '01145029534', link: 'https://wa.me/2001145029534' },
        { value: '01123108007', link: 'https://wa.me/2001123108007' },
        { value: '01066950046', link: 'https://wa.me/2001066950046' },
      ]
    },
    {
      title: t.phone,
      icon: 'fas fa-phone',
      color: '#667eea',
      bg: 'rgba(102, 126, 234, 0.1)',
      items: [
        { value: '01145029534', link: 'tel:01145029534' },
        { value: '01066950046', link: 'tel:01066950046' },
        { value: '01080885379', link: 'tel:01080885379' },
      ]
    },
    {
      title: t.email || 'Email',
      icon: 'fas fa-envelope',
      color: '#ea4335',
      bg: 'rgba(234, 67, 53, 0.1)',
      items: [
        { value: 'adhamsteve21@outlook.com', link: 'mailto:adhamsteve21@outlook.com' },
      ]
    },
    {
      title: t.telegramChannel,
      icon: 'fab fa-telegram',
      color: '#0088cc',
      bg: 'rgba(0, 136, 204, 0.1)',
      items: [
        { value: '@Adham_Syntax', link: 'https://t.me/Adham_Syntax' },
        { value: t.joinChannel, link: 'https://t.me/udotsOteOtszoetirsIwrj' },
      ]
    },
  ];

  return (
    <section id="contact" className={`contact ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t.contactTag}</span>
          <h2 className="section-title">{t.contactTitle}</h2>
          <div className="section-line"></div>
          <p className="section-subtitle">{t.contactSubtitle}</p>
        </div>

        <div className="contact-grid">
          {contactCategories.map((category, catIndex) => (
            <div 
              className="contact-category-card" 
              key={catIndex}
              style={{ '--method-color': category.color, '--method-bg': category.bg }}
            >
              <div className="category-header">
                <div className="category-icon">
                  <i className={category.icon}></i>
                </div>
                <h3>{category.title}</h3>
              </div>
              <div className="category-items">
                {category.items.map((item, itemIndex) => (
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="category-item"
                    key={itemIndex}
                  >
                    <span>{item.value}</span>
                    <i className="fas fa-arrow-right"></i>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="contact-bottom">
          <div className="availability">
            <div className="availability-dot"></div>
            <span>{t.availableFreelance}</span>
          </div>
        </div>
      </div>

      <div className="contact-bg-shapes">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
      </div>
      <div className="section-number">06</div>
    </section>
  );
};

export default Contact;
