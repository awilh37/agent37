import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRAIN_PATH = path.join(__dirname, '../../data/memory/brain.json');

// Simple neural network - no external dependencies!
class SimpleNeuralNetwork {
  constructor(inputSize, hiddenSize, outputSize) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;
    
    // Initialize weights with small random values
    this.w1 = this.randomMatrix(inputSize, hiddenSize);
    this.b1 = this.zeros(1, hiddenSize);
    this.w2 = this.randomMatrix(hiddenSize, outputSize);
    this.b2 = this.zeros(1, outputSize);
  }

  randomMatrix(rows, cols) {
    return Array(rows).fill(0).map(() => 
      Array(cols).fill(0).map(() => Math.random() * 0.1 - 0.05)
    );
  }

  zeros(rows, cols) {
    return Array(rows).fill(0).map(() => Array(cols).fill(0));
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  sigmoid_derivative(x) {
    return x * (1 - x);
  }

  relu(x) {
    return Math.max(0, x);
  }

  relu_derivative(x) {
    return x > 0 ? 1 : 0;
  }

  forward(input) {
    // Hidden layer with ReLU
    this.z1 = input[0].map((_, j) => 
      this.w1.reduce((sum, _, i) => sum + input[0][i] * this.w1[i][j], 0) + this.b1[0][j]
    );
    this.a1 = this.z1.map(x => this.relu(x));

    // Output layer with sigmoid
    this.z2 = this.a1.map((_, j) => 
      this.a1.reduce((sum, val, i) => sum + val * this.w2[i][j], 0) + this.b2[0][j]
    );
    this.a2 = this.z2.map(x => this.sigmoid(x));

    return [this.a2];
  }

  backward(input, target, learningRate) {
    const m = 1;

    // Ensure target is 2D array format [[val1, val2, ...]]
    let targetArray = target;
    if (!Array.isArray(target[0])) {
      targetArray = [target];
    }

    // Output layer error
    const output_error = targetArray[0].map((t, j) => this.a2[j] - t);
    const d_output = output_error.map((e, j) => e * this.sigmoid_derivative(this.a2[j]));

    // Hidden layer error
    const hidden_error = Array(this.hiddenSize).fill(0).map((_, i) =>
      d_output.reduce((sum, de, j) => sum + de * this.w2[i][j], 0)
    );
    const d_hidden = hidden_error.map((e, i) => e * this.relu_derivative(this.a1[i]));

    // Update weights and biases
    for (let i = 0; i < this.inputSize; i++) {
      for (let j = 0; j < this.hiddenSize; j++) {
        this.w1[i][j] -= learningRate * input[0][i] * d_hidden[j] / m;
      }
    }

    for (let j = 0; j < this.hiddenSize; j++) {
      this.b1[0][j] -= learningRate * d_hidden[j] / m;
    }

    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.outputSize; j++) {
        this.w2[i][j] -= learningRate * this.a1[i] * d_output[j] / m;
      }
    }

    for (let j = 0; j < this.outputSize; j++) {
      this.b2[0][j] -= learningRate * d_output[j] / m;
    }
  }

  toJSON() {
    return {
      w1: this.w1,
      b1: this.b1,
      w2: this.w2,
      b2: this.b2,
      inputSize: this.inputSize,
      hiddenSize: this.hiddenSize,
      outputSize: this.outputSize
    };
  }

  fromJSON(data) {
    this.w1 = data.w1;
    this.b1 = data.b1;
    this.w2 = data.w2;
    this.b2 = data.b2;
  }
}

export default class Brain {
  constructor() {
    this.net = new SimpleNeuralNetwork(10, 20, 5);

    this.actionMap = {
      0: 'idle',
      1: 'terminal',
      2: 'web',
      3: 'code',
      4: 'learn'
    };

    this.trainedExamples = 0;
    this.loadFromDisk();
  }

  decide(context) {
    try {
      const input = this.encodeContext(context);
      const output = this.net.forward([input]);
      
      let maxIdx = 0;
      let maxVal = output[0][0];
      for (let i = 1; i < output[0].length; i++) {
        if (output[0][i] > maxVal) {
          maxVal = output[0][i];
          maxIdx = i;
        }
      }

      const action = this.actionMap[maxIdx] || 'idle';
      const confidence = maxVal;

      return {
        action,
        actionIndex: maxIdx,
        confidence,
        allOutputs: output[0]
      };
    } catch (error) {
      console.error('Error in decision making:', error.message);
      return { action: 'idle', confidence: 0 };
    }
  }

  trainSupervised(examples) {
    try {
      const learningRate = 0.1;

      for (let epoch = 0; epoch < 100; epoch++) {
        let totalError = 0;
        
        examples.forEach(ex => {
          const input = this.encodeContext(ex.input);
          const output = this.encodeAction(ex.output);
          
          const prediction = this.net.forward([input]);
          this.net.backward([input], [output], learningRate);
          
          // Calculate error
          for (let i = 0; i < output.length; i++) {
            totalError += Math.pow(output[i] - prediction[0][i], 2);
          }
        });

        if (epoch % 20 === 0) {
          const mse = totalError / examples.length;
          console.log(`  [Brain] Epoch ${epoch}, Error: ${mse.toFixed(4)}`);
        }
      }

      this.trainedExamples += examples.length;
      this.saveToDisk();
    } catch (error) {
      console.error('Supervised training error:', error.message);
    }
  }

  trainReinforced(state, action, reward) {
    try {
      const input = this.encodeContext(state);
      const output = this.encodeAction(action);
      
      const adjustedLR = 0.1 * (1 + reward * 0.5);
      
      for (let i = 0; i < 10; i++) {
        this.net.forward([input]);
        this.net.backward([input], [output], adjustedLR);
      }
    } catch (error) {
      console.error('Reinforcement training error:', error.message);
    }
  }

  encodeContext(context) {
    if (Array.isArray(context)) {
      return context.slice(0, 10).concat(Array(10).fill(0)).slice(0, 10);
    }
    
    if (typeof context === 'object' && context !== null) {
      const values = Object.values(context).map(v => 
        typeof v === 'number' ? v : (v ? 1 : 0)
      );
      return values.slice(0, 10).concat(Array(10).fill(0)).slice(0, 10);
    }

    return Array(10).fill(0);
  }

  encodeAction(action) {
    const actionIndices = Object.entries(this.actionMap);
    const entry = actionIndices.find(([_, v]) => v === action);
    const index = entry ? parseInt(entry[0]) : 0;
    
    const output = Array(5).fill(0);
    output[index] = 1;
    return output;
  }

  saveToDisk() {
    try {
      const dir = path.dirname(BRAIN_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const brainData = {
        network: this.net.toJSON(),
        actionMap: this.actionMap,
        trainedExamples: this.trainedExamples,
        savedAt: new Date().toISOString()
      };

      fs.writeFileSync(BRAIN_PATH, JSON.stringify(brainData, null, 2));
    } catch (error) {
      console.error('Error saving brain:', error.message);
    }
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(BRAIN_PATH)) {
        const data = JSON.parse(fs.readFileSync(BRAIN_PATH, 'utf8'));
        this.net.fromJSON(data.network);
        this.actionMap = data.actionMap;
        this.trainedExamples = data.trainedExamples || 0;
        console.log(`✅ Brain loaded (trained on ${this.trainedExamples} examples)`);
      }
    } catch (error) {
      console.error('Could not load brain from disk, starting fresh');
    }
  }

  getStats() {
    return {
      trainedExamples: this.trainedExamples,
      actionMap: this.actionMap,
      lastSaved: BRAIN_PATH
    };
  }
}
