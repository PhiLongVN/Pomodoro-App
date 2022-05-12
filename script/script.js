const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: 'green',
  },
  warning: {
    color: 'orange',
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: 'red',
    threshold: ALERT_THRESHOLD,
  },
};
let TIME_LIMIT = 0;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.querySelector('.block').innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

// startTimer();

/* ============================================ */
/*                   SET TIME                   */
/* ============================================ */
const setBtn = document.querySelector('.setup');
const ClearBtn = document.querySelector('.clear');

const setBlock = document.querySelector('.setBlock');
const closeBtn = document.querySelector('.closebt');

const warn = document.querySelector('.warn');
const setUp = document.querySelector('.set');

const workTime = document.querySelector('.work input');
const restTime = document.querySelector('.rest input');

setUp.addEventListener('click', handleClick);
let workTime2;
let restTime2;

function handleClick() {
  workTime2 = workTime.value;
  restTime2 = restTime.value;

  if (workTime2 && restTime2) {
    TIME_LIMIT = workTime2 * 60;
    setBlock.style.display = 'none';
    warn.style.opacity = 0;
    startTimer();
  } else {
    warn.style.opacity = 1;
  }
}
/* ============================================ */
/*                     CLEAR                    */
/* ============================================ */
ClearBtn.addEventListener('click', handleClear);

function handleClear() {
  onTimesUp();
  timePassed = 0;
  TIME_LIMIT = 0;
  timeLeft = 0;

  document.getElementById('base-timer-label').innerHTML = formatTime(timeLeft);
  setCircleDasharray();
  setColorClear();
}

function setColorClear() {
  document.getElementById('base-timer-path-remaining').classList.remove('red');
  document.getElementById('base-timer-path-remaining').classList.remove('orange');
  document.getElementById('base-timer-path-remaining').classList.add('green');
}
/* ============================================ */
/*                     SHOW                     */
/* ============================================ */
setBtn.addEventListener('click', () => {
  setBlock.style.display = 'flex';
});
closeBtn.addEventListener('click', () => {
  setBlock.style.display = 'none';
  warn.style.opacity = 0;
});

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById('base-timer-label').innerHTML =
      formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
      TIME_LIMIT = restTime2 * 60;
      timePassed = 0;
      timeLeft = TIME_LIMIT;
      startTimeRest();
    }
  }, 1000);
}

function startTimeRest() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById('base-timer-label').innerHTML =
      formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
      TIME_LIMIT = workTime2 * 60;
      timePassed = 0;
      timeLeft = TIME_LIMIT;
      startTimer();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById('base-timer-path-remaining')
      .classList.remove(warning.color);
    document
      .getElementById('base-timer-path-remaining')
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById('base-timer-path-remaining')
      .classList.remove(info.color);
    document
      .getElementById('base-timer-path-remaining')
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById('base-timer-path-remaining')
    .setAttribute('stroke-dasharray', circleDasharray);
}
