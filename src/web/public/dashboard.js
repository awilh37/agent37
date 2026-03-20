// Global state
let executionState = {};
let historyData = [];
let currentExecutionId = null;
let executionRefreshInterval = null;

// Initialize
window.addEventListener('load', () => {
    initializeDashboard();
    setInterval(refreshDashboard, 2000);
    setupExecutionRefresh();
});

// ==================== INITIALIZATION ====================

async function initializeDashboard() {
    await refreshDashboard();
    await loadFullExecutionHistory();
    setupEventListeners();
}

function setupEventListeners() {
    // Modal close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllPanels();
    });
}

// ==================== EXECUTION REFRESH ====================

function setupExecutionRefresh() {
    // Faster refresh (every 500ms) during execution for real-time updates
    setInterval(() => {
        if (currentExecutionId) {
            fetchExecutionDetails(currentExecutionId);
        }
    }, 500);
}

async function fetchExecutionDetails(execId) {
    try {
        const response = await fetch(`/api/agent/execution/${execId}`);
        if (response.ok) {
            const execution = await response.json();
            updateExecutionDisplay(execution);
        }
    } catch (error) {
        console.error('Error fetching execution details:', error);
    }
}

// ==================== REFRESH DATA ====================

async function loadFullExecutionHistory(limit = 50, offset = 0) {
    try {
        const response = await fetch(`/api/agent/execution-log?limit=${limit}&offset=${offset}`);
        if (response.ok) {
            const data = await response.json();
            historyData = data.executions || [];
            updateHistoryDisplay(historyData);
            updateHistoryCount(data.total);
        }
    } catch (error) {
        console.error('Error loading execution history:', error);
    }
}

function updateHistoryCount(total) {
    const countEl = document.getElementById('history-count');
    if (countEl) {
        countEl.textContent = `Total Executions: ${total}`;
    }
}

function updateExecutionDisplay(execution) {
    // Update live during execution
    const statusEl = document.getElementById('exec-status');
    const outputEl = document.getElementById('exec-output');
    
    if (execution.result.generatedCode) {
        outputEl.innerHTML = `<pre>${escapeHtml(execution.result.generatedCode)}</pre>`;
    }
    
    statusEl.textContent = execution.result.success ? 
        `✅ Task Executed Successfully (${execution.action})` :
        `❌ Task Failed (${execution.action})`;
}

async function refreshDashboard() {
    try {
        const state = await fetch('/api/agent/state').then(r => r.json());
        const history = await fetch('/api/training/history').then(r => r.json());
        const brain = await fetch('/api/agent/brain-stats').then(r => r.json());

        updateAgentStatus(state);
        updateStats(history, brain);
        updateSuccessRates(history);
        updateLastUpdate();
    } catch (error) {
        console.error('Failed to refresh dashboard:', error);
    }
}

function updateAgentStatus(state) {
    document.getElementById('agent-id').textContent = `Agent ID: ${state.id.slice(0, 8)}`;
    document.getElementById('uptime').textContent = `Uptime: ${formatUptime(state.uptime)}`;
}

function updateStats(history, brain) {
    document.getElementById('total-experiences').textContent = history.totalExperiences || 0;
    document.getElementById('patterns-learned').textContent = history.patterns || 0;
    document.getElementById('trained-examples').textContent = brain.trainedExamples || 0;

    // Calculate average success rate
    const rates = Object.values(history.successRates || {}).map(r => parseFloat(r) || 0);
    const avgRate = rates.length > 0 ? (rates.reduce((a, b) => a + b) / rates.length).toFixed(1) : 0;
    document.getElementById('avg-success').textContent = `${avgRate}%`;
}

function updateSuccessRates(history) {
    const container = document.getElementById('success-rates-container');
    container.innerHTML = '';

    Object.entries(history.successRates || {}).forEach(([action, rate]) => {
        const html = `
            <div class="rate-item">
                <div class="rate-action">🎯 ${action}</div>
                <div class="rate-bar">
                    <div class="rate-fill" style="width: ${rate}%">
                        ${parseFloat(rate).toFixed(0)}%
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function updateLastUpdate() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    document.getElementById('last-update').textContent = time;
}

// ==================== MODAL MANAGEMENT ====================

function openPanel(panel) {
    closeAllPanels();
    document.getElementById(`${panel}-panel`).classList.add('active');
    document.getElementById('modal-overlay').classList.add('active');
}

function closePanel(panel) {
    document.getElementById(`${panel}-panel`).classList.remove('active');
    if (!hasOpenPanels()) {
        document.getElementById('modal-overlay').classList.remove('active');
    }
}

function closeAllPanels() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.getElementById('modal-overlay').classList.remove('active');
}

function hasOpenPanels() {
    return document.querySelectorAll('.modal.active').length > 0;
}

// ==================== TABS ====================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// ==================== TRAINING ====================

async function trainSupervised() {
    const dataText = document.getElementById('supervised-data').value.trim();
    
    if (!dataText) {
        showError('supervised', 'Please paste training data');
        return;
    }

    try {
        const progress = document.querySelector('#supervised .progress-bar');
        progress.classList.add('active');

        let data = JSON.parse(dataText);
        if (!Array.isArray(data)) {
            // Auto-wrap in array if needed
            data = '[' + dataText + ']';
            data = JSON.parse(data);
        }

        const response = await fetch('/api/agent/train', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'supervised', data })
        });

        const result = await response.json();

        if (response.ok) {
            showSuccess('supervised', `✅ Trained on ${data.length} examples!`);
            document.getElementById('supervised-data').value = '';
            await new Promise(r => setTimeout(r, 1000));
            await refreshDashboard();
        } else {
            showError('supervised', result.error || 'Training failed');
        }

        progress.classList.remove('active');
    } catch (error) {
        showError('supervised', 'JSON Parse Error: ' + error.message);
    }
}

async function trainReinforced() {
    const dataText = document.getElementById('reinforced-data').value.trim();
    
    if (!dataText) {
        showError('reinforced', 'Please paste training data');
        return;
    }

    try {
        const progress = document.querySelector('#reinforced .progress-bar');
        progress.classList.add('active');

        let data = JSON.parse(dataText);
        if (!Array.isArray(data)) {
            data = '[' + dataText + ']';
            data = JSON.parse(data);
        }

        const response = await fetch('/api/agent/train', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'reinforced', data })
        });

        const result = await response.json();

        if (response.ok) {
            showSuccess('reinforced', `✅ Reinforced training on ${data.length} episodes!`);
            document.getElementById('reinforced-data').value = '';
            await new Promise(r => setTimeout(r, 1000));
            await refreshDashboard();
        } else {
            showError('reinforced', result.error || 'Training failed');
        }

        progress.classList.remove('active');
    } catch (error) {
        showError('reinforced', 'JSON Parse Error: ' + error.message);
    }
}

function showError(type, message) {
    const resultBox = document.querySelector(`#${type} .result-box`) || 
                     document.getElementById(type + '-result');
    if (resultBox) {
        resultBox.textContent = '❌ ' + message;
        resultBox.className = 'result-box show error';
    }
}

function showSuccess(type, message) {
    const resultBox = document.querySelector(`#${type} .result-box`) || 
                     document.getElementById(type + '-result');
    if (resultBox) {
        resultBox.textContent = message;
        resultBox.className = 'result-box show success';
    }
}

// ==================== TASK EXECUTION ====================

function updateActionHelp() {
    const action = document.getElementById('task-action').value;
    const help = document.getElementById('action-help');
    
    const examples = {
        'code': '{"prompt": "create a landing page"} or {"prompt": "build a todo app"}',
        'terminal': '{"command": "npm --version"}',
        'web': '{"url": "https://example.com", "action": "fetch"}',
        'learn': '{"topic": "web development"}'
    };
    
    help.textContent = examples[action] || 'Select an action type to see examples';
}

function executeTask() {
    const action = document.getElementById('task-action').value;
    
    if (!action) {
        alert('Please select an action type');
        return;
    }

    try {
        const paramsText = document.getElementById('task-params').value;
        const params = paramsText ? JSON.parse(paramsText) : {};

        // Show confirmation
        showConfirmation(action, params);
    } catch (error) {
        document.getElementById('execution-error').textContent = '❌ JSON Parse Error: ' + error.message;
        document.getElementById('execution-error').classList.add('show');
    }
}

function showConfirmation(action, params) {
    executionState = { action, params };
    
    const confirmDialog = document.getElementById('confirmation-dialog');
    const taskType = {
        'code': '💻 Code Generation',
        'terminal': '🖥️ Terminal Command',
        'web': '🌐 Web Fetch',
        'learn': '📚 Learning'
    };

    document.getElementById('confirm-task-type').textContent = `${taskType[action] || action}`;
    document.getElementById('confirm-message').textContent = 
        `Execute ${taskType[action] || action} with these parameters?\n${JSON.stringify(params, null, 2)}`;
    
    confirmDialog.style.display = 'block';
}

async function confirmExecution() {
    document.getElementById('confirmation-dialog').style.display = 'none';
    
    const { action, params } = executionState;
    
    try {
        // Show executing status
        document.getElementById('exec-status').textContent = `⏳ Executing ${action}...`;
        document.getElementById('execution-results').classList.add('show');
        document.getElementById('execution-error').classList.remove('show');
        
        const startTime = Date.now();
        const response = await fetch('/api/agent/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, params })
        });

        const result = await response.json();
        const executionTime = Date.now() - startTime;

        // Track execution ID for real-time updates
        if (result.taskId) {
            currentExecutionId = result.taskId;
        }

        if (response.ok && result.result.success) {
            displayExecutionResults(result.result, executionTime, action, result.taskId);
            addToHistory(action, result.result, true, executionTime);
        } else {
            displayExecutionError(result.result || result.error);
            addToHistory(action, result.result, false, executionTime);
        }

        // Reload history to show new execution
        setTimeout(() => {
            loadFullExecutionHistory();
        }, 500);
        
        await refreshDashboard();
    } catch (error) {
        displayExecutionError(error.message);
        addToHistory(action, { error: error.message }, false, 0);
    }
}

function cancelExecution() {
    document.getElementById('confirmation-dialog').style.display = 'none';
}

function displayExecutionResults(result, time, action, taskId) {
    const resultsSection = document.getElementById('execution-results');
    
    // Status
    document.getElementById('exec-status').textContent = 
        `✅ Task Executed Successfully (${action})`;
    
    // Output - handle generated code specially
    const outputBox = document.getElementById('exec-output');
    if (result.generatedCode) {
        // Show code with syntax highlighting
        outputBox.innerHTML = `<pre><code>${escapeHtml(result.generatedCode)}</code></pre>`;
    } else if (result.details) {
        outputBox.textContent = JSON.stringify(result.details, null, 2);
    } else {
        outputBox.textContent = 'Task completed';
    }
    
    // Timing and details
    document.getElementById('exec-timing').innerHTML = `
        ⏱️ Execution Time: ${time}ms<br>
        🎯 Confidence: ${(result.confidence * 100).toFixed(1) || 'N/A'}%<br>
        💰 Reward: ${(result.reward || 0).toFixed(2)}<br>
        ${taskId ? `<br>📋 Task ID: <code style="font-size: 0.9rem;">${taskId}</code>` : ''}
    `;
    
    // Add view in history link
    if (taskId) {
        const linkEl = document.createElement('button');
        linkEl.className = 'btn btn-small';
        linkEl.textContent = '📋 View in History';
        linkEl.onclick = () => {
            openPanel('history');
            setTimeout(() => {
                const histItem = document.querySelector(`[data-task-id="${taskId}"]`);
                if (histItem) histItem.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };
        document.getElementById('exec-timing').appendChild(linkEl);
    }
    
    resultsSection.classList.add('show');
    document.getElementById('execution-error').classList.remove('show');
}

function displayExecutionError(error) {
    const errorBox = document.getElementById('execution-error');
    errorBox.textContent = '❌ Execution Failed: ' + (error.message || error);
    errorBox.classList.add('show');
    document.getElementById('execution-results').classList.remove('show');
}

function addToHistory(action, result, success, time) {
    historyData.unshift({
        action,
        success,
        result: result.details || result.error || 'Completed',
        time: new Date().toLocaleTimeString(),
        executionTime: time
    });
    
    // Keep last 50 items
    if (historyData.length > 50) historyData.pop();
}

function filterHistory() {
    // Placeholder for history filtering
    const filter = document.getElementById('history-filter').value.toLowerCase();
    updateHistoryDisplay(historyData.filter(item => 
        item.action.includes(filter)
    ));
}

function updateHistoryDisplay(items) {
    const list = document.getElementById('history-list');
    if (items.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No history yet</p>';
        return;
    }

    list.innerHTML = items.map((item, idx) => {
        const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : item.time;
        const resultText = typeof item.result === 'object' 
            ? JSON.stringify(item.result).substring(0, 100) 
            : String(item.result).substring(0, 100);
        
        return `
            <div class="history-item" data-task-id="${item.id || ''}" onclick="viewExecutionDetails('${item.id || idx}')">
                <div class="history-header">
                    <span class="history-action">🎯 ${item.action}</span>
                    <span class="history-time">${timestamp}</span>
                </div>
                <div class="history-result ${item.result?.success || item.success ? 'success' : 'failure'}">
                    ${item.result?.success || item.success ? '✅' : '❌'} 
                    ${resultText}${resultText.length >= 100 ? '...' : ''}
                </div>
                <div class="history-time" style="margin-top: 0.5rem;">
                    ⏱️ ${item.result?.duration || item.executionTime || 0}ms
                    ${item.result?.reward !== undefined ? ` | 💰 ${item.result.reward.toFixed(2)}` : ''}
                </div>
                <div style="margin-top: 0.5rem;">
                    <small style="color: #aaa;">Click to view full details</small>
                </div>
            </div>
        `;
    }).join('');
}

async function viewExecutionDetails(executionId) {
    try {
        const execution = await fetch(`/api/agent/execution/${executionId}`).then(r => r.json());
        showExecutionModal(execution);
    } catch (error) {
        alert('Error loading execution details: ' + error.message);
    }
}

function showExecutionModal(execution) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.zIndex = '2000';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90%; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="this.parentElement.parentElement.style.display='none'">&times;</span>
            <h2>Execution Details</h2>
            
            <div style="margin: 1rem 0;">
                <h3>📋 Task Info</h3>
                <p><strong>ID:</strong> <code>${execution.id}</code></p>
                <p><strong>Action:</strong> ${execution.action}</p>
                <p><strong>Timestamp:</strong> ${new Date(execution.timestamp).toLocaleString()}</p>
                <p><strong>Status:</strong> ${execution.result.success ? '✅ Success' : '❌ Failed'}</p>
            </div>
            
            <div style="margin: 1rem 0;">
                <h3>📊 Metrics</h3>
                <p><strong>Execution Time:</strong> ${execution.result.duration}ms</p>
                <p><strong>Reward:</strong> ${execution.result.reward?.toFixed(2) || 'N/A'}</p>
                <p><strong>Confidence:</strong> ${execution.confidence ? (execution.confidence * 100).toFixed(1) + '%' : 'N/A'}</p>
            </div>
            
            ${execution.result.generatedCode ? `
                <div style="margin: 1rem 0;">
                    <h3>💻 Generated Code</h3>
                    <pre style="background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 4px; overflow-x: auto;">
<code>${escapeHtml(execution.result.generatedCode)}</code>
                    </pre>
                </div>
            ` : ''}
            
            ${execution.result.details ? `
                <div style="margin: 1rem 0;">
                    <h3>📄 Details</h3>
                    <pre>${escapeHtml(JSON.stringify(execution.result.details, null, 2))}</pre>
                </div>
            ` : ''}
            
            ${execution.result.stdout ? `
                <div style="margin: 1rem 0;">
                    <h3>📤 Output</h3>
                    <pre style="background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 4px; max-height: 200px; overflow-y: auto;">
${escapeHtml(execution.result.stdout)}
                    </pre>
                </div>
            ` : ''}
            
            ${execution.result.stderr ? `
                <div style="margin: 1rem 0;">
                    <h3>⚠️ Error Output</h3>
                    <pre style="background: #2d1f1f; color: #ff6b6b; padding: 1rem; border-radius: 4px; max-height: 200px; overflow-y: auto;">
${escapeHtml(execution.result.stderr)}
                    </pre>
                </div>
            ` : ''}
            
            <div style="margin-top: 2rem;">
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.style.display='none'">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}

function clearHistory() {
    if (confirm('Clear all history?')) {
        historyData = [];
        updateHistoryDisplay([]);
    }
}

// ==================== MONITOR ====================

function openMonitorDetails() {
    // This is called when monitor panel opens
    updateMonitorDetails();
}

async function updateMonitorDetails() {
    try {
        const state = await fetch('/api/agent/state').then(r => r.json());
        const history = await fetch('/api/training/history').then(r => r.json());
        const brain = await fetch('/api/agent/brain-stats').then(r => r.json());

        // Agent Status
        document.getElementById('agent-status-detail').innerHTML = `
            <div class="detail-row">
                <span class="detail-label">State:</span>
                <span class="detail-value">${state.currentState}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Task Queue:</span>
                <span class="detail-value">${state.taskQueueLength}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Uptime:</span>
                <span class="detail-value">${formatUptime(state.uptime)}</span>
            </div>
        `;

        // Memory Usage
        document.getElementById('memory-usage').innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Total Experiences:</span>
                <span class="detail-value">${history.totalExperiences}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Patterns Found:</span>
                <span class="detail-value">${history.patterns}</span>
            </div>
        `;

        // Brain Stats
        document.getElementById('brain-stats-detail').innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Trained Examples:</span>
                <span class="detail-value">${brain.trainedExamples}</span>
            </div>
        `;

        // Action Stats
        let actionHTML = '';
        Object.entries(history.actionStats || {}).forEach(([action, stats]) => {
            const successRate = stats.attempts > 0 
                ? (stats.successes / stats.attempts * 100).toFixed(1)
                : 0;
            actionHTML += `
                <div class="detail-row">
                    <span class="detail-label">${action}:</span>
                    <span class="detail-value">${stats.successes}/${stats.attempts} (${successRate}%)</span>
                </div>
            `;
        });
        document.getElementById('action-stats-detail').innerHTML = actionHTML;
    } catch (error) {
        console.error('Failed to update monitor:', error);
    }
}

// Override openPanel to update monitor when it's opened
const originalOpenPanel = openPanel;
openPanel = function(panel) {
    originalOpenPanel(panel);
    if (panel === 'monitor') {
        updateMonitorDetails();
    } else if (panel === 'history') {
        updateHistoryDisplay(historyData);
    }
};

// ==================== UTILITIES ====================

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
