import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMORY_DIR = path.join(__dirname, '../../data/memory');

export default class Memory {
  constructor() {
    this.experiences = [];
    this.patterns = {};
    this.maxExperiences = 1000;
    
    if (!fs.existsSync(MEMORY_DIR)) {
      fs.mkdirSync(MEMORY_DIR, { recursive: true });
    }

    this.load();
  }

  addExperience(experience) {
    this.experiences.push({
      ...experience,
      id: Math.random().toString(36).substr(2, 9)
    });

    // Keep only recent experiences
    if (this.experiences.length > this.maxExperiences) {
      this.experiences = this.experiences.slice(-this.maxExperiences);
    }

    // Learn patterns from experience
    this.learnPattern(experience);
  }

  learnPattern(experience) {
    const key = `${experience.action}:${JSON.stringify(experience.params)}`;
    
    if (!this.patterns[key]) {
      this.patterns[key] = {
        successes: 0,
        failures: 0,
        totalReward: 0,
        avgReward: 0
      };
    }

    const pattern = this.patterns[key];
    if (experience.result) {
      pattern.successes++;
    } else {
      pattern.failures++;
    }

    pattern.totalReward += experience.reward || 0;
    pattern.avgReward = pattern.totalReward / (pattern.successes + pattern.failures);
  }

  getRecentContext(count = 5) {
    return this.experiences.slice(-count).map(exp => ({
      action: exp.action,
      reward: exp.reward,
      success: exp.result
    }));
  }

  getPattern(action, params) {
    const key = `${action}:${JSON.stringify(params)}`;
    return this.patterns[key] || null;
  }

  getAllPatterns() {
    return this.patterns;
  }

  getSuccessRate(action) {
    const actionPatterns = Object.entries(this.patterns)
      .filter(([key]) => key.startsWith(action + ':'))
      .map(([_, pattern]) => pattern);

    if (actionPatterns.length === 0) return 0;

    const totalSuccesses = actionPatterns.reduce((sum, p) => sum + p.successes, 0);
    const totalAttempts = actionPatterns.reduce((sum, p) => sum + p.successes + p.failures, 0);

    return totalAttempts > 0 ? totalSuccesses / totalAttempts : 0;
  }

  save() {
    try {
      const memoriesPath = path.join(MEMORY_DIR, 'experiences.json');
      const patternsPath = path.join(MEMORY_DIR, 'patterns.json');

      fs.writeFileSync(memoriesPath, JSON.stringify(this.experiences, null, 2));
      fs.writeFileSync(patternsPath, JSON.stringify(this.patterns, null, 2));
    } catch (error) {
      console.error('Error saving memory:', error.message);
    }
  }

  load() {
    try {
      const memoriesPath = path.join(MEMORY_DIR, 'experiences.json');
      const patternsPath = path.join(MEMORY_DIR, 'patterns.json');

      if (fs.existsSync(memoriesPath)) {
        this.experiences = JSON.parse(fs.readFileSync(memoriesPath, 'utf8'));
      }

      if (fs.existsSync(patternsPath)) {
        this.patterns = JSON.parse(fs.readFileSync(patternsPath, 'utf8'));
      }

      console.log(`✅ Memory loaded (${this.experiences.length} experiences)`);
    } catch (error) {
      console.error('Could not load memory, starting fresh');
    }
  }

  getStats() {
    const actionStats = {};
    
    Object.entries(this.patterns).forEach(([key, pattern]) => {
      const action = key.split(':')[0];
      if (!actionStats[action]) {
        actionStats[action] = {
          attempts: 0,
          successes: 0,
          avgReward: 0
        };
      }
      actionStats[action].attempts += pattern.successes + pattern.failures;
      actionStats[action].successes += pattern.successes;
      actionStats[action].avgReward += pattern.avgReward;
    });

    return {
      totalExperiences: this.experiences.length,
      patterns: Object.keys(this.patterns).length,
      actionStats
    };
  }
}
