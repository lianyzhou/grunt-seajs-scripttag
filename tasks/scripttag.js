/*
 * grunt-seajs-scripttag
 *
 * Copyright (c) 2015 lianyzhou
 */

var fs = require("fs"),
    path = require("path");

//找到拆分后文件最大的数字
function findMaxFileNum(dir , filename) {
  var result = 1;
  for(var i = 1 ; i < 100 ; i++) {
    var scriptFile = path.resolve(dir , filename + i + ".js");
    if(fs.existsSync(scriptFile)) {
      result = i;
    } else {
      break;
    }
  }
  return result;
}

//从数组指定位置开始，获取<script>标签所在的下标
function findScriptBegin(lines , beginIdx , part) {
  for(var i = beginIdx ; i >= 0 ; i--) {
    var line = lines[i].trim();
    if(part.test(line)) {
      return i;
    }
  }
  return -1;
}


module.exports = function(grunt) {

  grunt.registerMultiTask('scripttag', 'import seajs concated files by script tag.', function() {
    var options = this.options({
      regex : "App\\.loadPageScript\\(['\"](.*?)['\"]\\)",
      index : 1,
      pathPre:"/resources/scripts/",
      scriptDir : "dist/scripts"
    });
    var regex ;
    if(typeof options.regex === 'string') {
      regex = new RegExp(options.regex , "i");
    } else if(Object.prototype.toString.call(options.regex) === '[object RegExp]') {
      regex = options.regex;
    }

    var splitCount = 0;

    //对每一个文件都进行该操作
    this.files.forEach(function(f) {

        f.src.forEach(function(viewPath) {

          var lines = grunt.file.read(viewPath).split(/[\r\n]/g);

          var scriptFileList = [];

          var lineCount = 0;

          lines.forEach(function(line) {

            var ret = line.match(regex);

            if(ret) {
              var scriptPath = ret[options.index];
              var maxNum = findMaxFileNum(options.scriptDir , scriptPath);
              scriptFileList.push({
                idx : lineCount,
                scriptPath : scriptPath,
                maxNum : maxNum
              });
            }
            lineCount++;
          });

          if(scriptFileList.length) {

            splitCount++;

            var scriptBeginIdx = findScriptBegin(lines , scriptFileList[0].idx , /^<script/);

            if(scriptBeginIdx >= 0) {

              var addedLines = [];
              for(var i = 0, len = scriptFileList.length ; i < len ; i++) {
                var obj = scriptFileList[i];
                for(var j = 1, jLen = obj.maxNum ; j <= jLen ; j++) {
                    addedLines.push('<script src="' + options.pathPre + obj.scriptPath +  j + '.js"></script>');
                }
              }
              addedLines.unshift(0);
              addedLines.unshift(scriptBeginIdx);
              Array.prototype.splice.apply(lines , addedLines);
            } else {
              grunt.fail.warn("can't find <script tag of template : " + viewPath);
            }
          }

          var fileContent = lines.join('\n');
          grunt.file.write(f.dest , fileContent);

        });

    });
  });
};
