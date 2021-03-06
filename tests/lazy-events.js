describe('Test Lazy Events', ()=>{

  it('Bind events to object', async (done)=>{
    try{
      let { window } = await jsdom(``, [])

      // Bind to window.
      window.LazyEvents(window);
      assert(typeof window.on, 'function')

      // Bind to empty object
      let target = window.LazyEvents({});
      assert(typeof target.off, 'function')

      // Bind to existing object. Leave in tact, append on, off, one, emit functions.
      let target2 = { test: 'senica' }
      window.LazyEvents(target2);
      assert(typeof target2.emit, 'function');
      assert(target2.test, 'senica')

      done()
    }catch(e){
      done(e)
    }
  })

  it('Lazy events', async (done)=>{
    try{
      let { window } = await jsdom(``, [])

      // bind events
      window.LazyEvents(window);

      let before = ()=>{
        return new Promise((resolve, reject)=>{
          window.on('hello world', (senica, was, here)=>{
            resolve({place: 'first', value: `${senica} - ${was} - ${here}`});
          })
        })
      }

      window.emit('hello world', 'senica', 'was', 'here')

      // Even though registered after emitter, it will still get triggered.
      let after = ()=>{
        return new Promise((resolve, reject)=>{
          window.on('hello world', (senica, was, here)=>{
            resolve({place: 'second', value: `${senica} - ${was} - ${here}`});
          })
        })
      }

      Promise.all([before(), after()])
      .then((values)=>{
        require('assert').deepEqual(values[0], {place: 'first', value: 'senica - was - here'})
        require('assert').deepEqual(values[1], {place: 'second', value: 'senica - was - here'})
        done()
      })
      .catch((e)=>{
        done(e);
      })

    }catch(e){
      done(e)
    }
  })

  it('Non-lazy events', async (done)=>{
    try{
      let { window } = await jsdom(``, [])

      // bind events
      window.LazyEvents(window);

      let before = ()=>{
        return new Promise((resolve, reject)=>{
          window.on('hello world', (emitter)=>{
            resolve({place: 'first', value: emitter});
          })
        })
      }

      window.emit('hello world', 'first emitter')

      // Lazy flag is set to false, so it won't get triggered until after
      // an event happens again.
      let after = ()=>{
        return new Promise((resolve, reject)=>{
          window.on('hello world', (emitter)=>{
            resolve({place: 'second', value: emitter});
          }, false) // <-- lazy flag set to false.
        })
      }

      Promise.all([before(), after()])
      .then((values)=>{
        require('assert').deepEqual(values[0], {place: 'first', value: 'first emitter'})
        require('assert').deepEqual(values[1], {place: 'second', value: 'second emitter'})
        done()
      })
      .catch((e)=>{
        done(e);
      })

      window.emit('hello world', 'second emitter')

    }catch(e){
      done(e)
    }
  })

  it('Off. Single Callback', async (done)=>{
    try{
      let { window } = await jsdom(``, [])

      // bind events
      window.LazyEvents(window);

      let value = false;
      let cb = (input)=>{
        value = input;
      }

      window.on('test.off', cb)
      window.emit('test.off', 'one')
      window.emit('test.off', 'two')
      window.off('test.off', cb)
      window.emit('test.off', 'three')

      assert(value, 'two');
      done()

    }catch(e){
      done(e)
    }
  })

  it('Off. All of namespace.', async (done)=>{
    try{
      let { window } = await jsdom(``, [])

      // bind events
      window.LazyEvents(window);

      let value = 0;

      window.on('off.all', ()=>{
        value++;
      })
      window.on('off.all', ()=>{
        value++;
      })
      window.on('off.all', ()=>{
        value++;
      })
      window.emit('off.all', true)
      window.emit('off.all', true)
      window.off('off.all') // no callback, remove all
      window.emit('off.all', true)

      assert(value, 6);
      done()

    }catch(e){
      done(e)
    }
  })

  it('One', async (done)=>{
    try{
      let { window } = await jsdom(``, [])

      // bind events
      window.LazyEvents(window);

      let value = 0;

      window.one('one', ()=>{
        value++;
      })
      window.emit('one', true)
      window.emit('one', true) // does not do anything. event was removed.
      window.emit('one', true) // does not do anything. event was removed.

      assert(value, 1);
      done()

    }catch(e){
      done(e)
    }
  })

  it('One with asterisk', async (done)=>{
    try{
      let { window } = await jsdom(``, [])

      // bind events
      window.LazyEvents(window);

      let value = 0;

      let timer = null;
      window.one('*', (label, incoming)=>{
        value++;
        clearTimeout(timer);
        timer = setTimeout(()=>{
          assert(value, 1);
          assert(incoming, true);
          assert(label, 'one')
          done()
        }, 100)
      })
      window.emit('one', true)
      window.emit('one', true) // does not do anything. event was removed.
      window.emit('one', true) // does not do anything. event was removed.

    }catch(e){
      done(e)
    }
  })

  it('One with labels and value', async (done)=>{
    try{
      let { window } = await jsdom(``, [])

      // bind events
      window.LazyEvents(window);

      let value = 0;

      let timer = null;
      window.one('one', (incoming)=>{
        value++;
        clearTimeout(timer);
        timer = setTimeout(()=>{
          assert(value, 1);
          assert(incoming, true);
          done()
        }, 100)
      })
      window.emit('one', true)
      window.emit('one', true) // does not do anything. event was removed.
      window.emit('one', true) // does not do anything. event was removed.

    }catch(e){
      done(e)
    }
  })

  it('* Asterisk Event.', async (done)=>{
    try{
      let { window } = await jsdom(``, [])

      // bind events
      window.LazyEvents(window);

      // All event passes in label first.
      window.on('*', (label, value)=>{
        assert(label, 'one')
        assert(value, true);
        done();
      })
      window.emit('one', true)


    }catch(e){
      done(e)
    }
  })

  it('module.exports', (done)=>{
    let lazy = require('../src/lazy-events.js')({})

    lazy.on('module.exports', (value)=>{
      assert(value, true);
      done();
    })
    lazy.emit('module.exports', true)
  })

  it('module.exports from git', (done)=>{
    let lazy = require('../')({})

    lazy.on('module.exports', (value)=>{
      assert(value, true);
      done();
    })
    lazy.emit('module.exports', true)
  })

})
