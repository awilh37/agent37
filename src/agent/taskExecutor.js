import { execSync, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default class TaskExecutor {
  async execute(task) {
    console.log(`⚡ Executing task: ${task.action}`);

    switch (task.action) {
      case 'terminal':
        return this.executeTerminal(task.params);
      case 'web':
        return this.executeWeb(task.params);
      case 'code':
        return this.executeCode(task.params);
      case 'learn':
        return this.executeLearning(task.params);
      case 'idle':
      default:
        return { success: true, reward: 0, details: 'Idle state' };
    }
  }

  async executeTerminal(params) {
    try {
      if (!params.command) {
        return { success: false, reward: -0.5, details: 'No command specified' };
      }

      const { stdout, stderr } = await execAsync(params.command, { timeout: 5000 });
      
      return {
        success: true,
        reward: 0.5,
        details: {
          command: params.command,
          output: stdout.slice(0, 500),
          error: stderr ? stderr.slice(0, 200) : null
        }
      };
    } catch (error) {
      return {
        success: false,
        reward: -0.3,
        details: {
          command: params.command,
          error: error.message.slice(0, 200)
        }
      };
    }
  }

  async executeWeb(params) {
    try {
      if (!params.url) {
        return { success: false, reward: -0.5, details: 'No URL specified' };
      }

      // Placeholder for web interaction
      // In real use, you'd integrate a web scraping library
      console.log(`   🌐 Web task: ${params.url}`);
      
      return {
        success: true,
        reward: 0.3,
        details: {
          url: params.url,
          action: params.action || 'fetch',
          note: 'Web module - implement with your web library'
        }
      };
    } catch (error) {
      return { success: false, reward: -0.3, details: error.message };
    }
  }

  async executeCode(params) {
    try {
      if (!params.code) {
        return { success: false, reward: -0.5, details: 'No code specified' };
      }

      console.log(`   💻 Code task: ${params.code.slice(0, 50)}...`);
      
      return {
        success: true,
        reward: 0.4,
        details: {
          code: params.code.slice(0, 100),
          language: params.language || 'unknown',
          note: 'Code module - integrate with execution sandbox'
        }
      };
    } catch (error) {
      return { success: false, reward: -0.3, details: error.message };
    }
  }

  async executeLearning(params) {
    try {
      console.log(`   📚 Learning: ${params.topic || 'general'}`);
      
      return {
        success: true,
        reward: 0.2,
        details: {
          topic: params.topic,
          note: 'Learning mode - reflect on recent experiences'
        }
      };
    } catch (error) {
      return { success: false, reward: -0.2, details: error.message };
    }
  }
}
