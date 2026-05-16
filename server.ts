import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', msg: 'FPS Motion API is running' });
  });

  // Sample Property API
  app.get('/api/properties', (req, res) => {
    // In production, this would fetch from Firestore/MongoDB
    res.json([
      { id: 1, title: 'Luxury Villa', price: 8500000, type: 'Sale' },
      { id: 2, title: 'Modern Flat', price: 12000, type: 'Rent' }
    ]);
  });

  // Appointment API
  app.post('/api/appointments', (req, res) => {
    const { userId, slot, date, type } = req.body;
    console.log(`New Appointment Request: User ${userId} at ${slot} on ${date} (${type})`);
    res.status(201).json({ success: true, message: 'Appointment requested. Confirmation will be sent on WhatsApp.' });
  });

  // Admin: Get Analytics
  app.get('/api/admin/analytics', (req, res) => {
    res.json({
      totalUsers: 1250,
      activeProperties: 480,
      pendingAppointments: 15,
      revenueGenerated: '₹12.5 Cr'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FPS Motion Server running on http://localhost:${PORT}`);
  });
}

startServer();
