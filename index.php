<?php get_header();

if ( have_posts() ):
	while ( have_posts() ):
		the_post();
		?>
		<div class="docs-page">

			<div class="inner-wrap">

				<h1><?php the_title(); ?></h1>

				<div class="meta-col">
					<div class="excerpt">
						<?php fixie_the_excerpt(); ?>
					</div>
					<div class="revisions">
						Load a revision of this section:
						<?php fixie_list_revisions(); ?>
					</div>
				</div>

				<div class="content-col">
					<?php the_content(); ?>
				</div>
			</div>
			<?php
			// At this point we start recursively looking for child posts... walker?
			?>

		</div>
	<?php
	endwhile; else:
	echo '<p>Very sorry, there was no documentation found here.</p>';
endif;
?>

<?php get_footer(); ?>