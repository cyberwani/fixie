<?php get_header();

	if ( have_posts() ):
		while( have_posts() ):
			the_post();
			?>
			<div class="page">
			<h1><?php the_title(); ?></h1>
			</div>
		<?php
		endwhile;
	else:
		echo '<p>Very sorry, there was no documentation found here.</p>';
	endif;
?>

<?php get_footer(); ?>