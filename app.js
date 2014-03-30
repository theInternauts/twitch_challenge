function Controller(options){
	var rootId = (options && options.rootId) ? options.id : 'wrapper'
	this.root = document.getElementById(rootId)
	this.baseURL = (options && options.baseURL) ? options.baseURL : 'https://api.twitch.tv/kraken/search/streams'
	this.currentPage = 1
	this.resultsPerPage = 10
	this.totalResults = 0
	this.searchTerm = ''
	this.queryString = ''

	this.searchHandler = function(e){
		this.searchTerm = e.detail.searchTerm
		this.searchAPI()	
		// console.log("searchHandler: ", e, this)
	}

	this.searchAPI = function(term){
		(term != null && typeof(term) == 'string') ? this.searchTerm = term : null
		this.buildQueryString()
		var server = new AsyncModule()
		var config = {
			scope: this,
			callback: this.searchSuccessHandler,
			arguments: ['results-list'],
			onError: this.asyncErrorHandler
		}
		
		server.loadJSONP(this.queryString, config)
	}

	this.searchSuccessHandler = function(data){
		// console.log("Data: ", data)
		this.totalResults = data._total
		var customEvent = new CustomEvent("queryResults", { detail: { paging: { total: this.totalResults, currentPage: this.currentPage, maxNumberOfPages: this.maxNumberOfPages() }, collection: data.streams }})
		this.resultsPanelView.root.dispatchEvent(customEvent)
		// console.log(customEvent)
	}

	this.buildQueryString = function(){
		var limit = '?limit=' + encodeURI(this.resultsPerPage)
		var offset = '&offset=' + encodeURI(((this.currentPage-1)*this.resultsPerPage))
		var query = '&q=%22' + encodeURI(this.searchTerm) + '%22'
		// console.log(limit, ' | ', offset, ' | ', query)
		this.queryString = this.baseURL.concat(limit, offset, query)
		console.log(this.queryString)
	}

	this.maxNumberOfPages = function(){
		var num = Math.floor(this.totalResults / this.resultsPerPage)
		if (this.totalResults % this.resultsPerPage > 0){
			return ++num
		} else {
			return num
		}
	}

	this.asyncErrorHandler = function(errorMessage){
		var HTMLfragment = UTILS.createFragment('DIV', 'msg-async', 'msg-error')
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
}

Controller.prototype.init = function(){
	this.searchBarPanelView = new SearchBarPanelView({
		textFragment: '<input id="input-search" type="text" placeholder="Search query..." /><input type="submit" value="Search" id="btn-input-search-button"/>',		
		attributes: { id: 'search-panel', class: 'panel' }
	}).init()
	this.searchBarPanelView.setSearchListeners()

	this.resultsPanelView = new View({
		attributes: { id: 'results-panel', class: 'panel' }
	}).init()
	
	this.resultsCountView = new	ResultsCountView({
		textFragment: '<span>Total results: </span><span>0</span>',
		attributes: { id: 'results-count' },
		parentId: 'results-panel'
	}).init()
	this.resultsCountView.setEventListeners()
	
	this.resultsPaginationControlsView = new	View({
		textFragment: '<a href="#" id="btn-pg-first">&#8647;</a><a href="#" id="btn-pg-previous">&#8678;</a><span id="display-pg">1 / 1</span><a href="#" id="btn-pg-next">&#8680;</a><a href="#" id="btn-pg-last">&#8649;</a>',
		attributes: { id: 'results-page-controls' },
		parentId: 'results-panel'
	}).init()

	this.resultsListView = new View({
		rootTagName: 'UL',
		attributes: { id: 'results-list' },
		parentId: 'results-panel'
	}).init()

	this.setEventListeners()
	
}

Controller.prototype.setEventListeners = function(){
	this.searchBarPanelView.root.addEventListener('searchQuery', this.searchHandler.bind(this), false)
}



function SearchBarPanelView(options){
	View.call(this,options)

	this.setSearchListeners = function(){
		document.getElementById('input-search').addEventListener('keyup', this.broadcastEvent.bind(this), true)
		document.getElementById('btn-input-search-button').addEventListener('click', this.broadcastEvent.bind(this), true)
	}

	this.broadcastEvent = function(event){
		var customEvent = new CustomEvent("searchQuery", { detail: { searchTerm: document.getElementById('input-search').value }})
		this.root.dispatchEvent(customEvent)
		// console.log("this: ", this)
		// console.log("customEvent",  customEvent)
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
