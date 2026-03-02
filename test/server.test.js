import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3526';

describe('Dog vs Cat Server', () => {
    let server;
    
    before(async () => {
        // Start the server
        server = spawn('node', [path.join(__dirname, '..', 'server.js')], {
            stdio: 'pipe',
            cwd: path.join(__dirname, '..')
        });
        
        // Wait for server to be ready
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Server failed to start within 5 seconds'));
            }, 5000);
            
            server.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Dog vs Cat') || output.includes('running on')) {
                    clearTimeout(timeout);
                    resolve();
                }
            });
            
            server.stderr.on('data', (data) => {
                // Some servers log to stderr
                const output = data.toString();
                if (output.includes('Dog vs Cat') || output.includes('running on')) {
                    clearTimeout(timeout);
                    resolve();
                }
            });
            
            // Also try polling the health endpoint
            const pollServer = async () => {
                try {
                    const response = await fetch(`${BASE_URL}/health`);
                    if (response.ok) {
                        clearTimeout(timeout);
                        resolve();
                        return;
                    }
                } catch (e) {
                    // Server not ready yet
                }
                setTimeout(pollServer, 100);
            };
            setTimeout(pollServer, 500);
        });
    });
    
    after(() => {
        if (server) {
            server.kill();
        }
    });
    
    describe('Static Files', () => {
        it('should serve index.html', async () => {
            const response = await fetch(`${BASE_URL}/`);
            assert.strictEqual(response.status, 200);
            const body = await response.text();
            assert(body.includes('Dog vs Cat'));
        });
        
        it('should serve design tokens CSS', async () => {
            const response = await fetch(`${BASE_URL}/styles/design-tokens.css`);
            assert.strictEqual(response.status, 200);
            const body = await response.text();
            assert(body.includes('--primary:'));
            assert(body.includes('--font-heading:'));
        });
        
        it('should serve main CSS', async () => {
            const response = await fetch(`${BASE_URL}/style.css`);
            assert.strictEqual(response.status, 200);
            const body = await response.text();
            assert(body.includes('font-family: var(--font-body)'));
        });
        
        it('should serve JavaScript', async () => {
            const response = await fetch(`${BASE_URL}/app.js`);
            assert.strictEqual(response.status, 200);
        });
    });
    
    describe('API Endpoints', () => {
        it('should return initial votes', async () => {
            const response = await fetch(`${BASE_URL}/api/votes`);
            assert.strictEqual(response.status, 200);
            const data = await response.json();
            assert.strictEqual(typeof data.dog, 'number');
            assert.strictEqual(typeof data.cat, 'number');
        });
        
        it('should increment dog votes', async () => {
            const initial = await (await fetch(`${BASE_URL}/api/votes`)).json();
            
            const response = await fetch(`${BASE_URL}/api/vote/dog`, { method: 'POST' });
            assert.strictEqual(response.status, 200);
            
            const data = await response.json();
            assert.strictEqual(data.dog, initial.dog + 1);
        });
        
        it('should increment cat votes', async () => {
            const initial = await (await fetch(`${BASE_URL}/api/votes`)).json();
            
            const response = await fetch(`${BASE_URL}/api/vote/cat`, { method: 'POST' });
            assert.strictEqual(response.status, 200);
            
            const data = await response.json();
            assert.strictEqual(data.cat, initial.cat + 1);
        });
        
        it('should reset votes', async () => {
            // First add some votes
            await fetch(`${BASE_URL}/api/vote/dog`, { method: 'POST' });
            await fetch(`${BASE_URL}/api/vote/cat`, { method: 'POST' });
            
            // Then reset
            const response = await fetch(`${BASE_URL}/api/votes/reset`, { method: 'POST' });
            assert.strictEqual(response.status, 200);
            
            const data = await response.json();
            assert.strictEqual(data.dog, 0);
            assert.strictEqual(data.cat, 0);
        });
        
        it('should return health status', async () => {
            const response = await fetch(`${BASE_URL}/health`);
            assert.strictEqual(response.status, 200);
            const data = await response.json();
            assert.strictEqual(data.status, 'ok');
            assert(data.timestamp);
        });
    });
    
    describe('Design Tokens', () => {
        it('should have primary color defined', async () => {
            const response = await fetch(`${BASE_URL}/styles/design-tokens.css`);
            const body = await response.text();
            assert(body.includes('--primary: #8b5cf6'));
        });
        
        it('should have accent color defined', async () => {
            const response = await fetch(`${BASE_URL}/styles/design-tokens.css`);
            const body = await response.text();
            assert(body.includes('--accent: #06b6d4'));
        });
        
        it('should have Sora font for headings', async () => {
            const response = await fetch(`${BASE_URL}/styles/design-tokens.css`);
            const body = await response.text();
            assert(body.includes("--font-heading: 'Sora'"));
        });
        
        it('should have Nunito Sans font for body', async () => {
            const response = await fetch(`${BASE_URL}/styles/design-tokens.css`);
            const body = await response.text();
            assert(body.includes("--font-body: 'Nunito Sans'"));
        });
    });
    
    describe('HTML Structure', () => {
        it('should load Google Fonts', async () => {
            const response = await fetch(`${BASE_URL}/`);
            const body = await response.text();
            assert(body.includes('fonts.googleapis.com'));
            assert(body.includes('Sora'));
            assert(body.includes('Nunito Sans'));
        });
        
        it('should have design tokens CSS link', async () => {
            const response = await fetch(`${BASE_URL}/`);
            const body = await response.text();
            assert(body.includes('styles/design-tokens.css'));
        });
        
        it('should have proper meta tags', async () => {
            const response = await fetch(`${BASE_URL}/`);
            const body = await response.text();
            assert(body.includes('color-scheme'));
            assert(body.includes('theme-color'));
        });
    });
});
