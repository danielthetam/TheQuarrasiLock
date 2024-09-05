const canvas = document.getElementById("canvas")

canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

const ctx = canvas.getContext("2d");

const bars = [
    [1, 0, 1, 1],
    [1, 1, 0, 0],
    [0, 1, 0, 0]
]

var barsIsRight = [
    true,
    true,
    true
]

var leftSensor = 0
var rightSensor = 0

var leftAlarm = false
var rightAlarm = false

function updateSensors() {
    leftSensor = 0
    rightSensor = 0
    for (column=0; column<bars[0].length; ++column) {
        var leftCrystals = 0
        var rightCrystals = 0

        for (row=0; row<bars.length; ++row) {
            const isRight = barsIsRight[row]

            if (bars[row][column] == 1) {
                if (isRight) {
                    ++rightCrystals;
                }
                else {
                    ++leftCrystals;
                }
            }
        }

        if (leftCrystals % 2 == 0 & leftCrystals != 0) {
            ++leftSensor;
        }
        else if (rightCrystals % 2 == 0 & rightCrystals != 0) {
            ++rightSensor;
        }
    }
}

// Track Details
const trackWidth = canvas.width * 0.5
const trackHeight = canvas.height * 0.025

const trackXPos = canvas.width * 0.5
const trackYPos = [
    canvas.height * 0.5 - (canvas.height * 0.3),
    canvas.height * 0.5,
    canvas.height * 0.5 + (canvas.height * 0.3)
]

// Bar Details
const barWidth = trackWidth * 0.2
const barHeight  = trackHeight * 1.75

var currentFocus = 0 // Index of the current bar in focus

var barXTranslation = [
    [trackXPos + (trackWidth/2) - (barWidth/2), 0],  // Position, Velocity
    [trackXPos + (trackWidth/2) - (barWidth/2), 0],  // Position, Velocity
    [trackXPos + (trackWidth/2) - (barWidth/2), 0],  // Position, Velocity
]

window.onload = update

var leftLoser = false
var rightLoser = false
var gameFinished = false

function checkBarMovement() {
    for (i=0; i<barXTranslation.length; ++i) {
        if (barXTranslation[i][1] != 0) {
           return true; 
        }
    }

    return false;
}

function drawBackground() {

    if (leftLoser) {
        ctx.beginPath()
        const grad=ctx.createLinearGradient(0,0, canvas.width * .3,0);
        grad.addColorStop(0, "red");
        grad.addColorStop(1, "purple"); 
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
    }
    else if (rightLoser) {
        ctx.beginPath()
        const grad=ctx.createLinearGradient(0,0, canvas.width * 1.5, 0);
        grad.addColorStop(0, "purple");
        grad.addColorStop(1, "red"); 
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
    }
    else if (gameFinished & !leftLoser & !rightLoser) {
        ctx.beginPath()
        const grad=ctx.createLinearGradient(0,0, canvas.width * .3,0);
        grad.addColorStop(0, "green");
        grad.addColorStop(1, "purple"); 
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
        
    }
    else {
        ctx.fillStyle = "purple";
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
}

function drawRect(x, y, width, height, colour) {
    ctx.beginPath()
    ctx.shadowColor = "black"
    ctx.shadowBlur = 15;
    ctx.fillStyle = colour;
    ctx.roundRect(x - (width/2), y - (height/2), width, height, 5)
    ctx.fill()
}

const crystalRadius = (1/8) * barWidth
const quarterBar = (1/4) * barWidth;
const receptorWidth = 0.05 * barWidth
const receptorHeight = 0.75 * canvas.height

function drawTracks() {
    for (i=0; i<trackYPos.length; ++i) {
        drawRect(trackXPos, trackYPos[i], trackWidth, trackHeight, "white")
        drawRect(trackXPos, trackYPos[i], trackWidth, trackHeight * 0.1, "black")
    }
    
    for (i=0; i<barXTranslation.length; ++i) {
        // Drawing receptor
        for (j=0; j<bars[i].length; ++j) {
            const receptorPosX = ((trackXPos + (trackWidth/2)) - barWidth) + ((quarterBar * (j+1)) - crystalRadius)
            drawRect(receptorPosX, trackYPos[1], receptorWidth, receptorHeight, "white")
        }
        
        for (j=0; j<bars[i].length; ++j) {
            const receptorPosX = ((trackXPos - (trackWidth/2))) + ((quarterBar * (j+1)) - crystalRadius)
            drawRect(receptorPosX, trackYPos[1], receptorWidth, receptorHeight, "white")
        }
        

        // Drawing indicators
        const indicatorColour = "red"
        for (j=0; j<bars[i].length; ++j) {  // Right indicators
            const crystalPosX = (trackXPos + (trackWidth/2) - barWidth) + ((quarterBar * (j+1)) - crystalRadius)
            ctx.beginPath()
            ctx.fillStyle = "grey"

            var rightCrystals = 0

            for (row=0; row<bars.length; ++row) {
                const isRight = barsIsRight[row]

                if (bars[row][j] == 1) {
                    if (isRight) {
                        ++rightCrystals;
                    }
                }
            }

            if (rightCrystals % 2 == 0 & rightCrystals != 0) {
                ctx.fillStyle = indicatorColour
            }

            ctx.arc(crystalPosX, trackYPos[1] + (receptorHeight/2) + 20, crystalRadius * 0.4, 0, 2 * Math.PI)
            ctx.fill() 
        }
        for (j=0; j<bars[i].length; ++j) {
            const crystalPosX = (trackXPos - (trackWidth/2)) + ((quarterBar * (j+1)) - crystalRadius)
            ctx.beginPath()
            ctx.fillStyle = "grey"

            var leftCrystals = 0

            for (row=0; row<bars.length; ++row) {
                const isRight = barsIsRight[row]

                if (bars[row][j] == 1) {
                    if (!isRight) {
                        ++leftCrystals;
                    }
                }
            }

            if (leftCrystals % 2 == 0 & leftCrystals != 0) {
                ctx.fillStyle = indicatorColour
            }

            
            ctx.arc(crystalPosX, trackYPos[1] + (receptorHeight/2) + 20, crystalRadius * 0.4, 0, 2 * Math.PI)
            ctx.fill() 
        }
    }
    
}

function drawBar() {
    for (i=0; i<barXTranslation.length; ++i) {
        if (currentFocus == i) {
            drawRect(barXTranslation[i][0], trackYPos[i], barWidth + 10, barHeight + 10, "lightblue")
        }
        drawRect(barXTranslation[i][0], trackYPos[i], barWidth, barHeight, "darkblue")

        // Draw crystals
        for (j=0; j<bars[i].length; ++j) {
            if (bars[i][j] != 0) {
                const crystalPosX = (barXTranslation[i][0] - (barWidth/2)) + ((quarterBar * (j+1)) - crystalRadius)
                ctx.beginPath()
                ctx.fillStyle = "yellow"
                ctx.arc(crystalPosX, trackYPos[i], crystalRadius * 0.8, 0, 2 * Math.PI)
                ctx.fill() 
            }
        }
    }
}

const alarmRadius = (canvas.width/2) * 0.05
const alarmMargin = 0.15
const leftAlarmX = canvas.width * alarmMargin
const leftAlarmY = canvas.width * 0.4
const rightAlarmX = canvas.width * (1 - alarmMargin)
const rightAlarmY = canvas.width * 0.4
function drawAlarm() {

    // Left alarm
    ctx.beginPath()
    ctx.fillStyle = "#A9A9A9"
    ctx.arc(leftAlarmX, leftAlarmY + 5, alarmRadius + 5, 0, 2 * Math.PI)
    ctx.fill() 
    ctx.beginPath()
    ctx.fillStyle = "#808080"
    if (leftAlarm) {
        ctx.fillStyle = "green" 
    }
    ctx.arc(leftAlarmX, leftAlarmY, alarmRadius, 0, 2 * Math.PI)
    ctx.fill() 

    // Right alarm
    ctx.beginPath()
    ctx.fillStyle = "#A9A9A9"
    ctx.arc(rightAlarmX, rightAlarmY + 5, alarmRadius + 5, 0, 2 * Math.PI)
    ctx.fill() 
    ctx.beginPath()
    ctx.fillStyle = "#808080"
    if (rightAlarm) {
        ctx.fillStyle = "green" 
    }
    ctx.arc(rightAlarmX, rightAlarmY, alarmRadius, 0, 2 * Math.PI)
    ctx.fill() 
    
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground();
    drawTracks()
    drawBar()
    drawAlarm()

    for (i=0; i<barXTranslation.length; ++i) {
        if (barXTranslation[i][1] < 0)  {  // Moving left
            const maxLeft = trackXPos - (trackWidth/2) + (barWidth/2)
            if (barXTranslation[i][0] <= maxLeft) {
                barXTranslation[i][1] = 0
                barsIsRight[i] = false
            }
        }
        else if (barXTranslation[i][1] > 0) {  // Moving right
            const maxRight = trackXPos + (trackWidth/2) - (barWidth/2)
            if (barXTranslation[i][0] >= maxRight) {
                barXTranslation[i][1] = 0
                barsIsRight[i] = true
            }
        }

        barXTranslation[i][0] += barXTranslation[i][1]
    }

    if (!checkBarMovement()) {
        updateSensors()
        if ((leftSensor == 1 && !leftAlarm)) {
            leftLoser = true
        }
        else if ((rightSensor == 1 && !rightAlarm)) {
            rightLoser = true
        }
    }

    if ((leftLoser || rightLoser) & !gameFinished) {
        new Audio("lose.wav").play()
        gameFinished = true
    }

    var allLeft = true
    for (i=0; i<barsIsRight.length; ++i) {
        if (barsIsRight[i]) {
            allLeft = false
        }
    }

    if (allLeft & !gameFinished) {
        new Audio("win.wav").play()
        gameFinished = true 
    }

    window.requestAnimationFrame(update)
}

function moveBar(index) {
    new Audio('bar_move.wav').play()
    if (barsIsRight[index]) {  // Bar is on right side => move bar left
        barXTranslation[index][1] = -5
    }
    else {
        barXTranslation[index][1] = 5
    }
}

document.addEventListener('keydown', (details) => {
    if (details.key == ' ') {
        const focusedBarX = barXTranslation[currentFocus][0]
        if (focusedBarX < (canvas.width/2)) {  // Lazy way out
            rightAlarm = false
            leftAlarm = true
        } 
        else if (focusedBarX > (canvas.width/2)) {
            leftAlarm = false
            rightAlarm = true
        }
    }
}, false)

document.addEventListener('keyup', (details) => {
    if (details.key == ' ') {
        leftAlarm = false
        rightAlarm = false
    }
})


canvas.onclick = (pointer) => {
    const pointerX = pointer.x
    const pointerY = pointer.y
    var newFocus = null

    const x = pointerX
    const y = pointerY

    const leftBorderLeft = leftAlarmX - alarmRadius
    const leftBorderRight = leftAlarmX + alarmRadius
    const leftBorderTop = leftAlarmY - alarmRadius
    const leftBorderBottom = leftAlarmY + alarmRadius
    const focusedBarX = barXTranslation[currentFocus][0]

    if (x > leftBorderLeft &
        x < leftBorderRight &
        y < leftBorderBottom & 
        y > leftBorderTop)  {
            console.log("yes babi")
            if (focusedBarX < (canvas.width/2)) {  // Lazy way out
                rightAlarm = false
                leftAlarm = true
            } 
        }

    const rightBorderLeft = rightAlarmX - alarmRadius
    const rightBorderRight = rightAlarmX + alarmRadius
    const rightBorderTop = rightAlarmY - alarmRadius
    const rightBorderBottom = rightAlarmY + alarmRadius

    if (x > rightBorderLeft &
        x < rightBorderRight &
        y < rightBorderBottom & 
        y > rightBorderTop)  {
            console.log("yes babi")
            if (focusedBarX > (canvas.width/2)) {
                leftAlarm = false
                rightAlarm = true
            }
        }

    if (checkBarMovement() || gameFinished) {
        return;
    }

    // Check bar collision
    for (i=0; i<barXTranslation.length; ++i) {
        const borderLeft = barXTranslation[i][0] - (barWidth/2)
        const borderRight = barXTranslation[i][0] + (barWidth/2)
        const borderTop = trackYPos[i] - (barHeight/2)
        const borderBottom = trackYPos[i] + (barHeight/2)

        if (pointerX > borderLeft &
            pointerX < borderRight &
            pointerY < borderBottom & 
            pointerY > borderTop)  {
                newFocus = i
            }
    }

    if (newFocus != null) {
        if (newFocus == currentFocus) {
            moveBar(newFocus) 
        }
        else {
            currentFocus = newFocus
        }
    }
}