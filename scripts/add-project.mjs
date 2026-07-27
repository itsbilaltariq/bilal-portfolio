import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants & Env Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const LLM_API_KEY = process.env.LLM_API_KEY || process.env.GROQ_API_KEY || process.env.XAI_API_KEY || '';
const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://api.groq.com/openai/v1/chat/completions';
const LLM_MODEL = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Error: Please provide a repository name. Example: node add-project.mjs PromptForge');
    process.exit(1);
  }

  let repoInput = args[0].trim();
  // Ensure we extract just the repo name or use owner/repo if full path is provided
  let owner = 'itsbilaltariq';
  let repoName = repoInput;
  if (repoInput.includes('/')) {
    const parts = repoInput.split('/');
    owner = parts[0];
    repoName = parts[1];
  }

  console.log(`🚀 Starting project import process for ${owner}/${repoName}...`);

  // 1. Fetch Repository details from GitHub API
  const repoData = await fetchGitHub(`https://api.github.com/repos/${owner}/${repoName}`);
  const createdYear = new Date(repoData.created_at).getFullYear().toString();
  const githubUrl = repoData.html_url;
  const liveUrl = repoData.homepage || '';
  
  console.log(`✅ Fetched repository details. Year: ${createdYear}, GitHub: ${githubUrl}, Live: ${liveUrl}`);

  // 2. Fetch README content
  let readmeText = '';
  try {
    readmeText = await fetchGitHubRaw(`https://api.github.com/repos/${owner}/${repoName}/readme`);
    console.log('✅ Fetched README.md successfully.');
  } catch (err) {
    console.warn(`⚠️ Could not fetch README: ${err.message}. Using repository description instead.`);
    readmeText = repoData.description || 'No readme or description available.';
  }

  // 3. Summarize using Groq/Grok API
  if (!LLM_API_KEY) {
    console.error('❌ Error: LLM_API_KEY (or GROQ_API_KEY/XAI_API_KEY) is missing. Set it in environment variables.');
    process.exit(1);
  }

  console.log(`🤖 Sending data to LLM via ${LLM_BASE_URL} (Model: ${LLM_MODEL})...`);
  const llmResponse = await queryLLM(readmeText, repoData.name, repoData.description);
  console.log('✅ LLM summarization completed.');
  
  // 4. Read projects.json
  const projectsPath = path.resolve(__dirname, '../projects.json');
  let projectsList = [];
  try {
    const data = await fs.readFile(projectsPath, 'utf8');
    projectsList = JSON.parse(data);
  } catch (err) {
    console.log('⚠️ projects.json not found or invalid. Creating new projects array.');
  }

  // 5. Structure New Project Entry
  const newProject = {
    id: repoName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: llmResponse.title || repoName,
    year: createdYear,
    repo: `${owner}/${repoName}`,
    githubUrl: githubUrl,
    liveUrl: liveUrl,
    desc: llmResponse.desc,
    tags: llmResponse.tags,
    features: llmResponse.features
  };

  // 6. Merge or append to list
  const existingIndex = projectsList.findIndex(p => p.repo.toLowerCase() === `${owner}/${repoName}`.toLowerCase());
  if (existingIndex > -1) {
    console.log(`📝 Project already exists in projects.json. Updating details for index: ${existingIndex}...`);
    projectsList[existingIndex] = { ...projectsList[existingIndex], ...newProject };
  } else {
    console.log('➕ Appending new project to projects.json...');
    projectsList.push(newProject);
  }

  // 7. Save back to projects.json
  await fs.writeFile(projectsPath, JSON.stringify(projectsList, null, 2), 'utf8');
  console.log(`🎉 Successfully updated projects.json! Output file size: ${projectsList.length} projects.`);
}

/**
 * Fetch helper for GitHub JSON endpoints
 */
async function fetchGitHub(url) {
  const headers = {
    'User-Agent': 'Node-Fetch-Agent',
    'Accept': 'application/vnd.github.v3+json'
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch helper for GitHub raw text (README)
 */
async function fetchGitHubRaw(url) {
  const headers = {
    'User-Agent': 'Node-Fetch-Agent',
    'Accept': 'application/vnd.github.raw+json'
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API HTTP ${response.status}: ${response.statusText}`);
  }
  return response.text();
}

/**
 * Request summarization details from OpenAI-compatible LLM endpoint
 */
async function queryLLM(readmeText, repoName, repoDesc) {
  const systemPrompt = `You are a professional portfolio generator assistant.
Your goal is to extract key details of a GitHub repository from its README.md and construct content optimized for a high-quality personal portfolio.

Instructions:
1. Extract or write a polished "title" for the project (e.g. capitalize correctly, remove hyphens or add descriptive suffixes like "Workspace" or "Portal" if it sounds better).
2. Write a professional, action-oriented "desc" summarizing the project (1 to 2 sentences max, written in third person, e.g., "A collaborative sandbox prompt engineering playground...").
3. Extract an array of "tags" representing the core technologies, frameworks, and databases used. Limit to 4 or 5 most important tags.
4. Extract exactly 3 "features" (bullet points). Each feature bullet point MUST start with a strong action verb (e.g. "Engineered", "Developed", "Implemented", "Designed", "Built", "Optimized", "Integrated") and highlight a clear technical accomplishment. Keep bullet points concise and professional.

You MUST respond with a single JSON object in STRICT JSON format, matching this schema:
{
  "title": "string",
  "desc": "string",
  "tags": ["string"],
  "features": ["string", "string", "string"]
}

Do not include any wrapper text, explanation, or markdown code blocks (such as \`\`\`json) outside the JSON. Only return the raw JSON string.`;

  const userContent = `Repository Name: ${repoName}
Description: ${repoDesc || 'None'}
README Content:
---
${readmeText.substring(0, 8000)} // Truncate README if extremely large
---`;

  const payload = {
    model: LLM_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  };

  const response = await fetch(LLM_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LLM API HTTP ${response.status}: ${response.statusText}\nBody: ${errorBody}`);
  }

  const result = await response.json();
  const content = result.choices[0].message.content.trim();

  try {
    return JSON.parse(content);
  } catch (err) {
    // Fallback if LLM output had markdown formatting
    const cleaned = content.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleaned);
  }
}

main().catch(error => {
  console.error('❌ Process failed with error:', error);
  process.exit(1);
});
