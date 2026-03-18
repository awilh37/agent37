# AI Agent - Self-Trained Framework

A modular AI agent built from the ground up with minimal pre-trained data. You train it yourself through supervised and reinforcement learning. No LLM data required—just your own custom training!

## 🎯 Vision

Build a personal AI agent that learns exclusively from *your* training. Whether terminal commands, web interactions, or custom logic—you decide what it learns and how it behaves.

## ✨ Features

- **Lightweight Neural Network**: Brain.js LSTM for decision-making (Raspberry Pi friendly)
- **Dual Learning System**: 
  - **Supervised**: Teach it "when X happens, do Y"
  - **Reinforcement**: Reward good decisions, punish bad ones
- **Live Web Dashboard**: Real-time monitoring on port 3737
- **Task Modules**: Terminal, web, code execution (extendable)
- **Persistent Memory**: All learning saved between sessions
- **Cross-Platform**: Linux, Windows, Raspberry Pi

## 📁 Project Structure

```
agent37/
├── src/
│   ├── index.js                 # Main agent loop & startup
│   ├── agent/
│   │   ├── Agent.js             # Core agent class
│   │   ├── brain.js             # Neural network engine
│   │   ├── memory.js            # Experience & pattern storage
│   │   └── taskExecutor.js      # Task execution engine
│   ├── training/
│   │   └── trainer.js           # Interactive training CLI
│   └── web/
│       ├── server.js            # Express API (port 3737)
│       └── public/
│           ├── index.html       # Dashboard UI
│           ├── app.js           # Frontend logic
│           └── style.css        # Styling
├── data/
│   ├── memory/                  # Saved memories & trained models
│   └── training/                # Training logs (optional)
└── package.json
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **express**: Web server for port 3737
- **brain.js**: Neural network library
- **uuid**: Unique IDs for agent instances

### 2. Start the Agent

```bash
npm start
```

You'll see:
```
🤖 Initializing AI Agent...
✅ Brain loaded...
✅ Memory loaded...
✅ Web portal started on http://localhost:3737
🧠 Agent brain initialized and ready for training
📝 Run "npm run train" in another terminal to start training
```

### 3. Open the Web Portal

Visit **`http://localhost:3737`** in your browser. You'll see:
- Agent status (uptime, task queue, etc.)
- Memory & pattern statistics
- Task execution interface
- Training panels (supervised & reinforced)
- Success rates by action type

### 4. Start Training (in a new terminal)

```bash
npm run train
```

Interactive menu appears:
```
🎓 AI Agent Training System

Training Options:
1. Supervised Learning (teach specific behaviors)
2. Reinforcement Learning (reward/punish actions)
3. View Agent State
4. Exit
```

## 📚 Training Guide

### Supervised Learning

Teach the agent direct "situation → action" mappings.

**Example:**
```
Describe the situation: user wants to list files in current directory
What should the agent do? execute terminal command ls

Describe the situation: user wants to check the weather
What should the agent do? web browse weather website
```

The agent learns these patterns and will recognize similar situations.

### Reinforcement Learning

Let the agent try actions, then score how well it did (-1 to +1).

**Example:**
```
What was the state/situation? user asked to create a file
What action did the agent take? terminal mkdir newfile
Rate the outcome: -0.8 (wrong action, should use touch)

What was the state/situation? user asked to list files
What action did the agent take? terminal ls -la
Rate the outcome: 0.9 (perfect!)
```

The agent learns which patterns work best.

## 🎮 Web Dashboard Features

### Agent Status Panel
- Current state (idle, processing, etc.)
- Uptime and task queue length
- Memory usage statistics

### Memory & Patterns
- Total experiences stored
- Learned patterns detected
- Per-action success rates

### Task Executor
Manually send tasks to the agent:
```json
Action: terminal
Parameters: {"command": "ls -la"}
```

### Training Panels
Submit training data in JSON format:

**Supervised:**
```json
[
  {"situation": "list files", "correctAction": "terminal"},
  {"situation": "check time", "correctAction": "terminal"}
]
```

**Reinforced:**
```json
[
  {"state": "user asked to copy file", "action": "terminal cp", "reward": 0.7},
  {"state": "user asked to remove file", "action": "terminal rm", "reward": 0.9}
]
```

## 🧠 How It Works

1. **Agent Loop** (runs continuously)
   - Think: Neural network decides what to do based on memory
   - Execute: Carry out the decision (terminal, web, code, etc.)
   - Learn: Store experience and outcomes

2. **Memory System**
   - Stores every action + result
   - Identifies patterns (e.g., "this command usually succeeds 80%")
   - Weights decisions toward successful patterns

3. **Neural Network**
   - LSTM (Long Short-Term Memory) for context awareness
   - Trained on your supervised examples
   - Reinforced with reward signals

## 🛠️ Extending the Agent

### Add a New Task Type

Edit `src/agent/taskExecutor.js`:

```javascript
async executeCustom(params) {
  // Your custom logic here
  return {
    success: true,
    reward: 0.5,
    details: { /* results */ }
  };
}
```

Then train the agent to use it:
```
Situation: user wants X
Action: custom param1 param2
```

### Integrate Real APIs

Replace placeholder code in `taskExecutor.js`:
- **Web**: Add Puppeteer/Cheerio for real browsing
- **Terminal**: Already functional, works as-is
- **Code**: Add Node.js sandbox or Python execution

## 💡 Tips for Effective Training

1. **Start Simple**: Teach 5-10 basic behaviors first
2. **Provide Variety**: Different situations, edge cases, variations
3. **Use Reinforcement**: Score real attempts to guide learning
4. **Review Success Rates**: Check the dashboard—low rates show weak patterns
5. **Iterate**: Multiple training sessions compound learning
6. **Clean Slate**: `npm run clean` to start fresh if training goes wrong

## 🐍 On Raspberry Pi

The framework is lightweight, but Pi-specific tips:

```bash
# Monitor memory usage during training
free -h

# Reduce network size if memory is tight (edit brain.js):
hiddenLayers: [10, 8]  # Instead of [20, 15]

# Clear old memories to free space
npm run clean
```

## 🔧 Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Run agent + web portal |
| `npm run train` | Interactive training CLI |
| `npm run dev` | Dev mode with auto-reload |
| `npm run clean` | Clear all memories & models |

## 📊 Data Storage

- `data/memory/brain.json` - Trained neural network weights
- `data/memory/experiences.json` - All recorded experiences
- `data/memory/patterns.json` - Learned associations

These persist across sessions. Delete them to start fresh.

## ❓ FAQ

**Q: Will it eventually think for itself?**  
A: Yes! After enough training, it learns patterns and makes decisions independently. The web portal shows real-time thinking.

**Q: Can I train it while it's running?**  
A: Yes! The training CLI runs in a separate terminal. Changes apply immediately.

**Q: What if it learns wrong patterns?**  
A: Run `npm run clean` to reset, or use reinforcement learning to correct it with negative rewards.

**Q: How big can training datasets be?**  
A: Thousands of examples work fine. The neural network keeps a rolling window of 1000 recent experiences.

## 🎓 Next Steps

1. ✅ Run `npm install`
2. ✅ Start with `npm start`  
3. ✅ Open `http://localhost:3737`
4. ✅ Begin training with `npm run train`
5. ✅ Watch it learn in real-time on the dashboard!

---

**Enjoy building your personal AI! 🤖** Questions? Check the dashboard logs or experiment with the training interface.
