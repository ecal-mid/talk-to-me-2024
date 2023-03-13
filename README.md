# Talk to Me

_ressources semaine bloc 1CVmid / ECAL M&ID Mars 2023_

_Alain Bellet + Martial Grin_

https://ecal-mid.ch/talktome/

## Exemples de code

Tout se passe dans **machine.js**

### Speech
tester les voix et réglages ici
https://ecal-mid.ch/talktome/voiceTester.html

**Parler**  
*talkVoice.speak(text, index_voix, pitch, rate)*  
text:le texte, index_voix:index de la voix, pitch:0.1-2, rate 0.1-10  

Exemple
```JavaScript
// dire hello avec la première voix
talkVoice.speak('hello', 0, 1, 0.8)
```

### Son
**lancer le son**  
*talkSound.playSound(objet_son, boucle)*  
objet_son:objet créé par new Audio(), boucle: true ou false   

**stopper le son**  
*talkSound.pauseSound()*

Exemple
```JavaScript
// charger votre son au début de votre code dans 
const chime = new Audio('audio/bell.wav');
// lancer le son
talkSound.playSound(chime, false);
// stopper le son
talkSound.pauseSound();
```

### Leds
**couleurs:**  black, white, red, green, blue, magenta, yellow, cyan:, orange:, purple:, pink  

**Allumer une led**
*talkCommands.ledColor(index, couleur, effet)*  
index: 0-10, couleur: nom de la couleur (voir liste), effet 0:aucun ; 1:blink; 2:pulse

**Allumer toutes les led**  
*talkCommands.ledAllColor(couleur, effet)*  
couleur: nom de la couleur (voir liste), effet 0:aucun ; 1:blink; 2:pulse  

**Éteindre toutes les led**
*talkCommands.ledAllOff()*  


Example
```JavaScript
// allumer la première led en rouge
talkCommands.ledColor(0, 'red');
// allumer la deuxième led en vert en pulse
talkCommands.ledColor(0, 'green', 2);
// allumer la deuxième led en jaune en blink
talkCommands.ledColor(0, 'yellow', 1);
// éteindre la première led
talkCommands.ledColor(0, 'black');
// allumer toutes les leds en bleu et blink
talkCommands.ledAllColor('blue', 1);

//éteindre toutes les leds
talkCommands.ledAllOff();
```
