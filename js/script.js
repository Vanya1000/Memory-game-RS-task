"use strict";

const resultBlock = document.querySelector('.result__body');
const gameField = document.querySelector('.main__game');

const reset = document.querySelector('.main__resetButton');
const headerResult = document.querySelector('.header__result');
const mainResult = document.querySelector('.main__winner');


const animal = ['bear', 'cat', 'dog', 'fox', 'lion', 'monkey', 'owl', 'panda', 'pig', 'rabbit'];

function createCards(animal) {
	const game__card = `
	<div class="game__card" data-animal="${animal}">
						<div class="game__front-card">
							<img src="./assets/svg/${animal}.svg" alt="${animal}">
						</div>
						<div class="game__back-card">
							<img src="./assets/svg/back.svg" alt="back">
						</div>
						
					</div>`;
	gameField.insertAdjacentHTML('beforeend', game__card)
}

function paintCards(animal) {
	animal.map((animal) => {
		createCards(animal)
		createCards(animal)
	})
}
paintCards(animal)


const cards = document.querySelectorAll('.game__card');


const cardsCount = cards.length;
let openCardsCount = 0;
let firstCard = null;
let secondCard = null;
let isLock;
let attemptCount = 0;
let winnerHistory = [];
let winnerHistoryTime = [];



function flipCard(event) {
	playSound('./assets/mp3/push.mp3', 1)
	if (isLock) return;
	event.classList.add('flip');
	if (firstCard === null) {
		firstCard = event;
		firstCard.style.pointerEvents = 'none';
	} else {
		secondCard = event;
		isLock = true
		validateCards();
	}

}

function validateCards() {
	if (firstCard.dataset.animal === secondCard.dataset.animal) {
		openCardsCount += 2;
		attemptCount += 1;
		mainResult.textContent = `Moves: ${attemptCount}`;
		mainResult.style.opacity = "1";
		cardsCount === openCardsCount ? successGame() : trueCardOpen();

	} else {
		unflipCards();
		attemptCount += 1;
		mainResult.textContent = `Moves: ${attemptCount}`;
		mainResult.style.opacity = "1";
	}
}

function trueCardOpen() {
	playSound('./assets/mp3/open.mp3', 1)
	firstCard = null;
	secondCard = null;
	isLock = false;
}

function unflipCards() {
	setTimeout(() => {
		firstCard.style.pointerEvents = 'auto';
		firstCard.classList.remove('flip')
		secondCard.classList.remove('flip')
		firstCard = null;
		secondCard = null;
		isLock = false;
	}, 1000);
}


function saveResult(result) {
	winnerHistory.length < 10 ? winnerHistory.push(result) : winnerHistory = [...winnerHistory.slice(1, 10), result];
	winnerHistoryTime.length < 10 ? winnerHistoryTime.push(getDate()) : winnerHistoryTime = [...winnerHistoryTime.slice(1, 10), getDate()];
}

function resetGame() {
	!(openCardsCount === 0) && playSound('./assets/mp3/reset.mp3', 1);
	playSound('./assets/mp3/push.mp3', 1)
	firstCard = null;
	secondCard = null;
	openCardsCount = 0;
	attemptCount = 0;
	isLock = false;
	let time = 0;
	for (let card of cards) {
		time += 30;
		setTimeout(() => {
			card.classList.remove('flip');
		}, time);
		card.style.pointerEvents = 'auto';
	}
	headerResult.textContent = 'Good luck in the game!'
	headerResult.classList.remove('winner')
	mainResult.style.opacity = "0";
	setTimeout(() => {
		shuffle();
	}, 1000);
}

reset.addEventListener('click', () => resetGame());

gameField.addEventListener('click', (event) => {
	if (event.target.closest('.game__card')) { flipCard(event.target.closest('.game__card')) }
});



function showResult(item, index) {
	const resultItem = (`<div class="result__item">
	${winnerHistoryTime[index]} moves to win - <span>${item}</span>
	</div>`)
	resultBlock.insertAdjacentHTML('beforeend', resultItem)
}

if (winnerHistory) { winnerHistory.map((item, index) => { showResult(item, index) }) }


function successGame() {
	playSound('./assets/mp3/winner.mp3', 0.4);
	headerResult.classList.add('winner');
	headerResult.textContent = `You winner!`;
	saveResult(attemptCount)
	paintResult();
	mainResult.textContent = `You winner! After spending ${attemptCount} moves`;
	mainResult.style.opacity = "1";
}


function shuffle() {
	cards.forEach(card => {
		let ramdomPos = Math.floor(Math.random() * cards.length);
		card.style.order = ramdomPos;
	});
}


(function shuffleStart() {
	cards.forEach(card => {
		let ramdomPos = Math.floor(Math.random() * cards.length);
		card.style.order = ramdomPos;
	});
})();



function playSound(url, vol) {
	let audio = document.createElement('audio');
	audio.style.display = "none";
	audio.src = url;
	audio.volume = vol;
	audio.autoplay = true;
	audio.onended = function () {
		audio.remove()
	};
	document.body.appendChild(audio);
}
function getDate() {
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0');
	let yyyy = today.getFullYear();
	let hour = today.toLocaleTimeString().slice(0, -3);

	return today = `${dd}.${mm}.${yyyy} ${hour}:   `
}



function setLocalStorage() {
	localStorage.setItem('winner', JSON.stringify(winnerHistory));
	localStorage.setItem('winnerTime', JSON.stringify(winnerHistoryTime));
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
	if (localStorage.getItem('winner')) {
		winnerHistory = JSON.parse(localStorage.getItem("winner"));
	}
	if (localStorage.getItem('winnerTime')) {
		winnerHistoryTime = JSON.parse(localStorage.getItem("winnerTime"));
	}
	paintResult();
}
window.addEventListener('load', getLocalStorage)

function paintResult() {
	resultBlock.innerHTML = "";
	winnerHistory.map((item, index) => { showResult(item, index) })
}





console.log('%c  Самооценка 70/70 ', 'background: #222; color: #bada55');
console.log(`
Вёрстка +10 (Реализованы все пункты)
Логика игры. Карточки, по которым кликнул игрок, переворачиваются согласно правилам игры +10 (Реализованы все пункты)
Игра завершается, когда открыты все карточки +10 (Реализованы все пункты)
По окончанию игры выводится её результат - количество ходов, которые понадобились для завершения игры +10 (Реализованы все пункты)
Результаты последних 10 игр сохраняются в local storage. Есть таблица рекордов, в которой сохраняются результаты предыдущих 10 игр +10 (Реализованы все пункты)
По клику на карточку – она переворачивается плавно, если пара не совпадает – обе карточки так же плавно переварачиваются рубашкой вверх +10 (Реализованы все пункты)
Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10 (Реализованы все пункты)

`)
console.log('%c  Мои улучшения: Реализовано звуковое сопровожение игрового процесса. Реализована функция перемешивания карточек при каждой новой игре. Кнопка для сброса колличества попыток после которого происходит перемешивание.', 'background: #222; color: #bada55');