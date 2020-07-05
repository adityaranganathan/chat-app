"use strict";

const fs = require('fs');
const { COPYFILE_FICLONE } = fs.constants;
var serverConfig = undefined;

function configureEnvironment(environment){

    if(environment == 'production'){
        fs.copyFileSync('config/prodClientConfig.js', 'public/environmentConfig.js', COPYFILE_FICLONE);
        serverConfig = require('../config/prodServerConfig.js');
      }
      else{
        fs.copyFileSync('config/devClientConfig.js', 'public/environmentConfig.js', COPYFILE_FICLONE);
        serverConfig = require('../config/devServerConfig.js');
      }
      return serverConfig
}


module.exports.configureEnvironment = configureEnvironment