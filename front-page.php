<?php get_header(); ?>

	<h1><?php echo get_bloginfo( 'name' ); ?></h1>
	<p class="description"><?php echo get_bloginfo( 'description' ); ?></p>

<?php if ( have_posts() ): ?>
	<div class="books">

		<?php while ( have_posts() ):
			the_post();
			global $wp_query;

			// Open the book block on even numbers
			if ( $wp_query->current_post % 2 === 0 ) {
				echo '<div class="book-block">';
			}
			?>


			<div class="book-block-inner">
				<a href="<?php the_permalink(); ?>" class="book">
					<?php
					if ( has_post_thumbnail() ) {
						the_post_thumbnail( 'book-cover' );
					} else {
						echo '<img src="' . get_template_directory_uri() . '/images/missing-book-cover.png" alt="missing cover image">';
					}
					?>
				</a>

				<div class="book-info">
					<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
					Last updated:
					<time><?php echo human_time_diff( get_the_modified_time( 'U' ) ); ?> ago</time>
				</div>
			</div>


			<?php
			// close book block on odd numbers or if we're out of posts (array index zero)
			if ( $wp_query->current_post % 2 === 1 || $wp_query->current_post === $wp_query->post_count-1 ) {
				echo '</div><!-- end book block -->';
			}
			?>

		<?php endwhile; ?>
	</div>
<?php endif; ?>

<?php get_footer(); ?>