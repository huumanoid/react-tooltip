'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (target) {
  target.prototype.bindRemovalTracker = function () {
    if (isMutationObserverAvailable()) {
      this.removalTracker = new MutationBasedRemovalTracker(this);
      this.removalTracker.init();
    } else {
      this.removalTracker = new EventBasedRemovalTracker(this);
    }
  };

  target.prototype.attachRemovalTracker = function (element) {
    this.removalTracker.attach(element);
  };

  target.prototype.unbindRemovalTracker = function () {
    this.removalTracker.unbind();
  };
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
var getMutationObserverClass = function getMutationObserverClass() {
  return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
};

var isMutationObserverAvailable = function isMutationObserverAvailable() {
  return getMutationObserverClass() != null;
};

var EventBasedRemovalTracker = function () {
  function EventBasedRemovalTracker(tooltip) {
    _classCallCheck(this, EventBasedRemovalTracker);

    this.tooltip = tooltip;
    this.listeners = [];
  }

  _createClass(EventBasedRemovalTracker, [{
    key: 'attach',
    value: function attach(element) {
      var tooltip = this.tooltip;


      var _listener = function listener(e) {
        if (e.currentTarget === tooltip.state.currentTarget) {
          tooltip.hideTooltip();
          this.listeners.splice(this.listeners.indexOf(_listener), 1);
        }
      };
      _listener = _listener.bind(this);

      this.listeners.push({
        element: element,
        listener: _listener
      });

      element.addEventListener('DOMNodeRemovedFromDocument', _listener);
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref2 = _step.value;
          var listener = _ref2.listener,
              element = _ref2.element;

          element.removeEventListener('DOMNodeRemovedFromDocument', listener);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.listeners = [];
    }
  }]);

  return EventBasedRemovalTracker;
}();

var MutationBasedRemovalTracker = function () {
  function MutationBasedRemovalTracker(tooltip) {
    _classCallCheck(this, MutationBasedRemovalTracker);

    this.tooltip = tooltip;

    this.observer = null;
    this.inited = false;
    this.trackedElements = null;
  }

  _createClass(MutationBasedRemovalTracker, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (this.inited) {
        this.unbind();
      }

      this.trackedElements = [];

      var MutationObserver = getMutationObserverClass();
      if (MutationObserver) {
        this.observer = new MutationObserver(function () {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = _this.trackedElements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var element = _step2.value;

              if (_this.isDetached(element) && element === _this.tooltip.state.currentTarget) {
                _this.tooltip.hideTooltip();
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        });
        this.observer.observe(window.document, { childList: true, subtree: true });
      }

      this.inited = true;
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
        this.trackedElements = null;
      }
      this.inited = false;
    }
  }, {
    key: 'attach',
    value: function attach(element) {
      this.trackedElements.push(element);
    }

    // http://stackoverflow.com/a/32726412/7571078

  }, {
    key: 'isDetached',
    value: function isDetached(element) {
      if (element.parentNode === window.document) {
        return false;
      }
      if (element.parentNode == null) return true;
      return this.isDetached(element.parentNode);
    }
  }]);

  return MutationBasedRemovalTracker;
}();