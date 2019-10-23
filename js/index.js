const img = [
  'https://octodex.github.com/images/steroidtocat.png',
  'https://octodex.github.com/images/megacat-2.png',
  'https://octodex.github.com/images/dodgetocat_v2.png',
  'https://octodex.github.com/images/mcefeeline.jpg',
  'https://octodex.github.com/images/ironcat.jpg',
  'https://octodex.github.com/images/gracehoppertocat.jpg',
  'https://octodex.github.com/images/spidertocat.png',
  'https://octodex.github.com/images/octocat-de-los-muertos.jpg',
  'https://octodex.github.com/images/saritocat.png',
  'https://octodex.github.com/images/plumber.jpg',
  'https://octodex.github.com/images/linktocat.jpg',
  'https://octodex.github.com/images/kimonotocat.png'	
];

let total = 0;
let move = 0;
let count = 1;
let first_card = null;
let secn_card = null;

let stop_fa = false;
let stop_fc = true;
let stop_time = true;

const board = document.querySelector('.board');
const start = document.querySelector('.start');
const again = document.querySelector('.again');
const room = document.querySelector('.room');

const pad = val => val > 9 ? val : "0" + val;

//4*6 card group;
let card_id = 0;
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 6; j++) {
		const div = document.createElement('div');
		div.classList.add('card');
		div.dataset.id = card_id;
		room.appendChild(div);
		const front = document.createElement('div');
		front.classList.add('front');
		front.classList.add('face');
		
		const back = document.createElement('div');
		back.classList.add('back');
		back.classList.add('face');
		back.dataset.bid = 0;
		
		div.appendChild(front);
		div.appendChild(back);
    card_id++;
  }
	
	const br = document.createElement('br');
  room.appendChild(br);
}

start.addEventListener('click', () => {
  total = 0;
  stop_fa = true;
  stop_fc = false;
  stop_time = false;

  const cards = document.querySelectorAll('.card');
  Array.from(cards).forEach(card => card.classList.remove('flip'));
  start.style.display = 'none';
  randomIMG();
});

again.addEventListener('click', () => {
  stop_fa = false;
  stop_fc = true;
  start.style.display = 'block';
  board.style.display = 'none';
	const cards = document.querySelectorAll('.card');
  Array.from(cards).forEach(card => card.classList.remove('fliped'));
  randomIMG();
  flip_auto();
  flip_auto();
});

board.style.display = 'none';
randomIMG();
flip_auto();
flip_auto();
flip_auto();
flip_click();

function randomIMG() {
  let c_array = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12];
  let c_length = c_array.length;
  const cards = document.querySelectorAll('.card');

  Array.from(cards).forEach((card) => {
    const r_id = Math.floor(Math.random() * (c_length - 1));
    const temp = c_array[r_id];
    c_array[r_id] = c_array[c_length - 1];
    c_array[c_length - 1] = temp;
    c_length--;

    const cardBack = card.querySelector('.back');
    cardBack.style.backgroundImage = `url('${img[temp - 1]}')`;
    cardBack.style.backgroundRepeat = 'no-repeat';
    cardBack.style.backgroundSize = '100%';
    cardBack.dataset.bid = temp;
  });

  return 0;
}

function flip_click() {
  total = 0;  
  move = 0;
  count = 1;
  let i = 0;
  let first_card = null;
  let secn_card = null;
  const cards = document.querySelectorAll('.card');
  Array.from(cards).forEach((card, i, arr) => {
    const front = card.querySelector('.front');
    front.addEventListener('click', () => {
      if (stop_fc) {
        return 0;
      }

      front.parentElement.classList.toggle('flip');

      move++;
      document.querySelector('.c_move').innerHTML = move;

      if (count == 1){
        first_card = card.querySelector('.back').dataset.bid;
      } else if (count == 2){
        secn_card = card.querySelector('.back').dataset.bid;
      }

      if (first_card == secn_card) {
        const wonCards = document.querySelectorAll(`[data-bid="${first_card}"]`);
        Array.from(wonCards).forEach(el => el.parentElement.classList.add('fliped'));
        total++;

        if (total === 12) {
          stop_time = true;
          const sec_f = pad(++sec % 60); 
          const min_f = pad(parseInt(sec / 60, 10));
          stop_fc = reset(move,sec_f,min_f);
          stop_fc = true;
          move = 0;
        }
      }

      if (stop_fc) return;

      count++
      if (count > 2) {
        first_card = null;
        secn_card = null;
        count = 1;
        setTimeout(function(){
          arr.forEach(c => c.classList.remove('flip'));
        }, 400);
      }
    });
  });

  let sec = 0;
  setInterval(() => {
    if (stop_time) {
      sec = 0;
      return
    }
    document.querySelector('.sec').innerHTML = pad(++sec % 60);
    document.querySelector('.min').innerHTML = pad(parseInt(sec / 60, 10));
  }, 1000);
}

const randomNum = (min, max) => Math.floor(Math.random() * ((max - min) + 1) + min);

function flip_auto(time) {	
  setTimeout(() => {
    if(stop_fa) return;

    const r_ran = randomNum(1, 24);
		const rEl = document.querySelector(`[data-id="${r_ran}"]`);
    if (rEl) rEl.classList.toggle('flip');

    const newTime = randomNum(500, 1000);	
    flip_auto(newTime);
  }, time);
}

function reset(move, sec, min) {
  board.style.display = 'block';
  board.querySelector('.scr_moves').innerHTML = 0;
  board.querySelector('.scr_sec').innerHTML = sec;
  board.querySelector('.scr_min').innerHTML = min;
  return true;
}
