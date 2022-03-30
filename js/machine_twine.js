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
  buttonDownTime = new Date().getTime();
  /*if (waiting_for_user_input) {
    dialogMachine(event.detail.button, 0);
    
  } else {
    userInputError();
  }*/
});

document.addEventListener('buttonReleased', function (event) {
  const buttonUpTime = new Date().getTime();
  buttonPresssedDuration = buttonUpTime - buttonDownTime;

  buttonPresssedType = 'short';

  if (buttonPresssedDuration > 1200) {
    buttonPresssedType = 'long';
  }

  if (waiting_for_user_input) {
    //console.log(buttonPresssedTime);
    dialogMachine(event.detail.button, 0);
  } else {
    userInputError();
  }

  /*if (waiting_for_user_input) {
    dialogMachine(event.detail.button, 1);
  } else {
    userInputError();
  }*/
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
let buttonDownTime = 0;
let buttonPresssedDuration = 0;
let buttonPresssedType = 'normal';

// ** Prepare audio Objects **  //

// ** Start the machine **  //
function startMachine() {
  console.clear();
  waiting_for_user_input = true;
  machine_started = true;
  next_state = 'initialisation';
  button_press_counter = 0;
  talkFancylogger.logMessage('Machine started');
  dialogTree.start();
  dialogMachine(); // start the machine with first state
}

function dialogMachine(btn = -1, btn_state = 0) {
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
      talkFancylogger.logMessage('Press any button to continue');
      talkCommands.ledAllOff();
      next_state = 'speak';
      goToNextState();
      break;

    case 'speak':
      const txt = dialogTree.getText();
      talkFancylogger.logMessage(txt);
      next_state = 'check-btn';
      break;

    case 'check-btn':
      if (dialogTree.getNext(btn, buttonPresssedType)) {
        next_state = 'speak';
      } else {
        talkFancylogger.logMessage('THE END');
        next_state = 'end';
      }
      goToNextState();
      break;
    case 'end':
      console.log('....');
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

class dialogTreeManager {
  // https://github.com/lazerwalker/twison

  constructor(jsonUrl) {
    // load json file
    this.jsonUrl = jsonUrl;
    this.dialog = {};
    this.loadJSON();
  }

  async loadJSON() {
    const response = await fetch(this.jsonUrl);
    this.dialog = await response.json();
  }

  start() {
    console.log(console.log(Object.keys(this.dialog.passages)));
    this.next_node = this.dialog.passages['0'];
  }

  getText() {
    this.actual_entry = this.next_node;
    const text = this.actual_entry.text.replace(/\[\[(.*?)\]\]/g, ''); //remove links in text
    //console.log(text);
    return text;
  }

  getNext(userChoice, pressType) {
    if (this.actual_entry.links === undefined) {
      // if no links, we are at the end
      return false;
    }

    const nrOfLinks = Object.keys(this.actual_entry.links).length;
    let choiceStr = '';

    if (userChoice == 0) choiceStr = ':)';
    if (userChoice == 1) choiceStr = ':(';
    if (nrOfLinks == 4) {
      // if links with long and short press
      choiceStr += ' ' + pressType;
    }
    const next = this.getNextLink(choiceStr);

    this.next_node = Object.values(this.dialog.passages).find((obj) => {
      return obj.name == next;
    });

    return true;
  }

  getNextLink(choiceStr) {
    console.log(choiceStr);
    const next = Object.values(this.actual_entry.links).find((obj) => {
      return obj.name == choiceStr;
    });
    return next.link;
  }
}

const dialogTree = new dialogTreeManager('json/twine.json');
