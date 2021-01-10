const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')

let numOfCorrect = 0
let numOfIncorrect = 0
let wpmCounts = []
let dm = false

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
            if (dm == true){
                wpmCounts.push(0)
                document.getElementById("avgWpmDisplay").innerHTML = "Avg. WPM: " + getAvg(wpmCounts)
                renderNewQuote()
            }
            characterSpan.classList.add('incorrect')
            characterSpan.classList.remove('correct')
            correct = false
            numOfIncorrect += 1
        }
    })

    if (arrayQuote.length == arrayValue.length) {
        wpmCounts.push(Math.floor((totalChars / 5) / (time / 60)))
        document.getElementById("avgWpmDisplay").innerHTML = "Avg. WPM: " + getAvg(wpmCounts)
        renderNewQuote()}
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

    if (dm == true){
        document.getElementById("dmButton").innerHTML = "Exit Instant Death Mode"
    }
    else{
        document.getElementById("dmButton").innerHTML = "Instant Death Mode"
    }

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
    if ((numOfCorrect + numOfIncorrect) * 100 == 0)
    {
        document.getElementById("accDisplay").innerHTML = "Accuracy: " + "100%"
    }
    else
    {
        document.getElementById("accDisplay").innerHTML = "Accuracy: " + Math.floor(numOfCorrect / (numOfCorrect + numOfIncorrect) * 100) + "%"
    }
}

function getAvg(arr){
    let sum = 0
    let len = arr.length

    for (var i in arr)
    {
        sum += arr[i]
    }

    return Math.floor(sum / len)
}

function triggerDM(){
    dm = !dm
    wpmCounts = []
    document.getElementById("avgWpmDisplay").innerHTML = "Avg. WPM: " + 0
    renderNewQuote()
}

renderNewQuote()