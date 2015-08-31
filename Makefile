all: install cards

install:
	npm install
	ln -sf ../node_modules public

cards:
	[ -e data/AllSets.json ] ||\
	  curl -so data/AllSets.json http://mtgjson.com/json/AllSets.json
	node src/make cards

js:
	node src/make bundle

public/build/style.min.css: public/style.css
	cat node_modules/normalize.css/normalize.css public/style.css |\
	  node_modules/clean-css/bin/cleancss -o public/style.min.css

client: js public/build/style.min.css
