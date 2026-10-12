const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'YourSuperSecureSecretKeyHere',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        httpOnly: true,
        maxAge: 3600000 
    }
}));

const ADMIN_USER = {
    username: 'admin',
    passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW' 
};

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER.username && await bcrypt.compare(password, ADMIN_USER.passwordHash)) {
        req.session.isAuthenticated = true;
        req.session.user = username;
        return res.status(200).json({ message: 'تم تسجيل الدخول بنجاح، أهلاً بك يا سندال' });
    }
    res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
});

function requireAuth(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        return next();
    }
    res.status(403).json({ error: 'غير مصرح بالوصول، يرجى تسجيل الدخول أولاً' });
}

app.get('/dashboard', requireAuth, (req, res) => {
    res.send('<h1>مرحباً بك في لوحة التحكم الآمنة</h1><p>تم الاتصال بنجاح.</p>');
});

module.exports = app;
