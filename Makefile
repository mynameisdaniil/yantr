NPM = /usr/bin/env npm
NODE = /usr/bin/env node
MODULES = ./node_modules/
JSDOX = $(MODULES)jsdox/bin/jsdox

default: test

test:
	$(NODE) test.js

docs:
	$(NODE) $(JSDOX) --output docs ./
	@cp ./docs/main.md README.md

install:
	@rm -rf $(MODULES)
	$(NPM) install

.PHONY: docs
