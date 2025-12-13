/**
 * Quannex LinkedIn Content Generator
 *
 * Simple script to generate draft posts based on POC progress.
 * Run manually or via GitHub Actions.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const BASE_DIR = path.join(__dirname, '..');
const KNOWLEDGE_DIR = path.join(BASE_DIR, 'knowledge');
const DRAFTS_DIR = path.join(BASE_DIR, 'drafts');

// Load POC path from config (relative to BASE_DIR)
function getPOCDir() {
    const config = JSON.parse(fs.readFileSync(path.join(KNOWLEDGE_DIR, 'config.json')));
    return path.resolve(BASE_DIR, config.pocPath);
}

// Load knowledge
function loadKnowledge() {
    const posts = JSON.parse(fs.readFileSync(path.join(KNOWLEDGE_DIR, 'posts.json')));
    const concepts = JSON.parse(fs.readFileSync(path.join(KNOWLEDGE_DIR, 'concepts.json')));
    const config = JSON.parse(fs.readFileSync(path.join(KNOWLEDGE_DIR, 'config.json')));
    return { posts, concepts, config };
}

// Get recent git activity from POC
function getRecentPOCActivity() {
    const pocDir = getPOCDir();
    try {
        const commits = execSync(
            `git -C "${pocDir}" log --oneline --since="7 days ago" -10`,
            { encoding: 'utf-8' }
        );
        const changedFiles = execSync(
            `git -C "${pocDir}" diff --name-only HEAD~5 2>nul || echo "No recent changes"`,
            { encoding: 'utf-8' }
        );
        return { commits, changedFiles };
    } catch (e) {
        return { commits: 'No recent commits', changedFiles: '' };
    }
}

// Get next concept to introduce
function getNextConcept(concepts, posts) {
    const foundational = Object.entries(concepts.foundational)
        .filter(([_, v]) => !v.introduced)
        .sort((a, b) => a[1].priority - b[1].priority);

    return foundational[0] ? foundational[0][0] : null;
}

// Determine post type based on day
function getPostType() {
    const args = process.argv.slice(2);
    const typeArg = args.find(a => a.startsWith('--type='));
    if (typeArg) {
        return typeArg.split('=')[1];
    }

    const day = new Date().getDay();
    if (day === 1) return 'philosophy';  // Monday
    if (day === 3) return 'feature';     // Wednesday
    return 'philosophy'; // Default
}

// Generate draft content prompt
function generatePrompt(type, knowledge, pocActivity) {
    const { posts, concepts, config } = knowledge;
    const nextConcept = getNextConcept(concepts, posts);

    const baseContext = `
You are writing a LinkedIn post for Quannex - a Sacred Geometry Organizational Coherence Engine.
This is post #${posts.stats.totalPosts + 1}.

Previous posts: ${posts.stats.totalPosts}
${posts.posts.slice(-3).map(p => `- ${p.title}`).join('\n')}

Tone: Thoughtful, authentic, sharing a journey (not marketing-speak)
Length: 150-300 words
Include: One insight, one invitation to think differently
`;

    if (type === 'philosophy') {
        return `${baseContext}

TYPE: Philosophy Post (Monday)
CONCEPT TO EXPLORE: ${nextConcept || 'organizational coherence'}
CONCEPT DESCRIPTION: ${nextConcept ? concepts.foundational[nextConcept]?.description : 'How sacred geometry reveals organizational health'}

Write a reflective post about this concept. Share WHY it matters, not just WHAT it is.
Make it personal - this is Deimantas sharing his thesis journey.
End with a question that invites reflection.
`;
    } else {
        return `${baseContext}

TYPE: Feature Update (Wednesday)
RECENT POC ACTIVITY:
${pocActivity.commits}

CHANGED FILES:
${pocActivity.changedFiles}

Write an update about what's new in the Quannex POC.
Focus on ONE specific improvement or discovery.
Show the journey of building, including challenges.
Keep it human - you're sharing progress, not selling.
`;
    }
}

// Save draft
function saveDraft(type, prompt, timestamp) {
    const filename = `${timestamp}_${type}.md`;
    const content = `---
type: ${type}
generated: ${new Date().toISOString()}
status: draft
---

# LinkedIn Draft: ${type.charAt(0).toUpperCase() + type.slice(1)} Post

## Generation Prompt
${prompt}

## Draft
[AI will generate content here when run via GitHub Actions]

## Instructions
1. Review and edit the content above
2. Copy the final text
3. Open LinkedIn and paste
4. Add relevant image from screenshots/ folder
5. Post!
6. Move this file to published/ folder
`;

    const filepath = path.join(DRAFTS_DIR, filename);
    fs.writeFileSync(filepath, content);
    console.log(`Draft saved: ${filepath}`);
    return filepath;
}

// Main
function main() {
    console.log('=== Quannex LinkedIn Content Generator ===\n');

    const type = getPostType();
    console.log(`Post type: ${type}`);

    const knowledge = loadKnowledge();
    console.log(`Previous posts: ${knowledge.posts.stats.totalPosts}`);

    const pocActivity = getRecentPOCActivity();
    console.log(`Recent commits found: ${pocActivity.commits.split('\n').filter(l => l).length}`);

    const prompt = generatePrompt(type, knowledge, pocActivity);

    const timestamp = new Date().toISOString().split('T')[0];
    const filepath = saveDraft(type, prompt, timestamp);

    console.log('\n=== Done ===');
    console.log(`Next steps:`);
    console.log(`1. Run AI generation on the prompt (GitHub Action will do this)`);
    console.log(`2. Review draft at: ${filepath}`);
    console.log(`3. Copy to LinkedIn and post`);
}

main();
