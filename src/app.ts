import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();

const USERNAME = 'QA_Engineer';
const PASSWORD = 'FooBar42';
const MFA_CODE = '1337'; // Example MFA code for simplicity

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files (CSS)
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    res.redirect('/mfa');
  } else {
    res.send('Invalid Credentials. Please try again.');
  }
});

app.get('/mfa', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../src/mfa.html'));
});

app.post('/mfa', (req: Request, res: Response) => {
  const { mfaCode } = req.body;
  if (mfaCode === MFA_CODE) {
    res.cookie('session', 'authenticated', { httpOnly: true });
    res.redirect('/dashboard');
  } else {
    res.send('Invalid MFA Code. Please try again.');
  }
});

app.get('/dashboard', (req: Request, res: Response) => {
  if (req.cookies.session === 'authenticated') {
    res.send('Welcome to your dashboard!');
  } else {
    res.status(401).send('Unauthorized. Please log in.');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
