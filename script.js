//Выбор элементов на странице html
var cardsField = document.querySelector("#cards");
var resetBlock = document.querySelector("#reset");
var resetBtn = document.querySelector("#reset-btn");
var startBtn = document.querySelector("#start-btn");
var nextBtn = document.querySelector("#next-btn");
var muteBtn = document.querySelector("#mute");
var turns = document.querySelector("#turns");
var timeCounter = document.querySelector("#time");
var sound = document.getElementById("back-music");
// объявление переменных
var countCards = 16;
var totalFlips = 0;
var time;
var minutes = 0;
var seconds = 0;
var images = [];
var images1 = [1,2,3,4,5,6,7,8,9,10,11,12,
13,14,15,16,17,18,19,21,22,23,24,25,26];
var selected = [];
var deletedCards = 0;
var pause = false;
var gameStarted = false;
muteBtn.className = "off";

//создаем поле для  игры
function createField() {
	for(let i = 0; i < countCards; i ++) {
	const li = document.createElement("li");
	li.id = i;
	cardsField.appendChild(li);
	}
}
createField();

//функция для копирования картинок из исходного массива
const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []
    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }
    return randomPicks
}

//функция для перетасовки элементов массива
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

//наполнение игрового поля рандомными картинками
function pushCardImage() {
	var items = pickRandom(images1, countCards/2);
	images = shuffle([...items,...items]);
}
pushCardImage();

//включение и отключение звука в игре
muteBtn.onclick = function() {
	if(sound.muted == true) {
	sound.muted = false;
	muteBtn.className = "off";
	}
	else {
		sound.muted = true;
		muteBtn.className = "on";
	}
}

// проигрывание фоновой музыки
function playSound() {
          sound.play();
      }

// запуск игры 
startBtn.onclick = function start() {
	startGame();
	playSound();
	timer();
}

function startGame() {
gameStarted = true;
startBtn.className = "off";
startBtn.disabled = true;
}

//функция таймера в игре
function timer() {
	time = setInterval(function() {
		if(gameStarted == true){
		seconds++;
			if (seconds == 60) {
				minutes++;
				seconds = 0;
			}
		timeCounter.innerHTML = " Timer: " + minutes + " Mins " + seconds + " Secs" ;
		turns.innerHTML = totalFlips + " turns";
		}
	}, 1000);
}

//функция остановки таймера
function stopTimer() {
	clearInterval(time);
}

// выбор карточки на поле
cardsField.onclick = function(event) {
	if(pause == false && gameStarted == true) {
		var element = event.target;
		if(element.tagName == "LI" && element.className != "active") {
			totalFlips++; // количество ходов
			selected.push(element);
			element.className = "active";
			var img = images[element.id];
			element.style.backgroundImage = "url(images/" + img + ".png)"; // присваивание изображения выбранной карточке
			if(selected.length == 2) {
				pause = true;
				if(images[selected[0].id] == images[selected[1].id]) {
				selected[0].style.visibility = "hidden";
				selected[1].style.visibility = "hidden";
				deletedCards = deletedCards + 2;
				}
				setTimeout(refreshCards, 800);
			}
		}
	
	}
}

// обратное переворачивание карт
function refreshCards() {
	for(var i = 0; i < countCards; i++) {
		cardsField.children[i].className = "";
		cardsField.children[i].style.backgroundImage = "url(images/back.png)";
	}
	restart();
	selected = [];
	pause = false;
}

//перезапуск игры
function restart() {
	if(deletedCards == countCards) {
		resetBlock.style.display = "block";
		gameStarted = false;
		stopTimer();
		resetBtn.onclick = function() {
		location.reload();
		}
	}
}

// следующий уровень по нажатию кнопки
nextBtn.onclick = function() {
	//увеличение поля игры
		if(countCards == 16 && deletedCards == countCards) {
			countCards = 24;
			cardsField.style.height = "400px";
			cardsField.style.width = "600px";
		}
		else if(countCards == 24 && deletedCards == countCards) {
			countCards = 30;
			cardsField.style.height = "500px";
			cardsField.style.width = "600px";
			}
			else if(countCards == 30 && deletedCards == countCards) {
				countCards = 36;
				cardsField.style.height = "600px";
				cardsField.style.width = "600px";
				}
				else {nextBtn.style.display = "none";
				}
		//сброс переменных в начальные позиции
		minutes = 0;
		seconds = 0;
		totalFlips = 0;
		startBtn.className = "";
		startBtn.disabled = false;
		cardsField.innerHTML ="";
		deletedCards = 0;
		resetBlock.style.display = "none";
		images = [];
		//заполнение игрового поля картинками
		createField();
		pushCardImage();
	}
