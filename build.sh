#!/bin/bash
cat ./public/utility/_*.js ./public/script.js ./public/utility/lightbox.js > ./public/cached.js
cat ./public/utility/_*.min.css ./public/style.css > ./public/style.min.css
uglifyjs --compress --mangle -- ./public/cached.js > ./public/script.min.js
rm ./public/cached.js
