LazyEvents - Super Simple Events with Lazy Handling.
====================================================

*NOTE* This only works with ES6 browsers.

***Minified is 1082 bytes***

Usage
-----

#### Browser

Sorry, haven't added to bower repo yet. Let me know if it will be helpful to you.

Add `lazy-events.min.js` to your project.

Include the file in your html page.
`<script src="path to lazy-event.min.js"></script>`

Bind events to an object:
```javascript
// This will bind event handler to the window object.
// This will add on, one, off, and emit functions to the window object.
window.LazyEvents(window)
window.on('my-event', (value1, value2)=>{
  alert(`Yay! ${value1} ${value2}`)
})
window.emit('my-event', 'Hi', 'There')
window.off('my-event'); // remove all events.

// Another way to bind events.
let target = window.LazyEvents({});

// And another...
let target2 = {};
window.LazyEvents(target2);
```

#### NodeJs

Sorry, haven't added to npm repo yet. Let me know if it will be helpful to you.

Add to your project.
```bash
npm install https://github.com/senica/lazy-events.git --save
```

```js
let lazy = require('lazy-events')({}) // <-- or bind to some other object.
lazy.on('some-event', (value)=>{
  console.log('Yay!', value)
})
lazy.emit('some-event', 'Hi.');
```

## API

### on(event, callback[, lazy])

Listens for *event* to be emitted and then run *callback* with emitted values.

***event*** can be any string:
- 'event'
- 'event.names.0.name',
- 'something'
- 'post /user'

are all valid. Use your imagination.

***callback*** will receive as many arguments as passed in the emitter.

```js
let events = LazyEvents({})
events.on('hello', (one, two, three)=>{})
event.emit('hello', 'one', 'two', 'three')
```

It's good practice to just emit object, and use object properties, but there are times you may want to separate information.

***lazy*** is a boolean that defaults to **true**. When set to true, event listeners that are created after an event has been emitted will still be triggered. This is very helpful for dynamic applications where race conditions may occur and you do not know the specific order in which data may arrive from there server and the order in which resources are loaded in your app.

```js
let events = LazyEvents({})
event.emit('hello', 'one', 'two', 'three')
// runs as lazy
events.on('hello', (one, two, three)=>{})
// does not run; lazy flag set to false.
events.on('hello', (one, two, three)=>{}, false)
```

**NOTE**
- \* (asterisk) is a reserved event for listening to all events.

```js
let events = LazyEvents({})
// will run on EVERY event!
// IMPORTANT! Not that the first parameter passed into the function is the event that was triggered. This differs from all other event listeners in which you already now what the event is.
events.on('*', (label, one, two, three)=>{})
event.emit('hello', 'one', 'two', 'three')
```

### one(event, callback[, lazy])

This is the same as ***on*** except that the callback will only run **ONE TIME** and then turn itself off.

### off(event[, callback])

***event*** is required and specifies the event that you want to turn off.

***callback*** is optional. If specified, it will turn off the *event* with the *callback*. This means that you will have to separate your callbacks instead of using anonymous functions.

If *callback* is not specified, it will remove **ALL** *event*s.

```js
let events = LazyEvents({})
let event = ()=>{ console.log('hi'); }
events.on('intro', event);
events.on('intro', ()=>{ console.log('what'); })

// Turn off single event.
event.off('intro', event);

// Turn off all events of type intro.
event.off('intro');
```

### emit(event[, ...])

*emit* triggers an event. All parameters you pass in will be sent to the listener.

```js
let events = LazyEvents({})
event.emit('hello', 'one', 'two', 'three')
events.on('hello', (one, two, three)=>{
  console.log(one, two, three);
})

// if listening to *, the first parameter will be the event
events.on('hello', (label, one, two, three)=>{
  // label is "hello"
  console.log(label, one, two, three);
})
```

Contribution Guides
--------------------------------------

Contributions are always welcome!

1. Clone this repository. `git clone https://github.com/senica/lazy-events.git`
2. Run `npm install`
3. Make your changes.
4. Write tests in the tests directory. You may make another file if appropriate.
5. Run `npm test`.
6. Make a pull request.


Environments in which to use LazyEvents
--------------------------------------

- This is currently only intended for browsers. It would be fairly painless
to make available for nodejs, but it's not done.

How to build your own LazyEvents
--------------------------------

Clone a copy of the main LazyEvents git repo by running:

```bash
git clone https://github.com/senica/lazy-events.git
```

Enter the lazy-events directory:
```bash
cd lazy-events
```

Install dependencies:
```bash
npm install
```

Run the build script:
```bash
npm run build
```
The built version of LazyEvents will be put in the `dist/` subdirectory, along with the minified copy and associated map file.


Running the Unit Tests
--------------------------------------

Make sure you have the necessary dependencies:

```bash
npm install
```

Then:

```bash
npm test
```


Questions?
----------

Open an issue and I'll try and reply.
