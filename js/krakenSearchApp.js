function KrakenSearchApp(id, options){
		this.root = document.getElementById(id)
		this.baseURL = 'https://api.twitch.tv/kraken/search/streams' || options.baseURL
		this.currentPage = 1
		this.resultsPerPage = 10
		this.totalResults = 0
		this.searchTerm = ''
		this.queryString = ''

		this.init()
	}
// DONE // controller
	KrakenSearchApp.prototype.paginationClickHandler = function(event){
		event.preventDefault()
		switch(event.target.id){
			case 'btn-pg-first':
				this.currentPage = 1
			break
			case 'btn-pg-previous':
				this.currentPage > 1 ? this.currentPage-- : null
			break
			case 'btn-pg-next':
				this.currentPage < this.maxNumberOfPages() ? this.currentPage++ : this.currentPage = 1
			break
			case 'btn-pg-last':
				this.currentPage = this.maxNumberOfPages()
			break				
		}
		this.searchAPI()
	}
// DONE // controller
	KrakenSearchApp.prototype.maxNumberOfPages = function(){
		var num = Math.floor(this.totalResults / this.resultsPerPage)
		if (this.totalResults % this.resultsPerPage > 0){
			return ++num
		} else {
			return num
		}
	}
// DONE // resultsPaginationControlView
	KrakenSearchApp.prototype.updatePaginationDisplay = function(){
		var display = document.getElementById('display-pg')
		display.innerHTML = this.currentPage + ' / ' + this.maxNumberOfPages()
	}
// DONE // resultsPaginationControlsView
	KrakenSearchApp.prototype.buildResultsPageControlsTemplate = function(parentId){
		var textFragment = '<a href="#" id="btn-pg-first">&#8647;</a><a href="#" id="btn-pg-previous">&#8678;</a><span id="display-pg">1 / 1</span><a href="#" id="btn-pg-next">&#8680;</a><a href="#" id="btn-pg-last">&#8649;</a>'
		var parent = document.getElementById(parentId)
		var HTMLfragment = this.UtilCreateFragment('DIV', 'results-page-controls')
		var pageControls = HTMLfragment.childNodes[0]
		pageControls.innerHTML = textFragment
		parent.appendChild(HTMLfragment)
		
		pageControls.addEventListener('click', this.paginationClickHandler.bind(this), false)
		this.updatePaginationDisplay()			
	}
// DONE // controller
	KrakenSearchApp.prototype.buildQueryString = function(){
		var limit = '?limit=' + encodeURI(this.resultsPerPage)
		var offset = '&offset=' + encodeURI(((this.currentPage-1)*this.resultsPerPage))
		var query = '&q=%22' + encodeURI(this.searchTerm) + '%22'
		// console.log(limit, ' | ', offset, ' | ', query)
		this.queryString = this.baseURL.concat(limit, offset, query)
		console.log(this.queryString)
	}


// DONE // controller
	KrakenSearchApp.prototype.init = function(){
		console.log("init")
		this.buildSearchBar()
		this.buildResultsPanelContainer()
	}

// DONE // searchBarPanelView
	KrakenSearchApp.prototype.buildSearchBar = function(){
		var textFragment = '<input id="input-search" type="text" placeholder="Search query..." /><input type="submit" value="Search" id="btn-input-search-button"/>'		
		var HTMLfragment = this.UtilCreateFragment('DIV', 'search-panel', 'panel')
		HTMLfragment.childNodes[0].innerHTML = textFragment
		this.root.appendChild(HTMLfragment)

		this.setSearchListeners()
	}
// DONE // searchBarPanelView
	KrakenSearchApp.prototype.setSearchListeners = function(){
		document.getElementById('input-search').addEventListener('keyup', this.searchHandler.bind(this), true)
		document.getElementById('btn-input-search-button').addEventListener('click', this.searchAPI.bind(this), true)
	}
// DONE // controller
	KrakenSearchApp.prototype.searchHandler = function(event){
		this.searchTerm = event.target.value
		this.searchAPI()	
	}
// DONE // controller
	KrakenSearchApp.prototype.searchAPI = function(term){
		(term != null && typeof(term) == 'string') ? this.searchTerm = term : null
		this.buildQueryString()
		var server = new AsyncModule()
		var config = {
			scope: this,
			callback: this.displaySearchResults,
			arguments: ['results-list'],
			onError: this.AsyncErrorHandler
		}
		
		server.loadJSONP(this.queryString, config)
	}
// DONE // resultsListView
	KrakenSearchApp.prototype.displaySearchResults = function(data, parentId){
		this.totalResults = data._total
		this.updateResultsCount(this.totalResults)
		this.updatePaginationDisplay()

		var parent = document.getElementById(parentId)
		this.UtilEmptyNode(parent)
		data.streams.forEach(function(stream){
			var textFragment = '<div><img src="' + stream.channel.logo + '" /></div><div><p>' + stream.channel.status + '</p><p><span>' + stream.game + '</span> - <span>' + stream.viewers + ' viewers</span></p></div>'
			var HTMLfragment = document.createDocumentFragment();
			HTMLfragment.appendChild(document.createElement('LI'))
			HTMLfragment.childNodes[0].innerHTML = textFragment
			parent.appendChild(HTMLfragment)
		})		
	}
// DONE // resultsCountView
	KrakenSearchApp.prototype.updateResultsCount = function(newCount){
		var counterDisplayNode = document.getElementById('results-count').childNodes[1]
		counterDisplayNode.innerHTML = newCount
	}

// DONE // pull out into Util Class
	KrakenSearchApp.prototype.UtilCreateFragment = function(elementTag, nodeId, nodeClass){
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

// DONE // pull out into Util Class
	KrakenSearchApp.prototype.UtilEmptyNode = function(node){
		while (node.hasChildNodes()) {
		    node.removeChild(node.lastChild);
		}
	}

// DONE //
	KrakenSearchApp.prototype.buildResultsPanelContainer = function(){	
		var HTMLfragment = this.UtilCreateFragment('DIV', 'results-panel', 'panel')			
		this.root.appendChild(HTMLfragment)
		this.buildResultsCountTemplate('results-panel')
		this.buildResultsPageControlsTemplate('results-panel')  //I can't properly implment this until I deal with cross-origin security
		this.buildResultsListTemplate('results-panel')
	}

// DONE // results view
	KrakenSearchApp.prototype.buildResultsCountTemplate = function(parentId){
		var textFragment = '<span>Total results: </span><span>0</span>'		
		var parent = document.getElementById(parentId)		
		var HTMLfragment = this.UtilCreateFragment('DIV', 'results-count')		
		HTMLfragment.childNodes[0].innerHTML = textFragment
		parent.appendChild(HTMLfragment)
	}

// DONE // results view
	KrakenSearchApp.prototype.buildResultsListTemplate = function(parentId){
		var parent = document.getElementById(parentId)
		var HTMLfragment = this.UtilCreateFragment('UL', 'results-list')
		parent.appendChild(HTMLfragment)
	}

// DONE // controller
	KrakenSearchApp.prototype.AsyncErrorHandler = function(errorMessage){
		var HTMLfragment = this.UtilCreateFragment('DIV', 'msg-async', 'msg-error')
		var newNode = HTMLfragment.childNodes[0]
		newNode.innerHTML = '(Click to remove) Error: '+ errorMessage
		this.root.appendChild(HTMLfragment)
		this.root.insertBefore(newNode, this.root.childNodes[0])
		var removalHandler = function(event){			
			event.preventDefault()
			this.removeEventListener('click', removalHandler, false);
			this.remove()
		}
		newNode.addEventListener('click', removalHandler, false)
	}


	