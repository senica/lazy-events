(function(){
  /**
   * Events
   */
  const events = {}

  /**
   * Events Off.
   * @param  {String}   label Event to remove
   * @param  {[Function]} cb    Optional. If not provided all events of label
   *                            will be removed. If provided, only events with
   *                            the same callback will be removed.
   * @return {undefined}
   */
  function off(label, cb){
    if(typeof events[label] === 'undefined') return;

    if(typeof cb === 'undefined'){
      delete events[label];
      return;
    }

    for(let i=0; i<events[label].length; i++){
      if(events[label][i] === cb){
        events[label].splice(i, 1);
        i--;
      }
    }

  }

  /**
   * Events On.
   * You can listen to '*' and listen to all events
   * @param  {String}   label   Event to listen to
   * @param  {Function} cb      Required. This is the function that will be
   *                            called when the event is triggered.
   * @param  {Boolean}   lazy   When true, it will run even if the emit happens
   *                            after the event is registered. When false, it
   *                            will not trigger until an emit happens after it
   *                            has been registered.
   * @return {undefined}
   */
  function on(label, cb, lazy = true){
    if(typeof cb !== 'function') throw new Error('Callback on events must be a function.')
    if(typeof events[label] == 'undefined'){
      events[label] = []
      events[label].__ran__ = false;
      events[label].__args__ = [];
    }
    events[label].push(cb)
    if(events[label].__ran__ && lazy){
      cb.apply(root[namespace], events[label].__args__)
    }
  }
  // add a single handler for the all space. This is probably unnecessary
  on('*', ()=>{})

  /**
   * Events One.
   * Same as On, but will immediately remove itself once it has resolved once.
   */
  function one(label, cb, lazy = true){
    on(label, ()=>{
      let args = Array.from(arguments);
      cb.apply(root[namespace], args)
      off(label, cb);
    }, lazy)
  }

  /**
   * Events Emit.
   * @param  {String}   label   Event to emit
   * @param  {Arguments} arguments  All arguments after label will be sent to
   *                                listener.
   * @return {undefined}
   */
  function emit(label){
    if(typeof events[label] == 'undefined'){
      events[label] = []
    }

    // Store incoming values for future listeners
    let args = Array.from(arguments);
    args.shift();
    events[label].__ran__ = true;
    events[label].__args__ = args;

    events[label].forEach((event)=>{
      event.apply(root[namespace], events[label].__args__)
    })

    events['*'].forEach((event)=>{
      event.apply(root[namespace], [].concat(label, events[label].__args__))
    })
  }
})()
