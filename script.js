// Quiz Data
const quizData = [
    {
        question: "When did we first meet for a coffee?",
        options: ["April 23, 2025", "March 09, 2025", "June 05, 2025", "November 17, 2025"],
        correct: 3
    },
    {
        question: "What did we order that day?",
        options: ["matcha & dark mocha", "latte & americano", "iced chocolate & tea", "cappuccino & flat white"],
        correct: 0
    },
    {
        question: "The first flower you received from me",
        options: ["stargazer", "sunflower", "gerbera w/ roses", "anthurium"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let noClickCount = 0;

// Initialize Quiz
function initQuiz() {
    showQuestion();
}

function showQuestion() {
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    
    questionText.textContent = quizData[currentQuestion].question;
    optionsContainer.innerHTML = '';
    
    quizData[currentQuestion].options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btn) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');
    
    if (selectedIndex === quizData[currentQuestion].correct) {
        btn.classList.add('correct');
        score++;
        document.getElementById('score').textContent = score;
    } else {
        btn.classList.add('incorrect');
        allBtns[quizData[currentQuestion].correct].classList.add('correct');
    }
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            showQuestion();
        } else {
            switchSection('quiz-section', 'valentine-section');
        }
    }, 1500);
}

// Section Switching
function switchSection(currentId, nextId) {
    const current = document.getElementById(currentId);
    const next = document.getElementById(nextId);
    
    current.style.opacity = '0';
    setTimeout(() => {
        current.classList.remove('active');
        next.classList.add('active');
    }, 500);
}

// Valentine Section
const valentineData = {
    noMessages: [
        "No",
        "Are you sure? 🥺",
        "Pretty please... 🥺",
        "Really? 😢",
        "Think again! 💗",
        "Last chance! 🥺",
        "Nooo 😭",
        "Please??? 💕"
    ],
    noGifs: [
        "assets/normal.gif",
        "assets/sad.gif",
        "assets/please.gif",
        "assets/no.gif",
        "assets/beg.gif",
        "assets/sad.gif",
        "assets/beg.gif",
        "assets/please.gif"
    ],
    hints: [
        "choose wisely... 😌",
        "the yes button is getting bigger... 👀",
        "look how big yes is now! 😏",
        "just say yes already! 💗",
        "you know you want to say yes 😊",
        "the no button is running away! 🏃‍♂️",
        "come on... pretty please? 🥺",
        "I'll be so happy if you say yes! 🥰"
    ]
};

// Function to move the No button - stays visible, never overlaps with Yes
function moveNoButton() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const container = document.querySelector('.buttons-container');
    
    const containerRect = container.getBoundingClientRect();
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    
    // Get Yes button position relative to container
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const yesRelativeLeft = yesBtnRect.left - containerRect.left;
    const yesRelativeTop = yesBtnRect.top - containerRect.top;
    const yesRelativeRight = yesRelativeLeft + yesBtnRect.width;
    const yesRelativeBottom = yesRelativeTop + yesBtnRect.height;
    
    let newX, newY;
    let validPosition = false;
    let attempts = 0;
    const maxAttempts = 50;
    
    // Keep trying until we find a valid position that doesn't overlap
    while (!validPosition && attempts < maxAttempts) {
        // Generate random position in center area
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // Stay within 30% of center
        const maxOffsetX = containerRect.width * 0.25;
        const maxOffsetY = containerRect.height * 0.25;
        
        const randomOffsetX = (Math.random() - 0.5) * maxOffsetX * 2;
        const randomOffsetY = (Math.random() - 0.5) * maxOffsetY * 2;
        
        newX = centerX + randomOffsetX - (btnWidth / 2);
        newY = centerY + randomOffsetY - (btnHeight / 2);
        
        // Keep within bounds
        newX = Math.max(20, Math.min(newX, containerRect.width - btnWidth - 20));
        newY = Math.max(20, Math.min(newY, containerRect.height - btnHeight - 20));
        
        // Check if this position overlaps with Yes button (with extra padding)
        const noLeft = newX;
        const noRight = newX + btnWidth;
        const noTop = newY;
        const noBottom = newY + btnHeight;
        
        const padding = 40; // Extra space between buttons
        
        // Check overlap with padding
        const overlapsHorizontally = !(noRight + padding < yesRelativeLeft || noLeft - padding > yesRelativeRight);
        const overlapsVertically = !(noBottom + padding < yesRelativeTop || noTop - padding > yesRelativeBottom);
        
        if (!(overlapsHorizontally && overlapsVertically)) {
            validPosition = true;
        }
        
        attempts++;
    }
    
    // Apply the position
    noBtn.style.position = 'absolute';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.transform = 'none';
    noBtn.style.zIndex = '5'; // Ensure it stays visible
}

// Add mouse hover detection to move No button away from cursor
document.getElementById('no-btn').addEventListener('mouseenter', () => {
    if (noClickCount >= 2) {
        moveNoButton();
    }
});

document.getElementById('yes-btn').addEventListener('click', () => {
    // Acceptance - USE BLUSH GIF
    document.getElementById('reaction-gif').src = 'assets/blush.gif';
    document.getElementById('hint-text').textContent = 'YAAAYYY! 🎉';
    document.getElementById('yes-btn').style.display = 'none';
    document.getElementById('no-btn').style.display = 'none';
    
    createConfetti();
    
    setTimeout(() => {
        switchSection('valentine-section', 'gallery-section');
    }, 1200);
});

document.getElementById('no-btn').addEventListener('click', () => {
    const maxMessages = valentineData.noMessages.length;
    
    if (noClickCount < maxMessages) {
        // Change NO button text
        const noBtn = document.getElementById('no-btn');
        noBtn.textContent = valentineData.noMessages[noClickCount];
        
        // Change GIF
        document.getElementById('reaction-gif').src = valentineData.noGifs[noClickCount];
        
        // Change hint
        document.getElementById('hint-text').textContent = valentineData.hints[noClickCount];
        
        // Grow YES button
        const yesBtn = document.getElementById('yes-btn');
        const currentScale = 1 + (noClickCount + 1) * 0.25;
        yesBtn.style.transform = `scale(${currentScale})`;
        yesBtn.style.transition = 'transform 0.3s ease';
        
        // Start moving NO button after 2 clicks
        if (noClickCount >= 2) {
            moveNoButton();
        }
        
        noClickCount++;
    }
});

// Gallery Section
const flipCards = document.querySelectorAll('.flip-card');
flipCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

document.getElementById('gallery-continue-btn').addEventListener('click', () => {
    switchSection('gallery-section', 'playlist-section');
});

// Playlist Section
document.getElementById('open-invitation-btn').addEventListener('click', () => {
    switchSection('playlist-section', 'invitation-section');
});

// Invitation Section
document.getElementById('accept-btn').addEventListener('click', () => {
    document.getElementById('accept-btn').style.display = 'none';
    document.getElementById('final-message').style.display = 'block';
    createConfetti();
});

// Confetti Function
function createConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb3d9', '#fff'];
    
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach((piece, index) => {
            ctx.save();
            ctx.translate(piece.x + piece.w / 2, piece.y + piece.h / 2);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
            ctx.restore();
            
            piece.y += piece.speedY;
            piece.x += piece.speedX;
            piece.rotation += 2;
            
            if (piece.y > canvas.height) {
                confettiPieces.splice(index, 1);
            }
        });
        
        if (confettiPieces.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

// Initialize
initQuiz();