import app from './app';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables (if not already loaded in app.ts)
dotenv.config({
  path: path.resolve(__dirname, './config/.env')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
