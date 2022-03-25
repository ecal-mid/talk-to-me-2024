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
  all_purpose_btn_3.innerText = 'No action yet';
  all_purpose_btn_3.addEventListener('click', function () {
    // your action here
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

document.addEventListener('potentimeterChange', function (event) {
  console.log(event.detail.potentiometer);
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
const starWars = new Audio('audio/StarWars3.wav');

// ** Start the machine **  //
function startMachine() {
  console.clear();
  waiting_for_user_input = true;
  machine_started = true;
  next_state = 'initialisation';
  button_press_counter = 0;
  console.log('Machine started');
  dialogMachine(); // start the machine with first state
}

function dialogMachine(btn = -1) {
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

  switch (next_state) {
    case 'initialisation':
      console.log('Machine is initialised and ready');
      talkCommands.ledAllOff();
      next_state = 'check-pattern';
      break;

    case 'check-pattern':
      if (!inputPatternMatcher.isStarted) {
        console.log(
          'we are at the biginning, press button 1 and 2 and 3 to continue'
        );
        inputPatternMatcher.start(
          [1, 2, 3],
          next_state,
          'input-success',
          'input-error'
        );
      } else {
        next_state = inputPatternMatcher.check(btn);
        if (next_state != last_state) {
          goToNextState();
        } else {
          console.log('doing good, continue...');
        }
      }
      break;

    case 'input-error':
      console.log('so wrong!');
      break;
    case 'input-success':
      console.log('congrats, it is a success!');
      break;

    case 'two':
      if (btn != 1) {
        userInputError();
        console.log('wrong button');
        break;
      }
      console.log('second step');
      talkCommands.ledAllColor('blue');
      talkSound.playSound(chime_short, true);
      next_state = 'three';
      break;

    case 'three':
      console.log('last step, all what you do now will be ignored');
      talkSound.pauseSound();
      talkCommands.ledAllOff();
      talkCommands.ledColor(1, 'red');
      //waiting_for_user_input = false;
      next_state = 'deadend';
      break;

    case 'deadend':
      talkCommands.ledAllColor('purple', 1);
      console.log('pfff... you are pressing a button but i ignore it');
      button_press_counter++;
      if (button_press_counter > 2) {
        next_state = 'notamused';
      }
      break;

    case 'notamused':
      button_press_counter++;
      if (button_press_counter < 5) {
        console.log('please stop pressing my buttons');
        break;
      } else if (button_press_counter == 5) {
        console.log('what did i say?');
        break;
      } else {
        next_state = getRandomNextState(['rand1', 'rand2']);
        goToNextState();
      }
      break;

    case 'rand1':
      console.log('yoooo!!!!');
      next_state = 'notamused';
      break;

    case 'rand2':
      console.log('nooooo!!!!');
      next_state = 'notamused';
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
