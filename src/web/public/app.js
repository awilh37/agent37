let autoRefreshInterval;

async function refreshStatus() {
    try {
        const response = await fetch('/api/agent/state');
        const state = await response.json();

        const statusDisplay = document.getElementById('agent-status');
        statusDisplay.innerHTML = `
            <div class="stat-item">
                <p><strong>Agent ID:</strong> ${state.id.slice(0, 8)}</p>
                <p><strong>Current State:</strong> ${state.currentState}</p>
                <p><strong>Uptime:</strong> ${formatUptime(state.uptime)}</p>
                <p><strong>Tasks in Queue:</strong> ${state.taskQueueLength}</p>
            </div>
            <div class="stat-item">
                <p><strong>Memory Experiences:</strong> ${state.memoryStats.totalExperiences}</p>
                <p><strong>Learned Patterns:</strong> ${state.memoryStats.patterns}</p>
            </div>
        `;

        // Update memory panel
        const memoryDisplay = document.getElementById('memory-stats');
        let memoryHTML = '<div class="stat-item"><h4>Action Statistics:</h4>';
        
        Object.entries(state.memoryStats.actionStats || {}).forEach(([action, stats]) => {
            const successRate = stats.attempts > 0 ? (stats.successes / stats.attempts * 100).toFixed(1) : 0;
            memoryHTML += `
                <p><strong>${action}:</strong> ${stats.successes}/${stats.attempts} success (${successRate}%) | Avg Reward: ${stats.avgReward.toFixed(2)}</p>
            `;
        });
        memoryHTML += '</div>';
        memoryDisplay.innerHTML = memoryHTML;

        // Update success rates
        await updateSuccessRates();

    } catch (error) {
        console.error('Error refreshing status:', error);
        document.getElementById('agent-status').innerHTML = '<p>Error loading status</p>';
    }
}

async function updateSuccessRates() {
    try {
        const actions = ['terminal', 'web', 'code', 'learn'];
        let html = '';

        for (const action of actions) {
            const response = await fetch(`/api/agent/success-rate/${action}`);
            const data = await response.json();
            const percentage = (data.successRate * 100).toFixed(1);

            html += `
                <div class="success-rate-bar">
                    <div class="action-name">${action}</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="percentage">${percentage}%</div>
                </div>
            `;
        }

        document.getElementById('success-rates').innerHTML = html;
    } catch (error) {
        console.error('Error updating success rates:', error);
    }
}

async function executeTask(event) {
    event.preventDefault();

    try {
        const action = document.getElementById('task-action').value;
        const paramsText = document.getElementById('task-params').value;
        
        let params = {};
        if (paramsText) {
            params = JSON.parse(paramsText);
        }

        const response = await fetch('/api/agent/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, params })
        });

        const result = await response.json();
        document.getElementById('task-result').innerHTML = `
            <p><strong>✅ Success:</strong> ${result.message}</p>
        `;

        // Clear form
        document.getElementById('task-action').value = '';
        document.getElementById('task-params').value = '';

        // Refresh status
        setTimeout(refreshStatus, 500);

    } catch (error) {
        document.getElementById('task-result').innerHTML = `
            <p><strong>❌ Error:</strong> ${error.message}</p>
        `;
    }
}

async function trainSupervised() {
    try {
        const dataText = document.getElementById('supervised-data').value;
        const data = JSON.parse(dataText);

        const response = await fetch('/api/agent/train', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'supervised', data })
        });

        const result = await response.json();
        
        if (response.ok) {
            document.getElementById('training-result').innerHTML = `
                <p><strong>✅ ${result.message}</strong></p>
            `;
            document.getElementById('supervised-data').value = '';
        } else {
            document.getElementById('training-result').innerHTML = `
                <p><strong>❌ Error:</strong> ${result.error}</p>
            `;
        }

        setTimeout(refreshStatus, 500);

    } catch (error) {
        document.getElementById('training-result').innerHTML = `
            <p><strong>❌ Parse Error:</strong> ${error.message}</p>
        `;
    }
}

async function trainReinforced() {
    try {
        const dataText = document.getElementById('reinforced-data').value;
        const data = JSON.parse(dataText);

        const response = await fetch('/api/agent/train', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'reinforced', data })
        });

        const result = await response.json();
        
        if (response.ok) {
            document.getElementById('training-result').innerHTML = `
                <p><strong>✅ ${result.message}</strong></p>
            `;
            document.getElementById('reinforced-data').value = '';
        } else {
            document.getElementById('training-result').innerHTML = `
                <p><strong>❌ Error:</strong> ${result.error}</p>
            `;
        }

        setTimeout(refreshStatus, 500);

    } catch (error) {
        document.getElementById('training-result').innerHTML = `
            <p><strong>❌ Parse Error:</strong> ${error.message}</p>
        `;
    }
}

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

// Auto-refresh every 3 seconds
window.addEventListener('load', () => {
    refreshStatus();
    autoRefreshInterval = setInterval(refreshStatus, 3000);
});

window.addEventListener('beforeunload', () => {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});
