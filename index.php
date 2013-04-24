<?php get_header();

if ( have_posts() ):
	while ( have_posts() ):
		the_post();
		?>
		<div class="docs-page">

			<div class="inner-wrap">

				<h1 class="main-title" title="Top" id="top"><?php the_title(); ?></h1>

				<div class="content-col" id="top-content">
					<?php the_content(); ?>
				</div>

				<div class="meta-col">
					<div class="excerpt">
						<?php fixie_the_excerpt(); ?>
					</div>
					<div class="revisions">
						Load a revision of this section:
						<?php fixie_list_revisions( 'top-content' ); ?>
					</div>
				</div>

			</div>
		</div>
		<?php
		// Get a loop with all this page's children. Unfortunately, we don't go to the grandchild level.
		$children = new WP_Query( array(
			'posts_per_page' => - 1,
			'post_type'      => 'page',
			'post_parent'    => get_the_ID()
		) );

		if ( $children->have_posts() ):
			while ( $children->have_posts() ):
				$children->the_post();
				global $post;
				?>
				<div class="docs-page">
					<section class="inner-wrap">
						<h1 id="<?php echo $post->post_name; ?>"><?php the_title(); ?></h1>
						<div class="page-marker">page&nbsp;<?php echo $children->current_post + 2; ?> | <?php the_title(); ?></div>
						<div class="content-col" id="<?php echo $post->post_name; ?>-content">
							<?php the_content(); ?>
						</div>

						<div class="meta-col">
							<div class="excerpt">
								<?php fixie_the_excerpt(); ?>
							</div>
							<div class="revisions">
								Load a revision of this section:
								<?php fixie_list_revisions( $post->post_name . '-content' ); ?>
							</div>
						</div>

					</section>
				</div>
			<?php
			endwhile;
			wp_reset_postdata();
		endif;
		?>

	<?php
	endwhile; else:
	echo '<p>Very sorry, there was no documentation found here.</p>';
endif;
?>

<?php get_footer(); ?>