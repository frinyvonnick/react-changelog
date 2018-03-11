'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var propTypes = require('prop-types');
var ReactModal = _interopDefault(require('react-modal'));
var Markdown = _interopDefault(require('react-markdown'));
var fm = _interopDefault(require('front-matter'));
var lodash = require('lodash');
var cmp = _interopDefault(require('semver-compare'));

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }

      function _next(value) {
        step("next", value);
      }

      function _throw(err) {
        step("throw", err);
      }

      _next();
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _sliceIterator(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _slicedToArray(arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (Symbol.iterator in Object(arr)) {
    return _sliceIterator(arr, i);
  } else {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
}

var src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAsklEQVR4Ae2WsQrEIBAFH/iRUfN1yUnIRwoeuXKbc1CbsGM/g1ssK8dxXkxQ0aZedp0KTH+rqXYmdlU1XSRR1H6vKnbqn/dRN1HVJv7q7X95AutBIgE9INkE1/ME14NEBnpAtgmk5wmo54n5ejN1oOcJql8fWD8irq9mR03Xb4okwfUPKMH1NpGm6cGmHdXzBNfbRB7Sg007oJ+aOPv0JnGQw+vCh1dRWHk6HgpyHOe1fAE3Nwx9TaPILQAAAABJRU5ErkJggg==";

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "* {\n  box-sizing: border-box;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  line-height: 1.58em;\n}\n\n.modal {\n  position: absolute;\n  top: 40px;\n  left: 40px;\n  right: 40px;\n  bottom: 40px;\n  background-color: #fff;\n}\n\n.overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(0, 0, 0, .7);\n}\n\n.header {\n  padding: 0 20px;\n  height: 50px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-bottom: 1px solid #ddd;\n}\n\n.header span {\n  font-size: 18px;\n}\n\n.header img {\n  max-height: 30px;\n}\n\n.header button {\n  border: 0;\n  padding: 0;\n  background-color: transparent;\n  display: flex;\n  align-items: center;\n}\n\n.header button:hover {\n  cursor: pointer;\n}\n\n.header button span {\n  margin-right: 5px;\n}\n\n.content {\n  padding: 0 20px;\n  max-height: calc(100% - 50px);\n  overflow-y: auto;\n  overflow-x: hidden;\n  text-align: justify;\n}\n\n.content img {\n  max-width: 100%;\n}\n\n.content p img {\n  display: block;\n  margin: auto;\n}\n\n.content p img ~ em {\n  display: block;\n  text-align: center;\n  margin-top: 5px;\n}\n\n.content h1,\n.content h2,\n.content h3,\n.content h4,\n.content h5,\n.content h6 {\n  margin-bottom: 0;\n}\n\n\n.content h1 + p,\n.content h2 + p,\n.content h3 + p,\n.content h4 + p,\n.content h5 + p,\n.content h6 + P {\n  margin-top: 5px;\n}\n\n.content hr {\n  height: 1px;\n  margin: 0 0 10px;\n  background-color: #ddd;\n  border: 0;\n}\n";
styleInject(css);

var ChangeLogModal =
/*#__PURE__*/
function (_Component) {
  _inherits(ChangeLogModal, _Component);

  function ChangeLogModal() {
    var _ref;

    var _temp, _this;

    _classCallCheck(this, ChangeLogModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = ChangeLogModal.__proto__ || Object.getPrototypeOf(ChangeLogModal)).call.apply(_ref, [this].concat(args))), Object.defineProperty(_assertThisInitialized(_this), "state", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        changelog: undefined,
        open: false
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "fetchChangelog", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function () {
        var _value = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var res, changelog;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return fetch(_this.props.url);

                case 2:
                  res = _context.sent;
                  _context.next = 5;
                  return res.text();

                case 5:
                  changelog = _context.sent;

                  _this.setState({
                    changelog: changelog
                  });

                case 7:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function value() {
          return _value.apply(this, arguments);
        };
      }()
    }), Object.defineProperty(_assertThisInitialized(_this), "formatMarkdown", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(rawMarkdown) {
        var delimiter = '---';
        if (!rawMarkdown || !rawMarkdown.includes(delimiter)) return rawMarkdown;
        var parts = lodash.chunk(rawMarkdown.split(delimiter).splice(1), 2).map(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              metadata = _ref3[0],
              body = _ref3[1];

          return "".concat(delimiter).concat(metadata).concat(delimiter).concat(body);
        });
        var fmFeatures = parts.map(fm);
        var versions = lodash.groupBy(fmFeatures.filter(function (f) {
          if (!_this.props.version) return true;
          if (cmp(f.attributes.version, _this.props.version) > 0) return true;
          return false;
        }).sort(function (a, b) {
          return cmp(a.attributes.version, b.attributes.version);
        }), function (f) {
          return f.attributes.version;
        });
        return lodash.map(versions, function (v, key) {
          return "\n### Version ".concat(key, "\n<hr>\n\n").concat(v.map(function (v) {
            return v.body;
          }).join(''), "\n");
        }).join('');
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "openModal", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        return _this.setState({
          open: true
        });
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "closeModal", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        return _this.setState({
          open: false
        });
      }
    }), _temp));
  }

  _createClass(ChangeLogModal, [{
    key: "componentWillMount",
    value: function () {
      var _componentWillMount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.props.url) {
                  this.fetchChangelog();
                }

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function componentWillMount() {
        return _componentWillMount.apply(this, arguments);
      };
    }()
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.url !== nextProps.url) {
        this.fetchChangelog();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.openModal();
      ReactModal.setAppElement(this.props.appElement);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          title = _props.title,
          changelog = _props.changelog;
      return React__default.createElement(ReactModal, {
        isOpen: this.state.open,
        onRequestClose: this.closeModal,
        className: "modal",
        overlayClassName: "overlay"
      }, React__default.createElement("div", {
        className: "header"
      }, React__default.createElement("span", null, title), React__default.createElement("button", {
        onClick: this.closeModal
      }, React__default.createElement("span", null, "Close"), React__default.createElement("img", {
        src: src
      }))), React__default.createElement("div", {
        className: "content"
      }, React__default.createElement(Markdown, {
        source: this.formatMarkdown(changelog || this.state.changelog),
        escapeHtml: false
      })));
    }
  }]);

  return ChangeLogModal;
}(React.Component);
Object.defineProperty(ChangeLogModal, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    appElement: propTypes.string.isRequired,
    version: propTypes.string,
    title: propTypes.string,
    changelog: propTypes.string
  }
});
Object.defineProperty(ChangeLogModal, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    title: 'New things',
    changelog: undefined
  }
});

exports.ChangeLogModal = ChangeLogModal;
