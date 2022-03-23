/* 
TALK TO ME - ECAL 2022 - AB.
Serial communication via Web USB
Fancy logger styles to make the logs more readable and distinctive
contains helper functions
public functions must be exposed in the return function
*/

const talkFancylogger = (function () {
  /* PRIVATE MEMBERS */
  // STYLES
  const LOGSTYLE_IN = [
    'color: #444',
    'background-color: pink',
    'padding: 2px 4px',
    'border-radius: 4px',
    'font-size: 1.3em;',
  ].join(';');

  const LOGSTYLE_OUT = [
    'color: #444',
    'background-color: lightblue',
    'padding: 2px 4px',
    'border-radius: 4px',
    'font-size: 1.3em;',
  ].join(';');

  const LOGSTYLE_WARN = [
    'color: #444',
    'background-color: lightyellow',
    'padding: 2px 4px',
    'border-radius: 4px',
    'font-size: 1.3em;',
  ].join(';');

  const LOGSTYLE_MESSAGE = [
    'color: #444',
    'background-color: lightgray',
    'padding: 2px 4px',
    'border-radius: 4px',
    'font-size: 1.3em;',
  ].join(';');

  const LOGSTYLE_CODE = [
    'color: #444',
    'background-color: lightgray',
    'padding: 8px 8px',
    'border-radius: 1px',
    'font-size: 1.3em;',
  ].join(';');

  const LOGSTYLE_EMOJI = ['font-size: 1.5em;', 'padding: 2px 4px'].join(';');

  const emo_btn = String.fromCodePoint(0x1f518);
  const emo_message = String.fromCodePoint(0x1f4ac);
  const emo_sound = String.fromCodePoint(0x1f3b5);
  const emo_speech = String.fromCodePoint(0x1f444);
  const emo_led = String.fromCodePoint(0x1f6a5);
  const emo_warning = String.fromCodePoint(0x1f590);
  const emo_state = String.fromCodePoint(0x23ec);

  function printLogMessage(_msg) {
    console.log(`%c${emo_message} ${_msg}`, LOGSTYLE_IN);
  }

  function printLogWarning(_msg) {
    console.log(`%c${emo_warning} ${_msg}`, LOGSTYLE_WARN);
  }

  function printLogButton(_msg) {
    console.log(`%c${emo_btn} ${_msg}`, LOGSTYLE_IN);
  }

  function printLogCode(_msg) {
    console.log(`%c${emo_btn} ${_msg}`, LOGSTYLE_CODE);
  }

  function printLogSound(_msg) {
    console.log(`%c${emo_sound} ${_msg}`, LOGSTYLE_OUT);
  }

  function printLogSpeech(_msg) {
    console.log(`%c${emo_speech} ${_msg}`, LOGSTYLE_OUT);
  }

  function printLogState(_msg) {
    console.log(`%c${emo_state} ${_msg}`, LOGSTYLE_MESSAGE);
  }

  function printLogLed(led_index, led_color, led_effect) {
    let LOGSTYLE_LED_COLOR_CUSTOM =
      'color: #444;background-color: ' +
      led_color +
      ';padding: 2px 5px;border-radius: 10px;font-size: 1.3em;';
    console.log(
      `%c${emo_led} index: ${led_index}, color: ${led_color}, effect: ${led_effect}%c `,
      LOGSTYLE_OUT,
      LOGSTYLE_LED_COLOR_CUSTOM
    );
  }
  function get() {
    led_color = 'red';
    return `'background-color:${led_color}; padding: 2px 4px;border-radius: 10px '`;
  }

  /* PUBLIC MEMBERS */
  return {
    logButton: printLogButton,
    logCode: printLogCode,
    logSound: printLogSound,
    logSpeeech: printLogSpeech,
    logMessage: printLogMessage,
    logLed: printLogLed,
    logWarning: printLogWarning,
    logState: printLogState,
  };
})();
