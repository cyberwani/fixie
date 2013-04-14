<?php
require_once( get_template_directory() . '/dummy/dummy.php' );

/**
 * Runs appropriate WordPress functions immediately after the theme has been loaded
 */
function fixie_setup() {
	add_image_size( 'book-cover', 200, 300, true );
	add_theme_support( 'post-thumbnails' );
}

add_action( 'after_setup_theme', 'fixie_setup' );

/**
 * Enqueue Fixie's scripts and styles
 * @uses wp_enqueue_style
 * @uses wp_enqueue_script
 */
function fixie_scripts() {
	wp_enqueue_style( 'fixie-main', get_template_directory_uri() . '/css/build/fixie.css', array(), time() );
}

add_action( 'wp_enqueue_scripts', 'fixie_scripts' );

/**
 * Modify the front-page query to show us pages. This is a documentation theme and it's rather presumptuous about it.
 *
 * @param $query WP_Query
 */
function fixie_modify_front_page_query( $query ) {
	if ( ! $query->is_main_query() || ! is_home() )
		return;

	$query->set( 'post_type', 'page' );
}

add_action( 'pre_get_posts', 'fixie_modify_front_page_query' );

if ( ! function_exists( 'widont' ) ) {
	/**
	 * Don't let trailing words be widowed, stick an nbsp between the last space
	 * This function is popular (for instance, included on Wordpress.com), hence the function_exists wrap
	 * I don't intend for it to be 'pluggable' like you would override this.
	 * @link http://shauninman.com/archive/2006/08/22/widont_wordpress_plugin
	 *
	 * @param string $str
	 *
	 * @return string
	 */
	function widont( $str = '' ) {
		$str   = rtrim( $str );
		$space = strrpos( $str, ' ' );
		if ( $space !== false ) {
			$str = substr( $str, 0, $space ) . '&nbsp;' . substr( $str, $space + 1 );
		}
		return $str;
	}
}

add_filter( 'the_title', 'widont' );


/**
 * Touch the root parent page's 'last updated time' whenever a child or grand child is updated.
 * This ensures that on the index and the document single page we can reliably say when it was last updated.
 */