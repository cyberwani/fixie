/**
 * When a revision select menu changes, grab the post_id (value) and inject it into a dom element data-inject-into
 */
(function (window, undefined) {
	'use strict';

	/**
	 * Bind the event handler to an option menu
	 */
	function bindEvents() {
		var selectBoxes = document.querySelectorAll('.fixie-revision-list');

		for (var i = 0, len = selectBoxes.length; i < len; i++) {
			selectBoxes[i].addEventListener( "change", ajaxRequest, false );
		}
	}

	/**
	 * Perform the ajax request
	 * @param e event
	 */
	function ajaxRequest(e) {

		var xhr = new XMLHttpRequest(),
				el = e.target,
				pageId = el.value,
				url = fixie.ajaxurl + '?action=get-revision' + '&pageid=' + pageId;

		xhr.onreadystatechange = function () {
			if (xhr.readyState < 4) {
				return;
			}

			if (xhr.status !== 200) {
				return;
			}

			if (xhr.readyState === 4) {
				var injectIntoId = e.target.attributes[1].nodeValue; // super weak specifying the ID.

				if ( injectIntoId === null ) {
					return;
				}

				//var injectInto = document.getElementById(e.target.attribute('data-inject-into') );
				var injectInto = document.getElementById( injectIntoId );
				inject(injectInto, xhr.responseText);
			}

		};


		xhr.open('GET', url, true);
		xhr.send(null);

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
})(this);