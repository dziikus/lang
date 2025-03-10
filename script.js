const wordPairs = [
    {
        english: "breakfast",
        polish: "śniadanie"
    },
    {
        english: "dinner",
        polish: "późny obiad"
    },
    {
        english: "lunch",
        polish: "obiad"
    },
    {
        english: "meal",
        polish: "posiłek"
    },
    {
        english: "snack",
        polish: "przekąska"
    },
    {
        english: "supper",
        polish: "kolacja"
    },
    {
        english: "add",
        polish: "dodawać"
    },
    {
        english: "boil",
        polish: "gotować (np wodę)"
    },
    {
        english: "cook",
        polish: "gotować (np. mięso)"
    },
    {
        english: "cut",
        polish: "kroić"
    },
    {
        english: "fry",
        polish: "smażyć"
    },
    {
        english: "peel",
        polish: "obierać"
    },
    {
        english: "put",
        polish: "kłaść"
    },
    {
        english: "serve",
        polish: "podawać"
    },
    {
        english: "delicious",
        polish: "pyszny"
    },
    {
        english: "a few",
        polish: "kilka"
    },
    {
        english: "fork",
        polish "widelec"
      },
      {
        english: "glass",
        polish "szklanka"
      },
      {
        english: "hungry",
        polish "głodny"
      },
      {
        english: "knife",
        polish "nóż"
      },
      {
        english: "pill",
        polish "tabletka"
      },
      {
        english: "plate",
        polish "talerz"
      },
      {
        english: "slice",
        polish "plasterek (np. wędliny), kromka"
      },
      {
        english: "spoon",
        polish "łyżka"
      },
      {
        english: "tasty",
        polish "smaczny"
      },
      {
        english: "vinegar",
        polish "ocet"
      }
];

let questions = [];
let currentQuestion = null;
let correctAnswers = 0;
let totalQuestions = 0;
let wordAttempts = {};
let completedWords = new Set();
let consecutiveIncorrect = false;
let hasShownError = false;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createStones() {
    const stonesContainer = document.getElementById('stones');
    stonesContainer.innerHTML = '';
    const containerWidth = document.querySelector('.progress-container').offsetWidth;
    const stoneWidth = 30;
    const ufoWidth = 80;
    const padding = 40;
    const availableWidth = containerWidth - stoneWidth - ufoWidth - padding;
    const stoneSpacing = availableWidth / (wordPairs.length - 1);
    
    for (let i = 0; i < wordPairs.length; i++) {
        const stone = document.createElement('div');
        stone.className = 'stone';
        stone.style.left = `${padding + (i * stoneSpacing)}px`;
        stonesContainer.appendChild(stone);
    }
}

function initializeQuestions() {
    // Get words that needed multiple attempts
    const repeatedWords = Object.entries(wordAttempts)
        .filter(([word, attempts]) => attempts > 1)
        .map(([word]) => {
            const polishWord = word.split(' (')[0];
            return wordPairs.find(pair => pair.polish === polishWord);
        });

    questions = repeatedWords.length > 0 ? repeatedWords : [...wordPairs];
    shuffleArray(questions);
    correctAnswers = 0;
    totalQuestions = 0;
    wordAttempts = {};
    completedWords.clear();
    consecutiveIncorrect = false;
    document.getElementById('summary').innerHTML = '';
    document.getElementById('questionArea').style.display = 'block';
    createStones();
    updateProgress();
    showNextQuestion();
}

function updateProgress() {
    const remainingQuestions = questions.length;
    const progress = ((wordPairs.length - remainingQuestions) / wordPairs.length) * 100;
    const alien = document.getElementById('alien');
    const containerWidth = document.querySelector('.progress-container').offsetWidth;
    const stoneWidth = 30;
    const ufoWidth = 80;
    const padding = 40;
    const availableWidth = containerWidth - stoneWidth - ufoWidth - padding;
    const stoneSpacing = availableWidth / (wordPairs.length - 1);
    
    // Calculate alien position to land on the next stone
    const currentStoneIndex = wordPairs.length - remainingQuestions;
    const position = padding + (currentStoneIndex * stoneSpacing);
    alien.style.left = `${position}px`;
    
    // Add jump animation when moving
    alien.classList.add('jump');
    setTimeout(() => alien.classList.remove('jump'), 500);
    
    document.getElementById('stats').textContent = 
        `Remaining questions: ${remainingQuestions} out of ${wordPairs.length}`;
}

function showNextQuestion() {
    if (questions.length === 0) {
        showSummary();
        return;
    }

    currentQuestion = questions.shift();
    hasShownError = false;
    const questionContainer = document.getElementById('questionArea');
    questionContainer.innerHTML = `
        <div class="question-container">
            <div class="question">Translate to English: "${currentQuestion.polish}"</div>
            <input type="text" class="answer-input" placeholder="Type your answer..." autocomplete="off">
            <button onclick="checkAnswer()">Check Answer</button>
        </div>
    `;
    const input = questionContainer.querySelector('.answer-input');
    input.focus();
    
    // Add Enter key event listener
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
}

function checkAnswer() {
    const input = document.querySelector('.answer-input');
    const answer = input.value.trim().toLowerCase();
    const correctAnswer = currentQuestion.english.toLowerCase();
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
        correctAnswers++;
        totalQuestions++;
        playSound('correctSound');
        input.disabled = true;
        input.classList.add('correct');
        document.querySelector('.question-container').innerHTML += `
            <div class="correct-answer">Correct! Well done! 🎉</div>
        `;
        setTimeout(() => {
            updateProgress();
            showNextQuestion();
        }, 1000);
        
        // Spell out the word
        spellWord(currentQuestion.english);
    } else {
        totalQuestions++;
        playSound('wrongSound');
        input.classList.add('incorrect');
        const wordKey = `${currentQuestion.polish} (${currentQuestion.english})`;
        wordAttempts[wordKey] = (wordAttempts[wordKey] || 0) + 1;
        
        if (!hasShownError) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'incorrect-answer';
            messageDiv.textContent = `Incorrect. The correct answer is: "${currentQuestion.english}"`;
            document.querySelector('.question-container').appendChild(messageDiv);
            hasShownError = true;
        }
        
        if (!consecutiveIncorrect) {
            questions.push(currentQuestion);
            consecutiveIncorrect = true;
        }
        
        // Clear input and keep focus immediately
        input.value = '';
        input.focus();
    }
}

function showSummary() {
    const questionArea = document.getElementById('questionArea');
    const summary = document.getElementById('summary');
    const percentage = (correctAnswers / totalQuestions * 100).toFixed(1);
    
    // Get words that needed multiple attempts
    const repeatedWords = Object.entries(wordAttempts)
        .filter(([word, attempts]) => attempts > 1)
        .map(([word]) => word);
    
    questionArea.style.display = 'none';
    playSound('completionSound');
    
    // Start confetti animation
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
    
    summary.innerHTML = `
        <div class="completion-screen">
            <h1>🎉 Congratulations! 🎉</h1>
            <div class="score">Your Score: ${percentage}%</div>
            <p>You completed ${totalQuestions} questions with ${correctAnswers} correct answers!</p>
            ${repeatedWords.length > 0 ? `
                <div class="repeated-words">
                    <h3>Words to Practice More:</h3>
                    <ul>
                        ${repeatedWords.map(word => `<li>${word}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <p>Great job! You've completed the lesson! 🚀</p>
        </div>
    `;
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play().catch(error => console.log('Error playing sound:', error));
}

function spellWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Slightly slower rate for better clarity
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeQuestions();
}); 
