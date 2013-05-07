/**
 * When a revision select menu changes, grab the post_id (value) and inject it into a dom element data-inject-into
 */
(function (jQuery, window, undefined) {
	'use strict';

	/**
	 * Bind the event handler to an option menu
	 */
	function bindEvents() {
		jQuery(document.querySelectorAll('.fixie-revision-list')).on( 'change', ajaxRequest );
	}

	/**
	 * Perform the ajax request
	 * @param e event
	 */
	function ajaxRequest(e) {
		var el = e.target,
		pageId = el.value,
		injectInto = document.getElementById(e.target.attributes[1].nodeValue);

		jQuery.get( fixie.ajaxurl, {
			'action' : 'get-revision',
			'pageid' : pageId
		}, function( data, textStatus, jqXHR ){

			if ( textStatus != 'success' )
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