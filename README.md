# Talk to Me

_ressources semaine bloc 1CVmid / ECAL M&ID Mars 2023_

_Alain Bellet + Martial Grin_

https://ecal-mid.ch/talktome/

## Exemples de code

Tout se passe dans **DialogMachine.js**

### Speech

tester les voix et réglages ici
https://ecal-mid.ch/talktome/voiceTester.html

**Parler**  

* this.speakMachine.speakText(text, index_voix, pitch, rate)*  
text:le texte, index_voix:index de la voix, pitch:0.1-2, rate 0.1-10  

Exemple

```JavaScript
// dire hello avec la première voix
 this.speakMachine.speakText('hello', 0, 1, 0.8)
```

### Son

**lancer le son**  
*this.audioMachine.playAudio(objet_son, boucle)*  
objet_son:objet créé par new Audio(), boucle: true ou false   

**stopper le son**  
*this.audioMachine.pauseSound()*

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
*this.ledChangeColor(index, couleur, effet)*  
index: 0-10, couleur: nom de la couleur (voir liste), effet 0:aucun ; 1:blink; 2:pulse

**Allumer toutes les led**  
*this.ledsAllChangeColor(couleur, effet)*  
couleur: nom de la couleur (voir liste), effet 0:aucun ; 1:blink; 2:pulse  

**Éteindre toutes les led**
*this.ledsAllOff()*  

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

//éteindre toutes les leds
this.ledAllOff();
```

### Motor (servo)

**changer position**
*this.motorMoveAngle(angle);*  
angle: 0-180

Example
```JavaScript
// positionner le servo moteur à 90°
this.motorMoveAngle(90);
// positionner le servo moteur à 0°
this.motorMoveAngle(0);
```
