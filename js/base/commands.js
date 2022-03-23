/* 
TALK TO ME - ECAL 2022 - AB.
Serial communication via Web USB
Manage sending and receiving commands from serial
contains helper functions
public functions must be exposed in the return function
*/

let talkCommands = (function () {
  const colorLeds = {
    black: '00',
    white: '01',
    red: '02',
    green: '03',
    blue: '04',
    purple: '05',
    yellow: '06',
    orange: '07',
    cyan: '08',
  };

  /* PRIVATE MEMBERS */
  function commandInterpretter(data) {
    const command = data.substring(0, 1);
    const val = data.substring(1);

    if (command == 'M') {
      // message
      talkFancylogger.logMessage(val);
      //appendLine('receiver_lines', 'Message: ' + val);
    }
    if (command == 'B') {
      // Button
      dispatchButton(val);
      //appendLine('receiver_lines', 'Button: ' + val);
    }
    if (command == 'P') {
      dispatchPotentiometer(val);
    }
  }

  function commandSender(data) {
    talkApp.sendCommand(data);
  }

  function dispatchButton(val) {
    document.dispatchEvent(
      new CustomEvent('buttonPressed', {
        detail: { button: val },
      })
    );
    talkFancylogger.logButton(val);
  }

  function dispatchPotentiometer(val) {
    // appendLine('receiver_lines', 'Potentiometer:' + val);
    document.dispatchEvent(
      new CustomEvent('potentimeterChange', {
        detail: { potentiometer: val },
      })
    );
    //console.log('%cIN: Potentiometer: ' + val, baseConsoleStylesIN);
  }

  function changeLedColor(led_index, led_color, led_effect = 0) {
    talkFancylogger.logLed(led_index, led_color, led_effect);
    const led_color_code = colorLeds[led_color];
    commandSender('L' + led_index + led_color_code + led_effect);
  }

  function changeAllLedsColor(led_color, led_effect = 0) {
    // send first a command to avoid missign packet
    commandSender('L0000');
    for (let i = 0; i < 10; i++) {
      talkFancylogger.logLed(i, led_color, led_effect);
      const led_color_code = colorLeds[led_color];
      talkCommands.commandSend('L' + i + led_color_code + led_effect);
    }
  }

  function allLedsOff() {
    commandSender('Lx000');
  }
  /* PUBLIC MEMBERS */
  return {
    commandInterpret: commandInterpretter,
    commandSend: commandSender,
    ledColor: changeLedColor,
    ledAllColor: changeAllLedsColor,
    pressButton: dispatchButton,
    turnPotentiometer: dispatchPotentiometer,
    ledAllOff: allLedsOff,
  };
})();
