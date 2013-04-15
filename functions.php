<?php
require_once( get_template_directory() . '/dummy/dummy.php' );

/**
 * Runs appropriate WordPress functions immediately after the theme has been loaded
 */
function fixie_setup() {
	add_image_size( 'book-cover', 200, 300, true );
	add_theme_support( 'post-thumbnails' );
	add_post_type_support( 'page', 'excerpt' );
}

add_action( 'after_setup_theme', 'fixie_setup' );

/**
 * Enqueue Fixie's scripts and styles
 * @uses wp_enqueue_style
 * @uses wp_enqueue_script
 */
function fixie_scripts() {
	wp_enqueue_style( 'google-fonts', 'http://fonts.googleapis.com/css?family=Inder|ABeeZee:400,400italic', array() );
	wp_enqueue_style( 'fixie', get_template_directory_uri() . '/css/build/fixie.css', array(), time() );
	wp_enqueue_script( 'fixie', get_template_directory_uri() . '/js/build/fixie.js', array(), time(), true );
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
function fixie_touch_parents() {

}

/**
 * List post revisions
 *
 * @param $post_id integer of post to list revisions for
 *
 * @uses fixie_get_revisions()
 * @return string ordered list of post revisions
 */
function fixie_list_revisions( $post_id = null ) {

	$revisions = fixie_get_revisions( $post_id );

	if ( $revisions->have_posts() ) {
		echo '<ol class="fixie-revision-list">';
		while ( $revisions->have_posts() ) {
			$revisions->the_post();
			echo '<li class="fixie-revision" id="fixie-revision-' . get_the_ID() . '">' . human_time_diff( get_the_time('U')) . ' ago</li>';
		}
		echo '</ol>';
	}

	wp_reset_postdata();
}

/**
 * Get a WP_Query of post revisions for a particular post ID
 * @uses global $post if $post_id is null
 *
 * @param $post_id integer of post to get revisions for
 *
 * @return WP_Query|bool of post revisions id => title -- or false on failure
 */
function fixie_get_revisions( $post_id = null ) {
	if ( empty( $post_id ) ) {
		global $post;
		$post_id = $post->ID;
	}

	// Number of revisions to find. If WP_POST_REVISIONS is a number, use that. Otherwise default to 50
	$revision_count = defined( 'WP_POST_REVISIONS' ) && is_int( WP_POST_REVISIONS ) ? WP_POST_REVISIONS : 50;

	$revisions = new WP_Query( array(
		'post_parent'    => $post_id,
		'post_type'      => 'revision',
		'posts_per_page' => $revision_count,
		'post_status' => 'any',
		'no_found_rows' => true,
		'update_post_term_cache' => false,
		'update_post_meta_cache' => false
	) );

	if ( empty( $revisions ) || is_wp_error( $revisions ) )
		return false;

	return $revisions;

}

/**
 * A fixie version of the excerpt.
 * We only want to display content if someone actually hand crafted the excerpt.
 * @uses global $post
 */
function fixie_the_excerpt() {
	global $post;

	if ( empty( $post->post_excerpt ) )
		return;

	the_excerpt();
}