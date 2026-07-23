const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing for API endpoints
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from webroot
app.use(express.static(path.join(__dirname, 'webroot')));
app.use('/img', express.static(path.join(__dirname, 'webroot/img')));
app.use('/css', express.static(path.join(__dirname, 'webroot/css')));
app.use('/js', express.static(path.join(__dirname, 'webroot/js')));
app.use('/fonts', express.static(path.join(__dirname, 'webroot/fonts')));

const titleMap = {
    "index": "Infinity Tech - Somali IT Solutions, Mobile Apps, Web Dev & School SaaS",
    "about": "Infinity Tech - About Us | Leading Somali IT Solutions Provider",
    "service": "Infinity Tech - Our Core IT Services & Engineering Solutions",
    "service-mobile-app": "Infinity Tech - Native iOS & Android Mobile App Development",
    "service-web-dev": "Infinity Tech - Modern Web Application Development & Design",
    "service-school-saas": "Infinity Tech - School SaaS Management Platform",
    "pricing-plan": "Infinity Tech - Solution Packages & Service Engagement",
    "case-studies": "Infinity Tech - Case Studies & Proven Somali Projects",
    "faq": "Infinity Tech - Frequently Asked Questions (FAQ)",
    "contact": "Infinity Tech - Contact Us | Degmada Hodan, Mogadishu"
};

// Load environment variables from .env file if present
try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    envFile.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2 && parts[0].trim() && !process.env[parts[0].trim()]) {
            process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
        }
    });
} catch (e) {}

// DeepSeek API Key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

// AI Chatbot Backend Endpoint via DeepSeek API
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const systemPrompt = `You are Infinity AI, the official mobile chat assistant for Infinity Tech in Mogadishu, Somalia (Phone: +252615565249, Email: suppport@infotech.com).

We offer 3 core services:
1. Mobile App Development (iOS & Android apps with offline sync & mobile money APIs). Image: /img/studies/case-mobile-app.jpg
2. Website Dev & Design (Node.js, Express & React enterprise portals with sub-2s load speed). Image: /img/studies/case-website-dev.jpg
3. School SaaS Platform (Cloud software for 50+ Somali schools automating billing & WhatsApp parent alerts). Image: /img/studies/case-saas-platform.jpg

STRICT RULES FOR YOUR REPLIES:
- Write PROFESSIONAL, SHORT mobile SMS / WhatsApp text style replies (MAXIMUM 2 short sentences total!).
- NEVER write long paragraphs or bullet lists.
- If relevant to the service asked, attach exactly 1 image tag like <img src="/img/studies/case-mobile-app.jpg" class="chat-img" alt="Mobile App">.
- Be extremely polite, professional, and straight to the point.`;

        const messages = [{ role: 'system', content: systemPrompt }];

        if (Array.isArray(history)) {
            history.forEach(item => {
                if (item.role && item.content) {
                    messages.push({ role: item.role, content: item.content });
                }
            });
        }

        messages.push({ role: 'user', content: message });

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                max_tokens: 450,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('DeepSeek API Error:', errText);
            return res.json({
                reply: `Thanks for your message! Infinity Tech specializes in Mobile Apps, Web Dev, and School SaaS Platforms in Somalia. You can also chat directly with our team on <a href="https://wa.me/252615565249?text=Hello%20Infinity%20Tech%2C%20I%20would%20like%20to%20speak%20to%20a%20real%20person" target="_blank" style="color: #25D366; font-weight: bold;">WhatsApp (+252615565249)</a>!`
            });
        }

        const data = await response.json();
        const reply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : 'How can I assist you with our Mobile Apps, Web Dev, or School SaaS Platform?';

        res.json({ reply });
    } catch (err) {
        console.error('Chat API Error:', err);
        res.json({
            reply: `Hello! Infinity Tech offers Mobile Apps, Web Dev, and School SaaS software in Somalia. Chat with a real person anytime on <a href="https://wa.me/252615565249?text=Hello%20Infinity%20Tech%2C%20I%20would%20like%20to%20speak%20to%20a%20real%20person" target="_blank" style="color: #25D366; font-weight: bold;">WhatsApp (+252615565249)</a>!`
        });
    }
});

// Home 1 route
app.get(['/', '/index', '/index.html'], (req, res) => {
    res.render('index', { title: titleMap['index'] });
});

// Dynamic route handler for all view pages
app.get('/:page', (req, res) => {
    let pageName = req.params.page.replace('.html', '');
    const viewPath = path.join(__dirname, 'views', `${pageName}.ejs`);

    if (fs.existsSync(viewPath)) {
        const title = titleMap[pageName] || `Infinity Tech - ${pageName.replace('-', ' ').toUpperCase()}`;
        res.render(pageName, { title });
    } else {
        res.status(404).render('404', { title: '404 - Page Not Found | Infinity Tech' });
    }
});

// 404 Fallback
app.use((req, res) => {
    res.status(404).render('404', { title: '404 - Page Not Found | Infinity Tech' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
        console.log(`🏠 Home 1 active at http://localhost:${PORT}/`);
    });
}

module.exports = app;
