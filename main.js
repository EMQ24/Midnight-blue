let hard = false
document.getElementById("hard").addEventListener("click", () => {
    hard = !hard
    if (hard) document.getElementsByTagName("body")[0].style.backgroundImage = "unset"
    else document.getElementsByTagName("body")[0].style.backgroundImage = "url(background.png)"
})

let whiteWidth = 30;
let blackWidth = 15;
let scale = [
    {
        letter: "C",
        isFlat: false,
    },
    {
        letter: "D",
        isFlat: true,
    },
    {
        letter: "D",
        isFlat: false,
    },
    {
        letter: "E",
        isFlat: true,
    },
    {
        letter: "E",
        isFlat: false,
    },
    {
        letter: "F",
        isFlat: false,
    },
    {
        letter: "G",
        isFlat: true,
    },
    {
        letter: "G",
        isFlat: false,
    },
    {
        letter: "A",
        isFlat: true,
    },
    {
        letter: "A",
        isFlat: false,
    },
    {
        letter: "B",
        isFlat: true,
    },
    {
        letter: "B",
        isFlat: false,
    }
]
let keys = [];
let symbols = "1!2@34$5%6^78*9(0qQwWeErtTyYuiIoOpPasSdDfgGhHjJklLzZxcCvVbBnm"
let left = 0;
for (let octave = 2, noteNumber = 0; octave <= 6; octave++) {
    let octaveDiv = document.createElement("div");
    // octaveDiv.className = "octave";
    // document.getElementById("key").appendChild(octaveDiv);
    for (let i = 0; i < scale.length; i++, noteNumber++) {
        let note = scale[i];
        if (noteNumber != 0) {
            previousNote = keys[noteNumber - 1];
            //if the previous note is flat
            if (previousNote.isFlat) {
                //move one half black width to the right
                left = left + blackWidth / 2;
                //if the previous note is not flat
            } else {
                //if the current note is flat
                if (note.isFlat) {
                    left = left + whiteWidth - blackWidth / 2;
                } else {
                    left = left + whiteWidth;
                }
            }
        }
        let keyButton = document.createElement("button");
        let color = "white";
        if (note.isFlat) {
            color = "black";
        }
        keyButton.style.setProperty("left", left + "px");
        // octaveDiv.appendChild(keyButton);
        document.getElementById("key").appendChild(keyButton)
        keyButton.className = color + " key";
        keyButton.textContent = symbols[noteNumber]
        keyButton.addEventListener("click", check)
        let sample = note.letter;
        if (note.isFlat) {
            sample += "b";
        }
        sample += octave;
        let keyObject = { letter: note.letter, isFlat: note.isFlat, src: sample, button: keyButton, key: symbols[noteNumber] }
        keys.push(keyObject);
        keyButton.keyObject = keyObject;
    }
}

let cur = document.getElementById("score")
let sequence = []

let delay = 1300 //2.93 sec is the duration of the files but player migt get inpatient
let min = 100 //0.1 secs, during testing is still intelligible

//would be more convenient to add to keyObject? whatever sashrik working on the object right now so not now
function play(keyObject) {
    new Audio(keyObject.src).play()
}

let timer
//Displays the sequence
function display() {
    sequence.push(keys[Math.floor(Math.random * keys.length)])
    flash(sequence[0])
    if (sequence.size <= 1) timer = setInterval(function () {
        flash(sequence[0])  //aaaaaaa
    }, delay);
    else {
        index = 1
        timer = setTimeout(recurseFlash, delay)
    }
}

function recurseFlash() {
    flash(sequence[index])
    index++
    if (index < sequence.length) timer = setTimeout(recurseFlash, delay)
}

function check() {
    clearInterval(timer)
    if (this.textContent == sequence[index].key) {
        flash(sequence[index])
        index++
        if (sequence.length > 0 && sequence.length % 5 == 0 && index == sequence.length) {
            new Audio("0speedup.mp3").play()
            delay -= 100
        }
    } else {
        err(this.keyObject)
    }
}

function keyPress(event) {
    if (event.key == sequence[index].key) {
        flash(sequence[index])
        index++
    } else {
        err(keys[symbols.indexOf(event.key)])
    }
}

function flash(keyObject) {
    if (!hard) keyObject.button.focus()
    play(keyObject)
    timer = setTimeout(display, delay)
}

function err(keyObject) {
    keyObject.button.focus()
    play(keyObject)
    keyObject.button.className += " err"
    timer = setTimeout(() => { keyObject.button.classList.remove("err"); display() }, 2930)
    new Audio("mp3/0fail.mp3").play()
    sequence = []
    delay = 1300
}

display()

/* Testing index.html code:
<body>
    <script>new Audio('mp3/Ab4.mp3').play()
        setTimeout(function () { new Audio('mp3/Eb6.mp3').play() }, 1300)
    </script>
</body>
*/