# 🌐 Website Coding Training Guide

## Overview

This guide explains how to train your AI agent to code websites based on prompts—similar to what I do! The agent learns to translate natural language descriptions into HTML/CSS/JavaScript code.

## Training Dataset Included

**File:** `website-training-scenarios.json`

Contains:
- **15 supervised learning examples** - Direct "prompt → action" mappings
- **15 reinforcement learning scenarios** - Score the agent's code attempts
- **5 code generation templates** - Full website project examples
- **5 training levels** - Progressive complexity (HTML → Full Apps)
- **8 quality criteria** - How to score code quality

## 🎯 Training Strategy

### Phase 1: Supervised Learning (Build Foundation)

The agent learns patterns from your examples:

```
Example 1:
Situation: "user wants a simple landing page with title and button"
Correct Action: "code"

Example 2:
Situation: "user wants a dark theme navigation menu"
Correct Action: "code"
```

The agent recognizes: "when user describes a website, respond with 'code' action"

**How to train:**

```bash
npm run train
# Select: 1. Supervised Learning
# Enter each situation and correct action
# The agent learns patterns
```

Or upload via web portal:

```json
[
  {"situation": "user wants a landing page", "correctAction": "code"},
  {"situation": "user wants a form", "correctAction": "code"},
  {"situation": "user wants a gallery", "correctAction": "code"}
]
```

### Phase 2: Reinforcement Learning (Refine Technique)

Score the agent's actual code attempts:

```
Situation: "create a responsive navigation menu"
Agent Generated: HTML with flexbox layout and hamburger menu
Your Score: 0.95 ✅ (excellent!)

Situation: "build a todo list app"
Agent Generated: Form to add items, but no delete or localStorage
Your Score: 0.70 (good but missing features)
```

**How to train:**

```bash
npm run train
# Select: 2. Reinforcement Learning
# Describe situation + what agent tried + your score
# Agent learns which patterns work best
```

### Phase 3: Full Workflow Training

Combine both for best results:

1. **Days 1-3:** Supervised learning (20-30 examples)
2. **Days 4-6:** Reinforcement (score 10-15 real attempts)
3. **Day 7+:** Iterate with more complex scenarios

## 📚 Using the Training Scenarios

### Quick Start: Load Pre-Built Dataset

```bash
# Terminal 1: Start agent
npm start

# Browser: Open http://localhost:3737

# Dashboard -> Training panel -> Supervised Learning
# Copy/paste the supervised_learning array from JSON file
# Click "Train Supervised"
```

### Supervised Learning Scenarios

**15 built-in scenarios covering:**

1. Landing pages (beginner)
2. Responsive portfolios (intermediate)
3. Forms & validation (beginner)
4. Navigation menus (beginner)
5. Image galleries (intermediate)
6. Todo apps (intermediate)
7. Pricing tables (beginner)
8. Animations (intermediate)
9. Blog layouts (beginner)
10. Contact forms (beginner)
11. Timers (intermediate)
12. Dashboards (advanced)
13. Image sliders (intermediate)
14. Notifications (beginner)
15. Hero sections (beginner)

**To use:** Extract the `supervised_learning` array and train

### Reinforcement Learning Scenarios

**15 examples scoring agent attempts:**

Includes:
- ✅ High scores (0.85-0.95) for best practices
- ⚠️ Medium scores (0.65-0.80) for good but incomplete
- ❌ Low scores (0.50-0.65) for missing features

**To use:** Extract the `reinforcement_learning` array and train

### Code Generation Templates

**5 full website project examples:**

1. **Landing Page** - Tech startup site with hero + features + CTA
2. **E-commerce Product Page** - Gallery + price + buy button
3. **Blog Article** - Article + sidebar layout
4. **Admin Dashboard** - Sidebar + panels + data
5. **Documentation Site** - Nav + search + content

Each includes expected structure and keywords.

## 🎓 Training Progression

The JSON includes 5 training levels:

```
Level 1: HTML Basics (4 scenarios)
  ↓
Level 2: CSS Styling (4 scenarios)
  ↓
Level 3: Interactivity (4 scenarios)
  ↓
Level 4: Advanced Features (4 scenarios)
  ↓
Level 5: Full Applications (4 scenarios)
```

**Recommended approach:**

1. Start with Level 1 (supervised)
2. Train until 80%+ success rate
3. Move to Level 2
4. After Level 3: Use reinforcement learning
5. Levels 4-5: Mix both types

## 🔍 Quality Criteria

The JSON defines 8 quality criteria for scoring:

| Criterion | Weight | Example |
|-----------|--------|---------|
| Semantic HTML | 10% | Uses `<header>`, `<nav>`, `<main>` |
| Responsive Design | 15% | Works on mobile/tablet/desktop |
| Accessibility | 10% | Has labels, alt text, aria |
| Performance | 10% | Clean code, no memory leaks |
| User Experience | 15% | Hover states, feedback |
| Code Quality | 10% | Readable, organized structure |
| Meets Requirements | 20% | Has all requested features |
| Browser Compatibility | 10% | Works in modern browsers |

**Total Score Calculation:**
```
Score = Σ(criterion_met × criterion_weight)
Example: 0.9 × 0.2 + 0.8 × 0.15 + 1.0 × 0.1 = 0.81
```

## 💻 Example Training Session

### Setup

```bash
# Terminal 1
npm start

# Terminal 2
npm run train
```

### Training Flow

```
🎓 AI Agent Training System
Training Options:
1. Supervised Learning
2. Reinforcement Learning
3. View Agent State
4. Exit

Select: 1

📚 SUPERVISED LEARNING
Example 1:
Situation: user wants a simple landing page with hero section
Action: code

Example 2:
Situation: build a dark theme navbar
Action: code

Example 3:
Situation: create a responsive card grid
Action: code

[10 more examples...]

🧠 Training agent on 12 examples...
📚 Trained on 12 supervised examples

Example 2:
Select: 2

🎯 REINFORCEMENT LEARNING
Episode 1:
Situation: create a todo list app
Action taken: HTML form + JS to add items, no delete
Reward: 0.75 (good start but incomplete)

Episode 2:
Situation: build image gallery
Action taken: Grid layout + CSS hover + modal on click
Reward: 0.92 (excellent!)

[5 more episodes...]

✅ Reinforcement training complete!
```

### Monitor Progress

**Dashboard shows:**
- ✅ Agent learns "code" action for website prompts
- ✅ Success rate increases with each session
- ✅ Patterns emerge (e.g., "landing page" → strong pattern)
- ✅ Agent ready to generate code

## 🚀 Advanced: Custom Training Data

### Create Your Own Dataset

**Template:**

```json
{
  "supervised_learning": [
    {
      "situation": "[user prompt describing website]",
      "correctAction": "code",
      "language": "[html|css|js|html_css|html_js|html_css_js]",
      "complexity": "[beginner|intermediate|advanced]",
      "description": "[what agent should do]"
    }
  ],
  "reinforcement_learning": [
    {
      "situation": "[scenario description]",
      "agentAction": "[what agent tried]",
      "reward": [0.0-1.0],
      "feedback": "[why this score]"
    }
  ]
}
```

### Example Custom Training

```json
{
  "supervised_learning": [
    {
      "situation": "user wants a SaaS landing page with pricing",
      "correctAction": "code",
      "language": "html_css_js",
      "complexity": "intermediate",
      "description": "Create marketing site with hero, features, pricing, CTA"
    }
  ]
}
```

## 📈 Measuring Success

After training, check these metrics:

1. **Code Action Recognition**
   ```bash
   curl http://localhost:3737/api/agent/success-rate/code
   # Should see: ~90%+ success rate
   ```

2. **Agent State**
   ```bash
   curl http://localhost:3737/api/agent/state
   # Check: totalExperiences, patterns learned
   ```

3. **Manual Testing**
   ```bash
   # Test via portal:
   Action: code
   Parameters: {"prompt": "create a landing page"}
   # Agent should attempt code generation
   ```

## 🔧 Integration with Task Executor

To make code generation work in the agent, edit `src/agent/taskExecutor.js`:

```javascript
async executeCode(params) {
  const { prompt, language } = params;
  
  // Agent uses learned patterns to generate code
  const code = this.generateCodeFromPrompt(prompt, language);
  
  return {
    success: true,
    reward: 0.8,
    details: {
      prompt,
      code: code.slice(0, 500),
      language,
      estimatedQuality: this.scoreCodeQuality(code)
    }
  };
}

generateCodeFromPrompt(prompt, language) {
  // This is where the agent's learning kicks in!
  // It uses patterns from training to generate code
  
  // Example implementation:
  if (prompt.includes('landing') && prompt.includes('hero')) {
    return this.templates.landingPageHero;
  }
  if (prompt.includes('form')) {
    return this.templates.form;
  }
  // ... more patterns based on training
}
```

## 📝 Tips for Effective Training

1. **Start Simple** - Train on 5-10 basic website types first
2. **Be Specific** - "Create responsive portfolio" > "make website"
3. **Include Complexity** - Mix beginner, intermediate, advanced
4. **Score Generously** - Reward attempts, guide improvements
5. **Iterate** - Multiple training sessions compound learning
6. **Test Real Prompts** - After training, test with actual website briefs

## 🎯 What Agent Should Learn

After training, your agent should:

✅ Recognize website requests
✅ Choose "code" as the appropriate action
✅ Understand complexity levels (beginner vs advanced)
✅ Know common patterns (forms, galleries, navigation)
✅ Score code quality (responsive, accessible, semantic)
✅ Improve over time with reinforcement

## 📚 Example Workflows

### Workflow 1: Quick 30-Min Training

```bash
# 1. Load 10 supervised examples (5 min)
# 2. Do 5 reinforcement episodes (10 min)
# 3. Test with real prompts (10 min)
# 4. Refine weak areas (5 min)
```

### Workflow 2: Deep 3-Day Training

```bash
# Day 1: 15 supervised examples + 10 reinforcement
# Day 2: 10 advanced examples + 15 reinforcement
# Day 3: Full project training + real-world testing
```

### Workflow 3: Continuous Learning

```bash
# Session 1: Foundation (levels 1-2)
# Session 2: Build on foundation (levels 3-4)
# Session 3: Advanced projects (level 5)
# Session 4+: Specialized domains (e-commerce, SaaS, etc.)
```

## 🚀 Next: Deploy Your Trained Agent

Once trained, your agent can:

1. **Accept website prompts** - "Create a landing page for a startup"
2. **Generate code** - HTML/CSS/JS based on training
3. **Score its own work** - Using quality criteria
4. **Iterate** - Improve based on feedback
5. **Handle requests** - Via CLI, API, or web portal

---

**Ready to train?** Start with `npm run train` and use the scenarios provided! 🎉
