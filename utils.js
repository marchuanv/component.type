const http = require('http');
function Timer(isInterval){
  let milliseconds=1000;
  function internalStart(callback){
    if (isInterval){
         setTimeout.apply(this, [function(){
            callback.apply(this);
            internalStart.apply(this,[callback]);
          }, milliseconds]);
      } else {
        setTimeout.apply(this, [function(){
          callback.apply(this);
        }, milliseconds]);
      }
  };
  this.setTime=function(_milliseconds){
    milliseconds=_milliseconds;
  };
  this.start=function(callback){
      internalStart.apply(this, [callback]);
  };
};

function handleHttpResponse(request, response, cbSuccess){
    let body = [];
    response.on('data', function (body) {
      if (response.statusCode==200){
        cbSuccess(body);
      }else{
        const resMessage=`HTTP: ${request.url} request responded with status: ${response.statusCode}`;
        console.error(resMessage);
      }
    });
    response.on('end', function () {
        const bodyStr = Buffer.concat(body).toString();
        try{
          console.log('HTTP: parsing request body to JSON');
          JSON.parse(bodyStr);
        }catch(err){
            response.statusCode = 500;
            response.setHeader('Content-Type','application/json');
            response.write({message:'HTTP: error parsing request body to json'});
            response.end();
            return;
        }
        if (response.statusCode==200){
            cbSuccess(body);
        }else{
            const resMessage=`HTTP: request responded with status: ${response.statusCode}`;
            console.error(resMessage);
        }
    });
};

function handleHttpRequest(url, jsonData, cbPass, cbFail, req, res){
   var request=req;
   var response=res;
   if (!request && !url){
      console.log('HTTP: have to provide either an existing http request object or a url to create a new request.');
      return;
   }
   if (!request){
      const addressSplit=url.replace('http://','').replace('https://','').split(':');
      const hostName = addressSplit[0].split('/')[0];
      var port=80;
      if (addressSplit[1]){
          port = addressSplit[1].split('/')[0];
      }
      const options = {
          host: hostName,
          port: port, 
          method:'POST',
          headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(jsonString)
          }
      };
      request=http.request(options);
   }
   request.on('error', function(err){
      console.log(`HTTP: ${err}`);
   });
   if (response){
      handleHttpResponse(request, response, cbPass);
   }else{
      request.on('response', function (_response) {
          handleHttpResponse(request, response, cbPass);
      });
      request.write(jsonData);
      request.end();
   }
};

module.exports={
  getRandomNumber: function(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
  },
  createTimer: function(isInterval){
    return new Timer(isInterval);
  },
  handleHttpRequest: handleHttpRequest
};
