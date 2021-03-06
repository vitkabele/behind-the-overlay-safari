/**
 * This script is published under the GPL license.
 * It is taken from the original repository on the https://github.com/NicolaeNMV/BehindTheOverlay
 *
 * This is a script that will remove overlay popups in the 99% of the cases.
 * It does so by detecting DOM elements.
 *
 */

var debug = true;

function hideElement(element) {
   element.style.setProperty('display', 'none', 'important');
}

function isVisible(element) {
	return element.offsetWidth > 0 && element.offsetHeight > 0;
}

function getZIndex(element) {
	return parseInt(window.getComputedStyle(element).zIndex);
}

function isAnElement(node) {
	return node.nodeType == 1; // nodeType 1 mean element
}

function nodeListToArray(nodeList) {
	return Array.prototype.slice.call(nodeList);
}

function forEachElement(nodeList, functionToApply) {
	nodeListToArray(nodeList).filter(isAnElement).forEach(function(element) {
		functionToApply.call(this, element);
	});
}

function collectParents(element, predicate) {
	var matchedElement = element && predicate(element) ? [element] : [];
	var parent = element.parentNode;
	
	if (parent && parent != document && parent != document.body) {
		return matchedElement.concat(collectParents(parent, predicate));
	} else {
		return matchedElement;
	}
}

// Calculate the number of DOM elements inside an element
function elementWeight(element, maxThreshold) {
	var grandTotal = 0;
	var nextElement = element;
	var nextGrandChildNodes = [];
	
	function calculateBreathFirst(element) {
		var total = 0;
		var nextChildElements = [];
		
		var childNodes = element.childNodes;
		total = childNodes.length;
		
		forEachElement(childNodes, function(childNode) {
			var grandChildNodes = nodeListToArray(childNode.childNodes);
			total += grandChildNodes.length;
			nextChildElements = nextChildElements.concat(grandChildNodes.filter(isAnElement));
		});
		return [total, nextChildElements];
	}
	
	while (nextElement) {
		var tuple_total_nextChildElements = calculateBreathFirst(nextElement);
		var total = tuple_total_nextChildElements[0];
		
		grandTotal += total;
		nextGrandChildNodes = nextGrandChildNodes.concat(tuple_total_nextChildElements[1]);
		
		if (grandTotal >= maxThreshold) {
			break;
		} else {
			nextElement = nextGrandChildNodes.pop();
		}
	}
	
	return grandTotal;
}

function hideElementsAtZIndexNear(nearElement, thresholdZIndex) {
	nearElement.parentNode?.childNodes.filter(child => getZIndex(child) >= thresholdZIndex).map(hideElement)
}

// Check the element in the middle of the screen
// Search fo elements that has zIndex attribute
function methodTwoHideElementMiddle() {
	var overlayPopup = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
	
	var overlayFound = collectParents(overlayPopup, function(el) {
		return getZIndex(el) > 0;
	});
	
	if (debug){
		console.debug('Overlay found: ', overlayFound);
	}
	
	if (overlayFound.length == 0)
		return false;
	
	var olderParent = overlayFound.pop();
	
	if (debug){
		console.debug('Hide parrent: ', olderParent);
	}
	return olderParent;
}

function containersOverflowAuto() {
	var containers = [document.documentElement, document.body];
	
	containers.forEach(function(element) {
		if (window.getComputedStyle(element).overflow == 'hidden') {
			styleImportant(element, 'overflow', 'auto');
		}
	})
}

function overlayRemoverRun() {
	for (var i = 0; i < 10; i++) {
		var candidate = methodTwoHideElementMiddle();
		var first = i == 0;
		if (candidate === false) {
			if (first){
				alert('No overlay has been found on this website.');
			}
			break;
		} else {
			if (!first) {
				// Prevent to hide the actual content
				var weightThreshold = 100;
				var candidateWeight = elementWeight(candidate, weightThreshold)
				if (candidateWeight < weightThreshold) {
					if (debug){
						console.log('Element is too lightweight, hide it', candidate);
					}
					hideElement(candidate);
				} else {
					if (debug){
						console.log("Element is too heavy, don't hide it", candidate);
					}
				}
			} else {
				hideElement(candidate);
				containersOverflowAuto();
			}
		}
	}
}

overlayRemoverRun()
