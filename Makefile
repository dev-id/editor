all: install data

install:
	npm install
	ln -sf ../node_modules public

data: src/make/cards.js
	[ -e data/AllSets.json ] ||\
	  curl -so data/AllSets.json http://mtgjson.com/json/AllSets.json
	node src/make cards

js:
	node src/make bundle
