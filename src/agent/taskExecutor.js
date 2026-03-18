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
      const prompt = params.prompt || params.code || '';
      
      if (!prompt) {
        return { 
          success: false, 
          reward: -0.5, 
          details: 'No prompt or code specified',
          generatedCode: null
        };
      }

      // Generate HTML/CSS/JS based on prompt
      const generatedCode = this.generateCodeFromPrompt(prompt);
      
      return {
        success: true,
        reward: 0.7,
        details: {
          prompt: prompt,
          language: 'html',
          codeLength: generatedCode.length,
          note: 'Generated based on prompt'
        },
        generatedCode: generatedCode
      };
    } catch (error) {
      return { 
        success: false, 
        reward: -0.3, 
        details: error.message,
        generatedCode: null
      };
    }
  }

  generateCodeFromPrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Detect what type of code to generate
    if (lowerPrompt.includes('landing') || lowerPrompt.includes('page')) {
      return this.generateLandingPage(prompt);
    } else if (lowerPrompt.includes('form') || lowerPrompt.includes('signup')) {
      return this.generateForm(prompt);
    } else if (lowerPrompt.includes('gallery') || lowerPrompt.includes('image')) {
      return this.generateGallery(prompt);
    } else if (lowerPrompt.includes('todo') || lowerPrompt.includes('list')) {
      return this.generateTodoApp(prompt);
    } else if (lowerPrompt.includes('nav') || lowerPrompt.includes('menu')) {
      return this.generateNavigation(prompt);
    } else if (lowerPrompt.includes('card')) {
      return this.generateCards(prompt);
    } else if (lowerPrompt.includes('button')) {
      return this.generateButton(prompt);
    }
    
    // Default: generate generic HTML
    return this.generateGenericHTML(prompt);
  }

  generateLandingPage(prompt) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .tagline { font-size: 1.1rem; opacity: 0.9; }
        
        .hero { padding: 3rem; text-align: center; background: #f8f9fa; }
        .cta-button { background: #667eea; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; margin-top: 1rem; }
        .cta-button:hover { background: #764ba2; }
        
        footer { background: #333; color: white; text-align: center; padding: 1rem; margin-top: 2rem; }
    </style>
</head>
<body>
    <header>
        <h1>Welcome</h1>
        <p class="tagline">This is a beautiful landing page</p>
    </header>
    
    <section class="hero">
        <h2>Discover Amazing Features</h2>
        <p>Built with clean, semantic HTML and modern CSS</p>
        <button class="cta-button">Get Started</button>
    </section>
    
    <footer>
        <p>&copy; 2026 AI Generated. All rights reserved.</p>
    </footer>
</body>
</html>`;
  }

  generateForm(prompt) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up Form</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f0f0f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        
        .form-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        h2 { margin-bottom: 1.5rem; color: #333; text-align: center; }
        
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; color: #555; font-weight: bold; }
        input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
        input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 5px rgba(102, 126, 234, 0.1); }
        
        button { width: 100%; background: #667eea; color: white; padding: 0.75rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; margin-top: 1rem; }
        button:hover { background: #764ba2; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>User Sign Up</h2>
        <form onsubmit="handleSubmit(event)">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit">Sign Up</button>
        </form>
    </div>
    
    <script>
        function handleSubmit(event) {
            event.preventDefault();
            alert('Form submitted! (This is a demo)');
        }
    </script>
</body>
</html>`;
  }

  generateGallery(prompt) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Gallery</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 2rem; }
        
        h1 { text-align: center; margin-bottom: 2rem; color: #333; }
        
        .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        
        .gallery-item { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s; cursor: pointer; }
        .gallery-item:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        
        .gallery-item img { width: 100%; height: 200px; object-fit: cover; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        
        .gallery-info { padding: 1rem; }
        .gallery-info h3 { color: #333; margin-bottom: 0.5rem; }
        .gallery-info p { color: #666; font-size: 0.9rem; }
    </style>
</head>
<body>
    <h1>Image Gallery</h1>
    
    <div class="gallery">
        <div class="gallery-item">
            <div class="gallery-item img"></div>
            <div class="gallery-info">
                <h3>Image 1</h3>
                <p>Beautiful landscape</p>
            </div>
        </div>
        
        <div class="gallery-item">
            <div class="gallery-item img"></div>
            <div class="gallery-info">
                <h3>Image 2</h3>
                <p>Stunning design</p>
            </div>
        </div>
        
        <div class="gallery-item">
            <div class="gallery-item img"></div>
            <div class="gallery-info">
                <h3>Image 3</h3>
                <p>Amazing view</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  generateTodoApp(prompt) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 1rem; }
        
        .todo-container { background: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 100%; max-width: 500px; padding: 2rem; }
        
        h1 { color: #333; margin-bottom: 1.5rem; text-align: center; }
        
        .input-group { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
        input { flex: 1; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #764ba2; }
        
        .todo-list { list-style: none; }
        .todo-item { padding: 1rem; background: #f9f9f9; border-left: 4px solid #667eea; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; border-radius: 4px; }
        .delete-btn { color: #e74c3c; cursor: pointer; padding: 0.5rem; }
    </style>
</head>
<body>
    <div class="todo-container">
        <h1>My Todo List</h1>
        
        <div class="input-group">
            <input type="text" id="todoInput" placeholder="Add a new task...">
            <button onclick="addTodo()">Add</button>
        </div>
        
        <ul class="todo-list" id="todoList"></ul>
    </div>
    
    <script>
        function addTodo() {
            const input = document.getElementById('todoInput');
            if (input.value.trim()) {
                const li = document.createElement('li');
                li.className = 'todo-item';
                li.innerHTML = '<span>' + input.value + '</span><span class="delete-btn" onclick="this.parentElement.remove()">✕</span>';
                document.getElementById('todoList').appendChild(li);
                input.value = '';
            }
        }
    </script>
</body>
</html>`;
  }

  generateNavigation(prompt) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navigation Menu</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; }
        
        nav { background: #333; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { color: white; font-weight: bold; font-size: 1.5rem; }
        
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: white; text-decoration: none; transition: color 0.3s; }
        .nav-links a:hover { color: #667eea; }
        
        .hamburger { display: none; color: white; cursor: pointer; font-size: 1.5rem; }
        
        main { padding: 2rem; }
        
        @media (max-width: 768px) {
            .nav-links { display: none; }
            .hamburger { display: block; }
        }
    </style>
</head>
<body>
    <nav>
        <div class="logo">MyBrand</div>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <div class="hamburger" onclick="toggleMenu()">☰</div>
    </nav>
    
    <main>
        <h1>Welcome to the Navigation Demo</h1>
        <p>This page features a responsive navigation menu that adapts to mobile devices.</p>
    </main>
    
    <script>
        function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        }
    </script>
</body>
</html>`;
  }

  generateCards(prompt) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Layout</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 2rem; }
        
        h1 { text-align: center; margin-bottom: 2rem; color: #333; }
        
        .cards-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        
        .card { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        
        .card-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 120px; }
        
        .card-content { padding: 1.5rem; }
        .card-content h3 { color: #333; margin-bottom: 0.5rem; }
        .card-content p { color: #666; line-height: 1.5; }
        
        .card-footer { padding: 1rem 1.5rem; background: #f9f9f9; border-top: 1px solid #eee; }
        .card-footer button { background: #667eea; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Featured Cards</h1>
    
    <div class="cards-container">
        <div class="card">
            <div class="card-header"></div>
            <div class="card-content">
                <h3>Card 1</h3>
                <p>This is a beautiful card component with clean design and hover effects.</p>
            </div>
            <div class="card-footer">
                <button>Learn More</button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header"></div>
            <div class="card-content">
                <h3>Card 2</h3>
                <p>Perfect for showcasing products, services, or any content blocks.</p>
            </div>
            <div class="card-footer">
                <button>Learn More</button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header"></div>
            <div class="card-content">
                <h3>Card 3</h3>
                <p>Responsive layout adapts beautifully to all screen sizes.</p>
            </div>
            <div class="card-footer">
                <button>Learn More</button>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  generateButton(prompt) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buttons</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 2rem; background: #f5f5f5; }
        h1 { margin-bottom: 2rem; color: #333; }
        
        .button-group { margin: 1rem 0; }
        button { padding: 10px 20px; margin: 0.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; transition: all 0.3s; }
        
        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover { background: #764ba2; }
        
        .btn-secondary { background: #e0e0e0; color: #333; }
        .btn-secondary:hover { background: #d0d0d0; }
        
        .btn-success { background: #27ae60; color: white; }
        .btn-success:hover { background: #229954; }
        
        .btn-danger { background: #e74c3c; color: white; }
        .btn-danger:hover { background: #c0392b; }
    </style>
</head>
<body>
    <h1>Button Styles</h1>
    
    <div class="button-group">
        <button class="btn-primary">Primary Button</button>
        <button class="btn-secondary">Secondary Button</button>
        <button class="btn-success">Success Button</button>
        <button class="btn-danger">Danger Button</button>
    </div>
</body>
</html>`;
  }

  generateGenericHTML(prompt) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 1rem; }
        
        .container { text-align: center; background: rgba(0,0,0,0.2); padding: 3rem; border-radius: 8px; max-width: 600px; }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem; }
        button { background: white; color: #667eea; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        button:hover { background: #f0f0f0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${prompt}</h1>
        <p>This is a dynamically generated page based on your request.</p>
        <button onclick="alert('Button clicked!')">Click Me</button>
    </div>
</body>
</html>`;
  }
}
