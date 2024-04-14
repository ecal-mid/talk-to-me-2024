# Talk to Me

_ressources semaine bloc 1CVmid / ECAL M&ID Mars 2024_

_Alain Bellet + Martial Grin_

https://ecal-mid.ch/talktome/

## Exemples de code

Tout se passe dans **DialogMachine.js**

### Speech

tester les voix et réglages ici
https://ecal-mid.ch/talktome/voiceTester.html

**Parler**

_this.speakMachine.speakText(text, [index_voix, pitch, rate])_  
text:le texte, index_voix:index de la voix, pitch:0.1-2, rate 0.1-10

Exemple

```JavaScript
// dire hello avec la première voix
 this.speakMachine.speakText('hello', [0, 1, 0.8])
```

### Son

**lancer le son**  
_this.audioMachine.playAudio(objet_son, boucle)_  
objet_son:objet créé par new Audio(), boucle: true ou false

**stopper le son**  
_this.audioMachine.pauseSound()_

Exemple

```JavaScript
// charger votre son au début de votre code dans
this.sound_bell = new Audio('audio/bell.wav');
// lancer le son
this.audioMachine.playAudio(this.sound_bell, false);
// stopper le son
this.audioMachine.pauseSound();
```

### Leds

**couleurs:** black, white, red, green, blue, magenta, yellow, cyan:, orange:, purple:, pink

**Allumer une led**
_this.ledChangeColor(index, couleur, effet)_  
index: 0-10, couleur: nom de la couleur (voir liste), effet 0:aucun ; 1:blink; 2:pulse

**Allumer toutes les led**  
_this.ledsAllChangeColor(couleur, effet)_  
couleur: nom de la couleur (voir liste), effet 0:aucun ; 1:blink; 2:pulse

**Éteindre toutes les led**  
_this.ledsAllOff()_

**Allumer une led avec une valeur RGB**  
_this.ledChangeRGB(index, r, g, b)_  
index: 0-50, r: 0-255, g:0-255, b:0-255

Example

```JavaScript
// allumer la première led en rouge
this.ledChangeColor(0, 'red');
// allumer la deuxième led en vert en pulse
this.ledChangeColor(0, 'green', 2);
// allumer la deuxième led en jaune en blink
this.ledChangeColor(0, 'yellow', 1);
// éteindre la première led
this.ledChangeColor(0, 'black');
// allumer toutes les leds en bleu et blink
this.ledsAllChangeColor('blue', 1);
// allumer led avec valeur RGB
this.ledChangeRGB(1, 255, 0, 123);

//éteindre toutes les leds
this.ledsAllOff();
```

### Motor (servo)

**changer position**
_this.motorMoveAngle(angle);_  
angle: 0-180

Example

```JavaScript
// positionner le servo moteur à 90°
this.motorMoveAngle(90);
// positionner le servo moteur à 0°
this.motorMoveAngle(0);
```

### Simple Pattern matcher 

**lancer nouvelle comparaison**
_ this.patternMatcher.start(pattern, stateActual, stateForSuccess, stateForError);_  
pattern: array off buttons, stateActual: actual state, stateForSuccess: state fo success, stateForError: state for error

Example

```JavaScript
    // create instance
    this.patternMatcher = new PatternMatcher(); // add this to the constructor of the class DialogMachine
    // example state in switch case
    case 'check-pattern':
        if (!this.patternMatcher.isStarted) {
          console.log(
            'we are at the beginning, press button 1 and 2 and 3 to continue'
          );
          this.patternMatcher.start(
            [1, 2, 3],
            this.nextState,
            'can-speak',
            'input-error'
          );
        } else {
          this.nextState = this.patternMatcher.check(button);
          if (this.nextState != this.lastState) {
            this.goToNextState();
          } else {
            console.log('doing good, continue...');
          }
        }
        break;

   case 'input-error':
        this.fancyLogger.logMessage('This was not the right input, try again!');
        this.nextState = 'check-pattern';
        this.goToNextState();
        break;

   case 'input-success':
        this.fancyLogger.logMessage('Congratulations, you did it');
        break;



class PatternMatcher {
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
        this.isStarted = false;
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
```
