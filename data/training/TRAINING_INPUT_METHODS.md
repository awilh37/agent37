# 📖 Training Input Methods - Quick Guide

## Two Ways to Train Your Agent

Your agent now supports **two different input methods** for training data in both the web portal and CLI trainer.

---

## 1️⃣ Web Portal (Port 3737)

### Method: Direct JSON Paste

**The Problem You Had:**
- You pasted 5 scenarios without brackets
- Got error: "Parse Error: Unexpected non-whitespace character..."

**The Solution:**
The web portal now **automatically wraps your objects in brackets**.

### How to Use (Web Portal)

1. **Open the dashboard:** http://localhost:3737
2. **Click on "Training" tab**
3. **Go to "Supervised Learning" section**
4. **Paste raw JSON objects** (with OR without brackets):

#### Option A: Paste as individual objects (NO brackets needed)
```json
{
  "situation": "user wants a landing page",
  "correctAction": "code",
  "language": "html",
  "complexity": "beginner"
},
{
  "situation": "user wants a form",
  "correctAction": "code",
  "language": "html_css",
  "complexity": "beginner"
},
{
  "situation": "user wants a gallery",
  "correctAction": "code",
  "language": "html_css_js",
  "complexity": "intermediate"
}
```

#### Option B: Paste as array (WITH brackets)
```json
[
  {
    "situation": "user wants a landing page",
    "correctAction": "code",
    "language": "html"
  },
  {
    "situation": "user wants a form",
    "correctAction": "code",
    "language": "html_css"
  }
]
```

**Both formats work!** The portal auto-detects and converts as needed. ✅

### Step-by-Step for Your 5 Scenarios

1. Open http://localhost:3737
2. Scroll to "Supervised Learning" section
3. Copy-paste this into the text box:

```json
{
  "situation": "user wants a simple landing page with title and button",
  "correctAction": "code",
  "language": "html",
  "complexity": "beginner",
  "description": "Create minimal landing page"
},
{
  "situation": "user wants a responsive portfolio website",
  "correctAction": "code",
  "language": "html_css_js",
  "complexity": "intermediate",
  "description": "Build portfolio with multiple sections"
},
{
  "situation": "user wants a form to collect user information",
  "correctAction": "code",
  "language": "html",
  "complexity": "beginner",
  "description": "Create HTML form with validation"
},
{
  "situation": "user wants a dark theme navigation menu",
  "correctAction": "code",
  "language": "html_css",
  "complexity": "beginner",
  "description": "Build responsive navbar"
},
{
  "situation": "user wants an interactive image gallery",
  "correctAction": "code",
  "language": "html_css_js",
  "complexity": "intermediate",
  "description": "Create gallery with lightbox"
}
```

4. Click "Train"
5. ✅ Success! Message appears: "Supervised training completed"

---

## 2️⃣ CLI Trainer (Terminal)

### Two Input Methods Available

**Before:** Only interactive Q&A (type each answer one-by-one)  
**Now:** Choose between interactive OR bulk JSON paste

### How to Use (CLI Terminal)

1. **Start training:**
   ```bash
   npm run train
   ```

2. **Select Supervised Learning:**
   ```
   Training Options:
   1. Supervised Learning (teach specific behaviors)
   2. Reinforcement Learning (reward/punish actions)
   3. View Agent State
   4. Exit
   
   Select option (1-4): 1
   ```

3. **Choose your input method:**
   ```
   📚 SUPERVISED LEARNING
   Teach the agent by providing (situation, correct action) pairs.
   
   Choose input method:
   1. Answer questions (interactive)
   2. Paste JSON array (bulk)
   
   Select method (1 or 2): 
   ```

### Option 1: Interactive Q&A

**Choose "1" for interactive mode**

```
Select method (1 or 2): 1

--- Example 1 ---
Describe the situation: user wants a landing page
What should the agent do? create code
✓ Example added

Add another example? (y/n): n

🧠 Training agent on 1 examples...
✅ Supervised training complete!
```

**Pros:** Easy, guided one-at-a-time  
**Cons:** Slow for many examples (one per prompt)

---

### Option 2: Bulk JSON Paste (NEW!)

**Choose "2" for JSON input mode**

```
Select method (1 or 2): 2

📋 JSON Input Mode
Paste your JSON array of scenarios. You can:
  - Paste individual objects: { ... }, { ... }, ...
  - Paste an array: [ { ... }, { ... } ]
  - End input with an empty line
```

Then paste your JSON:

```json
{
  "situation": "user wants a landing page",
  "correctAction": "code"
},
{
  "situation": "user wants a form",
  "correctAction": "code"
},
{
  "situation": "user wants a gallery",
  "correctAction": "code"
}
```

Press **Enter twice** (once to finish typing, once empty line to end input):

```
📊 Loaded 3 examples

🧠 Training agent on 3 examples...
✅ Supervised training complete!
```

**Pros:** Fast, load many examples at once  
**Cons:** Requires valid JSON syntax

---

## 🎯 Quick Comparison

| Feature | Web Portal | CLI Interactive | CLI JSON Bulk |
|---------|-----------|-----------------|---------------|
| Speed | Medium | Slow | Fast ✅ |
| Ease | Easy | Easy | Medium |
| Batch Size | One paste | One per prompt | Multiple |
| JSON Brackets | Auto-wrapped | N/A | Both formats |
| Visual Feedback | Dashboard | Terminal | Terminal |
| Copy-Paste Friendly | ✅ Yes | Limited | ✅ Yes |

---

## 📝 JSON Format Reference

### For Supervised Learning

```json
{
  "situation": "user describes what they want",
  "correctAction": "what the agent should do",
  "language": "html or html_css or html_css_js",
  "complexity": "beginner or intermediate or advanced",
  "description": "brief description"
}
```

**Required fields:** `situation`, `correctAction`  
**Optional fields:** `language`, `complexity`, `description`

### For Reinforcement Learning

```json
{
  "state": "what the situation was",
  "action": "what the agent tried to do",
  "reward": 0.8
}
```

**Required fields:** `state`, `action`, `reward`  
**Reward range:** -1 to 1

---

## ❓ Common Questions

**Q: I keep getting "Parse Error" on the web portal**  
A: Try the following:
1. Make sure you're pasting valid JSON (check syntax)
2. You don't need brackets `[...]` anymore - the portal adds them
3. Try pasting one object first to test

**Q: Can I use both methods?**  
A: Absolutely! Use whichever is most convenient:
- Web portal for quick testing
- CLI JSON bulk for large training sets

**Q: How do I get JSON from my training file?**  
A: Open `data/training/website-training-scenarios.json`:
1. Find the `supervised_learning` array
2. Copy any scenarios you want
3. Paste directly into web portal or CLI

**Q: What if I mix formats (some with brackets, some without)?**  
A: The system auto-detects. Just paste and it works!

---

## 🚀 Recommended Workflow

### For Quick Testing
```
1. npm start (Terminal 1)
2. Open http://localhost:3737
3. Paste 3-5 scenarios
4. Click "Train" - watch dashboard update
5. See results in real-time!
```

### For Bulk Training
```
1. npm start (Terminal 1)
2. npm run train (Terminal 2)
3. Select: 1 (Supervised Learning)
4. Select: 2 (Paste JSON array)
5. Copy-paste 20+ scenarios at once
6. Press Enter twice to finish
7. Watch training complete!
```

### For Mixed Training
```
1. Use web portal for supervised examples (visual feedback)
2. Use CLI for reinforcement learning (batch scores)
3. Monitor dashboard for overall progress
```

---

## 🎓 Training Tips

1. **Start Small:** Test with 3-5 examples first
2. **Check Format:** Ensure valid JSON before submitting
3. **Use Dashboard:** Monitor success rates in real-time
4. **Mix Methods:** Combine web and CLI for best results
5. **Iterate:** Train multiple times, each session improves

---

## ✅ What Works Now

✅ Web portal accepts both formats automatically  
✅ CLI offers interactive and JSON bulk options  
✅ Both handle mixed brackets gracefully  
✅ Error messages are clear  
✅ No more "Parse Error" surprises!

---

**Everything is ready to go. Pick your method and start training!** 🎉
