watch:
	while sleep 1; do ls ./{test,lib}/**/*.js | entr -r gulp; done
