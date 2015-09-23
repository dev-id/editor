all: install fetch cards

install:
	npm install --no-optional
	ln -sf ../node_modules public
	mkdir -p public

fetch:
	curl -so data/AllSets.json http://mtgjson.com/json/AllSets.json

cards:
	node app.js cards

js:
	node app.js bundle

public/bundle.css: public/style.css
	cat node_modules/normalize.css/normalize.css public/style.css |\
	  node_modules/clean-css/bin/cleancss -o public/bundle.css

client: js public/bundle.css
