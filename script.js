const buttonPress = function(e) {
    if (this.value) {
        updateAnswerDisplay(this.value);
    } else {
        switch (this.id) {
            case 'del': 
                del();
                break;
            case 'submit':
                if (testStarted) submitAnswer();
                break;
            case 'standardtest':
            case 'randomtest':
                if (answerDisplayString > 0 && !testStarted) {
                    startTest(answerDisplayString, this.id);
                }
                break;
        }
    }
}

const keyPress = function(e) {
    if (!testFinished) {
        if (!isNaN(e.key)) {
            updateAnswerDisplay(e.key);
        } else {
            switch (e.key) {
                case 'Backspace':
                    del();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (testStarted) submitAnswer();
                    break;
                case 'S':
                case 's':
                    if (answerDisplayString > 0 && !testStarted) {
                        startTest(answerDisplayString, 'standardtest');
                    }
                    break;
                case 'R':
                case 'r':
                    if (answerDisplayString > 0 && !testStarted) {
                        startTest(answerDisplayString, 'randomtest');
                    }
                    break;
            }
        }
    } else if (e.key === 'Enter') location.reload();
}

const startTest = function(test, type) {
    timesTable = Number(test);
    testStarted = true;
    for (let x=1; x <= maxFactor; x++) {
        testArray[x-1] = x;
    }
    if (type === 'standardtest') {
        const standardTestButton = document.getElementById('standardtest');
        standardTestButton.classList.add('selectedtest');
    } else {
        const randomTestButton = document.getElementById('randomtest');
        randomTestButton.classList.add('selectedtest');
        shuffleTest();
    }
    promptQuestion(testArray.shift(), timesTable);
}

const shuffleTest = function() {
    for (let x = testArray.length - 1; x >= 0; x--) {
        const y = Math.floor(Math.random() * x);
        const newX = testArray[y];
        const newY = testArray[x];
        testArray[x] = newX;
        testArray[y] = newY;
        }
}

const promptQuestion = function(factor1, factor2) {
    questionDisplay.textContent = factor1 + " × " + factor2 + " =";
    currentQuestion = [factor1, factor2];
    clearAnswerDisplay();
    updateScoreDisplay();
}

const updateAnswerDisplay = function(character) {
    if (answerDisplayString > 0) {
        answerDisplayString += character;
    } else {
        answerDisplayString = character;
    }
    if (!testStarted) questionDisplay.textContent = "Press standard or random to begin";
    if (answerDisplayString > maxFactor && !testStarted) answerDisplayString = `${maxFactor}`;
    answerDisplay.textContent = answerDisplayString;
}

const del = function() {
    if (answerDisplayString.length > 0) {
        answerDisplayString = answerDisplayString.slice(0, answerDisplayString.length -1);
        if (answerDisplayString === "") {
            answerDisplay.textContent = "0";
        } else {
            answerDisplay.textContent = answerDisplayString;
        }
    }
}

const submitAnswer = function() {
    let mark = '❌';
    let correctAnswer = '= ' + currentQuestion[0] * currentQuestion[1];
    if (answerDisplayString == currentQuestion[0] * currentQuestion[1]) {
        score +=1;
        correctAnswer = '';
        mark = '✅';
    }
    const resultText = document.createElement('p');
    resultText.textContent = `${questionNumber}: ${currentQuestion[0]} × ${currentQuestion[1]} = ${answerDisplayString} ${mark} ${correctAnswer}`;
    resultPanel.appendChild(resultText);
    updateScoreDisplay();
    questionNumber += 1;
    if (questionNumber <= maxFactor) {
        promptQuestion(testArray.shift(), timesTable);
    } else {
        endTest();
    }
}

const updateScoreDisplay = function() {
    scroreDisplay.textContent = `Score: ${score} / ${maxFactor}`;
}

const clearAnswerDisplay = function() {
    answerDisplayString = '0';
    answerDisplay.textContent = answerDisplayString;
}

const endTest = function() {
    questionDisplay.textContent = "Press submit to start again";
    answerDisplayString = '0';
    updateAnswerDisplay(`Final score: ${score} / ${maxFactor}`);
    buttons.forEach(button => button.removeEventListener('click', buttonPress));
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', () => location.reload());
    testFinished = true;
}

const maxFactor = 12; // Highest timestable allowed

let testArray = []; 
let currentQuestion = []; 

let timesTable = 0;
let score = 0;
let questionNumber = 1;
let testStarted = false;
let testFinished = false;

const scroreDisplay = document.getElementById('score');
const questionDisplay = document.getElementById("questions");
questionDisplay.textContent = `Enter which test to take (1-${maxFactor}):`
const answerDisplay = document.getElementById("answer");
const resultPanel = document.getElementById("results");
let answerDisplayString = "";
const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener('click', buttonPress));
window.addEventListener('keydown', keyPress);