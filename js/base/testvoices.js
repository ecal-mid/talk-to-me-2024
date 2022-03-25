document.addEventListener('DOMContentLoaded', (event) => {
  const speakit = document.querySelector('#speakit');
  const inputTxt = document.querySelector('#texttospeak');
  const pitch = document.querySelector('#pitch');
  const rate = document.querySelector('#rate');
  const voiceSelect = document.querySelector('#voiceSelect');
  const allvoicecheck = document.querySelector('#allvoices');

  let voices = {};

  document.addEventListener('TextToSpeechReady', function (event) {
    populateVoiceList(event.detail.voices);
  });

  allvoicecheck.addEventListener('click', function () {
    populateVoiceList(voices);
  });

  function populateVoiceList(_voices) {
    voices = _voices;
    voiceSelect.innerHTML = ''; // clear list

    for (var i = 0; i < voices.length; i++) {
      var option = document.createElement('option');
      option.textContent =
        i + ' - ' + voices[i].name + ' (' + voices[i].lang + ')';

      if (voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      if (allvoicecheck.checked == false) {
        if (
          voices[i].lang.substring(0, 2) == 'fr' ||
          voices[i].lang.substring(0, 2) == 'en'
        ) {
          voiceSelect.appendChild(option);
        }
      } else {
        voiceSelect.appendChild(option);
      }
    }
  }

  speakit.addEventListener('click', function () {
    speakTextTest();
  });

  function speakTextTest() {
    var voiceIndex = 0;
    var selectedOption =
      voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        voiceIndex = i;
      }
    }
    console.clear();

    talkVoice.speak(inputTxt.value, voiceIndex, pitch.value, rate.value);

    talkFancylogger.logCode(
      `talkVoice.speak('your text', ${voiceIndex}, ${pitch.value}, ${rate.value})`
    );
  }
});
