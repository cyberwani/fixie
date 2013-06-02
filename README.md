# Fixie
Fixie is a WordPress theme for displaying readable and navigable documentation.

## Features
There is not a huge feature set in Fixie; you won't find a 'theme options' page. Instead, we've decided to focus narrowly on documentation and those who read it.

Much of Fixie's behavior can be modified or extended through action and filter hooks. Once the beta version is up, we'll document Fixie using Fixie.

### Automatic Navigation
Fixie creates a navigation menu for direct children of the current page.

### Front-end Revisions
Revision history for each section of a document is shown on the front-end including when it was last revised and by whom. You can switch out revisions of a section on the fly.

### Excerpts as Marginalia
Pages have excerpts and those excerpts are pulled into the margin as marginalia. It should probably be used as the tl;dr for that section.

### Print Stylesheet
Fixie comes with a bomb print stylesheet. Save as PDF and distribute like a boss.

## Complementary Plugins
Fixie is a theme and only a theme. We've created several plugins however, that complement nicely. See
* Fixie Templates allows reusable blocks of text to be placed in a document
* Fixie Shortcodes are helpful tools for documentarians. Includes shortcodes to show or hide text based on operating system

## Usage Tips
Fixie is all about page hierarchy. Each top level page represents a document. In fact, it's visually represented as a book on the home page by it's featured image. Child pages are automatically included into a long, 'fixie' document with the page title acting as a linked header reference.

For more information on how this works and what the HTML structure looks like, you'll want to refer to fixie's documentation, but the assumption is that you break your document up into sections. Each section is a page. Each page has a title and possibly some H2s—H6s.