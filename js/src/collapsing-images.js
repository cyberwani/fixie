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
				len,
				c,
				imgListLen,
				imgList;

		for (i = 0, len = contentCols.length; i < len; i++) {
			contentCols[i].addEventListener('click', contentColClicks);
			handleImages(contentCols[i]);

			imgList = contentCols[i].querySelectorAll('img');
			for ( c = 0, imgListLen = imgList.length; c < imgListLen; c++ ) {
				if ( imgList[i] !== undefined ) {
					imgList[i].addEventListener('onload', 'processImage');
				}
			}
		}
	}

	/**
	 * Callback for any clicks in .content-col
	 * @param e event
	 */
	var contentColClicks = function (e) {
		var parent;

		// Exit if we aren't clicking on a toggle.
		if (!e.target.classList.contains('toggletext')) {
			return true;
		}

		e.preventDefault();
		parent = getParentbyClass(e.target, 'image-container');

		if (parent.classList.contains('collapsed')) {

			expand(parent);
		} else {
			collapse(parent);
		}

	};

	/**
	 * Callback for when images load
	 * @param e event
	 */
	var processImage = function (e) {
		window.console.log (e);
	};

	/**
	 * Collapse wrapper
	 * @param wrapperEl Node
	 */
	var collapse = function (wrapperEl) {
		wrapperEl.classList.add('collapsed');
		wrapperEl.style.height = collapseHeight + 'px';
	};

	/**
	 * Expand the wrapper
	 * @param wrapperEl Node
	 */
	var expand = function (wrapperEl) {
		wrapperEl.classList.remove('collapsed');
		wrapperEl.style.height = '';
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
			toggletext.innerHTML = '<br>' + toggletext.innerHTML;
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