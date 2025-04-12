document.addEventListener('DOMContentLoaded', function() {
    // Matrix background effect
    createMatrixEffect();
    
    // Navigation
    const navLinks = document.querySelectorAll('.terminal-navigation a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding screen
            const targetScreen = this.getAttribute('data-screen');
            const screens = document.querySelectorAll('.screen');
            screens.forEach(screen => screen.classList.remove('active'));
            document.getElementById(targetScreen).classList.add('active');
        });
    });
    
    // Add glitch effect to some elements
    addRandomGlitchEffect();
    
    // Clipboard copy on welcome
    copyWelcomeToClipboard();
});

function createMatrixEffect() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('matrix-canvas');
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const columns = Math.floor(canvas.width / 20);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * 20, drops[i] * 20);
            
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
    
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function addRandomGlitchEffect() {
    const elements = document.querySelectorAll('h2, .terminal-title');
    
    elements.forEach(element => {
        setInterval(() => {
            if (Math.random() > 0.95) {
                element.style.textShadow = `0 0 2px #0f0, 0 0 3px #0f0, 0 0 5px #0f0, 0 0 10px #0f0`;
                setTimeout(() => {
                    element.style.textShadow = '';
                }, 100);
            }
        }, 500);
    });
}

function copyWelcomeToClipboard() {
    try {
        navigator.clipboard.writeText('Welcome').then(() => {
            console.log('Welcome text copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    } catch (err) {
        console.error('Clipboard API not supported', err);
    }
}
