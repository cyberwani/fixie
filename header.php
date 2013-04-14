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
		echo '<nav role="nav" class="main-nav"><ul></ul></nav>';
	}
?>