const azure = require('azure-storage');
const tableService = azure.createTableService(
	'DefaultEndpointsProtocol=https;AccountName=' +
		process.env.AzureAccountName +
		';AccountKey=' +
		process.env.AzureTableKey +
		';EndpointSuffix=core.windows.net'
);

module.exports = function(context, req) {
	//get the top 5 wines of the input type, eg. Chardonnay, etc
	if (req.query.type) {
		var query = new azure.TableQuery()
			.top(5)
			.where('variety eq ?', req.query.type)
			.and('points >= ?', 90);
		tableService.queryEntities('wines', query, null, function(error, result, response) {
			if (!error) {
				context.done(null, {
					body: { data: response.body.value },
				});
			} else {
				context.done({
					status: 400,
					body: 'Sorry, no wines found.' + err,
				});
			}
		});
	} else {
		context.done({
			status: 400,
			body: 'oops, pass in a param',
		});
	}
};
