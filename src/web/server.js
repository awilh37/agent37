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

    this.app.post('/api/agent/task', async (req, res) => {
      const { action, params } = req.body;
      
      if (!action) {
        return res.status(400).json({ error: 'Action required' });
      }

      try {
        // Execute task immediately and return results
        const task = {
          id: Math.random().toString(36).substr(2, 9),
          action,
          params: params || {},
          confidence: 0.7,
          createdAt: Date.now()
        };

        const result = await this.agent.executor.execute(task);
        
        // Store in memory
        this.agent.memory.addExperience({
          action: task.action,
          params: task.params,
          result: result.success,
          reward: result.reward,
          timestamp: Date.now(),
          details: result.details,
          generatedCode: result.generatedCode
        });

        res.json({ 
          success: true, 
          message: 'Task executed successfully',
          taskId: task.id,
          action: action,
          result: result
        });
      } catch (error) {
        res.status(500).json({ 
          error: 'Task execution failed',
          message: error.message 
        });
      }
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

    this.app.get('/api/training/history', (req, res) => {
      const stats = this.agent.memory.getStats();
      res.json({
        totalExperiences: stats.totalExperiences,
        patterns: stats.patterns,
        actionStats: stats.actionStats,
        successRates: Object.entries(stats.actionStats).reduce((acc, [action, data]) => {
          acc[action] = data.attempts > 0 ? (data.successes / data.attempts * 100).toFixed(1) : 0;
          return acc;
        }, {})
      });
    });

    this.app.get('/api/agent/brain-stats', (req, res) => {
      const brainStats = this.agent.brain.getStats();
      res.json(brainStats);
    });

    this.app.get('/api/agent/execution-log', (req, res) => {
      // Get recent executions from memory
      const limit = req.query.limit || 10;
      const stats = this.agent.memory.getStats();
      
      res.json({
        recentExecutions: stats.recentExperiences || [],
        actionStats: stats.actionStats
      });
    });

    // Serve dashboard as root
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    });
    
    // Keep old index for compatibility
    this.app.get('/old', (req, res) => {
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
