// Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const message = document.getElementById('message');
const penguin = document.getElementById('penguin');
const hearts = document.getElementById('hearts');
const gifLeft = document.getElementById('gifLeft');
const gifRight = document.getElementById('gifRight');

// Chibi-style cartoon love GIF URLs
const chibiGifs = [
    'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
    'https://media.giphy.com/media/KztT2c4u8mYYUiMKdJ/giphy.gif',
    'https://media.giphy.com/media/yoJC2JaiEMoxIhQhY4/giphy.gif',
    'https://media.giphy.com/media/QbkL9WuorOlgI/giphy.gif',
    'https://media.giphy.com/media/lTQF0ODLLjhza/giphy.gif',
    'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
];

// Cute animal love GIF URLs
const animalGifs = [
    'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
    'https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif',
    'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    'https://media.giphy.com/media/3oEjI5VtIhHvK37WYo/giphy.gif',
    'https://media.giphy.com/media/LpwBqCorPvZC0/giphy.gif',
];

// Preload GIFs
function preloadGifs() {
    [...chibiGifs, ...animalGifs].forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Create exactly 5 GIFs (3 chibi + 2 animal)
function createGifs() {
    // Randomly select 3 chibi and 2 animal GIFs
    const selectedChibi = [...chibiGifs].sort(() => Math.random() - 0.5).slice(0, 3);
    const selectedAnimal = [...animalGifs].sort(() => Math.random() - 0.5).slice(0, 2);
    const allSelected = [...selectedChibi, ...selectedAnimal];
    
    allSelected.forEach((gifUrl, i) => {
        setTimeout(() => {
            const gif = document.createElement('img');
            gif.className = 'gif-item';
            gif.src = gifUrl;
            
            // Alternate between left and right containers
            const container = i % 2 === 0 ? gifLeft : gifRight;
            container.appendChild(gif);
            
            // Remove after 6 seconds
            setTimeout(() => {
                gif.style.animation = 'fadeOut 0.8s ease forwards';
                setTimeout(() => gif.remove(), 800);
            }, 6000);
        }, i * 250);
    });
}

// Preload on page load
preloadGifs();

// State
let noClickCount = 0;
let yesScale = 1;
const noTexts = ['No 😅', 'Why? 🤔', 'Why not? 😢', 'Please 😭'];
let currentState = 'idle';

// Change penguin state
function setPenguinState(state) {
    penguin.className = 'penguin ' + state;
    currentState = state;
}

// Track mouse position for worried state
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    checkProximityToNo();
});

document.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        checkProximityToNo();
    }
});

function checkProximityToNo() {
    if (currentState === 'happy' || currentState === 'excited') return;
    
    const rect = noBtn.getBoundingClientRect();
    const distance = Math.sqrt(
        Math.pow(mouseX - (rect.left + rect.width / 2), 2) +
        Math.pow(mouseY - (rect.top + rect.height / 2), 2)
    );
    
    if (distance < 150 && currentState !== 'worried') {
        setPenguinState('worried');
    } else if (distance >= 150 && currentState === 'worried') {
        setPenguinState('idle');
    }
}

// Audio element for music
let musicAudio = null;
let musicPlaying = false;

// Initialize audio on first user interaction
function initAudio() {
    if (!musicAudio) {
        // Option 1: Use local file (recommended for production)
        // Place your royalty-free romantic music file in: /assets/music/romantic.mp3
        // musicAudio = new Audio('assets/music/romantic.mp3');
        
        // Option 2: Use royalty-free music from free sources
        musicAudio = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_4a26f03c52.mp3');
        musicAudio.loop = false;
        musicAudio.volume = 0;
    }
}

// Fade in audio
function fadeInAudio(audio, targetVolume = 0.3, duration = 2000) {
    const steps = 50;
    const stepTime = duration / steps;
    const volumeIncrement = targetVolume / steps;
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            audio.volume = targetVolume;
        } else {
            audio.volume = Math.min(volumeIncrement * currentStep, targetVolume);
            currentStep++;
        }
    }, stepTime);
}

// Play romantic music
function playMusic() {
    if (musicPlaying) return; // Prevent overlapping
    
    initAudio();
    musicAudio.currentTime = 0;
    musicAudio.play().then(() => {
        musicPlaying = true;
        fadeInAudio(musicAudio, 0.3, 2000);
    }).catch(() => {});
    
    // Reset flag when music ends
    musicAudio.onended = () => {
        musicPlaying = false;
    };
}

// Create heart animation
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = ['💖', '💕', '💗', '💓', '💝'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
    hearts.appendChild(heart);
    
    setTimeout(() => heart.remove(), 3000);
}

// Handle No button
function handleNo(e) {
    e.preventDefault();
    
    // Simple beep sound
    const beep = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3');
    beep.volume = 0.2;
    beep.play().catch(() => {});
    
    // Update text
    noClickCount = (noClickCount + 1) % noTexts.length;
    noBtn.textContent = noTexts[noClickCount];
    
    // Grow Yes button (max 2.5x)
    if (yesScale < 2.5) {
        yesScale += 0.2;
        yesBtn.style.transform = `scale(${yesScale})`;
    }
    
    // Penguin reactions based on click count
    if (noClickCount === 3) {
        setPenguinState('sad');
    } else if (noClickCount === 2) {
        setPenguinState('shy');
    } else {
        setPenguinState('sad');
    }
    
    setTimeout(() => {
        if (currentState !== 'happy' && currentState !== 'excited') {
            setPenguinState('idle');
        }
    }, 1000);
    
    // Move No button away from cursor/touch
    const rect = noBtn.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
    const y = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;
    
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    const deltaX = x - btnCenterX;
    const deltaY = y - btnCenterY;
    
    const angle = Math.atan2(deltaY, deltaX);
    const distance = 150;
    
    const newX = -Math.cos(angle) * distance;
    const newY = -Math.sin(angle) * distance;
    
    noBtn.style.transform = `translate(${newX}px, ${newY}px)`;
    
    setTimeout(() => {
        noBtn.style.transform = 'translate(0, 0)';
    }, 500);
}

// Handle Yes button
function handleYes() {
    playMusic();
    
    // Excited state first
    setPenguinState('excited');
    
    setTimeout(() => {
        
        // Hide buttons
        yesBtn.style.display = 'none';
        noBtn.style.display = 'none';
        
        // Show message
        message.textContent = 'Yay! You made me the happiest! 💕✨';
        message.classList.remove('hidden');
        
        // Happy penguin
        setPenguinState('happy');
        
        // Create hearts and GIFs
        for (let i = 0; i < 30; i++) {
            setTimeout(() => createHeart(), i * 100);
        }
        createGifs();
    }, 800);
}

// Mouse events
noBtn.addEventListener('mouseenter', handleNo);
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleNo(e);
});

// Touch events for mobile
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleNo(e);
});

yesBtn.addEventListener('click', handleYes);
yesBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleYes();
});
