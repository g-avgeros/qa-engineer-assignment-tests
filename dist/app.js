"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const USERNAME = 'QA_Engineer';
const PASSWORD = 'FooBar42';
const MFA_CODE = '1337'; // Example MFA code for simplicity
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public'))); // Serve static files (CSS)
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../src/index.html'));
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        res.redirect('/mfa');
    }
    else {
        res.send('Invalid Credentials. Please try again.');
    }
});
app.get('/mfa', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../src/mfa.html'));
});
app.post('/mfa', (req, res) => {
    const { mfaCode } = req.body;
    if (mfaCode === MFA_CODE) {
        res.cookie('session', 'authenticated', { httpOnly: true });
        res.redirect('/dashboard');
    }
    else {
        res.send('Invalid MFA Code. Please try again.');
    }
});
app.get('/dashboard', (req, res) => {
    if (req.cookies.session === 'authenticated') {
        res.send('Welcome to your dashboard!');
    }
    else {
        res.status(401).send('Unauthorized. Please log in.');
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map