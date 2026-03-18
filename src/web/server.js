import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3737;

export default class WebServer {
  constructor(agent) {
    this.agent = agent;
    this.app = express();
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));

    // API Routes
    this.app.get('/api/agent/state', (req, res) => {
      res.json(this.agent.getState());
    });

    this.app.get('/api/agent/memory', (req, res) => {
      res.json(this.agent.memory.getStats());
    });

    this.app.get('/api/agent/patterns', (req, res) => {
      res.json(this.agent.memory.getAllPatterns());
    });

    this.app.post('/api/agent/task', (req, res) => {
      const { action, params } = req.body;
      
      if (!action) {
        return res.status(400).json({ error: 'Action required' });
      }

      this.agent.taskQueue.push({
        id: Math.random().toString(36).substr(2, 9),
        action,
        params: params || {},
        confidence: 0.5,
        createdAt: Date.now()
      });

      res.json({ success: true, message: 'Task queued' });
    });

    this.app.post('/api/agent/train', (req, res) => {
      const { type, data } = req.body;

      if (type === 'supervised') {
        try {
          this.agent.trainSupervised(data);
          res.json({ success: true, message: 'Supervised training completed' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      } else if (type === 'reinforced') {
        try {
          this.agent.trainReinforced(data);
          res.json({ success: true, message: 'Reinforcement training completed' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(400).json({ error: 'Invalid training type' });
      }
    });

    this.app.get('/api/agent/success-rate/:action', (req, res) => {
      const rate = this.agent.memory.getSuccessRate(req.params.action);
      res.json({ action: req.params.action, successRate: rate });
    });

    // Serve index.html for root
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  }

  start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(PORT, () => {
        resolve();
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(resolve);
      } else {
        resolve();
      }
    });
  }
}
