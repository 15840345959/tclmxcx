var events = {};

function addEventListener (name, self, callback) {
  var tuple = [self, callback]
  var callbacks = events[name]
  if (Array.isArray(callbacks)) {
    callbacks.push(tuple)
  }
  else {
    events[name] = [tuple]
  }
}

function removeEventListener (name, self, callback) {
  var callbacks = events[name]
  if (Array.isArray(callbacks)) {
    events[name] = callbacks.filter((tuple) => {
      return tuple[0] != self
    });
  }
}

function sendEvent (name, data) {
  var callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.map((tuple) => {
      var self = tuple[0]
      var callback = tuple[1]
      callback.call(self, data)
    })
  }
}

exports.addEventListener = addEventListener
exports.removeEventListener = removeEventListener
exports.sendEvent = sendEvent