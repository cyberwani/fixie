/*! responsive-nav.js v1.0.14
 * https://github.com/viljamis/responsive-nav.js
 * http://responsive-nav.com
 *
 * Copyright (c) 2013 @viljamis
 * Available under the MIT license
 */

/* jshint strict:false, forin:false, noarg:true, noempty:true, eqeqeq:true,
 boss:true, bitwise:true, browser:true, devel:true, indent:2 */
/* exported responsiveNav */

var responsiveNav = (function (window, document) {

	var computed = !!window.getComputedStyle;

	// getComputedStyle polyfill
	if (!window.getComputedStyle) {
		window.getComputedStyle = function (el) {
			this.el = el;
			this.getPropertyValue = function (prop) {
				var re = /(\-([a-z]){1})/g;
				if (prop === "float") {
					prop = "styleFloat";
				}
				if (re.test(prop)) {
					prop = prop.replace(re, function () {
						return arguments[2].toUpperCase();
					});
				}
				return el.currentStyle[prop] ? el.currentStyle[prop] : null;
			};
			return this;
		};
	}

	var nav,
			opts,
			navToggle,
			docEl = document.documentElement,
			head = document.getElementsByTagName("head")[0],
			styleElement = document.createElement("style"),
			navOpen = false,

	// fn arg can be an object or a function, thanks to handleEvent
	// read more at: http://www.thecssninja.com/javascript/handleevent
			addEvent = function (el, evt, fn, bubble) {
				if ("addEventListener" in el) {
					// BBOS6 doesn't support handleEvent, catch and polyfill
					try {
						el.addEventListener(evt, fn, bubble);
					} catch (e) {
						if (typeof fn === "object" && fn.handleEvent) {
							el.addEventListener(evt, function (e) {
								// Bind fn as this and set first arg as event object
								fn.handleEvent.call(fn, e);
							}, bubble);
						} else {
							throw e;
						}
					}
				} else if ("attachEvent" in el) {
					// check if the callback is an object and contains handleEvent
					if (typeof fn === "object" && fn.handleEvent) {
						el.attachEvent("on" + evt, function () {
							// Bind fn as this
							fn.handleEvent.call(fn);
						});
					} else {
						el.attachEvent("on" + evt, fn);
					}
				}
			},

			removeEvent = function (el, evt, fn, bubble) {
				if ("removeEventListener" in el) {
					try {
						el.removeEventListener(evt, fn, bubble);
					} catch (e) {
						if (typeof fn === "object" && fn.handleEvent) {
							el.removeEventListener(evt, function (e) {
								fn.handleEvent.call(fn, e);
							}, bubble);
						} else {
							throw e;
						}
					}
				} else if ("detachEvent" in el) {
					if (typeof fn === "object" && fn.handleEvent) {
						el.detachEvent("on" + evt, function () {
							fn.handleEvent.call(fn);
						});
					} else {
						el.detachEvent("on" + evt, fn);
					}
				}
			},

			getFirstChild = function (e) {
				var firstChild = e.firstChild;
				// skip TextNodes
				while (firstChild !== null && firstChild.nodeType !== 1) {
					firstChild = firstChild.nextSibling;
				}
				return firstChild;
			},

			setAttributes = function (el, attrs) {
				for (var key in attrs) {
					el.setAttribute(key, attrs[key]);
				}
			},

			addClass = function (el, cls) {
				el.className += " " + cls;
				el.className = el.className.replace(/(^\s*)|(\s*$)/g, "");
			},

			removeClass = function (el, cls) {
				var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
				el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g, "");
			},

			ResponsiveNav = function (el, options) {
				var i;

				// Default options
				this.options = {
					animate     : true,        // Boolean: Use CSS3 transitions, true or false
					transition  : 400,      // Integer: Speed of the transition, in milliseconds
					label       : "Menu",        // String: Label for the navigation toggle
					insert      : "after",      // String: Insert the toggle before or after the navigation
					customToggle: "",     // Selector: Specify the ID of a custom toggle
					openPos     : "relative",  // String: Position of the opened nav, relative or static
					jsClass     : "js",        // String: 'JS enabled' class which is added to <html> el
					init        : function () {
					},   // Function: Init callback
					open        : function () {
					},   // Function: Open callback
					close       : function () {
					}   // Function: Close callback
				};

				// User defined options
				for (i in options) {
					this.options[i] = options[i];
				}

				// Adds "js" class for <html>
				addClass(docEl, this.options.jsClass);

				// Wrapper
				this.wrapperEl = el.replace("#", "");
				if (document.getElementById(this.wrapperEl)) {
					this.wrapper = document.getElementById(this.wrapperEl);
				} else {
					// If el doesn't exists, stop here.
					throw new Error("The nav element you are trying to select doesn't exist");
				}

				// Inner wrapper
				this.wrapper.inner = getFirstChild(this.wrapper);

				// For minification
				opts = this.options;
				nav = this.wrapper;

				// Init
				this._init(this);
			};

	ResponsiveNav.prototype = {
		// Public methods
		destroy: function () {
			this._removeStyles();
			removeClass(nav, "closed");
			removeClass(nav, "opened");
			nav.removeAttribute("style");
			nav.removeAttribute("aria-hidden");
			nav = null;
			_instance = null;

			removeEvent(window, "load", this, false);
			removeEvent(window, "resize", this, false);
			removeEvent(navToggle, "mousedown", this, false);
			removeEvent(navToggle, "touchstart", this, false);
			removeEvent(navToggle, "touchend", this, false);
			removeEvent(navToggle, "keyup", this, false);
			removeEvent(navToggle, "click", this, false);

			if (!opts.customToggle) {
				navToggle.parentNode.removeChild(navToggle);
			} else {
				navToggle.removeAttribute("aria-hidden");
			}
		},

		toggle: function () {
			if (!navOpen) {
				removeClass(nav, "closed");
				addClass(nav, "opened");
				nav.style.position = opts.openPos;
				setAttributes(nav, {"aria-hidden": "false"});

				navOpen = true;
				opts.open();
			} else {
				removeClass(nav, "opened");
				addClass(nav, "closed");
				setAttributes(nav, {"aria-hidden": "true"});

				if (opts.animate) {
					setTimeout(function () {
						nav.style.position = "absolute";
					}, opts.transition + 10);
				} else {
					nav.style.position = "absolute";
				}

				navOpen = false;
				opts.close();
			}
		},

		handleEvent: function (e) {
			var evt = e || window.event;

			switch (evt.type) {
				case "mousedown":
					this._onmousedown(evt);
					break;
				case "touchstart":
					this._ontouchstart(evt);
					break;
				case "touchend":
					this._ontouchend(evt);
					break;
				case "keyup":
					this._onkeyup(evt);
					break;
				case "click":
					this._onclick(evt);
					break;
				case "load":
					this._transitions(evt);
					this._resize(evt);
					break;
				case "resize":
					this._resize(evt);
					break;
			}
		},

		// Private methods
		_init      : function () {
			addClass(nav, "closed");
			this._createToggle();

			addEvent(window, "load", this, false);
			addEvent(window, "resize", this, false);
			addEvent(navToggle, "mousedown", this, false);
			addEvent(navToggle, "touchstart", this, false);
			addEvent(navToggle, "touchend", this, false);
			addEvent(navToggle, "keyup", this, false);
			addEvent(navToggle, "click", this, false);
		},

		_createStyles: function () {
			if (!styleElement.parentNode) {
				head.appendChild(styleElement);
			}
		},

		_removeStyles: function () {
			if (styleElement.parentNode) {
				styleElement.parentNode.removeChild(styleElement);
			}
		},

		_createToggle: function () {
			if (!opts.customToggle) {
				var toggle = document.createElement("a");
				toggle.innerHTML = opts.label;
				setAttributes(toggle, {
					"href": "#",
					"id"  : "nav-toggle"
				});

				if (opts.insert === "after") {
					nav.parentNode.insertBefore(toggle, nav.nextSibling);
				} else {
					nav.parentNode.insertBefore(toggle, nav);
				}

				navToggle = document.getElementById("nav-toggle");
			} else {
				var toggleEl = opts.customToggle.replace("#", "");

				if (document.getElementById(toggleEl)) {
					navToggle = document.getElementById(toggleEl);
				} else {
					throw new Error("The custom nav toggle you are trying to select doesn't exist");
				}
			}
		},

		_preventDefault: function (e) {
			if (e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			} else {
				e.returnValue = false;
			}
		},

		_onmousedown: function (e) {
			var evt = e || window.event;
			// If the user isn't right clicking:
			if (!(evt.which === 3 || evt.button === 2)) {
				this._preventDefault(e);
				this.toggle(e);
			}
		},

		_ontouchstart: function (e) {
			// Touchstart event fires before
			// the mousedown and can wipe it
			navToggle.onmousedown = null;
			this._preventDefault(e);
			this.toggle(e);
		},

		_ontouchend: function () {
			// Prevents ghost click from happening on some Android browsers
			var that = this;
			nav.addEventListener("click", that._preventDefault, true);
			setTimeout(function () {
				nav.removeEventListener("click", that._preventDefault, true);
			}, opts.transition);
		},

		_onkeyup: function (e) {
			var evt = e || window.event;
			if (evt.keyCode === 13) {
				this.toggle(e);
			}
		},

		_onclick: function (e) {
			// For older browsers (looking at IE)
			this._preventDefault(e);
		},

		_transitions: function () {
			if (opts.animate) {
				var objStyle = nav.style,
						transition = "max-height " + opts.transition + "ms";

				objStyle.WebkitTransition = transition;
				objStyle.MozTransition = transition;
				objStyle.OTransition = transition;
				objStyle.transition = transition;
			}
		},

		_calcHeight: function () {
			var savedHeight = nav.inner.offsetHeight,
					innerStyles = "#" + this.wrapperEl + ".opened{max-height:" + savedHeight + "px}";

			// Hide from old IE
			if (computed) {
				styleElement.innerHTML = innerStyles;
				innerStyles = "";
			}
		},

		_resize: function () {
			if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {
				setAttributes(navToggle, {"aria-hidden": "false"});

				// If the navigation is hidden
				if (nav.className.match(/(^|\s)closed(\s|$)/)) {
					setAttributes(nav, {"aria-hidden": "true"});
					nav.style.position = "absolute";
				}

				this._createStyles();
				this._calcHeight();
			} else {
				setAttributes(navToggle, {"aria-hidden": "true"});
				setAttributes(nav, {"aria-hidden": "false"});
				nav.style.position = opts.openPos;
				this._removeStyles();
			}

			// Init callback
			opts.init();
		}

	};

	var _instance;

	function rn(el, options) {
		if (!_instance) {
			_instance = new ResponsiveNav(el, options);
		}
		return _instance;
	}

	return rn;
})(window, document);

(function ($) {
	$.belowthefold = function (element, settings) {
		var fold = $(window).height() + $(window).scrollTop();
		return fold <= $(element).offset().top - settings.threshold;
	};
	$.abovethetop = function (element, settings) {
		var top = $(window).scrollTop();
		return top >= $(element).offset().top + $(element).height() - settings.threshold;
	};
	$.rightofscreen = function (element, settings) {
		var fold = $(window).width() + $(window).scrollLeft();
		return fold <= $(element).offset().left - settings.threshold;
	};
	$.leftofscreen = function (element, settings) {
		var left = $(window).scrollLeft();
		return left >= $(element).offset().left + $(element).width() - settings.threshold;
	};
	$.inviewport = function (element, settings) {
		return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
	};
	$.extend($.expr[':'], {
		"below-the-fold" : function (a, i, m) {
			return $.belowthefold(a, {
				threshold: 0
			});
		},
		"above-the-top"  : function (a, i, m) {
			return $.abovethetop(a, {
				threshold: 0
			});
		},
		"left-of-screen" : function (a, i, m) {
			return $.leftofscreen(a, {
				threshold: 0
			});
		},
		"right-of-screen": function (a, i, m) {
			return $.rightofscreen(a, {
				threshold: 0
			});
		},
		"in-viewport"    : function (a, i, m) {
			return $.inviewport(a, {
				threshold: 0
			});
		}
	});
})(jQuery);

/**
 * When a revision select menu changes, grab the post_id (value) and inject it into a dom element data-inject-into
 */
(function (jQuery, window, undefined) {
	'use strict';

	/**
	 * Bind the event handler to an option menu
	 */
	function bindEvents() {
		jQuery(document.querySelectorAll('.fixie-revision-list')).on('change', ajaxRequest);
	}

	/**
	 * Perform the ajax request
	 * @param e event
	 */
	function ajaxRequest(e) {
		var el = e.target,
				pageId = el.value,
				injectInto = document.getElementById(e.target.attributes[1].nodeValue);

		jQuery.get(fixie.ajaxurl, {
			'action': 'get-revision',
			'pageid': pageId
		}, function (data, textStatus, jqXHR) {

			if (textStatus != 'success')
				return false;

			inject(injectInto, data); // @todo now run the handleImages() function in collapsing-images.js. Will require a public API.
			return true;

		}, 'html');

	}

	/**
	 * Inject content into a particular dom element
	 * @param el
	 * @param content
	 */
	var inject = function (el, content) {

		// scroll up the old content (will actually scroll if there's a css transition in place
		el.style.height = 0;

		// replace the html
		el.innerHTML = content;

		// show the new content
		el.style.height = '';
	};


	bindEvents();
})(jQuery, window);
/**
 * Go through all the H1 tags. Find the ones that have id attributes and inject into the main navigation.
 * @todo: automatically link H2, H3, and H4 headings as sub-menu items to their parent H1.
 */
(function (window, undefined) {
	'use strict';

	var headings = document.querySelectorAll('h1[id]');
	var menu = document.querySelector('#nav ul');


	jQuery(headings).each(function (i, v) {
		var id = headings[i].getAttribute("id"),
				title = headings[i].getAttribute("title") || headings[i].innerHTML,
				li = document.createElement("li"),
				a = document.createElement("a");

		a.setAttribute("href", "#" + id);
		a.innerHTML = title;
		li.appendChild(a);
		menu.appendChild(li);
	});

	// see /js/lib/responsive-nav.js for details
	var navigation = responsiveNav("#nav", {
		label: "Pages"
	});
}(window));
/**
 * Make images not take up a whole mess of vertical space. Give them a full screen option.
 */

(function (window, undefined) {
	"use strict";

	var cutoffHeight = 300, // pixels
			collapseHeight = 200; // pixels

	/**
	 * Initalize some handlers
	 */
	function init() {
		var contentCols = document.querySelectorAll('.content-col'),
				i,
				len;

		window.addEventListener('load', function () {

			for (i = 0, len = contentCols.length; i < len; i++) {
				contentCols[i].addEventListener('click', contentColClicks);
				handleImages(contentCols[i]);
			}

		});

	}

	/**
	 * Callback for any clicks in .content-col
	 * @param e event
	 */
	var contentColClicks = function (e) {
		var parent = getParentbyClass(e.target, 'image-container');

		// Exit if this isn't an image container
		if (!parent) {
			return true;
		}

		// Exit if we're clicking on an anchor, or if the parent is an anchor
		if (e.target.nodeName === 'A' || e.target.parentNode.nodeName === 'A') {
			return true;
		}

		// At this point, we can prevent the default and take some action

		e.preventDefault();

		if (parent.classList.contains('collapsed')) {
			expand(parent);
		} else {
			collapse(parent);
		}

		return false;
	};

	/**
	 * Collapse wrapper
	 * @param wrapperEl Node
	 */
	var collapse = function (wrapperEl) {
		wrapperEl.classList.add('collapsed');
		wrapperEl.style.height = collapseHeight + 'px';
		wrapperEl.querySelector('.toggletext').innerHTML = 'Click to Expand';
	};

	/**
	 * Expand the wrapper
	 * @param wrapperEl Node
	 */
	var expand = function (wrapperEl) {
		wrapperEl.classList.remove('collapsed');

		// Set the wrapper height to the height of the image it contains. Needs to be explicit for CSS transitions to work as epected.
		wrapperEl.style.height = wrapperEl.querySelector('img').height + 'px';
		wrapperEl.querySelector('.toggletext').innerHTML = 'Click to Collapse';
	};

	/**
	 * Wrap image with some HTML to allow it to be shrunk
	 * @param el Node
	 */
	var wrapImage = function (el) {

		// Less than the cutoff, don't bother.

		if (el.height < cutoffHeight) {
			return;
		}

		// If the image is inside an anchor, we wrap that instead.
		if (el.parentNode.nodeName === 'A') {
			el = el.parentNode;
		}

		var wrapper = document.createElement('div'),
				toggletext = document.createElement('small'),
				wrapperEl,
				parent,
				caption;

		wrapper.className = 'image-container';
		toggletext.className = 'toggletext';
		toggletext.innerHTML = 'Click to Expand';

		parent = getParentbyClass(el, 'wp-caption');

		if (parent) {
			parent.classList.add('image-container');
			parent.querySelector('.wp-caption-text').appendChild(toggletext);
			wrapperEl = parent;
		} else {
			caption = document.createElement('p');
			caption.className = 'wp-caption-text';
			caption.appendChild(toggletext);
			wrapper.appendChild(el.cloneNode(true));
			wrapper.appendChild(caption);
			el.parentNode.replaceChild(wrapper, el);
			wrapperEl = wrapper;
		}

		collapse(wrapperEl);

	};


	/**
	 * Recursively check the parent for the classname until we get to html.
	 * @param el Node
	 * @param classname string
	 * @return bool|Node
	 */
	var getParentbyClass = function (el, classname) {

		// Keep trying to find an element with this class until we bottom out.
		while (el.parentNode && el.nodeType !== 9) {

			// if it's an element check.
			if (el.nodeType === 1) {
				if (el.classList.contains(classname)) {
					return el;
				}
			}
			// set the el to the parent, and keep on going.
			el = el.parentNode;
		}

		// Nothing matched inside the while loop, so we're done.
		return false;
	};

	/**
	 * Loop through every image and determine if it should be collapsed or not.
	 * @param limit node
	 */
	var handleImages = function (limit) {
		var images;

		if (!limit) {
			limit = document;
		}

		images = limit.querySelectorAll('img');

		for (var i = 0, len = images.length; i < len; i++) {

			var img = images[i]; // this image

			wrapImage(img);
		}

	};

	init();
})(window);

/**
 * As the page is scrolled, update the navigation accordingly
 */
(function (jQuery, window, undefined) {
	'use strict';

	// Bind a scroll handler... with throttling
	jQuery(window).scroll(throttle(checkForActiveLinks, 50));
	jQuery(window).load(checkForActiveLinks);

	function checkForActiveLinks() {
		var heading = jQuery('h1[id]:in-viewport').first(),
				id = heading.attr('id'),
				correspondingLink = jQuery(document.querySelector('.nav-bar a[href="#' + id + '"]'));

		// if there's a corresponding link for the header in view, apply the class active.
		if (correspondingLink.length > 0) {
			jQuery(document.querySelectorAll('.active')).removeClass('active');
			correspondingLink.addClass('active');
		}
	}


})(jQuery, window);

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time.
function throttle(fn, delay) {

	var timer = null;

	return function () {
		var context = this,
				args = arguments;

		clearTimeout(timer);

		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
};