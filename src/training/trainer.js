import readline from 'readline';
import Agent from '../agent/Agent.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const agent = new Agent();

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

async function main() {
    console.log('\n🎓 AI Agent Training System');
    console.log('=============================\n');

    let training = true;

    while (training) {
        console.log('\nTraining Options:');
        console.log('1. Supervised Learning (teach specific behaviors)');
        console.log('2. Reinforcement Learning (reward/punish actions)');
        console.log('3. View Agent State');
        console.log('4. Exit\n');

        const choice = await question('Select option (1-4): ');

        switch (choice) {
            case '1':
                await supervisedTraining();
                break;
            case '2':
                await reinforcedTraining();
                break;
            case '3':
                viewAgentState();
                break;
            case '4':
                training = false;
                break;
            default:
                console.log('Invalid choice. Please try again.');
        }
    }

    console.log('\n💾 Saving agent state...');
    await agent.saveMemory();
    console.log('✅ Agent training session completed!\n');
    rl.close();
}

async function supervisedTraining() {
    console.log('\n📚 SUPERVISED LEARNING');
    console.log('Teach the agent by providing (situation, correct action) pairs.\n');

    const examples = [];
    let addMore = true;

    while (addMore) {
        console.log(`\n--- Example ${examples.length + 1} ---`);
        
        const situation = await question('Describe the situation: ');
        const correctAction = await question('What should the agent do? ');

        examples.push({
            situation: situation.toLowerCase(),
            correctAction: correctAction.toLowerCase()
        });

        console.log('✓ Example added');

        const another = await question('Add another example? (y/n): ');
        addMore = another.toLowerCase() === 'y';
    }

    if (examples.length > 0) {
        console.log(`\n🧠 Training agent on ${examples.length} examples...`);
        agent.trainSupervised(examples);
        console.log('✅ Supervised training complete!\n');
    }
}

async function reinforcedTraining() {
    console.log('\n🎯 REINFORCEMENT LEARNING');
    console.log('Watch the agent attempt tasks and provide reward/penalty scores.\n');

    const episodes = [];
    let addMore = true;

    while (addMore) {
        console.log(`\n--- Episode ${episodes.length + 1} ---`);
        
        const state = await question('What was the state/situation? ');
        const action = await question('What action did the agent take? ');
        const rewardStr = await question('Rate the outcome (-1 to 1, e.g., 0.8): ');
        
        const reward = parseFloat(rewardStr) || 0;

        episodes.push({
            state: state.toLowerCase(),
            action: action.toLowerCase(),
            reward: Math.max(-1, Math.min(1, reward))
        });

        console.log(`✓ Episode recorded (reward: ${reward.toFixed(2)})`);

        const another = await question('Add another episode? (y/n): ');
        addMore = another.toLowerCase() === 'y';
    }

    if (episodes.length > 0) {
        console.log(`\n🧠 Training agent with ${episodes.length} episodes...`);
        agent.trainReinforced(episodes);
        console.log('✅ Reinforcement training complete!\n');
    }
}

function viewAgentState() {
    const state = agent.getState();
    
    console.log('\n📊 Agent State:');
    console.log(`  ID: ${state.id.slice(0, 8)}`);
    console.log(`  Current State: ${state.currentState}`);
    console.log(`  Uptime: ${formatUptime(state.uptime)}`);
    console.log(`  Task Queue: ${state.taskQueueLength}`);
    console.log(`\n📈 Memory Stats:`);
    console.log(`  Total Experiences: ${state.memoryStats.totalExperiences}`);
    console.log(`  Learned Patterns: ${state.memoryStats.patterns}`);
    
    if (Object.keys(state.memoryStats.actionStats).length > 0) {
        console.log(`\n📋 Action Statistics:`);
        Object.entries(state.memoryStats.actionStats).forEach(([action, stats]) => {
            const successRate = stats.attempts > 0 
                ? (stats.successes / stats.attempts * 100).toFixed(1)
                : 0;
            console.log(`  ${action}: ${stats.successes}/${stats.attempts} (${successRate}%)`);
        });
    }
    
    console.log(`\n🧠 Brain Stats:`);
    console.log(`  Trained Examples: ${state.brainStats.trainedExamples}`);
}

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
