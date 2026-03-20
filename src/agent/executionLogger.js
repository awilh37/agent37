import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.join(__dirname, '../../data/memory/executions.json');

class ExecutionLogger {
  constructor() {
    this.ensureLogExists();
  }

  ensureLogExists() {
    const logDir = path.dirname(LOG_FILE);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
    }
  }

  loadExecutions() {
    try {
      const data = fs.readFileSync(LOG_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading executions:', error);
      return [];
    }
  }

  saveExecution(execution) {
    try {
      const executions = this.loadExecutions();
      const newExecution = {
        id: execution.id || Math.random().toString(36).substr(2, 9),
        timestamp: execution.timestamp || Date.now(),
        action: execution.action,
        params: execution.params || {},
        result: {
          success: execution.result?.success || false,
          reward: execution.result?.reward || 0,
          details: execution.result?.details,
          generatedCode: execution.result?.generatedCode,
          stdout: execution.result?.stdout,
          stderr: execution.result?.stderr,
          duration: execution.result?.duration || 0
        },
        confidence: execution.confidence || 0.7,
        feedback: execution.feedback || null
      };

      executions.push(newExecution);
      fs.writeFileSync(LOG_FILE, JSON.stringify(executions, null, 2));
      return newExecution;
    } catch (error) {
      console.error('Error saving execution:', error);
      return null;
    }
  }

  getExecutions(limit = 100, offset = 0) {
    const executions = this.loadExecutions();
    return {
      total: executions.length,
      executions: executions.reverse().slice(offset, offset + limit),
      hasMore: executions.length > offset + limit
    };
  }

  getExecution(id) {
    const executions = this.loadExecutions();
    return executions.find(e => e.id === id) || null;
  }

  deleteExecution(id) {
    try {
      const executions = this.loadExecutions();
      const filtered = executions.filter(e => e.id !== id);
      fs.writeFileSync(LOG_FILE, JSON.stringify(filtered, null, 2));
      return true;
    } catch (error) {
      console.error('Error deleting execution:', error);
      return false;
    }
  }

  clearExecutions() {
    try {
      fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
      return true;
    } catch (error) {
      console.error('Error clearing executions:', error);
      return false;
    }
  }
}

export default ExecutionLogger;
