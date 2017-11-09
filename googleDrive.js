var google = require('googleapis');
function GoogleDrive(key){
    var drive = null;

    var authScopes =  ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file'];
    const thisInstance=this;
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      authScopes, // an array of auth scopes
      null
    );

    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log(err);
        return;
      }
      drive.files.list(function(err, res){
          if (err) {
            console.log(err);
            return;
          }
      
      });
    });

    drive = google.drive({
        version: 'v3',
        auth: jwtClient
    });

    function getFileId(name, cbFound, cbNotFound){
          drive.files.list(function(err, res){
              if (err) {
                console.log(err);
                return;
              }
              var exists=false;
              for (var i = 0; i < res.files.length; i++) {
                const file = res.files[i];
                if (file.name==name){
                    exists=true;
                    console.log(`FILE FOUND WITH NAME ${name} AND id ${file.id}`);
                    cbFound(file.id);
                }else if (!name){
                    cbFound(file.id);
                }
              };
              if (exists==false){
                if (cbNotFound){
                  cbNotFound(null);
                }
              }
          });
    };
    
    this.delete=function(name, cbDone){
        getFileId(name, function found(_fileId){
              console.log(`deleting ${_fileId}.`);
              drive.files.delete({
                  fileId: _fileId
              },function(){
                console.log(`${_fileId} was deleted.`);
                cbDone();
              });
        }, function(){
          console.log(`${name} not found`);
        });
    };

    this.new=function(name, dataStr, cbDone){
        drive.files.create({
          resource: {
            name: name,
            mimeType: 'application/json'
          },
          media: {
            mimeType: 'application/json',
            body: dataStr
          }
        }, function(err, file){
            if (err){
              console.log(err);
            }else{
              console.log(`FILE CREATED ${name} WITH id ${file.id}`);
              if (cbDone){
                  cbDone(file.id);
              }
            }
        });
    };

    this.load=function(name, cbFound, cbNotFound){
        getFileId(name, function found(_fileId){
            drive.files.get({
                fileId: _fileId,
                mimeType: 'application/json',
                alt: 'media' // THIS IS IMPORTANT PART! WITHOUT THIS YOU WOULD GET ONLY METADATA
            }, function(err, result) {
                if(err){
                  console.log(err);
                }else{
                  cbFound(result);
                }
            });
        },cbNotFound);
    }
}
module.exports=GoogleDrive;
