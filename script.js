const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')

let numOfCorrect = 0
let numOfIncorrect = 0

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const arrayValue = quoteInputElement.value.split('')

    let correct = true
    numOfCorrect = 0
    numOfIncorrect = 0

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]
        if (character == null) {
            characterSpan.classList.remove('incorrect')
            characterSpan.classList.remove('correct')
            correct = false
        }
        else if (character == characterSpan.innerText) 
        {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
            numOfCorrect += 1
        } 
        else {
            characterSpan.classList.add('incorrect')
            characterSpan.classList.remove('correct')
            correct = false
            numOfIncorrect += 1
        }
    })

    if (arrayQuote.length == arrayValue.length) {renderNewQuote()}
})

function getRandomQuote()
{
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json()
        .then(data => data.content))
}

async function renderNewQuote() {
    numOfCorrect = 0
    numOfIncorrect = 0
    startTimer()
    document.getElementById("wpmDisplay").innerHTML = "WPM: " + 0
    document.getElementById("accDisplay").innerHTML = "Accuracy: " + 100 + "%"
    const quote = await getRandomQuote()
    quoteDisplayElement.innerText = ''
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
    quoteInputElement.value = null
}

let startTime
function startTimer() {
    timerElement.innerText = 0
    startTime = new Date()
    setInterval(() => {
        displayWPM(quoteInputElement.value.split(''))
        displayAcc()
        timer.innerText = getTimerTime()
    }, 1000)
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000)
}

function displayWPM(arrayValue) {
    time = timerElement.innerText
    if (time != 0){
        totalChars = arrayValue.length
        document.getElementById("wpmDisplay").innerHTML = "WPM: " + Math.floor((totalChars / 5) / (time / 60))
    }
}

function displayAcc() {
    console.log(numOfCorrect)
    console.log(numOfIncorrect)
    if ((numOfCorrect + numOfIncorrect) * 100 == 0)
    {
        document.getElementById("accDisplay").innerHTML = "Accuracy: " + "100%"
    }
    else
    {
        document.getElementById("accDisplay").innerHTML = "Accuracy: " + Math.floor(numOfCorrect / (numOfCorrect + numOfIncorrect) * 100) + "%"
    }
}

renderNewQuote()