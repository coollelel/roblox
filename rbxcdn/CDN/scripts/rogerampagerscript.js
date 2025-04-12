import * as THREE from 'three';

// ASCII logo
const logoText = `
██████╗  ██████╗  ██████╗ ███████╗██████╗  █████╗ ███╗   ███╗██████╗  █████╗  ██████╗ ███████╗██████╗ 
██╔══██╗██╔═══██╗██╔════╝ ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔══██╗██╔══██╗██╔════╝ ██╔════╝██╔══██╗
██████╔╝██║   ██║██║  ███╗█████╗  ██████╔╝███████║██╔████╔██║██████╔╝███████║██║  ███╗█████╗  ██████╔╝
██╔══██╗██║   ██║██║   ██║██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔═══╝ ██╔══██║██║   ██║██╔══╝  ██╔══██╗
██║  ██║╚██████╔╝╚██████╔╝███████╗██║  ██║██║  ██║██║ ╚═╝ ██║██║     ██║  ██║╚██████╔╝███████╗██║  ██║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
                                                                                                        
`;

// Single login command
const easterEggs = {
    'help': 'Available commands: login, clear\nType "login" to authenticate.'
};

// Content for login command - handled separately
const commandContent = {};

// Matrix effect setup
class MatrixEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.getElementById('matrix-canvas').appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&%*+=/\\';
        this.fontSize = 14;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        
        this.initialize();
        this.draw();
    }
    
    initialize() {
        for(let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.floor(Math.random() * -100);
        }
    }
    
    draw() {
        // Transparent layer to create fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Green text
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for(let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if(this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.draw());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        // Adjust drops array
        if (this.drops.length !== this.columns) {
            const oldLength = this.drops.length;
            if (oldLength < this.columns) {
                for (let i = oldLength; i < this.columns; i++) {
                    this.drops[i] = Math.floor(Math.random() * -100);
                }
            } else {
                this.drops = this.drops.slice(0, this.columns);
            }
        }
    }
}

// 3D Scene for background ambience
class AmbientScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        document.querySelector('.background-container').appendChild(this.renderer.domElement);
        
        this.camera.position.z = 30;
        
        this.particles = [];
        this.particleSystem = null;
        
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x00ff9d,
            size: 0.3,
            transparent: true,
            opacity: 0.7
        });
        
        this.particleSystem = new THREE.Points(particles, material);
        this.scene.add(this.particleSystem);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate particle system slowly
        if (this.particleSystem) {
            this.particleSystem.rotation.x += 0.0003;
            this.particleSystem.rotation.y += 0.0005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Terminal functionality
class Terminal {
    constructor() {
        this.outputElement = document.getElementById('output');
        this.commandInput = document.getElementById('command-input');
        this.commandHistory = [];
        this.historyIndex = 0;
        this.currentInputText = '';
        this.cursorBlinkInterval = null;
        this.waitingForPassword = false;
        
        this.displayLogo();
        this.startTerminal();
        this.setupEventListeners();
    }
    
    displayLogo() {
        document.getElementById('logo').textContent = logoText;
    }
    
    startTerminal() {
        this.writeToTerminal('SYSTEM INITIALIZED...');
        this.writeToTerminal('RogeRampager Terminal v1.3.3.7');
        this.writeToTerminal('Type "help" for available commands.');
        this.newLine();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.isTyping) {
                if (e.key === 'Enter') {
                    const command = this.currentInputText.trim().toLowerCase();
                    this.executeCommand(command);
                    this.commandHistory.push(command);
                    this.historyIndex = this.commandHistory.length;
                    this.currentInputText = '';
                    this.commandInput.textContent = '';
                } else if (e.key === 'Backspace') {
                    if (this.currentInputText.length > 0) {
                        this.currentInputText = this.currentInputText.slice(0, -1);
                        this.commandInput.textContent = this.currentInputText;
                    }
                } else if (e.key === 'ArrowUp') {
                    if (this.historyIndex > 0) {
                        this.historyIndex--;
                        this.currentInputText = this.commandHistory[this.historyIndex];
                        this.commandInput.textContent = this.currentInputText;
                    }
                } else if (e.key === 'ArrowDown') {
                    if (this.historyIndex < this.commandHistory.length - 1) {
                        this.historyIndex++;
                        this.currentInputText = this.commandHistory[this.historyIndex];
                        this.commandInput.textContent = this.currentInputText;
                    } else {
                        this.historyIndex = this.commandHistory.length;
                        this.currentInputText = '';
                        this.commandInput.textContent = '';
                    }
                } else if (e.key.length === 1) {
                    this.currentInputText += e.key;
                    this.commandInput.textContent = this.currentInputText;
                }
            }
        });
        
        // Handle navigation click events
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const command = e.target.getAttribute('data-command');
                this.typeCommand(command);
            });
        });
    }
    
    typeCommand(command) {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.currentInputText = '';
        this.commandInput.textContent = '';
        
        const typeEffect = (text, index = 0) => {
            if (index < text.length) {
                this.currentInputText += text[index];
                this.commandInput.textContent = this.currentInputText;
                setTimeout(() => typeEffect(text, index + 1), 50);
            } else {
                setTimeout(() => {
                    this.executeCommand(command);
                    this.commandHistory.push(command);
                    this.historyIndex = this.commandHistory.length;
                    this.currentInputText = '';
                    this.commandInput.textContent = '';
                    this.isTyping = false;
                }, 200);
            }
        };
        
        typeEffect(command);
    }
    
    executeCommand(command) {
        this.writeToTerminal(`root@rogerampager:~# ${command}`, 'command-text');
        
        if (this.waitingForPassword) {
            this.checkPassword(command);
            this.waitingForPassword = false;
        } else if (command === 'clear') {
            this.clearTerminal();
        } else if (command === 'login') {
            this.writeToTerminal('Enter password:');
            this.waitingForPassword = true;
        } else if (easterEggs[command]) {
            this.typeText(easterEggs[command]);
        } else if (commandContent[command]) {
            this.typeText(commandContent[command]);
        } else if (command) {
            this.typeText(`Command not found: ${command}`);
        }
    }
    
    checkPassword(password) {
        if (password === 'rbxcdnisnotascamtrustme') {
            this.typeText('ACCESS GRANTED\n\nWelcome to RogeRampager secure system.\nYou have successfully authenticated.\n\nLoading secure environment...', 50, () => {
                // Redirect to the specified URL after typing completes
                window.location.href = 'https://rbxcdn.vercel.app/rbxcdn/CDN/rogerampager/usdconvertingsystemhtmlworking.html';
            });
        } else {
            this.typeText('ACCESS DENIED\n\nInvalid password. Authentication failed.\nSecurity alert triggered.');
        }
    }
    
    typeText(text, speed = 20, callback = null) {
        const lines = text.split('\n');
        let lineIndex = 0;
        
        const typeLine = () => {
            if (lineIndex < lines.length) {
                const line = lines[lineIndex];
                this.writeToTerminal(line);
                lineIndex++;
                setTimeout(typeLine, speed * 3);
            } else {
                this.newLine();
                // Call the callback if provided
                if (callback) callback();
            }
        };
        
        typeLine();
    }
    
    writeToTerminal(text, className = '') {
        const line = document.createElement('div');
        line.textContent = text;
        if (className) line.classList.add(className);
        this.outputElement.appendChild(line);
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
    
    newLine() {
        const spacer = document.createElement('div');
        spacer.innerHTML = '&nbsp;';
        this.outputElement.appendChild(spacer);
    }
    
    clearTerminal() {
        this.outputElement.innerHTML = '';
        this.displayLogo();
    }
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const matrixEffect = new MatrixEffect();
    const ambientScene = new AmbientScene();
    const terminal = new Terminal();
    
    // Resize handler
    window.addEventListener('resize', () => {
        matrixEffect.resize();
        ambientScene.resize();
    });
});
