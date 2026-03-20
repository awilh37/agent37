import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENT_FILES_DIR = path.join(__dirname, '../../agentFiles');

// Ensure agentFiles directory exists
if (!fs.existsSync(AGENT_FILES_DIR)) {
  fs.mkdirSync(AGENT_FILES_DIR, { recursive: true });
}

class FileEditor {
  constructor() {
    this.baseDir = AGENT_FILES_DIR;
  }

  // Validate file path is within agentFiles directory
  validatePath(filePath) {
    const fullPath = path.resolve(path.join(this.baseDir, filePath));
    const normalized = path.normalize(fullPath);
    
    if (!normalized.startsWith(path.resolve(this.baseDir))) {
      throw new Error('Access denied: file must be in agentFiles directory');
    }
    
    return normalized;
  }

  // Read file contents
  read(filePath) {
    try {
      const fullPath = this.validatePath(filePath);
      
      if (!fs.existsSync(fullPath)) {
        return { success: false, error: 'File not found', path: filePath };
      }
      
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      return {
        success: true,
        path: filePath,
        content,
        lineCount: lines.length,
        lines: lines.map((line, idx) => ({ lineNumber: idx + 1, content: line }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Write file (overwrites entire content)
  write(filePath, content) {
    try {
      const fullPath = this.validatePath(filePath);
      
      // Create directory if needed
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
      
      return {
        success: true,
        message: 'File written successfully',
        path: filePath,
        size: content.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Append to end of file
  append(filePath, content) {
    try {
      const fullPath = this.validatePath(filePath);
      
      if (!fs.existsSync(fullPath)) {
        // Create new file if doesn't exist
        return this.write(filePath, content);
      }
      
      const existing = fs.readFileSync(fullPath, 'utf8');
      const newContent = existing + (existing.endsWith('\n') ? '' : '\n') + content;
      
      fs.writeFileSync(fullPath, newContent, 'utf8');
      
      return {
        success: true,
        message: 'Content appended successfully',
        path: filePath,
        newSize: newContent.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Insert content at specific line
  insertLine(filePath, lineNumber, content) {
    try {
      const fullPath = this.validatePath(filePath);
      
      if (!fs.existsSync(fullPath)) {
        return { success: false, error: 'File not found' };
      }
      
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const lines = fileContent.split('\n');
      
      // Validate line number
      if (lineNumber < 1 || lineNumber > lines.length + 1) {
        return { 
          success: false, 
          error: `Line number ${lineNumber} out of range (1-${lines.length + 1})`
        };
      }
      
      // Insert at specified line (1-indexed)
      lines.splice(lineNumber - 1, 0, content);
      
      const newContent = lines.join('\n');
      fs.writeFileSync(fullPath, newContent, 'utf8');
      
      return {
        success: true,
        message: `Content inserted at line ${lineNumber}`,
        path: filePath,
        lineNumber,
        totalLines: lines.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Replace line at specific line number
  replaceLine(filePath, lineNumber, content) {
    try {
      const fullPath = this.validatePath(filePath);
      
      if (!fs.existsSync(fullPath)) {
        return { success: false, error: 'File not found' };
      }
      
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const lines = fileContent.split('\n');
      
      // Validate line number
      if (lineNumber < 1 || lineNumber > lines.length) {
        return { 
          success: false, 
          error: `Line number ${lineNumber} out of range (1-${lines.length})`
        };
      }
      
      // Replace line (0-indexed in array, but 1-indexed for user)
      lines[lineNumber - 1] = content;
      
      const newContent = lines.join('\n');
      fs.writeFileSync(fullPath, newContent, 'utf8');
      
      return {
        success: true,
        message: `Line ${lineNumber} replaced`,
        path: filePath,
        lineNumber,
        totalLines: lines.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Replace multiple lines by pattern or line range
  replaceRange(filePath, startLine, endLine, content) {
    try {
      const fullPath = this.validatePath(filePath);
      
      if (!fs.existsSync(fullPath)) {
        return { success: false, error: 'File not found' };
      }
      
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const lines = fileContent.split('\n');
      
      // Validate line numbers
      if (startLine < 1 || endLine < startLine || endLine > lines.length) {
        return { 
          success: false, 
          error: `Invalid line range: ${startLine}-${endLine} (file has ${lines.length} lines)`
        };
      }
      
      // Replace range (convert to 0-indexed)
      const newLines = content.split('\n');
      lines.splice(startLine - 1, endLine - startLine + 1, ...newLines);
      
      const newContent = lines.join('\n');
      fs.writeFileSync(fullPath, newContent, 'utf8');
      
      return {
        success: true,
        message: `Lines ${startLine}-${endLine} replaced`,
        path: filePath,
        replacedLines: endLine - startLine + 1,
        totalLines: lines.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new empty file
  create(filePath) {
    try {
      const fullPath = this.validatePath(filePath);
      
      if (fs.existsSync(fullPath)) {
        return { success: false, error: 'File already exists' };
      }
      
      // Create directory if needed
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, '', 'utf8');
      
      return {
        success: true,
        message: 'File created successfully',
        path: filePath
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete file
  delete(filePath) {
    try {
      const fullPath = this.validatePath(filePath);
      
      if (!fs.existsSync(fullPath)) {
        return { success: false, error: 'File not found' };
      }
      
      fs.unlinkSync(fullPath);
      
      return {
        success: true,
        message: 'File deleted successfully',
        path: filePath
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // List files in directory
  listFiles(dirPath = '') {
    try {
      const fullPath = this.validatePath(dirPath || '.');
      
      if (!fs.existsSync(fullPath)) {
        return { success: false, error: 'Directory not found' };
      }
      
      const files = fs.readdirSync(fullPath);
      const details = files.map(file => {
        const filePath = path.join(fullPath, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          type: stats.isDirectory() ? 'directory' : 'file',
          size: stats.size,
          modified: stats.mtime.toISOString()
        };
      });
      
      return {
        success: true,
        directory: dirPath || 'agentFiles',
        count: details.length,
        files: details
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get file statistics
  getStats(filePath) {
    try {
      const fullPath = this.validatePath(filePath);
      
      if (!fs.existsSync(fullPath)) {
        return { success: false, error: 'File not found' };
      }
      
      const stats = fs.statSync(fullPath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n').length;
      
      return {
        success: true,
        path: filePath,
        size: stats.size,
        created: stats.birthtime.toISOString(),
        modified: stats.mtime.toISOString(),
        lines,
        type: stats.isDirectory() ? 'directory' : 'file'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default FileEditor;
