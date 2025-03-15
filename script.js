// Initialize Firebase and Firestore
const db = firebase.firestore();

const wordPairsList = {
    list5: [
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
        }
    ],
    list6: [
        {
            english: "walk",
            polish: "chodzić pieszo, spacerować"
        },
        {
            english: "wash",
            polish: "myć (się)"
        },
        {
            english: "watch",
            polish: "oglądać"
        },
        {
            english: "fast",
            polish: "szybki"
        },
        {
            english: "scary",
            polish: "przerażający"
        },
        {
            english: "strong",
            polish: "silny"
        },
        {
            english: "stupid",
            polish: "głupi"
        },
        {
            english: "tired",
            polish: "zmęczony"
        },
        {
            english: "ugly",
            polish: "brzydki"
        },
        {
            english: "wet",
            polish: "mokry"
        },
        {
            english: "bat",
            polish: "nietoperz"
        },
        {
            english: "camel",
            polish: "wielbłąd"
        },
        {
            english: "chimpanzee",
            polish: "szympans"
        },
        {
            english: "flamingo",
            polish: "flaming"
        },
        {
            english: "killer whale",
            polish: "orka"
        },
        {
            english: "leopard",
            polish: "lampart"
        },
        {
            english: "back",
            polish: "plecy, grzbiet"
        },
        {
            english: "beach",
            polish: "plaża"
        },
        {
            english: "both",
            polish: "obydwoje"
        },
        {
            english: "closer",
            polish: "bliżej"
        },
        {
            english: "desert",
            polish: "pustynia"
        },
        {
            english: "e-pal",
            polish: "korespondencyjny znajomy"
        },
        {
            english: "free time",
            polish: "czas wolny"
        },
        {
            english: "holidays",
            polish: "wakacje"
        },
        {
            english: "I'm good at it.",
            polish: "Jestem w tym dobry/dobra."
        },
        {
            english: "idea",
            polish: "pomysł"
        },
        {
            english: "lots of",
            polish: "dużo, mnóstwo"
        },
        {
            english: "pet",
            polish: "zwierzątko domowe"
        },
        {
            english: "tourist",
            polish: "turysta"
        },
        {
            english: "usually",
            polish: "zwykle"
        },
        {
            english: "carry",
            polish: "nosić"
        },
        {
            english: "climb",
            polish: "wspinać się"
        },
        {
            english: "do tricks",
            polish: "robić sztuczki"
        },
        {
            english: "do, make",
            polish: "robić"
        },
        {
            english: "drink",
            polish: "pić"
        },
        {
            english: "drive",
            polish: "prowadzić samochód, jeździć"
        },
        {
            english: "eat",
            polish: "jeść"
        },
        {
            english: "fly",
            polish: "latać"
        },
        {
            english: "go",
            polish: "iść"
        },
        {
            english: "learn",
            polish: "uczyć się, dowiadywać się"
        },
        {
            english: "listen to",
            polish: "słuchać"
        },
        {
            english: "live",
            polish: "mieszkać, żyć"
        },
        {
            english: "meet",
            polish: "spotykać, poznawać"
        },
        {
            english: "play",
            polish: "bawić się, grać"
        },
        {
            english: "read",
            polish: "czytać"
        },
        {
            english: "ride",
            polish: "jeździć"
        },
        {
            english: "run",
            polish: "biegać"
        },
        {
            english: "rest",
            polish: "odpoczywać"
        },
        {
            english: "speak",
            polish: "mówić"
        },
        {
            english: "sleep",
            polish: "spać"
        },
        {
            english: "swim",
            polish: "pływać"
        },
        {
            english: "train",
            polish: "trenować, ćwiczyć"
        },
        {
            english: "visit",
            polish: "odwiedzać"
        },
        {
            english: "wake up",
            polish: "budzić się"
        }
    ]
};

let wordPairs = [];
let questions = [];
let currentQuestion = null;
let correctAnswers = 0;
let totalQuestions = 0;
let wordAttempts = {};
let completedWords = new Set();
let consecutiveIncorrect = false;
let hasShownError = false;
let currentUser = null;
let userStats = {
    totalSessions: 0,
    wordsLearned: {},
    lastList: null,
    overallScore: 0,
    sessionHistory: []
};

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
    
    const currentStoneIndex = wordPairs.length - remainingQuestions;
    const position = padding + (currentStoneIndex * stoneSpacing);
    alien.style.left = `${position}px`;
    
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
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
}

async function checkAnswer() {
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
        
        await updateWordStats(currentQuestion.english, true);
        
        setTimeout(() => {
            updateProgress();
            showNextQuestion();
        }, 1000);
        
        spellWord(currentQuestion.english);
    } else {
        totalQuestions++;
        playSound('wrongSound');
        input.classList.add('incorrect');
        
        await updateWordStats(currentQuestion.english, false);
        
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
        
        input.value = '';
        input.focus();
    }
}

async function showSummary() {
    const questionArea = document.getElementById('questionArea');
    const summary = document.getElementById('summary');
    const percentage = (correctAnswers / totalQuestions * 100).toFixed(1);
    
    userStats.totalSessions++;
    userStats.overallScore = (userStats.overallScore * (userStats.totalSessions - 1) + (correctAnswers / totalQuestions)) / userStats.totalSessions;
    
    userStats.sessionHistory.push({
        date: new Date().toISOString(),
        list: userStats.lastList,
        score: percentage,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers
    });
    
    await saveUserData();
    
    const repeatedWords = Object.entries(wordAttempts)
        .filter(([word, attempts]) => attempts > 1)
        .map(([word]) => word);
    
    questionArea.style.display = 'none';
    playSound('completionSound');
    
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
            <h1>🎉 Congratulations, ${currentUser ? currentUser.name : 'Student'}! 🎉</h1>
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
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
}

function showListSelection() {
    const container = document.getElementById('questionArea');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="list-selection">
            <h2>Choose a Word List</h2>
            <div class="list-buttons">
                <button onclick="selectList('list5')">List 5 (Food & Cooking)</button>
                <button onclick="selectList('list6')">List 6 (Animals)</button>
            </div>
        </div>
    `;
}

async function selectList(listName) {
    wordPairs = wordPairsList[listName];
    userStats.lastList = listName;
    await saveUserData();
    initializeQuestions();
}

async function handleCredentialResponse(response) {
    const responsePayload = jwt_decode(response.credential);
    
    currentUser = {
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture
    };
    
    await loadUserData();
    updateUserStatsDisplay();
    
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('appContent').style.display = 'block';
    
    if (userStats.lastList) {
        selectList(userStats.lastList);
    } else {
        showListSelection();
    }
}

function signOut() {
    google.accounts.id.disableAutoSelect();
    currentUser = null;
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('appContent').style.display = 'none';
}

async function saveUserData() {
    if (currentUser) {
        const userData = {
            stats: userStats,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            await db.collection('users').doc(currentUser.email).set(userData);
            console.log('User data saved successfully');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }
}

async function loadUserData() {
    if (currentUser) {
        try {
            const doc = await db.collection('users').doc(currentUser.email).get();
            
            if (doc.exists) {
                const userData = doc.data();
                userStats = userData.stats;
                updateUserStatsDisplay();
            } else {
                userStats = {
                    totalSessions: 0,
                    wordsLearned: {},
                    lastList: null,
                    overallScore: 0,
                    sessionHistory: []
                };
                await saveUserData();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
}

function updateUserStatsDisplay() {
    if (currentUser) {
        // Update user info
        const userInfoDiv = document.getElementById('userName');
        userInfoDiv.innerHTML = `
            <div class="user-header">
                <img src="${currentUser.picture}" alt="${currentUser.name}" class="user-avatar">
                <span>Welcome, ${currentUser.name}!</span>
            </div>`;

        // Update stats display
        const statsDisplay = document.getElementById('userStatsDisplay');
        const totalWords = Object.keys(userStats.wordsLearned).length;
        const masteredWords = Object.entries(userStats.wordsLearned)
            .filter(([_, stats]) => stats.successRate >= 0.8).length;
        
        statsDisplay.innerHTML = `
            <div class="user-stats">
                <div class="stats-details">
                    <div class="stat-item">
                        <span class="stat-label">Total Sessions</span>
                        <span class="stat-value">${userStats.totalSessions}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Words Learned</span>
                        <span class="stat-value">${totalWords}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Mastered Words</span>
                        <span class="stat-value">${masteredWords}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Overall Score</span>
                        <span class="stat-value">${(userStats.overallScore * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>`;
    }
}

async function updateWordStats(word, isCorrect) {
    if (!userStats.wordsLearned[word]) {
        userStats.wordsLearned[word] = {
            attempts: 0,
            successes: 0,
            lastAttempt: null,
            successRate: 0
        };
    }
    
    const stats = userStats.wordsLearned[word];
    stats.attempts++;
    if (isCorrect) stats.successes++;
    stats.lastAttempt = new Date().toISOString();
    stats.successRate = stats.successes / stats.attempts;
    
    await saveUserData();
} 
