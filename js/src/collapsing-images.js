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
		if ( ! parent ) {
			return true;
		}

		// Exit if we're clicking on an anchor, or if the parent is an anchor
		if (e.target.nodeName === 'A' || e.target.parentNode.nodeName === 'A' ) {
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