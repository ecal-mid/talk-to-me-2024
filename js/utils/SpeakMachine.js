import Fancylogger from './FancyLogger.js';

export default class SpeakMachine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.synthesisUtterance;
    this.isSpeaking = false;
    this.fancylogger = new Fancylogger();
    this.init();
  }

  init() {
    console.log('Text To Speech Init');
    this.initSpeech().then((voices) => {
      this.readyToSpeech();
    });
  }

  initSpeech() {
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

  readyToSpeech() {
    this.voices = speechSynthesis.getVoices();
    console.log('Text To speech Ready');

    document.dispatchEvent(
      new CustomEvent('TextToSpeechReady', {
        detail: { voices: this.voices },
      })
    );
  }

  speakText(_text, _voice = 0, _pitch = 1, _rate = 1) {
    this.fancylogger.logSpeech('Text: ' + _text);
    console.log('Voice index: ' + _voice);
    console.log('Pitch: ' + _pitch);
    console.log('Rate: ' + _rate);
    this.synthesisUtterance = new SpeechSynthesisUtterance(_text);
    this.synthesisUtterance.voice = this.voices[_voice];
    this.synthesisUtterance.pitch = _pitch;
    this.synthesisUtterance.rate = _rate;
    this.synth.speak(this.synthesisUtterance);
    this.isSpeaking = true;

    this.synthesisUtterance.addEventListener(
      'end',
      this.finishSpeaking.bind(this)
    );
  }

  finishSpeaking() {
    this.isSpeaking = false;
    document.dispatchEvent(
      new CustomEvent('TextToSpeechEnded', {
        detail: {},
      })
    );
  }

  cancelSpeak() {
    this.synth.cancel();
  }

  getVoicesList() {
    return voices;
  }
}
