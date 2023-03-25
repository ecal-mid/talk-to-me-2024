import SpeakMachine from './utils/SpeakMachine.js';
import FancyLogger from './utils/FancyLogger.js';

export default class VoiceTester {
  constructor() {
    this.speakMachine = new SpeakMachine();
    this.fancyLogger = new FancyLogger();
    this.speakit = document.querySelector('#speakit');
    this.inputTxt = document.querySelector('#texttospeak');
    this.pitch = document.querySelector('#pitch');
    this.rate = document.querySelector('#rate');
    this.voiceSelect = document.querySelector('#voiceSelect');
    this.allvoicecheck = document.querySelector('#allvoices');
    this.voices = {};
    this.init();
  }

  init() {
    this.handleVoiceReady = this.populateVoiceList.bind(this);
    document.addEventListener('TextToSpeechReady', (event) => {
      console.log('TextToSpeechReady');
      this.handleVoiceReady(event.detail.voices);
    });
    this.handleSpeak = this.speakTextTest.bind(this);
    speakit.addEventListener('click', () => {
      this.handleSpeak();
    });
    this.handleAllVoices = this.populateVoiceList.bind(this);
    this.allvoicecheck.addEventListener('click', () => {
      this.handleAllVoices(this.voices);
    });
  }

  populateVoiceList(_voices) {
    this.voices = _voices;
    this.voiceSelect.innerHTML = ''; // clear list

    for (var i = 0; i < this.voices.length; i++) {
      var option = document.createElement('option');
      option.textContent =
        i + ' - ' + this.voices[i].name + ' (' + this.voices[i].lang + ')';

      if (this.voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', this.voices[i].lang);
      option.setAttribute('data-name', this.voices[i].name);
      if (this.allvoicecheck.checked == false) {
        if (
          this.voices[i].lang.substring(0, 2) == 'fr' ||
          this.voices[i].lang.substring(0, 2) == 'en'
        ) {
          this.voiceSelect.appendChild(option);
        }
      } else {
        this.voiceSelect.appendChild(option);
      }
    }
  }

  speakTextTest() {
    var voiceIndex = 0;
    var selectedOption =
      this.voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (var i = 0; i < this.voices.length; i++) {
      if (this.voices[i].name === selectedOption) {
        voiceIndex = i;
      }
    }
    //console.clear();

    this.speakMachine.speakText(this.inputTxt.value, [
      voiceIndex,
      this.pitch.value,
      this.rate.value,
    ]);

    this.fancyLogger.logCode(
      `this.speakMachine.speakText('your text', [${voiceIndex}, ${pitch.value}, ${rate.value}])`
    );
  }
}

window.onload = () => {
  const voiceTester = new VoiceTester();
};
