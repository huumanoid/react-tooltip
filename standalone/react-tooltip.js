(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ReactTooltip = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  GLOBAL: {
    HIDE: '__react_tooltip_hide_event',
    REBUILD: '__react_tooltip_rebuild_event',
    SHOW: '__react_tooltip_show_event'
  }
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  target.prototype.isCustomEvent = function (ele) {
    var event = this.state.event;

    return event || !!ele.getAttribute('data-event');
  };

  /* Bind listener for custom event */
  target.prototype.customBindListener = function (ele) {
    var _this = this;

    var _state = this.state,
        event = _state.event,
        eventOff = _state.eventOff;

    var dataEvent = ele.getAttribute('data-event') || event;
    var dataEventOff = ele.getAttribute('data-event-off') || eventOff;

    dataEvent.split(' ').forEach(function (event) {
      ele.removeEventListener(event, customListener);
      customListener = checkStatus.bind(_this, dataEventOff);
      ele.addEventListener(event, customListener, false);
    });
    if (dataEventOff) {
      dataEventOff.split(' ').forEach(function (event) {
        ele.removeEventListener(event, _this.hideTooltip);
        ele.addEventListener(event, _this.hideTooltip, false);
      });
    }
  };

  /* Unbind listener for custom event */
  target.prototype.customUnbindListener = function (ele) {
    var _state2 = this.state,
        event = _state2.event,
        eventOff = _state2.eventOff;

    var dataEvent = event || ele.getAttribute('data-event');
    var dataEventOff = eventOff || ele.getAttribute('data-event-off');

    ele.removeEventListener(dataEvent, customListener);
    if (dataEventOff) ele.removeEventListener(dataEventOff, this.hideTooltip);
  };
};

/**
 * Custom events to control showing and hiding of tooltip
 *
 * @attributes
 * - `event` {String}
 * - `eventOff` {String}
 */

var checkStatus = function checkStatus(dataEventOff, e) {
  var show = this.state.show;
  var id = this.props.id;

  var dataIsCapture = e.currentTarget.getAttribute('data-iscapture');
  var isCapture = dataIsCapture && dataIsCapture === 'true' || this.props.isCapture;
  var currentItem = e.currentTarget.getAttribute('currentItem');

  if (!isCapture) e.stopPropagation();
  if (show && currentItem === 'true') {
    if (!dataEventOff) this.hideTooltip(e);
  } else {
    e.currentTarget.setAttribute('currentItem', 'true');
    setUntargetItems(e.currentTarget, this.getTargetArray(id));
    this.showTooltip(e);
  }
};

var setUntargetItems = function setUntargetItems(currentTarget, targetArray) {
  for (var i = 0; i < targetArray.length; i++) {
    if (currentTarget !== targetArray[i]) {
      targetArray[i].setAttribute('currentItem', 'false');
    } else {
      targetArray[i].setAttribute('currentItem', 'true');
    }
  }
};

var customListener = void 0;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  target.prototype.getEffect = function (currentTarget) {
    var dataEffect = currentTarget.getAttribute('data-effect');
    return dataEffect || this.props.effect || 'float';
  };
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  target.prototype.isCapture = function (currentTarget) {
    var dataIsCapture = currentTarget.getAttribute('data-iscapture');
    return dataIsCapture && dataIsCapture === 'true' || this.props.isCapture || false;
  };
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  /**
   * Hide all tooltip
   * @trigger ReactTooltip.hide()
   */
  target.hide = function (target) {
    dispatchGlobalEvent(_constant2.default.GLOBAL.HIDE, { target: target });
  };

  /**
   * Rebuild all tooltip
   * @trigger ReactTooltip.rebuild()
   */
  target.rebuild = function () {
    dispatchGlobalEvent(_constant2.default.GLOBAL.REBUILD);
  };

  /**
   * Show specific tooltip
   * @trigger ReactTooltip.show()
   */
  target.show = function (target) {
    dispatchGlobalEvent(_constant2.default.GLOBAL.SHOW, { target: target });
  };

  target.prototype.globalRebuild = function () {
    if (this.mount) {
      this.unbindListener();
      this.bindListener();
    }
  };

  target.prototype.globalShow = function (event) {
    if (this.mount) {
      // Create a fake event, specific show will limit the type to `solid`
      // only `float` type cares e.clientX e.clientY
      var e = { currentTarget: event.detail.target };
      this.showTooltip(e, true);
    }
  };

  target.prototype.globalHide = function (event) {
    if (this.mount) {
      var hasTarget = event && event.detail && event.detail.target && true || false;
      this.hideTooltip({ currentTarget: hasTarget && event.detail.target }, hasTarget);
    }
  };
};

var _constant = require('../constant');

var _constant2 = _interopRequireDefault(_constant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatchGlobalEvent = function dispatchGlobalEvent(eventName, opts) {
  // Compatibale with IE
  // @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
  var event = void 0;

  if (typeof window.CustomEvent === 'function') {
    event = new window.CustomEvent(eventName, { detail: opts });
  } else {
    event = document.createEvent('Event');
    event.initEvent(eventName, false, true);
    event.detail = opts;
  }

  window.dispatchEvent(event);
}; /**
    * Static methods for react-tooltip
    */

},{"../constant":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  target.prototype.bindRemovalTracker = function () {
    var _this = this;

    var MutationObserver = getMutationObserverClass();
    if (MutationObserver == null) return;

    var observer = new MutationObserver(function (mutations) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = mutations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var mutation = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = mutation.removedNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var element = _step2.value;

              if (element === _this.state.currentTarget) {
                _this.hideTooltip();
                return;
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
    });

    observer.observe(window.document, { childList: true, subtree: true });

    this.removalTracker = observer;
  };

  target.prototype.unbindRemovalTracker = function () {
    if (this.removalTracker) {
      this.removalTracker.disconnect();
      this.removalTracker = null;
    }
  };
};

/**
 * Tracking target removing from DOM.
 * It's nessesary to hide tooltip when it's target disappears.
 * Otherwise, the tooltip would be shown forever until another target
 * is triggered.
 *
 * If MutationObserver is not available, this feature just doesn't work.
 */

// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
var getMutationObserverClass = function getMutationObserverClass() {
  return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  target.prototype.bindWindowEvents = function (resizeHide) {
    // ReactTooltip.hide
    window.removeEventListener(_constant2.default.GLOBAL.HIDE, this.globalHide);
    window.addEventListener(_constant2.default.GLOBAL.HIDE, this.globalHide, false);

    // ReactTooltip.rebuild
    window.removeEventListener(_constant2.default.GLOBAL.REBUILD, this.globalRebuild);
    window.addEventListener(_constant2.default.GLOBAL.REBUILD, this.globalRebuild, false);

    // ReactTooltip.show
    window.removeEventListener(_constant2.default.GLOBAL.SHOW, this.globalShow);
    window.addEventListener(_constant2.default.GLOBAL.SHOW, this.globalShow, false);

    // Resize
    if (resizeHide) {
      window.removeEventListener('resize', this.onWindowResize);
      window.addEventListener('resize', this.onWindowResize, false);
    }
  };

  target.prototype.unbindWindowEvents = function () {
    window.removeEventListener(_constant2.default.GLOBAL.HIDE, this.globalHide);
    window.removeEventListener(_constant2.default.GLOBAL.REBUILD, this.globalRebuild);
    window.removeEventListener(_constant2.default.GLOBAL.SHOW, this.globalShow);
    window.removeEventListener('resize', this.onWindowResize);
  };

  /**
   * invoked by resize event of window
   */
  target.prototype.onWindowResize = function () {
    if (!this.mount) return;
    this.hideTooltip();
  };
};

var _constant = require('../constant');

var _constant2 = _interopRequireDefault(_constant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../constant":2}],9:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

/* Decoraters */


/* Utils */


/* CSS */


var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _staticMethods = require('./decorators/staticMethods');

var _staticMethods2 = _interopRequireDefault(_staticMethods);

var _windowListener = require('./decorators/windowListener');

var _windowListener2 = _interopRequireDefault(_windowListener);

var _customEvent = require('./decorators/customEvent');

var _customEvent2 = _interopRequireDefault(_customEvent);

var _isCapture = require('./decorators/isCapture');

var _isCapture2 = _interopRequireDefault(_isCapture);

var _getEffect = require('./decorators/getEffect');

var _getEffect2 = _interopRequireDefault(_getEffect);

var _trackRemoval = require('./decorators/trackRemoval');

var _trackRemoval2 = _interopRequireDefault(_trackRemoval);

var _getPosition = require('./utils/getPosition');

var _getPosition2 = _interopRequireDefault(_getPosition);

var _getTipContent = require('./utils/getTipContent');

var _getTipContent2 = _interopRequireDefault(_getTipContent);

var _aria = require('./utils/aria');

var _nodeListToArray = require('./utils/nodeListToArray');

var _nodeListToArray2 = _interopRequireDefault(_nodeListToArray);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactTooltip = (0, _staticMethods2.default)(_class = (0, _windowListener2.default)(_class = (0, _customEvent2.default)(_class = (0, _isCapture2.default)(_class = (0, _getEffect2.default)(_class = (0, _trackRemoval2.default)(_class = (_temp = _class2 = function (_Component) {
  _inherits(ReactTooltip, _Component);

  function ReactTooltip(props) {
    _classCallCheck(this, ReactTooltip);

    var _this = _possibleConstructorReturn(this, (ReactTooltip.__proto__ || Object.getPrototypeOf(ReactTooltip)).call(this, props));

    _this.state = {
      place: 'top', // Direction of tooltip
      type: 'dark', // Color theme of tooltip
      effect: 'float', // float or fixed
      show: false,
      border: false,
      placeholder: '',
      offset: {},
      extraClass: '',
      html: false,
      delayHide: 0,
      delayShow: 0,
      event: props.event || null,
      eventOff: props.eventOff || null,
      currentEvent: null, // Current mouse event
      currentTarget: null, // Current target of mouse event
      ariaProps: (0, _aria.parseAria)(props), // aria- and role attributes
      isEmptyTip: false,
      disable: false
    };

    _this.bind(['showTooltip', 'updateTooltip', 'hideTooltip', 'globalRebuild', 'globalShow', 'globalHide', 'onWindowResize']);

    _this.mount = true;
    _this.delayShowLoop = null;
    _this.delayHideLoop = null;
    _this.intervalUpdateContent = null;
    return _this;
  }

  /**
   * For unify the bind and unbind listener
   */


  _createClass(ReactTooltip, [{
    key: 'bind',
    value: function bind(methodArray) {
      var _this2 = this;

      methodArray.forEach(function (method) {
        _this2[method] = _this2[method].bind(_this2);
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          insecure = _props.insecure,
          resizeHide = _props.resizeHide;

      if (insecure) {
        this.setStyleHeader(); // Set the style to the <link>
      }
      this.bindListener(); // Bind listener for tooltip
      this.bindWindowEvents(resizeHide); // Bind global event for static method
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      var ariaProps = this.state.ariaProps;

      var newAriaProps = (0, _aria.parseAria)(props);

      var isChanged = Object.keys(newAriaProps).some(function (props) {
        return newAriaProps[props] !== ariaProps[props];
      });
      if (isChanged) {
        this.setState({ ariaProps: newAriaProps });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.mount = false;

      this.clearTimer();

      this.unbindListener();
      this.removeScrollListener();
      this.unbindWindowEvents();
    }

    /**
     * Pick out corresponded target elements
     */

  }, {
    key: 'getTargetArray',
    value: function getTargetArray(id) {
      var targetArray = void 0;
      if (!id) {
        targetArray = document.querySelectorAll('[data-tip]:not([data-for])');
      } else {
        var escaped = id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        targetArray = document.querySelectorAll('[data-tip][data-for="' + escaped + '"]');
      }
      // targetArray is a NodeList, convert it to a real array
      return (0, _nodeListToArray2.default)(targetArray);
    }

    /**
     * Bind listener to the target elements
     * These listeners used to trigger showing or hiding the tooltip
     */

  }, {
    key: 'bindListener',
    value: function bindListener() {
      var _this3 = this;

      var _props2 = this.props,
          id = _props2.id,
          globalEventOff = _props2.globalEventOff;

      var targetArray = this.getTargetArray(id);

      targetArray.forEach(function (target) {
        var isCaptureMode = _this3.isCapture(target);
        var effect = _this3.getEffect(target);
        if (target.getAttribute('currentItem') === null) {
          target.setAttribute('currentItem', 'false');
        }
        _this3.unbindBasicListener(target);

        if (_this3.isCustomEvent(target)) {
          _this3.customBindListener(target);
          return;
        }

        target.addEventListener('mouseenter', _this3.showTooltip, isCaptureMode);
        if (effect === 'float') {
          target.addEventListener('mousemove', _this3.updateTooltip, isCaptureMode);
        }
        target.addEventListener('mouseleave', _this3.hideTooltip, isCaptureMode);
      });

      // Global event to hide tooltip
      if (globalEventOff) {
        window.removeEventListener(globalEventOff, this.hideTooltip);
        window.addEventListener(globalEventOff, this.hideTooltip, false);
      }

      // Track removal of targetArray elements from DOM
      this.bindRemovalTracker();
    }

    /**
     * Unbind listeners on target elements
     */

  }, {
    key: 'unbindListener',
    value: function unbindListener() {
      var _this4 = this;

      var _props3 = this.props,
          id = _props3.id,
          globalEventOff = _props3.globalEventOff;

      var targetArray = this.getTargetArray(id);
      targetArray.forEach(function (target) {
        _this4.unbindBasicListener(target);
        if (_this4.isCustomEvent(target)) _this4.customUnbindListener(target);
      });

      if (globalEventOff) window.removeEventListener(globalEventOff, this.hideTooltip);
      this.unbindRemovalTracker();
    }

    /**
     * Invoke this before bind listener and ummount the compont
     * it is necessary to invloke this even when binding custom event
     * so that the tooltip can switch between custom and default listener
     */

  }, {
    key: 'unbindBasicListener',
    value: function unbindBasicListener(target) {
      var isCaptureMode = this.isCapture(target);
      target.removeEventListener('mouseenter', this.showTooltip, isCaptureMode);
      target.removeEventListener('mousemove', this.updateTooltip, isCaptureMode);
      target.removeEventListener('mouseleave', this.hideTooltip, isCaptureMode);
    }

    /**
     * When mouse enter, show the tooltip
     */

  }, {
    key: 'showTooltip',
    value: function showTooltip(e, isGlobalCall) {
      var _this5 = this;

      if (isGlobalCall) {
        // Don't trigger other elements belongs to other ReactTooltip
        var targetArray = this.getTargetArray(this.props.id);
        var isMyElement = targetArray.some(function (ele) {
          return ele === e.currentTarget;
        });
        if (!isMyElement || this.state.show) return;
      }
      // Get the tooltip content
      // calculate in this phrase so that tip width height can be detected
      var _props4 = this.props,
          children = _props4.children,
          multiline = _props4.multiline,
          getContent = _props4.getContent;

      var originTooltip = e.currentTarget.getAttribute('data-tip');
      var isMultiline = e.currentTarget.getAttribute('data-multiline') || multiline || false;

      // Generate tootlip content
      var content = void 0;
      if (getContent) {
        if (Array.isArray(getContent)) {
          content = getContent[0] && getContent[0]();
        } else {
          content = getContent();
        }
      }
      var placeholder = (0, _getTipContent2.default)(originTooltip, children, content, isMultiline);
      var isEmptyTip = typeof placeholder === 'string' && placeholder === '' || placeholder === null;

      // If it is focus event or called by ReactTooltip.show, switch to `solid` effect
      var switchToSolid = e instanceof window.FocusEvent || isGlobalCall;

      // if it need to skip adding hide listener to scroll
      var scrollHide = true;
      if (e.currentTarget.getAttribute('data-scroll-hide')) {
        scrollHide = e.currentTarget.getAttribute('data-scroll-hide') === 'true';
      } else if (this.props.scrollHide != null) {
        scrollHide = this.props.scrollHide;
      }

      // To prevent previously created timers from triggering
      this.clearTimer();

      this.setState({
        placeholder: placeholder,
        isEmptyTip: isEmptyTip,
        place: e.currentTarget.getAttribute('data-place') || this.props.place || 'top',
        type: e.currentTarget.getAttribute('data-type') || this.props.type || 'dark',
        effect: switchToSolid && 'solid' || this.getEffect(e.currentTarget),
        offset: e.currentTarget.getAttribute('data-offset') || this.props.offset || {},
        html: e.currentTarget.getAttribute('data-html') ? e.currentTarget.getAttribute('data-html') === 'true' : this.props.html || false,
        delayShow: e.currentTarget.getAttribute('data-delay-show') || this.props.delayShow || 0,
        delayHide: e.currentTarget.getAttribute('data-delay-hide') || this.props.delayHide || 0,
        border: e.currentTarget.getAttribute('data-border') ? e.currentTarget.getAttribute('data-border') === 'true' : this.props.border || false,
        extraClass: e.currentTarget.getAttribute('data-class') || this.props.class || this.props.className || '',
        disable: e.currentTarget.getAttribute('data-tip-disable') ? e.currentTarget.getAttribute('data-tip-disable') === 'true' : this.props.disable || false
      }, function () {
        if (scrollHide) _this5.addScrollListener(e);
        _this5.updateTooltip(e);

        if (getContent && Array.isArray(getContent)) {
          _this5.intervalUpdateContent = setInterval(function () {
            if (_this5.mount) {
              var _getContent = _this5.props.getContent;

              var _placeholder = (0, _getTipContent2.default)(originTooltip, _getContent[0](), isMultiline);
              var _isEmptyTip = typeof _placeholder === 'string' && _placeholder === '';
              _this5.setState({
                placeholder: _placeholder,
                isEmptyTip: _isEmptyTip
              });
            }
          }, getContent[1]);
        }
      });
    }

    /**
     * When mouse hover, updatetooltip
     */

  }, {
    key: 'updateTooltip',
    value: function updateTooltip(e) {
      var _this6 = this;

      var _state = this.state,
          delayShow = _state.delayShow,
          show = _state.show,
          isEmptyTip = _state.isEmptyTip,
          disable = _state.disable;
      var afterShow = this.props.afterShow;
      var placeholder = this.state.placeholder;

      var delayTime = show ? 0 : parseInt(delayShow, 10);
      var eventTarget = e.currentTarget;

      if (isEmptyTip || disable) return; // if the tooltip is empty, disable the tooltip
      var updateState = function updateState() {
        if (Array.isArray(placeholder) && placeholder.length > 0 || placeholder) {
          var isInvisible = !_this6.state.show;
          _this6.setState({
            currentEvent: e,
            currentTarget: eventTarget,
            show: true
          }, function () {
            _this6.updatePosition();
            if (isInvisible && afterShow) afterShow();
          });
        }
      };

      clearTimeout(this.delayShowLoop);
      if (delayShow) {
        this.delayShowLoop = setTimeout(updateState, delayTime);
      } else {
        updateState();
      }
    }

    /**
     * When mouse leave, hide tooltip
     */

  }, {
    key: 'hideTooltip',
    value: function hideTooltip(e, hasTarget) {
      var _this7 = this;

      var _state2 = this.state,
          delayHide = _state2.delayHide,
          isEmptyTip = _state2.isEmptyTip,
          disable = _state2.disable;
      var afterHide = this.props.afterHide;

      if (!this.mount) return;
      if (isEmptyTip || disable) return; // if the tooltip is empty, disable the tooltip
      if (hasTarget) {
        // Don't trigger other elements belongs to other ReactTooltip
        var targetArray = this.getTargetArray(this.props.id);
        var isMyElement = targetArray.some(function (ele) {
          return ele === e.currentTarget;
        });
        if (!isMyElement || !this.state.show) return;
      }
      var resetState = function resetState() {
        var isVisible = _this7.state.show;
        _this7.setState({
          show: false
        }, function () {
          _this7.removeScrollListener();
          if (isVisible && afterHide) afterHide();
        });
      };

      this.clearTimer();
      if (delayHide) {
        this.delayHideLoop = setTimeout(resetState, parseInt(delayHide, 10));
      } else {
        resetState();
      }
    }

    /**
     * Add scroll eventlistener when tooltip show
     * automatically hide the tooltip when scrolling
     */

  }, {
    key: 'addScrollListener',
    value: function addScrollListener(e) {
      var isCaptureMode = this.isCapture(e.currentTarget);
      window.addEventListener('scroll', this.hideTooltip, isCaptureMode);
    }
  }, {
    key: 'removeScrollListener',
    value: function removeScrollListener() {
      window.removeEventListener('scroll', this.hideTooltip);
    }

    // Calculation the position

  }, {
    key: 'updatePosition',
    value: function updatePosition() {
      var _this8 = this;

      var _state3 = this.state,
          currentEvent = _state3.currentEvent,
          currentTarget = _state3.currentTarget,
          place = _state3.place,
          effect = _state3.effect,
          offset = _state3.offset;

      var node = _reactDom2.default.findDOMNode(this);
      var result = (0, _getPosition2.default)(currentEvent, currentTarget, node, place, effect, offset);

      if (result.isNewState) {
        // Switch to reverse placement
        return this.setState(result.newState, function () {
          _this8.updatePosition();
        });
      }
      // Set tooltip position
      node.style.left = result.position.left + 'px';
      node.style.top = result.position.top + 'px';
    }

    /**
     * Set style tag in header
     * in this way we can insert default css
     */

  }, {
    key: 'setStyleHeader',
    value: function setStyleHeader() {
      if (!document.getElementsByTagName('head')[0].querySelector('style[id="react-tooltip"]')) {
        var tag = document.createElement('style');
        tag.id = 'react-tooltip';
        tag.innerHTML = _style2.default;
        document.getElementsByTagName('head')[0].appendChild(tag);
      }
    }

    /**
     * CLear all kinds of timeout of interval
     */

  }, {
    key: 'clearTimer',
    value: function clearTimer() {
      clearTimeout(this.delayShowLoop);
      clearTimeout(this.delayHideLoop);
      clearInterval(this.intervalUpdateContent);
    }
  }, {
    key: 'render',
    value: function render() {
      var _state4 = this.state,
          placeholder = _state4.placeholder,
          extraClass = _state4.extraClass,
          html = _state4.html,
          ariaProps = _state4.ariaProps,
          disable = _state4.disable,
          isEmptyTip = _state4.isEmptyTip;

      var tooltipClass = (0, _classnames2.default)('__react_component_tooltip', { 'show': this.state.show && !disable && !isEmptyTip }, { 'border': this.state.border }, { 'place-top': this.state.place === 'top' }, { 'place-bottom': this.state.place === 'bottom' }, { 'place-left': this.state.place === 'left' }, { 'place-right': this.state.place === 'right' }, { 'type-dark': this.state.type === 'dark' }, { 'type-success': this.state.type === 'success' }, { 'type-warning': this.state.type === 'warning' }, { 'type-error': this.state.type === 'error' }, { 'type-info': this.state.type === 'info' }, { 'type-light': this.state.type === 'light' });

      var Wrapper = this.props.wrapper;
      if (ReactTooltip.supportedWrappers.indexOf(Wrapper) < 0) {
        Wrapper = ReactTooltip.defaultProps.wrapper;
      }

      if (html) {
        return _react2.default.createElement(Wrapper, _extends({ className: tooltipClass + ' ' + extraClass
        }, ariaProps, {
          'data-id': 'tooltip',
          dangerouslySetInnerHTML: { __html: placeholder } }));
      } else {
        return _react2.default.createElement(
          Wrapper,
          _extends({ className: tooltipClass + ' ' + extraClass
          }, ariaProps, {
            'data-id': 'tooltip' }),
          placeholder
        );
      }
    }
  }]);

  return ReactTooltip;
}(_react.Component), _class2.propTypes = {
  children: _react.PropTypes.any,
  place: _react.PropTypes.string,
  type: _react.PropTypes.string,
  effect: _react.PropTypes.string,
  offset: _react.PropTypes.object,
  multiline: _react.PropTypes.bool,
  border: _react.PropTypes.bool,
  insecure: _react.PropTypes.bool,
  class: _react.PropTypes.string,
  className: _react.PropTypes.string,
  id: _react.PropTypes.string,
  html: _react.PropTypes.bool,
  delayHide: _react.PropTypes.number,
  delayShow: _react.PropTypes.number,
  event: _react.PropTypes.string,
  eventOff: _react.PropTypes.string,
  watchWindow: _react.PropTypes.bool,
  isCapture: _react.PropTypes.bool,
  globalEventOff: _react.PropTypes.string,
  getContent: _react.PropTypes.any,
  afterShow: _react.PropTypes.func,
  afterHide: _react.PropTypes.func,
  disable: _react.PropTypes.bool,
  scrollHide: _react.PropTypes.bool,
  resizeHide: _react.PropTypes.bool,
  wrapper: _react.PropTypes.string
}, _class2.defaultProps = {
  insecure: true,
  resizeHide: true,
  wrapper: 'div'
}, _class2.supportedWrappers = ['div', 'span'], _temp)) || _class) || _class) || _class) || _class) || _class) || _class;

/* export default not fit for standalone, it will exports {default:...} */


module.exports = ReactTooltip;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./decorators/customEvent":3,"./decorators/getEffect":4,"./decorators/isCapture":5,"./decorators/staticMethods":6,"./decorators/trackRemoval":7,"./decorators/windowListener":8,"./style":10,"./utils/aria":11,"./utils/getPosition":12,"./utils/getTipContent":13,"./utils/nodeListToArray":14,"classnames":1}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = '.__react_component_tooltip{border-radius:3px;display:inline-block;font-size:13px;left:-999em;opacity:0;padding:8px 21px;position:fixed;pointer-events:none;transition:opacity 0.3s ease-out;top:-999em;visibility:hidden;z-index:999}.__react_component_tooltip:before,.__react_component_tooltip:after{content:"";width:0;height:0;position:absolute}.__react_component_tooltip.show{opacity:0.9;margin-top:0px;margin-left:0px;visibility:visible}.__react_component_tooltip.type-dark{color:#fff;background-color:#222}.__react_component_tooltip.type-dark.place-top:after{border-top-color:#222;border-top-style:solid;border-top-width:6px}.__react_component_tooltip.type-dark.place-bottom:after{border-bottom-color:#222;border-bottom-style:solid;border-bottom-width:6px}.__react_component_tooltip.type-dark.place-left:after{border-left-color:#222;border-left-style:solid;border-left-width:6px}.__react_component_tooltip.type-dark.place-right:after{border-right-color:#222;border-right-style:solid;border-right-width:6px}.__react_component_tooltip.type-dark.border{border:1px solid #fff}.__react_component_tooltip.type-dark.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-dark.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-dark.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-dark.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-success{color:#fff;background-color:#8DC572}.__react_component_tooltip.type-success.place-top:after{border-top-color:#8DC572;border-top-style:solid;border-top-width:6px}.__react_component_tooltip.type-success.place-bottom:after{border-bottom-color:#8DC572;border-bottom-style:solid;border-bottom-width:6px}.__react_component_tooltip.type-success.place-left:after{border-left-color:#8DC572;border-left-style:solid;border-left-width:6px}.__react_component_tooltip.type-success.place-right:after{border-right-color:#8DC572;border-right-style:solid;border-right-width:6px}.__react_component_tooltip.type-success.border{border:1px solid #fff}.__react_component_tooltip.type-success.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-success.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-success.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-success.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-warning{color:#fff;background-color:#F0AD4E}.__react_component_tooltip.type-warning.place-top:after{border-top-color:#F0AD4E;border-top-style:solid;border-top-width:6px}.__react_component_tooltip.type-warning.place-bottom:after{border-bottom-color:#F0AD4E;border-bottom-style:solid;border-bottom-width:6px}.__react_component_tooltip.type-warning.place-left:after{border-left-color:#F0AD4E;border-left-style:solid;border-left-width:6px}.__react_component_tooltip.type-warning.place-right:after{border-right-color:#F0AD4E;border-right-style:solid;border-right-width:6px}.__react_component_tooltip.type-warning.border{border:1px solid #fff}.__react_component_tooltip.type-warning.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-warning.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-warning.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-warning.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-error{color:#fff;background-color:#BE6464}.__react_component_tooltip.type-error.place-top:after{border-top-color:#BE6464;border-top-style:solid;border-top-width:6px}.__react_component_tooltip.type-error.place-bottom:after{border-bottom-color:#BE6464;border-bottom-style:solid;border-bottom-width:6px}.__react_component_tooltip.type-error.place-left:after{border-left-color:#BE6464;border-left-style:solid;border-left-width:6px}.__react_component_tooltip.type-error.place-right:after{border-right-color:#BE6464;border-right-style:solid;border-right-width:6px}.__react_component_tooltip.type-error.border{border:1px solid #fff}.__react_component_tooltip.type-error.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-error.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-error.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-error.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-info{color:#fff;background-color:#337AB7}.__react_component_tooltip.type-info.place-top:after{border-top-color:#337AB7;border-top-style:solid;border-top-width:6px}.__react_component_tooltip.type-info.place-bottom:after{border-bottom-color:#337AB7;border-bottom-style:solid;border-bottom-width:6px}.__react_component_tooltip.type-info.place-left:after{border-left-color:#337AB7;border-left-style:solid;border-left-width:6px}.__react_component_tooltip.type-info.place-right:after{border-right-color:#337AB7;border-right-style:solid;border-right-width:6px}.__react_component_tooltip.type-info.border{border:1px solid #fff}.__react_component_tooltip.type-info.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-info.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-info.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-info.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-light{color:#222;background-color:#fff}.__react_component_tooltip.type-light.place-top:after{border-top-color:#fff;border-top-style:solid;border-top-width:6px}.__react_component_tooltip.type-light.place-bottom:after{border-bottom-color:#fff;border-bottom-style:solid;border-bottom-width:6px}.__react_component_tooltip.type-light.place-left:after{border-left-color:#fff;border-left-style:solid;border-left-width:6px}.__react_component_tooltip.type-light.place-right:after{border-right-color:#fff;border-right-style:solid;border-right-width:6px}.__react_component_tooltip.type-light.border{border:1px solid #222}.__react_component_tooltip.type-light.border.place-top:before{border-top:8px solid #222}.__react_component_tooltip.type-light.border.place-bottom:before{border-bottom:8px solid #222}.__react_component_tooltip.type-light.border.place-left:before{border-left:8px solid #222}.__react_component_tooltip.type-light.border.place-right:before{border-right:8px solid #222}.__react_component_tooltip.place-top{margin-top:-10px}.__react_component_tooltip.place-top:before{border-left:10px solid transparent;border-right:10px solid transparent;bottom:-8px;left:50%;margin-left:-10px}.__react_component_tooltip.place-top:after{border-left:8px solid transparent;border-right:8px solid transparent;bottom:-6px;left:50%;margin-left:-8px}.__react_component_tooltip.place-bottom{margin-top:10px}.__react_component_tooltip.place-bottom:before{border-left:10px solid transparent;border-right:10px solid transparent;top:-8px;left:50%;margin-left:-10px}.__react_component_tooltip.place-bottom:after{border-left:8px solid transparent;border-right:8px solid transparent;top:-6px;left:50%;margin-left:-8px}.__react_component_tooltip.place-left{margin-left:-10px}.__react_component_tooltip.place-left:before{border-top:6px solid transparent;border-bottom:6px solid transparent;right:-8px;top:50%;margin-top:-5px}.__react_component_tooltip.place-left:after{border-top:5px solid transparent;border-bottom:5px solid transparent;right:-6px;top:50%;margin-top:-4px}.__react_component_tooltip.place-right{margin-left:10px}.__react_component_tooltip.place-right:before{border-top:6px solid transparent;border-bottom:6px solid transparent;left:-8px;top:50%;margin-top:-5px}.__react_component_tooltip.place-right:after{border-top:5px solid transparent;border-bottom:5px solid transparent;left:-6px;top:50%;margin-top:-4px}.__react_component_tooltip .multi-line{display:block;padding:2px 0px;text-align:center}';

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAria = parseAria;
/**
 * Support aria- and role in ReactTooltip
 *
 * @params props {Object}
 * @return {Object}
 */
function parseAria(props) {
  var ariaObj = {};
  Object.keys(props).filter(function (prop) {
    // aria-xxx and role is acceptable
    return (/(^aria-\w+$|^role$)/.test(prop)
    );
  }).forEach(function (prop) {
    ariaObj[prop] = props[prop];
  });

  return ariaObj;
}

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (e, target, node, place, effect, offset) {
  var tipWidth = node.clientWidth;
  var tipHeight = node.clientHeight;

  var _getCurrentOffset = getCurrentOffset(e, target, effect),
      mouseX = _getCurrentOffset.mouseX,
      mouseY = _getCurrentOffset.mouseY;

  var defaultOffset = getDefaultPosition(effect, target.clientWidth, target.clientHeight, tipWidth, tipHeight);

  var _calculateOffset = calculateOffset(offset),
      extraOffset_X = _calculateOffset.extraOffset_X,
      extraOffset_Y = _calculateOffset.extraOffset_Y;

  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  var _getParent = getParent(node),
      parentTop = _getParent.parentTop,
      parentLeft = _getParent.parentLeft;

  // Get the edge offset of the tooltip


  var getTipOffsetLeft = function getTipOffsetLeft(place) {
    var offset_X = defaultOffset[place].l;
    return mouseX + offset_X + extraOffset_X;
  };
  var getTipOffsetRight = function getTipOffsetRight(place) {
    var offset_X = defaultOffset[place].r;
    return mouseX + offset_X + extraOffset_X;
  };
  var getTipOffsetTop = function getTipOffsetTop(place) {
    var offset_Y = defaultOffset[place].t;
    return mouseY + offset_Y + extraOffset_Y;
  };
  var getTipOffsetBottom = function getTipOffsetBottom(place) {
    var offset_Y = defaultOffset[place].b;
    return mouseY + offset_Y + extraOffset_Y;
  };

  // Judge if the tooltip has over the window(screen)
  var outsideVertical = function outsideVertical() {
    var result = false;
    var newPlace = void 0;
    if (getTipOffsetTop('left') < 0 && getTipOffsetBottom('left') <= windowHeight && getTipOffsetBottom('bottom') <= windowHeight) {
      result = true;
      newPlace = 'bottom';
    } else if (getTipOffsetBottom('left') > windowHeight && getTipOffsetTop('left') >= 0 && getTipOffsetTop('top') >= 0) {
      result = true;
      newPlace = 'top';
    }
    return { result: result, newPlace: newPlace };
  };
  var outsideLeft = function outsideLeft() {
    var _outsideVertical = outsideVertical(),
        result = _outsideVertical.result,
        newPlace = _outsideVertical.newPlace; // Deal with vertical as first priority


    if (result && outsideHorizontal().result) {
      return { result: false }; // No need to change, if change to vertical will out of space
    }
    if (!result && getTipOffsetLeft('left') < 0 && getTipOffsetRight('right') <= windowWidth) {
      result = true; // If vertical ok, but let out of side and right won't out of side
      newPlace = 'right';
    }
    return { result: result, newPlace: newPlace };
  };
  var outsideRight = function outsideRight() {
    var _outsideVertical2 = outsideVertical(),
        result = _outsideVertical2.result,
        newPlace = _outsideVertical2.newPlace;

    if (result && outsideHorizontal().result) {
      return { result: false }; // No need to change, if change to vertical will out of space
    }
    if (!result && getTipOffsetRight('right') > windowWidth && getTipOffsetLeft('left') >= 0) {
      result = true;
      newPlace = 'left';
    }
    return { result: result, newPlace: newPlace };
  };

  var outsideHorizontal = function outsideHorizontal() {
    var result = false;
    var newPlace = void 0;
    if (getTipOffsetLeft('top') < 0 && getTipOffsetRight('top') <= windowWidth && getTipOffsetRight('right') <= windowWidth) {
      result = true;
      newPlace = 'right';
    } else if (getTipOffsetRight('top') > windowWidth && getTipOffsetLeft('top') >= 0 && getTipOffsetLeft('left') >= 0) {
      result = true;
      newPlace = 'left';
    }
    return { result: result, newPlace: newPlace };
  };
  var outsideTop = function outsideTop() {
    var _outsideHorizontal = outsideHorizontal(),
        result = _outsideHorizontal.result,
        newPlace = _outsideHorizontal.newPlace;

    if (result && outsideVertical().result) {
      return { result: false };
    }
    if (!result && getTipOffsetTop('top') < 0 && getTipOffsetBottom('bottom') <= windowHeight) {
      result = true;
      newPlace = 'bottom';
    }
    return { result: result, newPlace: newPlace };
  };
  var outsideBottom = function outsideBottom() {
    var _outsideHorizontal2 = outsideHorizontal(),
        result = _outsideHorizontal2.result,
        newPlace = _outsideHorizontal2.newPlace;

    if (result && outsideVertical().result) {
      return { result: false };
    }
    if (!result && getTipOffsetBottom('bottom') > windowHeight && getTipOffsetTop('top') >= 0) {
      result = true;
      newPlace = 'top';
    }
    return { result: result, newPlace: newPlace };
  };

  // Return new state to change the placement to the reverse if possible
  var outsideLeftResult = outsideLeft();
  var outsideRightResult = outsideRight();
  var outsideTopResult = outsideTop();
  var outsideBottomResult = outsideBottom();

  if (place === 'left' && outsideLeftResult.result) {
    return {
      isNewState: true,
      newState: { place: outsideLeftResult.newPlace }
    };
  } else if (place === 'right' && outsideRightResult.result) {
    return {
      isNewState: true,
      newState: { place: outsideRightResult.newPlace }
    };
  } else if (place === 'top' && outsideTopResult.result) {
    return {
      isNewState: true,
      newState: { place: outsideTopResult.newPlace }
    };
  } else if (place === 'bottom' && outsideBottomResult.result) {
    return {
      isNewState: true,
      newState: { place: outsideBottomResult.newPlace }
    };
  }

  // Return tooltip offset position
  return {
    isNewState: false,
    position: {
      left: parseInt(getTipOffsetLeft(place) - parentLeft, 10),
      top: parseInt(getTipOffsetTop(place) - parentTop, 10)
    }
  };
};

// Get current mouse offset
var getCurrentOffset = function getCurrentOffset(e, currentTarget, effect) {
  var boundingClientRect = currentTarget.getBoundingClientRect();
  var targetTop = boundingClientRect.top;
  var targetLeft = boundingClientRect.left;
  var targetWidth = currentTarget.clientWidth;
  var targetHeight = currentTarget.clientHeight;

  if (effect === 'float') {
    return {
      mouseX: e.clientX,
      mouseY: e.clientY
    };
  }
  return {
    mouseX: targetLeft + targetWidth / 2,
    mouseY: targetTop + targetHeight / 2
  };
};

// List all possibility of tooltip final offset
// This is useful in judging if it is necessary for tooltip to switch position when out of window
/**
 * Calculate the position of tooltip
 *
 * @params
 * - `e` {Event} the event of current mouse
 * - `target` {Element} the currentTarget of the event
 * - `node` {DOM} the react-tooltip object
 * - `place` {String} top / right / bottom / left
 * - `effect` {String} float / solid
 * - `offset` {Object} the offset to default position
 *
 * @return {Object
 * - `isNewState` {Bool} required
 * - `newState` {Object}
 * - `position` {OBject} {left: {Number}, top: {Number}}
 */
var getDefaultPosition = function getDefaultPosition(effect, targetWidth, targetHeight, tipWidth, tipHeight) {
  var top = void 0;
  var right = void 0;
  var bottom = void 0;
  var left = void 0;
  var disToMouse = 3;
  var triangleHeight = 2;
  var cursorHeight = 12; // Optimize for float bottom only, cause the cursor will hide the tooltip

  if (effect === 'float') {
    top = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: -(tipHeight + disToMouse + triangleHeight),
      b: -disToMouse
    };
    bottom = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: disToMouse + cursorHeight,
      b: tipHeight + disToMouse + triangleHeight + cursorHeight
    };
    left = {
      l: -(tipWidth + disToMouse + triangleHeight),
      r: -disToMouse,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
    right = {
      l: disToMouse,
      r: tipWidth + disToMouse + triangleHeight,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
  } else if (effect === 'solid') {
    top = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: -(targetHeight / 2 + tipHeight + triangleHeight),
      b: -(targetHeight / 2)
    };
    bottom = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: targetHeight / 2,
      b: targetHeight / 2 + tipHeight + triangleHeight
    };
    left = {
      l: -(tipWidth + targetWidth / 2 + triangleHeight),
      r: -(targetWidth / 2),
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
    right = {
      l: targetWidth / 2,
      r: tipWidth + targetWidth / 2 + triangleHeight,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
  }

  return { top: top, bottom: bottom, left: left, right: right };
};

// Consider additional offset into position calculation
var calculateOffset = function calculateOffset(offset) {
  var extraOffset_X = 0;
  var extraOffset_Y = 0;

  if (Object.prototype.toString.apply(offset) === '[object String]') {
    offset = JSON.parse(offset.toString().replace(/\'/g, '\"'));
  }
  for (var key in offset) {
    if (key === 'top') {
      extraOffset_Y -= parseInt(offset[key], 10);
    } else if (key === 'bottom') {
      extraOffset_Y += parseInt(offset[key], 10);
    } else if (key === 'left') {
      extraOffset_X -= parseInt(offset[key], 10);
    } else if (key === 'right') {
      extraOffset_X += parseInt(offset[key], 10);
    }
  }

  return { extraOffset_X: extraOffset_X, extraOffset_Y: extraOffset_Y };
};

// Get the offset of the parent elements
var getParent = function getParent(currentTarget) {
  var currentParent = currentTarget;
  while (currentParent) {
    if (window.getComputedStyle(currentParent).getPropertyValue('transform') !== 'none') break;
    currentParent = currentParent.parentElement;
  }

  var parentTop = currentParent && currentParent.getBoundingClientRect().top || 0;
  var parentLeft = currentParent && currentParent.getBoundingClientRect().left || 0;

  return { parentTop: parentTop, parentLeft: parentLeft };
};

},{}],13:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tip, children, getContent, multiline) {
  if (children) return children;
  if (getContent !== undefined && getContent !== null) return getContent; // getContent can be 0, '', etc.
  if (getContent === null) return null; // Tip not exist and childern is null or undefined

  var regexp = /<br\s*\/?>/;
  if (!multiline || multiline === 'false' || !regexp.test(tip)) {
    // No trim(), so that user can keep their input
    return tip;
  }

  // Multiline tooltip content
  return tip.split(regexp).map(function (d, i) {
    return _react2.default.createElement(
      'span',
      { key: i, className: 'multi-line' },
      d
    );
  });
};

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (nodeList) {
  var length = nodeList.length;
  if (nodeList.hasOwnProperty) {
    return Array.prototype.slice.call(nodeList);
  }
  return new Array(length).fill().map(function (index) {
    return nodeList[index];
  });
};

},{}]},{},[9])(9)
});