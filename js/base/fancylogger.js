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

  const LOGSTYLE_CODE = [
    'color: #444',
    'background-color: lightgray',
    'padding: 8px 8px',
    'border-radius: 1px',
    'font-size: 1.3em;',
  ].join(';');

  const LOGSTYLE_EMOJI = ['font-size: 1.5em;', 'padding: 2px 4px'].join(';');

  const emo_btn = String.fromCodePoint(0x1f518);
  const emao_message = String.fromCodePoint(0x1f4ac);
  const emo_sound = String.fromCodePoint(0x1f3b5);
  const emo_speech = String.fromCodePoint(0x1f444);

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

  /* PUBLIC MEMBERS */
  return {
    logButton: printLogButton,
    logCode: printLogCode,
    logSound: printLogSound,
    logSpeeech: printLogSpeech,
  };
})();
