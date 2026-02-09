import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

const AIAssistant = ({ language, translations }) => {
  const t = translations[language];
  const [messages, setMessages] = useState([
    { type: 'bot', text: t.aiGreeting }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update greeting when language changes
  useEffect(() => {
    setMessages([{ type: 'bot', text: t.aiGreeting }]);
  }, [language, t.aiGreeting]);

  const generateResponse = (question) => {
    const q = question.toLowerCase();
    
    if (q.includes('skill') || q.includes('مهار') || q.includes('tech')) {
      return language === 'ar' 
        ? 'ادهم شمس يتقن: React, Next.js, Vue.js, Nuxt.js, Node.js, Express, MongoDB, Python, Django, PHP, Laravel, TypeScript, Tailwind CSS وأكثر! 🚀'
        : 'Adham is proficient in: React, Next.js, Vue.js, Nuxt.js, Node.js, Express, MongoDB, Python, Django, PHP, Laravel, TypeScript, Tailwind CSS and more! 🚀';
    }
    if (q.includes('experience') || q.includes('خبر') || q.includes('year')) {
      return language === 'ar'
        ? 'ادهم شمس لديه أكثر من 3 سنوات من الخبرة في العمل الحر، أنجز أكثر من 50 مشروع لأكثر من 30 عميل سعيد! 💼'
        : 'Adham has 3+ years of freelance experience, completed 50+ projects for 30+ happy clients! 💼';
    }
    if (q.includes('hire') || q.includes('work') || q.includes('وظف') || q.includes('عمل') || q.includes('contact') || q.includes('تواصل')) {
      return language === 'ar'
        ? 'يمكنك التواصل مع ادهم شمس عبر:\n📱 واتساب: 01145029534\n📧 إيميل: adhamsteve21@outlook.com\n✈️ تيليجرام: @Adham_Syntax\nأو اذهب لقسم التواصل في الأسفل! 👇'
        : 'You can reach Adham via:\n📱 WhatsApp: 01145029534\n📧 Email: adhamsteve21@outlook.com\n✈️ Telegram: @Adham_Syntax\nOr scroll down to the Contact section! 👇';
    }
    if (q.includes('project') || q.includes('مشروع') || q.includes('portfolio') || q.includes('أعمال')) {
      return language === 'ar'
        ? 'ادهم شمس أنجز أكثر من 50 مشروع متنوع تشمل تطبيقات ويب كاملة، لوحات تحكم، متاجر إلكترونية والمزيد! شاهد قسم الأعمال في الموقع 🎨'
        : 'Adham has completed 50+ diverse projects including full web apps, dashboards, e-commerce sites and more! Check the Portfolio section on this site 🎨';
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('مرحب') || q.includes('اهلا') || q.includes('hey')) {
      return language === 'ar'
        ? 'مرحباً! 😊 كيف أقدر أساعدك؟ يمكنك السؤال عن مهارات ادهم شمس، خبرته، مشاريعه، أو كيفية التواصل معه!'
        : 'Hello! 😊 How can I help you? You can ask about Adham\'s skills, experience, projects, or how to get in touch!';
    }
    if (q.includes('age') || q.includes('old') || q.includes('عمر') || q.includes('سن')) {
      return language === 'ar'
        ? 'ادهم شمس عمره 20 سنة، ولد في 21 سبتمبر 2005 في مصر 🇪🇬'
        : 'Adham is 20 years old, born on September 21, 2005 in Egypt 🇪🇬';
    }
    if (q.includes('price') || q.includes('cost') || q.includes('سعر') || q.includes('تكلفة')) {
      return language === 'ar'
        ? 'الأسعار تختلف حسب حجم ونوع المشروع. تواصل مع ادهم شمس للحصول على عرض سعر مخصص! 💰'
        : 'Pricing varies depending on the project scope and type. Contact Adham for a custom quote! 💰';
    }

    return language === 'ar'
      ? 'شكراً لسؤالك! يمكنك السؤال عن مهارات ادهم شمس أو خبرته أو مشاريعه أو كيفية التواصل معه. أو تواصل معه مباشرة عبر واتساب! 😊'
      : 'Thanks for your question! You can ask about Adham\'s skills, experience, projects, or how to contact him. Or reach out directly via WhatsApp! 😊';
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <section id="ai" className={`ai-section ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t.aiTag}</span>
          <h2 className="section-title">{t.aiTitle}</h2>
          <div className="section-line"></div>
          <p className="section-subtitle">{t.aiSubtitle}</p>
        </div>

        <div className="ai-chat-container">
          <div className="ai-chat-card">
            <div className="ai-chat-header">
              <div className="ai-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="ai-header-info">
                <h4>{t.aiName}</h4>
                <span className="ai-status">
                  <span className="status-dot"></span>
                  {t.aiOnline}
                </span>
              </div>
            </div>

            <div className="ai-chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`ai-message ${msg.type}`}>
                  {msg.type === 'bot' && (
                    <div className="ai-msg-avatar">
                      <i className="fas fa-robot"></i>
                    </div>
                  )}
                  <div className="ai-msg-bubble">
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="ai-message bot">
                  <div className="ai-msg-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="ai-msg-bubble typing">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="ai-chat-input">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.aiPlaceholder}
              />
              <button onClick={handleSend} className="ai-send-btn">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="section-number">05</div>
    </section>
  );
};

export default AIAssistant;
