js/combined.js: js/visualisation.js js/input.js js/control.js
	closure --compilation_level SIMPLE_OPTIMIZATIONS --js js/visualisation.js js/input.js js/control.js --js_output_file js/combined.js
