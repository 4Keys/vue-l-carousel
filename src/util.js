var win = window,
	simpleSelectorRE = /^[\w-]*$/,
	cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },

	emptyArr = [],
	slice = emptyArr.slice,
	
	round = Math.round; 

function qsa(element, selector) {
	var found,
		maybeID = selector[0] == '#',
		maybeClass = !maybeID && selector[0] == '.',
		nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
		isSimple = simpleSelectorRE.test(nameOnly)
	return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
		( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
		(element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
		slice.call(
			isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
				maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
				element.getElementsByTagName(selector) : // Or a tag
				element.querySelectorAll(selector) // Or it's not simple, and we need to query all
		)
}

function on(element, ev, callback) {
	element.addEventListener(ev, callback);
}

function off(element, ev, callback) {
	element.removeEventListener(ev, callback);
}

function attr(element, name) {
	return element.getAttribute(name);
}

function camelize(str) { 
	return str.replace(/-+(.)?/g, function(match, chr){ 
		return chr ? chr.toUpperCase() : '' 
	});
}

function dasherize(str) {
	return str.replace(/::/g, '/')
		   .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
		   .replace(/([a-z\d])([A-Z])/g, '$1_$2')
		   .replace(/_/g, '-')
		   .toLowerCase()
}

function maybeAddPx(name, value) {
	return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
}

function css(element, property, value) {
	var elementSytle = element.style;
	if (arguments.length < 3) {
		return elementSytle[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property);
	}
	else {
		if(!value && value !== 0) {
			elementSytle.removeProperty(dasherize(key));
		}
		else {
			elementSytle.cssText += dasherize(property) + ':' + maybeAddPx(value);
		}
	}
}

function each(elements, callback) {
	for(var i = 0, len = elements.length, element; i < len; i++) {
		element = elements[i];
		callback.call(element, element, i);
	}
}

function offset(element) {
	var obj = element.getBoundingClientRect();
	return {
		left: obj.left + win.pageXOffset,
		top: obj.top + win.pageYOffset,
		width: round(obj.width),
		height: round(obj.height)
	};
}

function width(element) {
	return offset(element).width();
}

var $ = {
	qsa,
	on,
	off,
	attr,
	css,
	each,
	offset,
	width
};


export default {
	$
};
