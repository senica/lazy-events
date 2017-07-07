(function(){

  function LazyEvents(target = {}){

    const events = {};

    Object.defineProperty(target, 'on', {
      get: ()=>{
        return on;
      }
    })
    Object.defineProperty(target, 'one', {
      get: ()=>{
        return one;
      }
    })
    Object.defineProperty(target, 'off', {
      get: ()=>{
        return off;
      }
    })
    Object.defineProperty(target, 'emit', {
      get: ()=>{
        return emit;
      }
    })

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
        cb.apply(target, events[label].__args__)
      }

      return target;
    }

    /**
     * Events One.
     * Same as On, but will immediately remove itself once it has resolved once.
     */
    function one(label, cb, lazy = true){
      let _cb = function(){ // do not use double arrow here, it messes up arguments
        let args = Array.from(arguments);
        cb.apply(target, args)
        off(label, _cb);
      }
      on(label, _cb, lazy)
      return target;
    }


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
      return target;
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
        event.apply(target, events[label].__args__)
      })

      if(typeof events['*'] !== 'undefined'){
        events['*'].forEach((event)=>{
          let args = [].concat(label, events[label].__args__);
          event.apply(target, args);
        })
      }
      return target;
    }

    return target;
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = LazyEvents;
  }else if(typeof define === 'function' && define.amd) {
    define([], function() {
      return LazyEvents;
    });
  }else{
    window.LazyEvents = LazyEvents;
  }
})()
