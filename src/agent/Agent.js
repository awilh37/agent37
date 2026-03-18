import Brain from './brain.js';
import Memory from './memory.js';
import TaskExecutor from './taskExecutor.js';
import { v4 as uuidv4 } from 'uuid';

export default class Agent {
  constructor() {
    this.id = uuidv4();
    this.brain = new Brain();
    this.memory = new Memory();
    this.executor = new TaskExecutor();
    this.currentState = 'idle';
    this.taskQueue = [];
    this.lastThought = null;
    this.sessionStartTime = Date.now();
    
    console.log(`[Agent ${this.id.slice(0, 8)}] Created`);
  }

  async think() {
    try {
      const recentContext = this.memory.getRecentContext(5);
      const decision = this.brain.decide(recentContext);
      
      this.lastThought = {
        timestamp: Date.now(),
        decision,
        context: recentContext
      };

      if (decision.action !== 'idle') {
        this.taskQueue.push({
          id: uuidv4(),
          action: decision.action,
          params: decision.params,
          confidence: decision.confidence,
          createdAt: Date.now()
        });

        this.currentState = 'processing';
      }
    } catch (error) {
      console.error('Error during think phase:', error.message);
    }
  }

  async executePendingTasks() {
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      
      try {
        const result = await this.executor.execute(task);
        
        this.memory.addExperience({
          action: task.action,
          params: task.params,
          result: result.success,
          reward: result.reward,
          timestamp: Date.now(),
          details: result.details
        });

        this.currentState = 'idle';
      } catch (error) {
        console.error(`Task execution failed: ${error.message}`);
        
        this.memory.addExperience({
          action: task.action,
          params: task.params,
          result: false,
          reward: -0.5,
          timestamp: Date.now(),
          error: error.message
        });
      }
    }
  }

  updateMemory() {
    // Periodically save memory to disk
    if (Math.random() < 0.1) {
      this.memory.save();
    }
  }

  async saveMemory() {
    console.log('💾 Saving agent memory...');
    this.memory.save();
    this.brain.save();
  }

  // Training methods
  trainSupervised(examples) {
    const formattedExamples = examples.map(ex => ({
      input: ex.situation,
      output: ex.correctAction
    }));
    
    this.brain.trainSupervised(formattedExamples);
    console.log(`📚 Trained on ${examples.length} supervised examples`);
  }

  trainReinforced(episodes) {
    let totalReward = 0;
    
    episodes.forEach(episode => {
      this.brain.trainReinforced(episode.state, episode.action, episode.reward);
      totalReward += episode.reward;
    });
    
    console.log(`🎯 Trained on ${episodes.length} episodes (avg reward: ${(totalReward / episodes.length).toFixed(3)})`);
  }

  getState() {
    return {
      id: this.id,
      currentState: this.currentState,
      uptime: Date.now() - this.sessionStartTime,
      taskQueueLength: this.taskQueue.length,
      lastThought: this.lastThought,
      memoryStats: this.memory.getStats(),
      brainStats: this.brain.getStats()
    };
  }
}
