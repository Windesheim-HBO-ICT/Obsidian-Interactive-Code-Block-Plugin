# Interactieve Code Blocks

Deze plugin maakt het mogelijk om 
[interactieve code blocks](https://github.com/windesheim-hbo-ict/deeltaken) 
te bekijken en te testen. Dit doe je door een markdown bestand in de reader 
modus te bekijken (rechts boven in Obsidian).

## Over
Deze plugin is bedoelt om te assisteren bij het maken van interactive code 
blocks, deze plugin is geen vervanging voor de daadwerkelijke interactive code 
block. Als je dat is waar je naar zoekt, bekijk dan onze [quartz plugin](https://github.com/Windesheim-HBO-ICT/Leertaken/blob/main/quartz/quartz/plugins/transformers/codeRunner.ts)
Bij [Windesheim](https://windesheim.nl) gebruiken we deze quartz plugin om onze 
interactieve code blocks te tonen. Deze Obsidian plugin wordt gebruikt om de 
markdown bestanden met interactieve code blocks te maken en te testen tijdens 
het schrijf proces.

## Gebruik
> [!CAUTION]    
> De preview die deze plugin genereert is **NIET** gelijk aan de daadwerkelijke 
> code block zoals die wordt gegenereert in de quartz plugin.
>
> *ALLE* code blocks zullen runnable gemaakt worden in deze preview, ook kunnen 
> code blocks niet worden aangepast in de preview.


De markdown syntax om interactieve code blocks te maken is uiteraard het zelfde 
als de syntax die wordt gebruikt door de [quartz plugin](https://github.com/Windesheim-HBO-ICT/Leertaken/blob/main/quartz/quartz/plugins/transformers/codeRunner.ts). 

Hier een kleine samenvatting:

````md
```javascript runner
console.log('I am runable and editable')
```
````

````md
```javascript
console.log('I am neither runable nor editable, however I am rendered as a interactive code block')
```
````

````md
```javascript sandbox
console.log('I am runable, editable and my language can be changed. This is a whole world of possibilities!')
```
````

## Limitaties
Omdat deze plugin puur gemaakt is om interactieve code blocks te schrijven en 
te testen is de preview erg gelimiteerd. Enkele limitaties zijn:

- Geen editing
- Geen sandbox modus
- Geen syntax highlighting
