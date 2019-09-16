const azure = require('azure-storage');
const tableService = azure.createTableService(
	'DefaultEndpointsProtocol=https;AccountName=' +
		process.env.AzureAccountName +
		';AccountKey=' +
		process.env.AzureTableKey +
		';EndpointSuffix=core.windows.net'
);

module.exports = function(context) {
	//get one random wine, based on a random number calculated here
	var num = Math.floor(Math.random() * 1000);
	var query = new azure.TableQuery().where('rowKey eq ?', num);
	tableService.queryEntities('wines', query, null, function(error, result, response) {
		if (!error) {
			context.done(null, {
				body: { data: response.body.value },
			});
		} else {
			context.done({
				status: 400,
				body: 'Sorry, no wine found.' + err,
			});
		}
	});
};
