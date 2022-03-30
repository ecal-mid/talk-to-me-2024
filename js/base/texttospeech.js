/* 
TALK TO ME - ECAL 2022 - AB.
Serial communication via Web USB
Singelton Module to Manage text to speech using the browser API
contains helper functions
public functions must be exposed in the return function
*/

let talkVoice = (function () {
  'use strict';
  let synth = window.speechSynthesis;
  let voices = [];
  let utterThis;
  /* PRIVATE MEMBERS */

  function speakText(_text, _voice = 0, _pitch = 1, _rate = 1) {
    talkFancylogger.logSpeeech('Text: ' + _text);
    console.log('Voice index: ' + _voice);
    console.log('Pitch: ' + _pitch);
    console.log('Rate: ' + _rate);
    utterThis = new SpeechSynthesisUtterance(_text);
    utterThis.voice = voices[_voice];
    utterThis.pitch = _pitch;
    utterThis.rate = _rate;
    synth.speak(utterThis);

    utterThis.addEventListener('end', function (event) {
      document.dispatchEvent(
        new CustomEvent('speechEnded', {
          detail: {},
        })
      );
    });
  }
  function cancelSpeak() {
    synth.cancel();
  }

  function initSpeech() {
    return new Promise(function (resolve, reject) {
      let id;

      id = setInterval(() => {
        if (speechSynthesis.getVoices().length !== 0) {
          resolve(speechSynthesis.getVoices());
          clearInterval(id);
        }
      }, 10);
    });
  }

  initSpeech().then((voices) => {
    readyToSpeech();
  });

  function readyToSpeech() {
    voices = speechSynthesis.getVoices();
    console.log('Text To speech Ready');

    document.dispatchEvent(
      new CustomEvent('TextToSpeechReady', {
        detail: { voices: voices },
      })
    );
  }

  function getVoicesList() {
    return voices;
  }

  document.addEventListener('DOMContentLoaded', (event) => {
    initSpeech();
  });

  /* PUBLIC MEMBERS */
  return {
    speak: speakText,
    getVoicesList: getVoicesList,
    cancelSpeak: cancelSpeak,
  };
})();
