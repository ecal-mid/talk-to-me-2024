import WebUsbManager from './utils/WebUsbManager.js';
import FancyLogger from './utils/FancyLogger.js';
import SpeakMachine from './utils/SpeakMachine.js';
import AudioMachine from './utils/AudioMachine.js';

export default class TalkMachine {
  constructor() {
    this.version = '1.3';
    this.statusDisplay = document.querySelector('#status');
    this.connectButton = document.querySelector('#connect');
    this.restartButton = document.querySelector('#restartbutton');
    this.versionDisplay = document.querySelector('#version');
    this.versionDisplay.textContent = 'version ' + this.version;
    this.webUsbManager = new WebUsbManager(
      this,
      this.connectButton,
      this.statusDisplay
    );
    this.fancyLogger = new FancyLogger();
    this.speakMachine = new SpeakMachine();
    this.audioMachine = new AudioMachine();
    this.maxLeds = 10;
    this.handleReceiveUSBCommand = this.receiveCommandFromUsb.bind(this); // comes from WebUsbManager
    this.initSimulationButtons();
    this.initTestButtons();
    this.initLedColors();
  }

  /* COMMANDS */
  receiveCommandFromUsb(data) {
    const command = data.substring(0, 1);
    let val = data.substring(1);
    val = val.replace(/[\n\r]+/g, ''); // remove line breaks

    if (command == 'M') {
      // Message
      this.fancyLogger.logMessage(val);
    }
    if (command == 'B') {
      // Button pressed
      this.dispatchButton(val, 'pressed');
    }
    if (command == 'H') {
      // Button released
      this.dispatchButton(val, 'released');
    }
    if (command == 'P') {
      // Potentiometer
      dispatchPotentiometer(val);
    }
  }

  sendCommandToUsb(data) {
    this.webUsbManager.handleSend(data);
  }

  /* BUTTONS */
  initSimulationButtons() {
    // test buttons
    this.testButtons = document.querySelectorAll('.testbutton');
    this.boundSimulateBtn = this.dispatchButton.bind(this);
    for (let i = 0; i < this.testButtons.length; i++) {
      this.testButtons[i].addEventListener('mousedown', (e) => {
        const t = e.target;
        const btn = t.id.substring(3, 4);
        this.boundSimulateBtn(btn, 'pressed');
      });
      this.testButtons[i].addEventListener('mouseup', (e) => {
        const t = e.target;
        const btn = t.id.substring(3, 4);
        this.boundSimulateBtn(btn, 'released');
      });
    }
  }

  initTestButtons() {
    this.testerButtons = document.querySelectorAll('.tester');

    this.boundBtn = this.handleTesterButtons.bind(this);
    for (let i = 0; i < this.testerButtons.length; i++) {
      this.testerButtons[i].addEventListener('click', (e) => {
        this.handleTesterButtons(i + 1);
      });
    }
  }

  handleTesterButtons(btn) {
    console.log('overridden by child class');
  }

  handleButtonPressed(btn) {
    console.log('overridden by child class');
  }

  handleButtonReleased(btn) {
    console.log('overridden by child class');
  }

  dispatchButton(val, btn_state) {
    this.handleButtonPressed(val);
    if (btn_state == 'pressed') {
      document.dispatchEvent(
        new CustomEvent('buttonPressed', {
          detail: { button: val },
        })
      );
    }
    if (btn_state == 'released') {
      this.handleButtonReleased(val);
      document.dispatchEvent(
        new CustomEvent('buttonReleased', {
          detail: { button: val },
        })
      );
    }
    this.fancyLogger.logButton(val + ' ' + btn_state);
  }

  /* LEDS */
  initLedColors() {
    this.colorLeds = {
      black: '00',
      white: '01',
      red: '02',
      green: '03',
      blue: '04',
      magenta: '05',
      yellow: '06',
      cyan: '07',
      orange: '08',
      purple: '09',
      pink: '10',
    };
  }

  ledChangeColor(led_index, led_color, led_effect = 0) {
    this.fancyLogger.logLed(led_index, led_color, led_effect);
    const led_color_code = this.colorLeds[led_color];
    this.sendCommandToUsb('L' + led_index + led_color_code + led_effect);
  }

  ledsAllChangeColor(led_color, led_effect = 0) {
    // send first a command to avoid missign packet
    this.sendCommandToUsb('L0000');
    for (let i = 0; i < this.maxLeds; i++) {
      this.fancyLogger.logLed(i, led_color, led_effect);
      const led_color_code = this.colorLeds[led_color];
      this.sendCommandToUsb('L' + i + led_color_code + led_effect);
    }
  }

  ledsAllOff() {
    this.fancyLogger.logLed('all', 'black', 0);
    this.sendCommandToUsb('Lx000');
  }

  ledChangeRGB(led_index = 0, r = 255, g = 255, b = 255) {
    // add leading zero to led_index if it is less than 10
    if (led_index < 10) {
      led_index = '0' + led_index;
    }
    // convert RGB to HEX
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;

    const hex_color = r + g + b;
    //this.fancyLogger.logLed(led_index, hex_color, led_effect);
    this.sendCommandToUsb('H' + led_index + hex_color);
  }

  /* MOTOR */
  motorMoveAngle(angle = 0) {
    if (angle < 0) angle = 0;
    if (angle > 180) angle = 180;
    this.fancyLogger.logMessage('servo ' + angle);
    let cmd = 'M0';
    if (angle < 10) cmd = 'M000' + angle;
    if (angle >= 10 && angle < 100) cmd = 'M00' + angle;
    if (angle >= 100) cmd = 'M0' + angle;
    this.sendCommandToUsb(cmd);
  }
}
