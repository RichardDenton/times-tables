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
                if (answerDisplayString > 0 && !testStarted) {
                    startStandardTest(answerDisplayString);
                }
        }
    }
}

const startStandardTest = function(test) {
    timesTable = Number(test);
    testStarted = true;
    for (let x=1; x <= 12; x++) {
        testArray[x-1] = x;
    }
    promptQuestion(testArray.shift(), timesTable);
}

const promptQuestion = function(factor1, factor2) {
    questionDisplay.textContent = factor1 + " × " + factor2 + " =";
    currentQuestion = [factor1, factor2];
    clearAnswerDisplay();
}

const updateAnswerDisplay = function(character) {
    if (answerDisplayString > 0) {
        answerDisplayString += character;
    } else {
        answerDisplayString = character;
    }
    if (!testStarted) questionDisplay.textContent = "Press standard or random to begin";
    if (answerDisplayString > 12 && !testStarted) answerDisplayString = "12";
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
    const resultText = document.getElementById(`q${questionNumber}result`);
    resultText.textContent = `${currentQuestion[0]} × ${currentQuestion[1]} = ${answerDisplayString} ${mark} ${correctAnswer}`;
}

const clearAnswerDisplay = function() {
    answerDisplayString = '0';
    answerDisplay.textContent = answerDisplayString;
}

let testArray = []; // Store 1 - 12 to allow tests to be randomised
let currentQuestion = []; 

let timesTable = 0;
let score = 0;
let questionNumber = 1;
let testStarted = false;

const questionDisplay = document.getElementById("questions");
const answerDisplay = document.getElementById("answer");
let answerDisplayString = "";
const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener('click', buttonPress));
