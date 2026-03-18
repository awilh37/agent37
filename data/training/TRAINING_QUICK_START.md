# 🚀 Website Coding Training - Quick Start

## What You Have

**File:** `website-training-scenarios.json`

Complete training dataset with:
- ✅ **15 Supervised Learning Examples** - Teach the agent directly
- ✅ **15 Reinforcement Learning Scenarios** - Score agent attempts
- ✅ **5 Code Generation Templates** - Full website examples
- ✅ **5 Training Levels** - Progressive complexity path
- ✅ **8 Quality Criteria** - How to score website code

---

## 🎯 The Training in 3 Steps

### Step 1: Supervised Learning (Build Foundation)

Agent learns: "When user describes a website → respond with 'code' action"

**15 Examples Included:**
1. Landing page with title & button
2. Responsive portfolio website
3. Form to collect information
4. Dark theme navigation menu
5. Interactive image gallery
6. Todo app with add/delete
7. Pricing table with tiers
8. Animated loading spinner
9. Blog page with cards
10. Contact form
11. Countdown timer
12. Weather dashboard
13. Image comparison slider
14. Notification banner
15. Hero section with overlay

**How to train:**
```bash
# Option A: Interactive CLI
npm run train
# Select: 1. Supervised Learning
# Enter each situation and "code" as action

# Option B: Web Portal
# 1. npm start
# 2. Open http://localhost:3737
# 3. Training panel → Supervised Learning
# 4. Paste the JSON array
```

### Step 2: Reinforcement Learning (Refine Quality)

Agent learns: "These patterns work well, those need improvement"

**15 Scoring Examples Included:**
- ✅ High scores (0.85-0.95) - Best practices, complete features
- ⚠️ Medium scores (0.65-0.80) - Good but missing something
- ❌ Low scores (0.50-0.65) - Missing key features

**Examples:**
- Landing page HTML only → 0.85 (good, but add CSS)
- Navbar with flexbox & hamburger → 0.95 (excellent!)
- Form without labels → 0.60 (add accessibility)
- Todo app no delete → 0.70 (add functionality)

**How to train:**
```bash
npm run train
# Select: 2. Reinforcement Learning
# Enter: situation + what agent tried + your score
```

### Step 3: Test & Validate

```bash
# Check success rate for "code" action
curl http://localhost:3737/api/agent/success-rate/code

# Test via portal:
# Action: code
# Parameters: {"prompt": "create a landing page"}
# Agent should recognize this → code action
```

---

## 📊 The 5 Training Levels

Start at Level 1, advance when achieving 80%+ success:

```
Level 1: HTML Basics
├─ Create heading & paragraph
├─ Create button element
├─ Create list of items
└─ Create HTML form with inputs

Level 2: CSS Styling
├─ Style text with colors & fonts
├─ Create box with padding & borders
├─ Build layout with flexbox
└─ Create responsive grid layout

Level 3: Interactivity
├─ Add click event handlers
├─ Toggle classes on elements
├─ Validate form inputs
└─ Manipulate DOM elements

Level 4: Advanced Features
├─ Create CSS animations
├─ Build interactive components
├─ Store data with localStorage
└─ Create fetch API calls

Level 5: Full Applications
├─ Build complete todo app
├─ Create blog with search
├─ Build e-commerce product page
└─ Create dashboard with real data
```

---

## 🔍 8 Quality Criteria

When scoring agent code, consider:

| Criterion | Weight | What to Look For |
|-----------|--------|-----------------|
| **Semantic HTML** | 10% | Uses `<header>`, `<nav>`, `<main>`, `<footer>` |
| **Responsive Design** | 15% | Works mobile/tablet/desktop with @media |
| **Accessibility** | 10% | Has labels, alt text, aria attributes |
| **Performance** | 10% | Clean code, no memory leaks |
| **User Experience** | 15% | Hover states, feedback, spinners |
| **Code Quality** | 10% | Readable, organized structure |
| **Meets Requirements** | 20% | Has ALL requested features |
| **Browser Compatibility** | 10% | Works in modern browsers |

**Scoring Example:**
```
Landing page checklist:
✓ Semantic HTML (10%) → 0.9 score = 0.09
✓ Responsive design (15%) → 0.85 score = 0.1275
✓ Meets requirements (20%) → 1.0 score = 0.20
Total: 0.09 + 0.1275 + 0.20 + ... = 0.80+
```

---

## 5️⃣ Code Generation Templates

5 complete website examples included:

### Template 1: Landing Page
```
Prompt: "Create a landing page for a tech startup"
Expected: Hero section + Features + Call-to-action
Responsive: Yes | Interactive: No
```

### Template 2: E-Commerce Product Page
```
Prompt: "Build product detail page with gallery"
Expected: Image gallery + Product info + Buy button
Responsive: Yes | Interactive: Yes
```

### Template 3: Blog Article
```
Prompt: "Create blog post with sidebar"
Expected: Article content + Sidebar
Responsive: Yes | Interactive: No
```

### Template 4: Admin Dashboard
```
Prompt: "Build admin dashboard with panels"
Expected: Sidebar nav + Header + Data panels
Responsive: Yes | Interactive: Yes
```

### Template 5: Documentation Site
```
Prompt: "Create docs site with navigation"
Expected: Sidebar nav + Main content + Search
Responsive: Yes | Interactive: Yes
```

---

## 🎯 Recommended Training Flow

### 30-Minute Quick Train
```
1. Load 10 supervised examples (5 min)
2. Do 5 reinforcement episodes (10 min)
3. Test real prompts (10 min)
4. Refine weak areas (5 min)
```

### 3-Day Deep Train
```
Day 1: 15 supervised + 10 reinforcement (levels 1-2)
Day 2: Advanced examples + 15 reinforcement (levels 3-4)
Day 3: Full projects + real-world testing (level 5)
```

### Ongoing Learning
```
Session 1: Levels 1-2 (foundation)
Session 2: Levels 3-4 (build on foundation)
Session 3+: Level 5 + specialized domains
```

---

## 💡 Pro Tips

1. **Start Simple** - Begin with 5-10 basic scenarios
2. **Mix Complexity** - Combine beginner, intermediate, advanced
3. **Be Specific** - "Responsive portfolio" > "make website"
4. **Score Fairly** - High for excellence, medium for good attempts
5. **Iterate** - Multiple sessions compound learning
6. **Test Real Prompts** - After training, try actual website briefs

---

## 📁 File Location

```
/home/awilh37/github/agent37/data/training/
├── website-training-scenarios.json     # ALL training data
├── WEBSITE_TRAINING_GUIDE.md           # Detailed guide (this file)
└── TRAINING_QUICK_START.md             # Quick reference (THIS FILE)
```

---

## 🚀 Get Started Now!

### Option 1: Interactive Training
```bash
cd /home/awilh37/github/agent37
npm start                    # Terminal 1
npm run train                # Terminal 2
```

### Option 2: Web Portal Training
```bash
npm start                    # Terminal 1
# Open http://localhost:3737
# Dashboard → Training → Supervised Learning
# Paste JSON data
```

---

## 📈 Success Metrics

After training, check:

✅ Agent recognizes "code" action for website requests
✅ Success rate: 85%+ for "code" action
✅ Patterns learned: 15+ website scenarios
✅ Can handle beginner → intermediate scenarios
✅ Scores code quality consistently

---

## 🔗 Next Steps

1. **Read Full Guide** - `WEBSITE_TRAINING_GUIDE.md`
2. **Start Training** - `npm run train`
3. **Monitor Progress** - Dashboard @ http://localhost:3737
4. **Test Real Prompts** - "Create a landing page"
5. **Iterate & Improve** - Multiple training sessions

---

**Ready? Start training your website-coding AI agent! 🎉**
