import Agent from './agent/Agent.js';
import WebServer from './web/server.js';

console.log('🤖 Initializing AI Agent...');

const agent = new Agent();
const webServer = new WebServer(agent);

// Start the web portal
webServer.start().then(() => {
  console.log('✅ Web portal started on http://localhost:3737');
  console.log('🧠 Agent brain initialized and ready for training');
  console.log('📝 Run "npm run train" in another terminal to start training\n');
});

// Main agent loop - processes tasks and learns
async function agentLoop() {
  while (true) {
    try {
      // Agent thinks about what to do next
      await agent.think();
      
      // Execute any pending tasks
      await agent.executePendingTasks();
      
      // Update memory based on outcomes
      agent.updateMemory();
      
      // Brief pause to prevent CPU overuse
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('❌ Agent loop error:', error.message);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Start the agent loop
agentLoop().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await agent.saveMemory();
  process.exit(0);
});
