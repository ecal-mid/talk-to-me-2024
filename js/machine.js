// ** Event Listener for Page and scripts loaded **  //
document.addEventListener('DOMContentLoaded', function (event) {
  // ** Event Listener on mouse click anywhere on start machine button  //
  const restartMachine = document.querySelector('#restartbutton');
  restartMachine.addEventListener('click', function () {
    //if (!machine_started) {
    startMachine();
    //}
  });

  // ** Event Listener For all purpose buttons you can create more in the HTML file if needed //
  // ALL PURPOSE BUTTON 1
  const all_purpose_btn_1 = document.querySelector('#all_purpose_btn_1');
  all_purpose_btn_1.innerText = 'Turn all leds off';
  all_purpose_btn_1.addEventListener('click', function () {
    // your action here
    talkCommands.ledAllOff();
  });
  // ALL PURPOSE BUTTON 2
  const all_purpose_btn_2 = document.querySelector('#all_purpose_btn_2');
  all_purpose_btn_2.innerText = 'All leds purple and blinking';
  all_purpose_btn_2.addEventListener('click', function () {
    // your action here
    talkCommands.ledAllColor('purple', 1);
  });
  // ALL PURPOSE BUTTON 3
  const all_purpose_btn_3 = document.querySelector('#all_purpose_btn_3');
  all_purpose_btn_3.innerText = 'All leds yellow and pulsing';
  all_purpose_btn_3.addEventListener('click', function () {
    talkCommands.ledAllColor('yellow', 2);
  });
});

// ** Event Listener for User Inputs **  //

document.addEventListener('buttonPressed', function (event) {
  if (waiting_for_user_input) {
    dialogMachine(event.detail.button);
  } else {
    userInputError();
  }
});

// ** Event Listener for Speech **  //

document.addEventListener('speechEnded', function (event) {
  console.log('speech ended');
});

// ** Event Listener for Sound **  //

document.addEventListener('soundEnded', function (event) {
  console.log('sound ended');
});

let machine_started = false;
let waiting_for_user_input = true;
let next_state = '';
let last_state = '';
let button_press_counter = 0;

// ** Prepare audio Objects **  //
const chime_short = new Audio('audio/bell_short.wav');
const chime = new Audio('audio/bell.wav');

// ** Start the machine **  //
function startMachine() {
  console.clear();
  waiting_for_user_input = true;
  machine_started = true;
  next_state = 'initialisation';
  button_press_counter = 0;
  talkFancylogger.logMessage('Machine satrted');
  dialogMachine(); // start the machine with first state
}

function dialogMachine(btn = -1) {
  // *** first test before continuing to rules
  if (!waiting_for_user_input) {
    userInputError();
    return;
  }
  if (!machine_started) {
    talkFancylogger.logWarning('Machine is not started yet, press Start');
    return;
  }
  if (next_state != last_state) {
    talkFancylogger.logState(`entering State: ${next_state}`);
  } else {
    talkFancylogger.logState(`Staying in State: ${next_state}`);
  }
  last_state = next_state;

  // *** States and Rules
  switch (next_state) {
    case 'initialisation':
      talkFancylogger.logMessage('Machine is initialised and ready');
      talkFancylogger.logMessage('Press any button ton continue');
      talkCommands.ledAllOff();
      next_state = 'welcome';
      break;
    case 'welcome':
      talkFancylogger.logMessage(
        'Welcome, you got two buttons, use one of them'
      );
      next_state = 'choose-color';
      break;

    case 'choose-color':
      if (btn == 0) {
        // blue
        next_state = 'choose-blue';
        goToNextState();
      }
      if (btn == 1) {
        // yellow
        next_state = 'choose-yellow';
        goToNextState();
      }
      break;

    case 'choose-blue':
      talkFancylogger.logMessage('Blue was a good choice');
      next_state = 'choose-blue';
      break;

    case 'choose-yellow':
      talkFancylogger.logMessage('Yellow was a bad choice');
      talkFancylogger.logMessage('Press blue to continue');
      next_state = 'choose-color';
      goToNextState();
      break;

    default:
      talkFancylogger.logWarning(
        `Sorry but State: "${next_state}" has no case defined`
      );
  }
}

function userInputError() {
  talkSound.playErrorBuzzer();
}

function goToNextState() {
  dialogMachine();
}

function getRandomNextState(statesArray) {
  var rand_index = Math.floor(Math.random() * statesArray.length);
  _next_state = statesArray[rand_index];
  return _next_state;
}

class PatternMatcher {
  constructor() {
    this.isStarted = false;
  }

  start(pattern, stateActual, stateForSuccess, stateForError) {
    this.isStarted = true;
    this.index_to_check = 0;
    this.pattern = pattern;
    this.stateActual = stateActual;
    this.stateForSuccess = stateForSuccess;
    this.stateForError = stateForError;
  }

  check(userInput) {
    let nextState;
    if (this.pattern[this.index_to_check] == userInput) {
      // matching
      if (this.index_to_check + 1 == this.pattern.length) {
        // success
        nextState = this.stateForSuccess;
      } else {
        // doing good
        this.index_to_check++;
        nextState = this.stateActual;
      }
    } else {
      // wrong
      console.log('pattern error');
      this.isStarted = false;
      nextState = this.stateForError;
    }
    if (nextState != this.stateActual) this.isStarted = false;
    return nextState;
  }
}

let inputPatternMatcher = new PatternMatcher([], '', '', '');
