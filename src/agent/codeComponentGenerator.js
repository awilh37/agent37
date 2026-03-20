// Code Generator with Component Recognition and Merging
// This module detects multiple components in a prompt and intelligently combines them

class CodeComponentGenerator {
  constructor() {
    this.components = {
      button: { keywords: ['button', 'btn', 'click'], type: 'interactive' },
      dropdown: { keywords: ['dropdown', 'select', 'menu'], type: 'interactive' },
      form: { keywords: ['form', 'input', 'field', 'submit'], type: 'input' },
      gallery: { keywords: ['gallery', 'image', 'photo', 'grid'], type: 'display' },
      modal: { keywords: ['modal', 'popup', 'dialog'], type: 'interactive' },
      navigation: { keywords: ['nav', 'navbar', 'menu', 'header'], type: 'structure' },
      card: { keywords: ['card', 'box', 'panel'], type: 'layout' },
      table: { keywords: ['table', 'data', 'rows'], type: 'display' },
      todo: { keywords: ['todo', 'task', 'list', 'checkbox'], type: 'app' },
      animation: { keywords: ['animation', 'animate', 'smooth', 'transition'], type: 'effect' },
      darkmode: { keywords: ['dark', 'theme', 'toggle'], type: 'feature' },
      footer: { keywords: ['footer', 'bottom'], type: 'structure' }
    };
  }

  // Detect which components are needed
  detectComponents(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const detected = [];
    
    for (const [name, info] of Object.entries(this.components)) {
      for (const keyword of info.keywords) {
        if (lowerPrompt.includes(keyword)) {
          detected.push(name);
          break; // Don't add same component twice
        }
      }
    }
    
    return detected.length > 0 ? detected : ['generic'];
  }

  // Generate combined HTML with multiple components
  generateCombined(prompt) {
    const components = this.detectComponents(prompt);
    let html = this.getHTMLHeader();
    let css = this.getBaseStyles();
    let js = '';
    
    // Add each component
    for (const component of components) {
      const { styles, markup, script } = this.getComponentCode(component, prompt);
      css += styles;
      html += markup;
      if (script) js += script;
    }
    
    // Close HTML and add script
    html += '</main>\n';
    if (js) {
      html += `<script>\n${js}\n</script>\n`;
    }
    html += '</body>\n</html>';
    
    return html;
  }

  // Get HTML header
  getHTMLHeader() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Page</title>
    <style>
`;
  }

  // Get base styles (shared by all pages)
  getBaseStyles() {
    return `        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; color: #333; }
        main { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        h1, h2, h3 { margin-bottom: 1rem; color: #667eea; }
        button { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; transition: all 0.3s; }
        button:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
`;
  }

  // Get component-specific code
  getComponentCode(component, prompt) {
    const methods = {
      button: () => this.getButtonComponent(prompt),
      dropdown: () => this.getDropdownComponent(prompt),
      form: () => this.getFormComponent(prompt),
      gallery: () => this.getGalleryComponent(prompt),
      modal: () => this.getModalComponent(prompt),
      navigation: () => this.getNavigationComponent(prompt),
      card: () => this.getCardComponent(prompt),
      table: () => this.getTableComponent(prompt),
      todo: () => this.getTodoComponent(prompt),
      animation: () => this.getAnimationComponent(prompt),
      darkmode: () => this.getDarkmodeComponent(prompt),
      footer: () => this.getFooterComponent(prompt),
      generic: () => this.getGenericComponent(prompt)
    };
    
    return methods[component] ? methods[component]() : { styles: '', markup: '', script: '' };
  }

  getButtonComponent(prompt) {
    return {
      styles: `
        .button-group { margin: 2rem 0; display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover { background: #764ba2; }
        .btn-secondary { background: #e0e0e0; color: #333; }
        .btn-secondary:hover { background: #d0d0d0; }
        .btn-success { background: #27ae60; color: white; }
        .btn-success:hover { background: #229954; }
        .btn-danger { background: #e74c3c; color: white; }
        .btn-danger:hover { background: #c0392b; }
`,
      markup: `
        <section class="button-section">
            <h2>Buttons</h2>
            <div class="button-group">
                <button class="btn-primary">Primary Action</button>
                <button class="btn-secondary">Secondary</button>
                <button class="btn-success">Success</button>
                <button class="btn-danger">Delete</button>
            </div>
        </section>
`,
      script: `
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Button clicked:', this.textContent);
            });
        });
`
    };
  }

  getDropdownComponent(prompt) {
    return {
      styles: `
        .dropdown-container { margin: 2rem 0; }
        select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; background: white; cursor: pointer; }
        select:hover { border-color: #667eea; }
        select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 5px rgba(102, 126, 234, 0.3); }
`,
      markup: `
        <section class="dropdown-container">
            <h2>Dropdown Menu</h2>
            <select>
                <option>Select an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
            </select>
        </section>
`,
      script: `
        document.querySelector('select').addEventListener('change', function() {
            console.log('Selected:', this.value);
        });
`
    };
  }

  getFormComponent(prompt) {
    return {
      styles: `
        .form-section { margin: 2rem 0; }
        form { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 500px; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        input, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
        input:focus, textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 5px rgba(102, 126, 234, 0.3); }
        textarea { resize: vertical; min-height: 100px; }
        form button { background: #667eea; color: white; width: 100%; }
        form button:hover { background: #764ba2; }
`,
      markup: `
        <section class="form-section">
            <h2>Contact Form</h2>
            <form>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" placeholder="Your name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Your email" required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" placeholder="Your message"></textarea>
                </div>
                <button type="submit">Send</button>
            </form>
        </section>
`,
      script: `
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            console.log('Form submitted:', { name, email });
            this.reset();
        });
`
    };
  }

  getGalleryComponent(prompt) {
    return {
      styles: `
        .gallery-section { margin: 2rem 0; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .gallery-item { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .gallery-item:hover { transform: scale(1.05); }
        .gallery-item img { width: 100%; height: 150px; object-fit: cover; }
        .gallery-item p { padding: 1rem; text-align: center; }
`,
      markup: `
        <section class="gallery-section">
            <h2>Image Gallery</h2>
            <div class="gallery">
                <div class="gallery-item">
                    <div style="background: #667eea; height: 150px;"></div>
                    <p>Image 1</p>
                </div>
                <div class="gallery-item">
                    <div style="background: #764ba2; height: 150px;"></div>
                    <p>Image 2</p>
                </div>
                <div class="gallery-item">
                    <div style="background: #27ae60; height: 150px;"></div>
                    <p>Image 3</p>
                </div>
                <div class="gallery-item">
                    <div style="background: #e74c3c; height: 150px;"></div>
                    <p>Image 4</p>
                </div>
            </div>
        </section>
`,
      script: ''
    };
  }

  getModalComponent(prompt) {
    return {
      styles: `
        .modal-section { margin: 2rem 0; }
        .modal-btn { background: #667eea; color: white; }
        .modal-btn:hover { background: #764ba2; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; }
        .modal.active { display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; padding: 2rem; border-radius: 8px; max-width: 500px; box-shadow: 0 8px 16px rgba(0,0,0,0.3); }
        .modal-close { float: right; cursor: pointer; font-size: 1.5rem; color: #666; }
        .modal-close:hover { color: #333; }
`,
      markup: `
        <section class="modal-section">
            <button class="modal-btn" onclick="document.getElementById('myModal').classList.add('active')">Open Modal</button>
            <div id="myModal" class="modal">
                <div class="modal-content">
                    <span class="modal-close" onclick="document.getElementById('myModal').classList.remove('active')">&times;</span>
                    <h2>Modal Title</h2>
                    <p>This is modal content.</p>
                </div>
            </div>
        </section>
`,
      script: `
        document.getElementById('myModal').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
`
    };
  }

  getNavigationComponent(prompt) {
    return {
      styles: `
        nav { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem 0; margin-bottom: 2rem; }
        .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand { color: white; font-weight: bold; font-size: 1.5rem; }
        .nav-menu { display: flex; gap: 2rem; list-style: none; }
        .nav-menu a { color: white; text-decoration: none; transition: opacity 0.3s; }
        .nav-menu a:hover { opacity: 0.8; }
        @media (max-width: 768px) { .nav-menu { flex-direction: column; gap: 1rem; } }
`,
      markup: `
        <nav>
            <div class="nav-container">
                <div class="nav-brand">Logo</div>
                <ul class="nav-menu">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
        </nav>
`,
      script: ''
    };
  }

  getCardComponent(prompt) {
    return {
      styles: `
        .card-section { margin: 2rem 0; }
        .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
        .card h3 { color: #667eea; margin-bottom: 0.5rem; }
        .card p { color: #666; line-height: 1.6; }
`,
      markup: `
        <section class="card-section">
            <h2>Card Components</h2>
            <div class="card-grid">
                <div class="card">
                    <h3>Card 1</h3>
                    <p>This is a card component with some content inside.</p>
                </div>
                <div class="card">
                    <h3>Card 2</h3>
                    <p>Cards are great for organizing content.</p>
                </div>
                <div class="card">
                    <h3>Card 3</h3>
                    <p>They create a clean, structured layout.</p>
                </div>
            </div>
        </section>
`,
      script: ''
    };
  }

  getTableComponent(prompt) {
    return {
      styles: `
        .table-section { margin: 2rem 0; }
        table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        th { background: #667eea; color: white; padding: 1rem; text-align: left; font-weight: 600; }
        td { padding: 1rem; border-bottom: 1px solid #eee; }
        tr:hover { background: #f9f9f9; }
`,
      markup: `
        <section class="table-section">
            <h2>Data Table</h2>
            <table>
                <thead>
                    <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        <th>Column 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Data 1</td>
                        <td>Data 2</td>
                        <td>Data 3</td>
                    </tr>
                    <tr>
                        <td>Data 4</td>
                        <td>Data 5</td>
                        <td>Data 6</td>
                    </tr>
                </tbody>
            </table>
        </section>
`,
      script: ''
    };
  }

  getTodoComponent(prompt) {
    return {
      styles: `
        .todo-section { margin: 2rem 0; max-width: 500px; }
        .todo-input { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .todo-input input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .todo-input button { background: #667eea; color: white; }
        .todo-list { list-style: none; }
        .todo-item { background: white; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; display: flex; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .todo-item input[type="checkbox"] { margin-right: 1rem; }
        .todo-item.done { opacity: 0.6; }
        .todo-item.done span { text-decoration: line-through; }
`,
      markup: `
        <section class="todo-section">
            <h2>Todo List</h2>
            <div class="todo-input">
                <input type="text" id="todoInput" placeholder="Add a new task...">
                <button onclick="addTodo()">Add</button>
            </div>
            <ul class="todo-list" id="todoList">
                <li class="todo-item">
                    <input type="checkbox">
                    <span>Sample task</span>
                </li>
            </ul>
        </section>
`,
      script: `
        function addTodo() {
            const input = document.getElementById('todoInput');
            if (input.value.trim()) {
                const li = document.createElement('li');
                li.className = 'todo-item';
                li.innerHTML = '<input type="checkbox"><span>' + input.value + '</span>';
                document.getElementById('todoList').appendChild(li);
                input.value = '';
            }
        }
`
    };
  }

  getAnimationComponent(prompt) {
    return {
      styles: `
        .animation-section { margin: 2rem 0; display: flex; gap: 2rem; flex-wrap: wrap; }
        .animated-box { width: 100px; height: 100px; background: #667eea; border-radius: 4px; animation: slideIn 1s ease-in-out; }
        @keyframes slideIn { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .bounce { animation: bounce 1s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
`,
      markup: `
        <section class="animation-section">
            <h2 style="width: 100%;">Animations</h2>
            <div class="animated-box"></div>
            <div class="animated-box pulse"></div>
            <div class="animated-box bounce"></div>
        </section>
`,
      script: ''
    };
  }

  getDarkmodeComponent(prompt) {
    return {
      styles: `
        .darkmode-toggle { margin: 1rem 0; }
        .toggle-btn { background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        body.dark-mode { background: #1a1a1a; color: #e0e0e0; }
        body.dark-mode main { background: #1a1a1a; }
        body.dark-mode .card { background: #2a2a2a; color: #e0e0e0; }
        body.dark-mode .form-section form { background: #2a2a2a; }
        body.dark-mode input, body.dark-mode textarea, body.dark-mode select { background: #333; color: #e0e0e0; border-color: #444; }
`,
      markup: `
        <section class="darkmode-toggle">
            <button class="toggle-btn" onclick="toggleDarkMode()">🌙 Toggle Dark Mode</button>
        </section>
`,
      script: `
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        }
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
`
    };
  }

  getFooterComponent(prompt) {
    return {
      styles: `
        footer { background: #333; color: white; padding: 2rem; margin-top: 3rem; text-align: center; }
        footer a { color: #667eea; text-decoration: none; }
        footer a:hover { text-decoration: underline; }
`,
      markup: `
        <footer>
            <p>&copy; 2026 Generated by AI Agent. All rights reserved.</p>
            <p><a href="#privacy">Privacy</a> | <a href="#terms">Terms</a> | <a href="#contact">Contact</a></p>
        </footer>
`,
      script: ''
    };
  }

  getGenericComponent(prompt) {
    return {
      styles: `
        .content-section { margin: 2rem 0; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
`,
      markup: `
        <section class="content-section">
            <h2>Welcome</h2>
            <p>This is a generated page based on your request.</p>
        </section>
`,
      script: ''
    };
  }
}

export default CodeComponentGenerator;
