# Fixie
Fixie is a WordPress theme for displaying readable and navigable documentation.

* Current Working: 0.2.0
* Latest Stable: 0.2.0
* Contributors: @tddewey, @lkwdwrd
* Contributing: By all means. Open an issue, or submit a Pull request against the master branch

## History and Purpose
Fixed gear bicycles, or "fixies" are stripped down and simple machines, a bicycle in the purest form. Simplicity means an easy to use and understand experience. Single page <a href="https://github.com/philips/fixiedocs">Fixie docs</a> were conceived by Brandon Phillips as a response to the sea of document trees, toggle arrows, and docs spread out across thousands of pages.

Fixie docs are displayed as a single page for the reader and maintained as parent->child pages in the admin. Automatic navigation, section breaks, and the browser's native search function allows a reader to move throughout the document easily. <a href="http://www.thereisnopagefold.com/">Love your scrollbar</a>.

## Features
There is not a huge feature set in Fixie; you won't find a 'theme options' page. Instead, we've decided to focus narrowly on documentation and those who read it.

### Automatic Navigation
Fixie creates a navigation menu for direct children of the current page. Grandchildren are currently not accounted for in any way.

### Front-end Revisions
Revision history for each section of a document is shown on the front-end including when it was last revised and by whom. You can switch out revisions of a section on the fly.

### Excerpts as Marginalia
Pages have excerpts and those excerpts are pulled into the margin as marginalia. It should probably be used as the tl;dr for that section.

### Collapsing Images
Images are great visual reference, but can often get in the way and bloat the length of documents. We collapse tall images inline automatically.

### Print Stylesheet
Fixie comes with a print stylesheet. Save as PDF and distribute like a boss.

## Complementary Plugins
Fixie is a theme and only a theme. The plan is to create several plugins that complement nicely.
* Fixie Templates allows reusable blocks of text to be placed in a document
* Fixie Shortcodes are helpful tools for documentarians. Includes shortcodes to show or hide text based on operating system
* Fixie Syntax will be a code/syntax viewer that fits well in the fixie theme

## Usage Tips
Fixie is all about page hierarchy. Each top level page represents a document. In fact, it's visually represented as a book on the home page by it's featured image. Child pages are automatically included into a long, 'fixie' document with the page title acting as a linked header reference.

For more information on how this works and what the HTML structure looks like, you'll want to refer to fixie's documentation, but the assumption is that you break your document up into sections. Each section is a page. Each page has a title and possibly some H2s—H6s.

Fixie should be installed on a new installation, or on a site that has only pages (and is intended to be used as documentation). We remove the post editor from the admin menu, and don't support much of the template hierarchy.

## Roadmap
* A better 404 page
* Auto collapse images after going back through revision history
* Do something with grandchild pages, or otherwise fix that oddity
* Complementary plugins: templates, shortcodes, and syntax
* TinyMCE editor for alert dialog styles
* Testing in the real world. 10up will be using this for some internal documentation, any issues will be fixed here.