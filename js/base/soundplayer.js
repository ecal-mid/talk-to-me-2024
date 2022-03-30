/* 
TALK TO ME - ECAL 2022 - AB.
Serial communication via Web USB
Singelton Module to Manage playing local sounds (.mp3, .wav)
contains helper functions
public functions must be exposed in the return function
*/

let talkSound = (function () {
  'use strict';
  /* PRIVATE MEMBERS */
  let error_sound = new Audio('audio/error_buzzer.wav');
  let soundPlaying = new Audio();

  function playSound(sound, loop = false) {
    // first stop sound incase one was already playing
    resetSound();

    soundPlaying = sound;
    if (loop) {
      soundPlaying.loop = true;
      talkFancylogger.logSound('(loop)');
    } else {
      talkFancylogger.logSound();
    }
    soundPlaying.play();

    soundPlaying.onended = function () {
      document.dispatchEvent(
        new CustomEvent('soundEnded', {
          detail: {},
        })
      );
    };
  }
  function resetSound() {
    soundPlaying.pause();
    soundPlaying.currentTime = 0;
  }

  function pauseSound() {
    soundPlaying.pause();
    soundPlaying.currentTime = 0;
  }

  function playErrorBuzzer() {
    error_sound.currentTime = 0;
    error_sound.play();
  }

  /* PUBLIC MEMBERS */
  return {
    playSound: playSound,
    pauseSound: pauseSound,
    playErrorBuzzer: playErrorBuzzer,
  };
})();
