// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time.
function throttle(fn, delay) {

	var timer = null;

	return function () {
		var context = this,
				args = arguments;

		clearTimeout(timer);

		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
};