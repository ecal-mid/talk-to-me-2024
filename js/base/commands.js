/* 
TALK TO ME - ECAL 2022 - AB.
Serial communication via Web USB
Manage sending and receiving commands from serial
contains helper functions
public functions must be exposed in the return function
*/

let talkCommands = (function () {
  /* PRIVATE MEMBERS */
  function commandInterpretter(data) {
    const command = data.substring(0, 1);
    const val = data.substring(1);
    if (command == 'M') {
      // message
      console.log('%cIN: Message: ' + val, baseConsoleStylesIN);
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
    console.log('%cOUT: ' + data, baseConsoleStylesOUT);
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

  function changeLedColor(led_index, led_color_code, led_blink = 0) {
    commandSender('L' + led_index + led_color_code + led_blink);
  }

  function changeAllLedsColor(led_color_code, led_blink = 0) {
    for (let i = 0; i < 10; i++) {
      talkCommands.commandSend('L' + i + led_color_code + led_blink);
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
