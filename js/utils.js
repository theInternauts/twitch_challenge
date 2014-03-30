UTILS = (function(){
	
	function emptyNode(node){
		if (node == null){
			throw TypeError('Pass in a DOM node to be cleared');
		}
		while (node.hasChildNodes()) {
		    node.removeChild(node.lastChild);
		}
	}

	function createFragment(elementTag, nodeId, nodeClass){
		//currently this only supports setting an ID attribute and/or a single class attribute
		var HTMLfragment = document.createDocumentFragment();
		HTMLfragment.appendChild(document.createElement(elementTag))
		if(nodeClass){
			var attrClass = document.createAttribute("class")
			attrClass.value = nodeClass
			HTMLfragment.childNodes[0].setAttributeNode(attrClass)
		}
		if(nodeId){
			var attrId = document.createAttribute("id")
			attrId.value = nodeId			
			HTMLfragment.childNodes[0].setAttributeNode(attrId)
		}

		return HTMLfragment
	}

	function extend(addedOptions,originalObj){
		return deepCopy(addedOptions,originalObj)
	}

	function clone(obj){
		return deepCopy(obj)
	}

	function deepCopy(addedOptions,originalObj) {
		//only for basic arrays and object literals.  Custom classes and primative will not work
		if(originalObj == null){
			var originalObj = (addedOptions instanceof Array) ? [] : {};
		}
	  for (var i in addedOptions) {
	    if (addedOptions[i] && typeof addedOptions[i] == "object") {
	      originalObj[i] = deepCopy(addedOptions[i]);
	    } else originalObj[i] = addedOptions[i]
	  } 
	  return originalObj;
	}


	//expose the public members
	return {
		emptyNode: emptyNode,
		createFragment: createFragment,
		extend: extend,
		clone: clone
	}

})()