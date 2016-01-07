# Front-End Gulp Template
Full front-end template that uses gulp for pre and post-processors.

## Installation
1. Clone the repo `git clone git@github.com:phobos101/frontend-gulp-template.git`
2. Install the dependencies `npm install`
3. Start building in the `/source` dir

## Switch between development build and production build
This template will build the site differently depending if you want to have a dev build or deploy to production.
* For Mac/UNIX use `export NODE_ENV=string` where string is either development or production
* For Windows use `set NODE_ENV=string` where string is either development or production

## !!Warning!!
You **WILL** run into issues if you use node version 0.X

Ensure you update your node to a recent version.

## Tasks
* ### **HTML**
  * This allows you to use logic and partials in your HTML. For instance:
  ```<body>
    <!-- @include partials/_header.html -->

    <main>
      <h1>Content goes here</h1>
    <main>

    <!-- @include partials/_footer.html -->```

  * Minifies HTML when in production build only

* ### **SASS / SCSS**
  * Converts SCSS to CSS

  * Prefixes images with the correct relative file path

  * Automatically adds vendor prefixes such as moz

  * Packs multiple media queries with the same
   dimensions into a single query

  * Adds pseudo element support for <= IE8

  * Minifies the resultant .css files in production build only


* ### Images
  * Compresses all images faster speeds

  * Any image placed in `source/images/inline` will be converted to Data URIs meaning that the images never need to be requested.

* ### JavaScript
  * Files are simply moved to a Javascript dir in a development build

  * When using a production build, the following will occur:
    * Scripts are loaded in the correct order via gulp-deporder. In your ,js files specify the dependencies at the top with `\\ requires: angular/app.js` (example)

    * Scripts are concatinated into a single file

    * All debug information is stripped from the file

    * The file is then minified

## Watch
The following files and directories are watched for changes and will auto reload your page:

* `source/*.html`, `source/partials/**/*`
* `source/images/*.*`, `source/images/inline/*`
* `source/scss/**/*`, but **NOT** `source/scss/images/_datauri.scss`
* `source/js/**/*`

## Feedback?
Please get in touch at robwilson101@gmail.com or submit an issue or PR.
