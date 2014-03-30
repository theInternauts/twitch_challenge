function Model(options){
	var that = this
	this.paging = {
		total: options.data._total,
		currentPage: options.currentPage,
		maxNumberOfPages: options.maxNumberOfPages 
	}

	this.collection = []
	options.data.streams.forEach(function(stream){
		var tempObj = {}
		tempObj.logo = stream.channel.logo
		tempObj.status = stream.channel.status
		tempObj.game = stream.game
		tempObj.viewers = stream.viewers
		that.collection.push(tempObj)
	})
}
