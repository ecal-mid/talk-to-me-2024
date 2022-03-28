# Talk to Me

_ressources semaine bloc 1CVmid / ECAL M&ID Mars 2022_

_Alain Bellet + Paul Lëon_

https://ecal-mid.ch/talktome/

## Exemples de code

Tout se passe dans machine.js

#### Speech


#### Son
```
// charger votre son au début de votre code dans 
const chime = new Audio('audio/bell.wav');
// lancer le son

// stopper le son
talkSound.pauseSound();
```

#### Leds

Allumer une led
talkCommands.ledColor(1, 'red');

Éteindre toutes les leds
talkCommands.ledAllOff();
