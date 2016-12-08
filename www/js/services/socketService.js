((app)=>{

  app.factory('socket',function(socketFactory) {
  	//Create socket and connect to http://localhost:8000/

   	var myIoSocket = io('http://192.168.3.168:8100/');
	   return  socketFactory({
      	ioSocket: myIoSocket
    	});

  })

})(angular.module('app.services'))
