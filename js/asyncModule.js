//this thing is sooooooo ugly.  Not for production, Cricket
AsyncModule = function(){
	var xhr, response, responseText

	function init(){
		xhr = new XMLHttpRequest()			
	}

	function UtilCreateFragment(elementTag, nodeId, nodeClass){
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

	function handlerCustomJSONPEvent(options){
		var finalHandler = function(event){
			var args
			response = event
			responseText = event.detail.JSONPdata
			args = [responseText]
			args = args.concat(options.arguments)
			
			if (options.callback != null && options.scope != null){
				options.callback.apply(options.scope, args)
			}
			//these next two lines may casue issues when there are multiple instances of the this module making JSONP requests
			//delete window.handlerAsyncModule //potential RACE CONDITION if multiple events fired quickly, as well
			window.removeEventListener('JSONP-LOADED', finalHandler, false)
		}

		//the actual handler is finalHandler
		return finalHandler
	}

	function loadJSONP(url, options){
		//attaching an event listener to the global scope to handle a custom event			
		window.addEventListener('JSONP-LOADED', handlerCustomJSONPEvent(options), false)

		//dynamically create global callback to handle the JSONP script tag load 
		window.handlerAsyncModule = function(data){
			var AsyncModuleUID = uid				
			var myJSONPEvent

			if (window.CustomEvent) {
				myJSONPEvent = new CustomEvent('JSONP-LOADED', { 'detail': { 'JSONPdata': data, 'AsyncModuleUID': AsyncModuleUID }})
				window.dispatchEvent(myJSONPEvent);
			}
		}
					
		//create a script tag to load the JSONP url (then destroy it)			
		var newUrl = url.concat('&callback=handlerAsyncModule')
		var uid = "AsyncModuleObject" + Date.now()									
		var HTMLfragment = UtilCreateFragment('SCRIPT', uid)
		var loader = HTMLfragment.childNodes[0]
		loader.src = newUrl
		loader.type = 'text/javascript'
		document.getElementsByTagName('head')[0].appendChild(HTMLfragment)
		loader != null ? loader.remove() : null
		return uid
	}

	function STUBload(url, options){
		response = 200
      	responseText = STUBDATA
		if(options.callback){
			options.arguments ? options.arguments.push(STUBDATA) : null
			options.callback.apply(options.scope, options.arguments)
		} else {
			return responseText
		}
	}

	function get(url){
		xhr.open('get', url)
		 
		xhr.onreadystatechange = function(){
		    if(xhr.readyState === 4){
		        if(xhr.status === 200){
		        	console.log("yes: ", xhr.responseText)
		        	response = xhr.status
		        	responseText = xhr.responseText
		        	return xhr.responseText
		        } else {
		            alert('Error: '+ xhr.status)
		        }
		    }
		}
		 
		xhr.send(null)	
	}


	function load(url, options){
		xhr.open('get', url)
		 
		xhr.onreadystatechange = function(){
		    if(xhr.readyState === 4){
		        if(xhr.status === 200){
		        	if(options.callback){
						options.arguments ? options.arguments.push(JSON.parse(xhr.responseText)) : null
						options.callback.apply(options.scope, options.arguments)
					} else {
						console.log(xhr.responseText)
					}			      
					response = xhr.status
		        	responseText = xhr.responseText
					//not sure about this line  	
					return xhr.responseText
		        } else {
		        	response = xhr.status
		        	responseText = ""
		        	if(options.onError){
						options.onError.apply(options.scope, [xhr.status])
					} else {							
			            alert('Error: '+ xhr.status)
					}
		        }
		    }
		}
		 
		xhr.send(null)				
	}

	function getResponse(){
		return response
	}

	function getResponseText(){ 
		return responseText
	}

	init()

	return {
		load: STUBload,
		loadJSONP: loadJSONP,
		getResponse: getResponse, 
		getResponseText: getResponseText,
		get: get
	}
}

