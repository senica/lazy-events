let ug = require('uglify-es');
let fs = require('fs');
let code = fs.readFileSync(__dirname + '/src/lazy-events.js');
let result = ug.minify(code.toString());
if(result.error){
  throw new Error(result.error);
}
fs.writeFileSync(__dirname + '/dist/lazy-events.min.js', result.code);
