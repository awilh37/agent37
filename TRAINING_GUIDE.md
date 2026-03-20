# AI Agent Training Guide: File Editing & Smart Code Generation

## Overview
This guide explains how to train your AI agent to:
1. Generate smart HTML code by combining multiple components
2. Create and edit files in the `agentFiles` directory
3. Complete full workflows (parse prompt → generate code → create file)

## New Agent Capabilities

### Action Types
- **`code`**: Generate combined HTML/CSS/JS from a prompt
- **`code_file`**: Create HTML file in agentFiles with generated code
- **`file_edit`**: Perform file operations (read, write, append, insert, replace, etc.)
- **`terminal`**: Run terminal commands (existing)

### Smart Component Recognition
The agent now detects keywords in prompts and automatically combines relevant components:

| Keyword | Component | Type |
|---------|-----------|------|
| button, btn, click | Button | Interactive |
| dropdown, select, menu | Dropdown | Interactive |
| form, input, field | Form | Input |
| gallery, image, photo | Gallery | Display |
| modal, popup, dialog | Modal | Interactive |
| nav, navbar, menu, header | Navigation | Structure |
| card, box, panel | Card | Layout |
| table, data, rows | Table | Display |
| todo, task, list | Todo App | App |
| animation, animate | Animation | Effect |
| dark, theme, toggle | Dark Mode | Feature |
| footer, bottom | Footer | Structure |

**Example**: "Landing page with buttons and dropdown" → Combines Navigation + Button + Dropdown components

## Training Materials Available

### 1. Supervised Learning: `file-editing-supervised.json`
**Purpose**: Teach the agent step-by-step what to do

**Contains 20 examples:**
- Component merging scenarios
- File operations (read, write, append, insert, replace)
- Directory operations
- Complete workflow examples

**How to use:**
```bash
# In web portal, Training Panel → Supervised Learning
# Paste the examples from file-editing-supervised.json
```

### 2. Reinforcement Learning: `file-editing-reinforcement.json`
**Purpose**: Reward good behavior, penalize mistakes

**Contains 15 scenarios with rewards (0-1 scale):**
- 0.9: Perfect component merging (3+ components)
- 0.85: Good file creation with proper components
- 0.8: Correct file operations
- 0.75: Basic operations completed
- 0.5-0.6: Incomplete or partial success

**How to use:**
```bash
# In web portal, Training Panel → Reinforced Learning
# Paste the examples from file-editing-reinforcement.json
```

### 3. Testing Scenarios: `file-editing-tests.json`
**Purpose**: Validate that the agent can perform tasks correctly

**Contains 15 test cases** covering:
- Component merging (2-4 components per test)
- File creation in agentFiles
- File reading and editing
- Directory operations
- Complex workflows

**How to verify:**
```bash
# In Execution Panel, test each scenario
# Check that files are created in agentFiles/
# Verify generated code contains expected components
```

## How to Train the Agent

### Step 1: Use Supervised Learning
```json
{
  "situation": "user wants landing page with buttons and form",
  "correctAction": "code",
  "prompt": "landing page with form and button styling",
  "expected_components": ["navigation", "form", "button"],
  "feedback": "Good! Combined navigation, form, and button components."
}
```

**What to do:**
1. Go to web portal → Training Panel
2. Click "📚 Training" button
3. Select "Supervised Learning" tab
4. Copy examples from `file-editing-supervised.json`
5. Paste into textarea
6. Click "Train Supervised"

**What the agent learns:**
- Which keywords map to components
- How to combine multiple components
- Proper file operations
- Terminal commands

### Step 2: Use Reinforcement Learning
```json
{
  "situation": "generate landing page with buttons and dropdown",
  "agentAction": "code with navigation, buttons, and dropdown merged",
  "reward": 0.9,
  "feedback": "Excellent! Correctly identified and merged 3 components."
}
```

**What to do:**
1. Go to web portal → Reinforced Learning tab
2. Copy examples from `file-editing-reinforcement.json`
3. Paste into textarea
4. Click "Train Reinforced"

**What the agent learns:**
- Rewards for good component merging (0.9 = 3+ components)
- Rewards for successful file operations (0.8 = proper file use)
- Penalties for incomplete tasks (0.5 = missing components)

### Step 3: Test with Real Scenarios
```bash
# Test 1: Simple component merging
{
  "action": "code",
  "params": {"prompt": "landing page with buttons and dropdown"}
}
# Expected: HTML with navigation, buttons, and dropdown

# Test 2: File creation
{
  "action": "code_file",
  "params": {"prompt": "contact form with validation", "filename": "contact.html"}
}
# Expected: File created in agentFiles/contact.html

# Test 3: File editing
{
  "action": "file_edit",
  "params": {"action": "append", "filename": "contact.html", "content": "<footer>..."}
}
# Expected: Footer appended to file
```

## File Operations API

### File Editing Endpoint
```
POST /api/agent/file-edit
Body:
{
  "action": "read|write|append|insert|replace|replace-range|list|stats|create|delete",
  "filename": "path/to/file.html",
  "content": "optional content",
  "lineNumber": 1,
  "startLine": 1,
  "endLine": 10
}
```

### Actions Explained

| Action | Purpose | Parameters |
|--------|---------|------------|
| `read` | Read file contents | filename |
| `write` | Create/overwrite file | filename, content |
| `append` | Add content to end | filename, content |
| `insert` | Add line at position | filename, lineNumber, content |
| `replace` | Change one line | filename, lineNumber, content |
| `replace-range` | Change multiple lines | filename, startLine, endLine, content |
| `create` | Create empty file | filename |
| `delete` | Remove file | filename |
| `list` | Show directory contents | filename (use `.` for agentFiles root) |
| `stats` | Get file information | filename |

## Code Generation: Component Library

### Available Components
All components are pre-built and can be combined:

1. **Navigation** - Header menu with links
2. **Button** - Styled buttons (primary, secondary, success, danger)
3. **Dropdown** - Select menu with options
4. **Form** - Input fields with validation
5. **Gallery** - Image grid with hover effects
6. **Modal** - Popup dialog box
7. **Card** - Content container with shadow
8. **Table** - Data table with styling
9. **Todo** - Task list app with add/remove
10. **Animation** - Smooth transitions and keyframes
11. **Dark Mode** - Theme toggle with CSS variables
12. **Footer** - Page bottom section

### How Merging Works
When the agent sees multiple keywords:
1. Detects all components needed
2. Extracts CSS for each component
3. Extracts HTML markup for each component
4. Extracts JavaScript for interactivity
5. Combines into single HTML file

**Example**: "Landing page with buttons and dropdown"
```
1. Detect: ["landing"] → navigation
2. Detect: ["button"] → button component
3. Detect: ["dropdown"] → dropdown component
4. Merge: HTML header + nav + buttons + dropdown
5. Return: Complete HTML with CSS & JS
```

## Training Tips

### ✅ DO
- Train on diverse prompts (landing pages, forms, apps, etc.)
- Use keywords consistently (button, form, gallery, etc.)
- Provide positive feedback for good component combining
- Test with reinforcement learning for best results
- Use both supervised and reinforcement in combination

### ❌ DON'T
- Use vague prompts ("make something nice") - use specific keywords
- Train only on one component type - use variety
- Forget to test file operations - they're crucial
- Skip reinforcement learning - it's essential for learning
- Overload prompts - 3-4 keywords is optimal

## Expected Results After Training

### Agent Behavior Changes
**Before Training:**
- Generates only simple, single-component pages
- Doesn't understand file operations
- Can't create files in agentFiles

**After Supervised Learning:**
- Understands component keywords
- Knows file operation actions
- Can read/write files (but inconsistently)

**After Reinforcement Learning:**
- Actively combines 2-4 components per request
- Reliably creates files in correct directory
- Uses proper file operations
- Generates higher-quality merged components
- Responds with higher confidence

### Metric Improvements
- Component accuracy: 60% → 90%
- File operation success: 40% → 85%
- Multi-component pages: 20% → 80%
- Reward scores: +0.2-0.3 points

## Example Workflows

### Workflow 1: Generate & View Code
```
User: "Create a landing page with buttons and dropdown"
Agent: Detects [navigation, button, dropdown]
       Generates HTML with all 3 components
       Shows code in execution results
       Saves to execution history
```

### Workflow 2: Create File
```
User: {"action": "code_file", "params": {"prompt": "contact form with buttons"}}
Agent: Detects [form, button]
       Generates HTML
       Creates file: agentFiles/contact-form-with-buttons.html
       Returns success + file path
```

### Workflow 3: Edit File
```
User: {"action": "file_edit", "params": {"action": "append", "filename": "contact.html", "content": "<footer>..."}}
Agent: Opens file agentFiles/contact.html
       Appends footer content
       Saves file
       Returns success + updated line count
```

## Troubleshooting

### Agent Not Combining Components
**Solution**: Train with more supervised examples showing multiple keywords

### File Operations Not Working
**Solution**: Ensure training includes file_edit action examples

### Generated Code Missing Styling
**Solution**: Reinforce training with examples that reward CSS inclusion

### Files Not Saving to agentFiles
**Solution**: Check file paths use relative names (not absolute paths)

## Next Steps

1. **Start with supervised learning**: 10-15 examples
2. **Test basic functionality**: Single component generation
3. **Add reinforcement learning**: 10-15 scenarios with rewards
4. **Test file operations**: Create, read, edit files
5. **Advanced training**: Complex multi-component prompts
6. **Validation**: Run all test scenarios

## Files Reference

| File | Purpose | Format |
|------|---------|--------|
| `file-editing-supervised.json` | Supervised examples | Array of scenarios |
| `file-editing-reinforcement.json` | Reinforcement scenarios | Array with rewards |
| `file-editing-tests.json` | Test cases | Array with expected outcomes |

All files are in `data/training/` directory.

## Questions?

The agent should now be able to:
- ✅ Generate code by combining multiple components
- ✅ Create files in agentFiles/
- ✅ Edit files (append, insert, replace)
- ✅ Read file contents
- ✅ List directory contents
- ✅ Get file statistics

Happy training! 🚀
