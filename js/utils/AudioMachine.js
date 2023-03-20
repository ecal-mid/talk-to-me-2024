import FancyLogger from './FancyLogger.js';

export default class AudioMachine {
  constructor() {
    this.fancyLogger = new FancyLogger();
    this.soundPlaying = new Audio();
    this.isPlaying = false;
  }

  playAudio(sound, loop = false) {
    // first stop sound in case one was already playing
    this.resetAudio();
    this.soundPlaying = sound;
    const soundName = sound.currentSrc.substring(
      sound.currentSrc.lastIndexOf('/') + 1
    );
    if (loop) {
      this.soundPlaying.loop = true;
      this.fancyLogger.logSound(soundName + '(loop)');
    } else {
      this.fancyLogger.logSound(soundName);
    }
    this.soundPlaying.play();
    this.isPlaying = true;

    this.soundPlaying.onended = this.finishPlaying.bind(this);
  }

  finishPlaying() {
    this.isPlaying = false;
    document.dispatchEvent(
      new CustomEvent('audioEnded', {
        detail: {},
      })
    );
  }

  resetAudio() {
    this.soundPlaying.pause();
    this.soundPlaying.currentTime = 0;
  }

  pauseAudio() {
    this.soundPlaying.pause();
  }
}
