import TalkMachine from 'https://ecal-mid.ch/talktome/source/1.3/TalkMachine.js';

export default class DialogMachine extends TalkMachine {
  constructor() {
    super();

    this.machineStarted = true;
    this.isSpeaking = false;
    this.lastState = '';
    this.nextState = '';
    this.waitingForUserInput = true;
    this.machineStarted = false;
    this.init();
  }

  init() {
    // EVENT HANDLERS
    this.restartButton.addEventListener(
      'click',
      this.handleRestartButton.bind(this)
    );
    document.addEventListener(
      'TextToSpeechEnded',
      this.handleTextToSpeechEnded.bind(this)
    );
    document.addEventListener('audioEnded', this.handleAudioEnded.bind(this));
    // SOUNDS
    this.sound_error = new Audio('audio/error_buzzer.wav');
  }

  /* ----- EVENT HANDLERS ------- */

  handleRestartButton() {
    console.clear();
    this.start(); // restart the dialog
  }

  handleTesterButtons(button) {
    switch (button) {
      case 1:
        this.ledsAllOff();
        break;
      case 2:
        this.ledsAllChangeColor('red');
        break;
      case 3:
        this.ledsAllChangeColor('yellow', 1);
        break;
      case 4:
        this.ledChangeRGB(0, 100, 100, 100);
        break;

      default:
        this.fancyLogger.logWarning('no action defined for button ' + button);
    }
  }

  handleButtonPressed(button) {
    // called when a button is pressed (arduino or simulator)
  }

  handleButtonReleased(button) {
    // called when a button is released (arduino or simulator)
    if (this.waitingForUserInput == true) {
      this.dialogFlow('released', button);
    }
  }

  handleTextToSpeechEnded() {
    // called when the spoken text is finished
    this.isSpeaking = false;
  }

  handleAudioEnded() {
    // called when the playing audio is finished
    console.log('audio ended');
  }

  handleUserInputError() {
    this.fancyLogger.logWarning('user input is not allowed at this time');
    this.audioMachine.playSound(this.sound_error);
  }

  // Voice presets
  preset_voice_1 = [1, 1, 0.8]; //preset for a voice, voice index, pitch, rate

  start() {
    console.clear();
    this.waitingForUserInput = true;
    this.machineStarted = true;
    this.nextState = 'initialisation';
    this.buttonPressCounter = 0;
    this.fancyLogger.logMessage('Machine started');
    this.dialogFlow(); // start the machine with first state
  }

  goToNextState() {
    this.dialogFlow();
  }

  dialogFlow(eventType = 'default', button = -1) {
    /**** first test before continuing to rules ****/
    if (this.waitingForUserInput === false) {
      this.handleUserInputError();
      return;
    }

    if (this.machineStarted === false) {
      this.fancyLogger.logWarning(
        'Machine is not started yet, press Start Machine'
      );
      return;
    }

    if (this.nextState !== this.lastState) {
      this.fancyLogger.logState(`entering State: ${this.nextState}`);
    } else {
      this.fancyLogger.logState(`staying in State: ${this.nextState}`);
    }

    if (this.speakMachine.isSpeaking === true) {
      this.fancyLogger.logWarning(
        'Im speaking, please wait until I am finished'
      );
      return;
    }
    this.lastState = this.nextState;

    /**** States and Rules ****/
    switch (this.nextState) {
      case 'initialisation':
        this.fancyLogger.logMessage('Machine is initialised and ready');
        this.fancyLogger.logMessage('Press any button to continue');
        this.ledsAllOff();
        this.nextState = 'welcome';
        this.goToNextState();
        break;

      case 'welcome':
        this.fancyLogger.logMessage(
          'Welcome, you got two buttons, use one of them'
        );
        this.nextState = 'choose-color';
        break;

      case 'choose-color':
        if (button == 0) {
          // blue
          this.nextState = 'choose-blue';
          this.goToNextState();
        }
        if (button == 1) {
          // yellow
          this.nextState = 'choose-yellow';
          this.goToNextState();
        }
        break;

      case 'choose-blue':
        this.fancyLogger.logMessage('Blue was a good choice');
        this.fancyLogger.logMessage('Press any button to continue');
        this.nextState = 'can-speak';
        break;

      case 'choose-yellow':
        this.fancyLogger.logMessage('Yellow was a bad choice');
        this.fancyLogger.logMessage('Press blue to continue');
        this.nextState = 'choose-color';
        this.goToNextState();
        break;

      case 'can-speak':
        this.speakMachine.speakText(
          'I can speak, i can count. Press a button.',
          this.preset_voice_1
        );
        this.nextState = 'count-press';
        break;

      case 'count-press':
        this.buttonPressCounter++;
        this.speakMachine.speakText(
          'you pressed ' + this.buttonPressCounter + ' time',
          this.preset_voice_1
        );

        if (this.buttonPressCounter > 2) {
          this.nextState = 'toomuch';
          this.goToNextState();
        }
        break;

      case 'toomuch':
        this.speakMachine.speakText(
          'You are pressing too much! I Feel very pressed',
          this.preset_voice_1
        );
        this.nextState = 'enough-pressed';
        break;

      case 'enough-pressed':
        this.speakMachine.speakText(
          'Enough is enough! I dont want to be pressed anymore!',
          this.preset_voice_1
        );
        break;

      default:
        this.fancyLogger.logWarning(
          `Sorry but State: "${this.nextState}" has no case defined`
        );
    }
  }
}

window.onload = () => {
  const dialogMachine = new DialogMachine();
};
