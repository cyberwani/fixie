<!doctype HTML>
<html>
<head <?php language_attributes(); ?>>
	<title><?php wp_title(); ?></title>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width" />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<?php
if ( is_page() ){
// Set up in-page navigation container. This will be populated with javascript
?>
<nav role="nav" id="nav">
	<div class="nav-bar">
		<?php
		global $post;
		if ( has_post_thumbnail( $post->ID ) ) echo get_the_post_thumbnail( $post->ID, 'thumbnail' );
		?>
		<ul>
		</ul>
	</div>
</nav>
<?php
}
?>