const utils=require('./utils.js');
const logging=require('./logging.js');
process.env.thisserveraddress='localhost:3000';
const messageBus=new utils.createMessageBusClient();

try{
	messageBus.subscribe('endpoint1', function success(requestData) {
		logging.write('subscriber1 notified: ',requestData);
	});
	messageBus.subscribe('endpoint2', function success(requestData) {
		logging.write('subscriber2 notified: ',requestData);
	});
	messageBus.publish('endpoint1',  'localhost:3000',  {message:"blaaaaaaaaaaaaaaaaaaaa"});
	messageBus.publish('endpoint2',   'localhost:3000', {message:"naaaaahhhhhhh"});
}catch(err){
	logging.write(err);
}