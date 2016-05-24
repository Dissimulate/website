/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _path = __webpack_require__(2);

	var _path2 = _interopRequireDefault(_path);

	var _cms = __webpack_require__(3);

	var _cms2 = _interopRequireDefault(_cms);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = (0, _express2.default)();
	var port = 8080;

	app.use('/', _express2.default.static(__dirname));

	var cms = new _cms2.default(app);

	cms.start([{
	  name: 'blog',
	  fields: [{ type: 'text', name: 'title' }, { type: 'textarea', name: 'body' }]
	}, {
	  name: 'test',
	  fields: [{ type: 'text', name: 'title' }, { type: 'textarea', name: 'body' }]
	}]);

	app.get('*', function (req, res) {
	  res.sendFile(_path2.default.resolve(__dirname, '../', 'index.html'));
	});

	app.listen(port, function () {
	  console.log('Listening on port ' + port + '...');
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _path = __webpack_require__(2);

	var _path2 = _interopRequireDefault(_path);

	var _lowdb = __webpack_require__(4);

	var _lowdb2 = _interopRequireDefault(_lowdb);

	var _fileAsync = __webpack_require__(5);

	var _fileAsync2 = _interopRequireDefault(_fileAsync);

	var _bodyParser = __webpack_require__(11);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _credential = __webpack_require__(12);

	var _credential2 = _interopRequireDefault(_credential);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var pw = (0, _credential2.default)();
	var jsonParser = _bodyParser2.default.json();

	var authed = {};
	var timeout = 200000;

	var CMS = function () {
	  function CMS(app) {
	    var database = arguments.length <= 1 || arguments[1] === undefined ? 'data.json' : arguments[1];

	    _classCallCheck(this, CMS);

	    this.app = app;
	    this.data = (0, _lowdb2.default)(database, { storage: _fileAsync2.default });
	    this.users = (0, _lowdb2.default)('users.json', { storage: _fileAsync2.default });
	  }

	  _createClass(CMS, [{
	    key: 'start',
	    value: function start(config) {
	      var _this = this;

	      this.config = config;

	      this.app.get('/admin', function (req, res) {
	        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	        if (true) {
	          if (Date.now() >= authed[ip]) {
	            delete authed[ip];
	            return;
	          } else {
	            authed[ip] = Date.now() + timeout;
	          }
	        } else {
	          if (_this.users('account').find({})) {
	            res.sendFile(_path2.default.resolve(__dirname, '../', 'login.html'));
	          } else {
	            res.sendFile(_path2.default.resolve(__dirname, '../', 'signup.html'));
	          }
	          return;
	        }

	        res.sendFile(_path2.default.resolve(__dirname, '../', 'cms.html'));
	      });

	      this.app.get('/admin/*', function (req, res) {
	        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	        if (true) {
	          if (Date.now() >= authed[ip]) {
	            delete authed[ip];
	            return;
	          } else {
	            authed[ip] = Date.now() + timeout;
	          }
	        } else {
	          if (_this.users('account').find({})) {
	            res.sendFile(_path2.default.resolve(__dirname, '../', 'login.html'));
	          } else {
	            res.sendFile(_path2.default.resolve(__dirname, '../', 'signup.html'));
	          }
	          return;
	        }

	        res.sendFile(_path2.default.resolve(__dirname, '../', 'cms.html'));
	      });

	      this.app.post('/get-data/:page', jsonParser, function (req, res) {
	        var post = _this.data(req.params.page).chain().filter(req.body.filter || {}).orderBy(req.body.sort || 'created', [req.body.order || 'desc']).splice(req.body.from || 0, req.body.limit || Infinity).value();

	        res.json(post);
	      });

	      this.app.post('/data/save', jsonParser, function (req, res) {
	        if (!req.body) return res.sendStatus(400);

	        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	        if (authed[ip]) {
	          if (Date.now() >= authed[ip]) {
	            delete authed[ip];
	            return;
	          } else {
	            authed[ip] = Date.now() + timeout;
	          }
	        } else return res.sendStatus(403);

	        if (req.body.update) {
	          _this.data(req.body.name).chain().find({ created: req.body.row.created }).assign(req.body.row).value().then(function () {
	            return res.sendStatus(200);
	          });
	        } else {
	          req.body.row.created = Date.now();
	          req.body.row.published = true;

	          _this.data(req.body.name).push(req.body.row).then(function () {
	            return res.sendStatus(200);
	          });
	        }
	      });

	      this.app.post('/admin-login', jsonParser, function (req, res) {
	        if (!req.body) return res.sendStatus(400);

	        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	        var user = _this.users('account').find({ user: req.body.user }) || {};

	        pw.verify(user.hash, req.body.pass, function (err, isValid) {
	          if (err) throw err;

	          if (isValid) {
	            authed[ip] = Date.now() + timeout;
	            res.sendStatus(200);
	          } else {
	            res.sendStatus(400);
	          }
	        });
	      });

	      this.app.post('/admin-add', jsonParser, function (req, res) {
	        if (!req.body) return res.sendStatus(400);

	        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	        if (authed[ip]) {
	          if (Date.now() >= authed[ip]) {
	            delete authed[ip];
	            return;
	          } else {
	            authed[ip] = Date.now() + timeout;
	          }
	        } else if (_this.users('account').find({})) {
	          return res.sendStatus(403);
	        }

	        pw.hash(req.body.pass, function (err, hash) {
	          if (err) throw err;

	          _this.users('account').push({
	            user: req.body.user,
	            hash: hash
	          });

	          res.sendStatus(200);
	        });
	      });

	      this.app.get('/data-pages', function (req, res) {
	        res.json(_this.config);
	      });
	    }
	  }]);

	  return CMS;
	}();

	exports.default = CMS;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("lowdb");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var steno = __webpack_require__(6);

	var _require = __webpack_require__(7);

	var stringify = _require.stringify;


	module.exports = {
	  read: __webpack_require__(9).read,
	  write: function write(dest, obj) {
	    var serialize = arguments.length <= 2 || arguments[2] === undefined ? stringify : arguments[2];

	    return new Promise(function (resolve, reject) {
	      var data = serialize(obj);

	      steno.writeFile(dest, data, function (err) {
	        if (err) return reject(err);
	        resolve();
	      });
	    });
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("steno");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var jph = __webpack_require__(8);

	module.exports = {
	  parse: jph.parse,
	  stringify: function stringify(obj) {
	    return JSON.stringify(obj, null, 2);
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("json-parse-helpfulerror");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var fs = __webpack_require__(10);

	var _require = __webpack_require__(7);

	var parse = _require.parse;
	var stringify = _require.stringify;


	module.exports = {
	  read: function read(source) {
	    var deserialize = arguments.length <= 1 || arguments[1] === undefined ? parse : arguments[1];

	    if (fs.existsSync(source)) {
	      // Read database
	      var data = fs.readFileSync(source, 'utf-8').trim() || '{}';

	      try {
	        return deserialize(data);
	      } catch (e) {
	        if (e instanceof SyntaxError) {
	          e.message = 'Malformed JSON in file: ' + source + '\n' + e.message;
	        }
	        throw e;
	      }
	    } else {
	      // Initialize empty database
	      fs.writeFileSync(source, '{}');
	      return {};
	    }
	  },
	  write: function write(dest, obj) {
	    var serialize = arguments.length <= 2 || arguments[2] === undefined ? stringify : arguments[2];

	    var data = serialize(obj);
	    fs.writeFileSync(dest, data);
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("graceful-fs");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("credential");

/***/ }
/******/ ]);