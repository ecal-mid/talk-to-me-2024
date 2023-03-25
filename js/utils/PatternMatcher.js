export default class PatternMatcher {
  constructor() {
    this.isStarted = false;
  }

  start(pattern, stateActual, stateForSuccess, stateForError) {
    this.isStarted = true;
    this.index_to_check = 0;
    this.pattern = pattern;
    this.stateActual = stateActual;
    this.stateForSuccess = stateForSuccess;
    this.stateForError = stateForError;
  }

  check(userInput) {
    let nextState;
    if (this.pattern[this.index_to_check] == userInput) {
      // matching
      if (this.index_to_check + 1 == this.pattern.length) {
        // success
        console.log('pattern success');
        nextState = this.stateForSuccess;
      } else {
        // doing good
        this.index_to_check++;
        nextState = this.stateActual;
      }
    } else {
      // wrong
      console.log('pattern error');
      this.isStarted = false;
      nextState = this.stateForError;
    }
    if (nextState != this.stateActual) this.isStarted = false;
    return nextState;
  }
}
