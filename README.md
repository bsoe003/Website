#Brian Soe's Website

##Technical Background
My website uses [Jade](http://jade-lang.com/) as a HTML template engine, [SASS](http://sass-lang.com/) as a CSS pre-processor, and [jQuery](https://jquery.com/) for client-side scripting.

The server-side is being utilized through [Node.js](https://nodejs.org/en/) with [Express.js](https://expressjs.com/) web framework. 

Additionally, other libraries such as [Lightbox](http://lokeshdhakar.com/projects/lightbox2/), [Leaflet](http://leafletjs.com/), and [Nodemailer](https://nodemailer.com/) are temporarily integrated to implement specific features quickly.

This website **does not** depend on external CSS framework such as Bootstrap, Flat UI, or Foundations.


##Backlog
###Cross-Browser Compatibility
Most of the current codebases are written with various browser issues in mind. However, the website has not been fully tested for full cross-browser compatibility. If you want to explore my website to full extent, I recommend using the latest version of Google Chrome.

The fixes for following browser are pending:

* Internet Explorer
* Microsoft Edge
* any Android browsers
* Opera
* iOS Chrome
* any old browsers

###Responsiveness
The website is fairly responsive for screen width between 750px (iPhone 6) and 1440px (15-inch Macbook Pro). If your screen size is out of this range, the pages may look "glitchy". If you are using a smartphone and viewing the website in landscape, it may not display correctly either.

###`<noscript>` Handling
In certain cases, people may have disabled Javascript from their browser for various reasons. Although most features of the website should be functional even if Javascript is disabled, this has been finished yet.

I highly recommend enabling Javascript before exploring through the website.

###Optimization
In normal cases, the website should render very quickly (under 500 ms per page). However, if the visitor of my website faces network delay or owns slow computer, the loading time may lead to frustration.

I am currently considering following optimizations:

* Image resizing and/or compression
* Lazy load large files
* Pre-load handling

I have already accomplished following optimization process:

* HTML, CSS, and Javascript minification (and uglifying)
* Cache Control for media files, CSS, and Javascript through HTTP header.
* Enabled gzip compression on server-side

###Something Fun
Many visitors of my site may not have a lot of time to retain all the information I am presenting. I constant think about what fun elements I can integrate on my website to make it enjoyable while displaying my personality. These will be integrated in future, but not a high priority.
