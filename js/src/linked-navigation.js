/**
 * As the page is scrolled, update the navigation accordingly
 */
(function (jQuery, window, undefined) {
	'use strict';

	// Bind a scroll handler... with throttling
	jQuery(window).scroll( throttle( checkForActiveLinks, 50) );
	jQuery(window).load( checkForActiveLinks );

	function checkForActiveLinks(){
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
