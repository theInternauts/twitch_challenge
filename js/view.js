function View(config){
	var uid = Date.now()

	UTILS.extend(config,this)
	this.rootTagName = this.rootTagName || 'DIV'
	this.parentId = this.parentId || 'wrapper'


	this.init = function(){		
		this.parent = document.getElementById(this.parentId)
		this.HTMLfragment = UTILS.createFragment(this.rootTagName, this.attributes.id, this.attributes.class)
		
		this.render()
		return this
	}

	this.render = function(options){
		console.log("VIEW ", this.getId(), " => 'render'")
		if(this.textFragment){
			this.HTMLfragment.childNodes[0].innerHTML = this.textFragment
		}
		this.parent.appendChild(this.HTMLfragment)
		//Not great. This has potential for a race condition if other entities simultaneously append to the same DOM node
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





function SearchBarPanelView(options){
	View.call(this,options)

	this.setEventListeners = function(){
		document.getElementById('input-search').addEventListener('keyup', this.broadcastEvent.bind(this), true)
		document.getElementById('btn-input-search-button').addEventListener('click', this.broadcastEvent.bind(this), true)
	}

	this.broadcastEvent = function(e){
		var customEvent = new CustomEvent("searchQuery", { detail: { searchTerm: document.getElementById('input-search').value }})
		this.root.dispatchEvent(customEvent)
	}
}

SearchBarPanelView.prototype = Object.create(View.prototype)
SearchBarPanelView.prototype.constructor = SearchBarPanelView






function ResultsCountView(options){
	View.call(this,options)

	this.setEventListeners = function(){
		this.parent.addEventListener("queryResults", this.updateResultsCount.bind(this), false)
	}

	this.updateResultsCount = function(e){
		var counterDisplayNode = document.getElementById('results-count').childNodes[1]
		counterDisplayNode.innerHTML = e.detail.paging.total
	}

}

ResultsCountView.prototype = Object.create(View.prototype)
ResultsCountView.prototype.constructor = ResultsCountView





function ResultsListView(options){
	View.call(this,options)

	this.setEventListeners = function(){
		this.parent.addEventListener("queryResults", this.updateDisplayList.bind(this), false)
	}

	this.updateDisplayList = function(e){
		UTILS.emptyNode(this.root)
		var root = this.root
		e.detail.collection.forEach(function(stream){
			var textFragment = '<div><img src="' + stream.logo + '" /></div><div><p>' + stream.status + '</p><p><span>' + stream.game + '</span> - <span>' + stream.viewers + ' viewers</span></p></div>'
			var HTMLfragment = document.createDocumentFragment();
			HTMLfragment.appendChild(document.createElement('LI'))
			HTMLfragment.childNodes[0].innerHTML = textFragment
			root.appendChild(HTMLfragment)
		})
	}

}

ResultsListView.prototype = Object.create(View.prototype)
ResultsListView.prototype.constructor = ResultsListView






function ResultsPaginationControlsView(options){
	View.call(this,options)

	this.setEventListeners = function(){
		this.root.addEventListener('click', this.broadcastEvent.bind(this), true)
		this.parent.addEventListener('queryResults', this.updatePaginationDisplay.bind(this), true)
	}

	this.broadcastEvent = function(e){
		var customEvent = new CustomEvent("pagingEvent", { detail: { btn: e.target.id }})
		this.root.dispatchEvent(customEvent)
	}

	this.updatePaginationDisplay = function(e){
		var display = document.getElementById('display-pg')
		display.innerHTML = e.detail.paging.currentPage + ' / ' + e.detail.paging.maxNumberOfPages
	}
}

ResultsPaginationControlsView.prototype = Object.create(View.prototype)
ResultsPaginationControlsView.prototype.constructor = ResultsPaginationControlsView



