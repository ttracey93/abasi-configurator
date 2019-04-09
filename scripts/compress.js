const FBXLoader = require('three-fbxloader-offical');
const XML = require('xmlhttprequest');

global.XMLHttpRequest = XML.XMLHttpRequest;
global.window = {
  setTimeout: global.setTimeout,
};

const loader = new FBXLoader();

async function getModel() {
  console.log('asd');
  try {
    await new Promise(async (resolve, reject) => {
      console.log('Within promise');

      await loader.load('https://www.dropbox.com/s/m1ucpxdm389ie8a/1.FBX?dl=1', (fbx) => {
        console.log('asd2');
        console.log(fbx);
    
        try {
          const data = JSON.stringify(fbx);
        
          const fs = require('fs');
        
          fs.writeFileSync('./test.json', data);

          resolve();
        } catch (ex) {
          console.log(ex);

          reject(ex);
        }
      });
    });

  } catch (ex) {
    console.log(ex);

    reject(ex);
  }
}

getModel().then(() => {
  console.log('Mother of god');
})