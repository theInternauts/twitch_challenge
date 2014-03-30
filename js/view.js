function View(config){
	var uid = Date.now()

	UTILS.extend(config,this)
	this.rootTagName = this.rootTagName || 'DIV'
	this.parentId = this.parentId || 'wrapper'


	this.init = function(){		
		this.parent = document.getElementById(this.parentId)
		this.HTMLfragment = UTILS.createFragment(this.rootTagName, this.attributes.id, this.attributes.class)
		/*this fires once the View is instantiated
			should build and attach the DOM template.  THEN attach event handlers
		*/		
		this.render()
		return this
	}

	this.render = function(options){
		console.log("VIEW ", this.getId(), " => 'render'")
		if(this.textFragment){
			this.HTMLfragment.childNodes[0].innerHTML = this.textFragment
		}
		this.parent.appendChild(this.HTMLfragment)
		//this has potential for a race condition in heavy load
		this.root = this.parent.lastChild
		return this
	}

	this.getId = function(){ return uid }
	this.close = function(){
		//need to do cleanup before destruction INCLUDING removing event listeners.
		return this.getId()
	}

	// this.init();
}