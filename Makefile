all: install data link

install:
	npm install

data:
	[ -d data ] || mkdir data
	[ -e data/AllSets.json ] ||\
	  curl -so data/AllSets.json http://mtgjson.com/json/AllSets.json
	node src/make cards

link:
	ln -sf ../node_modules public
	ln -sf ../../data/setlist.js public/js
	ln -sf ../../src/_.js public/js

js:
	node_modules/babel/bin/babel.js\
	  public/js --out-dir public/build --modules=system
