const chokidar = require('chokidar');
const fs=require('fs');
console.log('start');
const matchReg=/\.scss$/;
const cache=new Map();
const dir='./src/components';
var path=require('path');
var join = path.join;
var uglifycss = require('uglifycss');

var sass = require('node-sass');
function isFileExisted(filePath) {
    return fs.existsSync(filePath);
}


function getCssFiles(jsonPath) {
    let cssFiles =[];
    function findJsonFile(path) {
      let files = fs.readdirSync(path);
      files.forEach(function (item, index) {
        let fPath = join(path, item);
        let stat = fs.statSync(fPath);
        if (stat.isDirectory() === true) {
          findJsonFile(fPath);
        }
        if (stat.isFile() === true&& matchReg.test(fPath) ) {
            cssFiles.push(fPath);
        }
      });
    }
     findJsonFile(jsonPath);
     return cssFiles;
  }

  const writeCssToFile=(filePath) =>{
    setTimeout(function(){
      try{
        let result= sass.renderSync({
          file:filePath
       });
       result=uglifycss.processString(result.css.toString());
       var oldData=cache.get(filePath);
       const d=`import {css} from 'lit-element';\nexport default css\`${result}\`; `;
       if(oldData==undefined||oldData!=d){
         fs.writeFile(filePath+'.ts',d, function(err){
           if(!err){
             console.log(`write css to ${filePath+'.ts'} success `);
           }else{
             console.warn(`write css to ${filePath+'.ts'} fail `)
           }
         });
       }
      }catch(ex){
        console.error(ex);
      }
    },100);

  };


  const cssFiles=getCssFiles(dir);
  cssFiles.forEach( (filePath) =>{
    if(!isFileExisted(filePath+".ts")){
        writeCssToFile(filePath);
    }
  });



// One-liner for current directory
chokidar.watch(dir,{
    ignored:/\.[tj]s$/
}).on('change', (path) => {
    if(matchReg.test(path)){
        writeCssToFile(path);
    }
}).on('unlink', (filepath) => {
   fs.unlink(filepath+'.ts',(error)=>{
     if(!error){
      console.log('delete file  success ');
     }
    
   });
});