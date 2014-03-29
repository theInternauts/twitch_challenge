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


function Controller(){
	// this.views = {}
	// this.addView(view){
	// 	if(view == null){
	// 		throw Exception("This method requires a View instance")
	// 	} else {
	// 		this.views[view.getId()] = view			
	// 		return view
	// 	}
	// }
	this.maxNumberOfPages = function(){}
	this.AsyncErrorHandler = function(errorMessage){}
}


function View(config){
	var uid = Date.now()
	UTILS.extend(config,this)
	this.rootTagName = this.rootTagName || 'DIV'
	this.parentId = this.parentId || 'wrapper'
	this.textFragment = this.textFragment || '<p></p>'

	this.getId = function(){ return uid }

	this.init = function(){		
		this.root = document.getElementById(this.parentId)
		this.HTMLfragment = UTILS.createFragment(this.rootTagName, this.attributes.id, this.attributes.class)
		/*this fires once the View is instantiated
			should build and attach the DOM template.  THEN attach event handlers
		*/		
		this.render()
	}
	this.render = function(options){
		console.log("VIEW ", this.getId(), " => 'render'")
		if(this.textFragment){
			this.HTMLfragment.childNodes[0].innerHTML = this.textFragment
		}
		this.root.appendChild(this.HTMLfragment)
		return this
	}

	this.close = function(){
		//need to do cleanup before destruction INCLUDING removing event listeners.
		return this.getId()
	}

	this.init();
}


Controller.prototype.init = function(){
	this.searchBarView = new View({
		textFragment: '<input id="input-search" type="text" placeholder="Search query..." /><input type="submit" value="Search" id="btn-input-search-button"/>',		
		attributes: { id: 'search-panel', class: 'panel' }
	})
	// this.paginationView = new View()
	this.resultsPaneView = new View({
		attributes: { id: 'results-panel', class: 'panel' }
	})
}