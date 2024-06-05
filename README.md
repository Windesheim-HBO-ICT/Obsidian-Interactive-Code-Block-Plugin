# Windesheim's Interactive Code Blocks

This plugin makes it possible to preview and test [interactive code blocks](github.com/windesheim-hbo-ict/deeltaken) 
in Obsidian!

## About
This plugin is meant to assist with creating [interactive code blocks](github.com/windesheim-hbo-ict/deeltaken), it is not 
and will never be a replacement for an actual interactive code block. If that is
what you are searching for, take a look at [our quartz plugin](todo) we use this 
plugin to serve web pages that contain interactive code blocks.

## Usage
The markdown syntax to use the interactive code blocks is the same as the syntax 
used in the [quartz plugin](). Here are some examples:

Note that **all code blocks will be runable in the obsidian editor**. This is 
**not** the case when they are properly displayed by the quartz plugin.

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

## Limitations
Because this plugin is purely meant for testing code blocks it mostly just runs 
and does not do anything else. That is why it has some major limitations.

- No editing
- No sandbox
- No syntax highlighting

