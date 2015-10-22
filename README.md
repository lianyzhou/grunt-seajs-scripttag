# grunt-seajs-scripttag

> include &lt;script&gt; tag into template , in order to import splited files by grunt-antrol-concat

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-seajs-scripttag --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-seajs-scripttag');
```

## The "scripttag" task

### Overview
In your project's Gruntfile, add a section named `scripttag` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  scripttag: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.regex

Type: `String`|`RegExp`
Default value: `"App\\.loadPageScript\\(['\"](.*?)['\"]\\)"`

Find path of seajs.use('xxx') by regex expression.

You can specify String(will be turned into RegExp by new RegExp) or RegExp


#### options.index

Type: `Number`
Default value: `1`

Find the path group of regex expression.

For example , if the regex is `"App\\.loadPageScript\\(['\"](.*?)['\"]\\)"`,then 1 will be the path group

#### options.pathPre

Type: `String`
Default value: `'/resources/scripts/'`

if seajs.use('`page/home/search`') , the &lt;script&gt; 's attribute will be `/resources/scripts/page/home/search` , then pathPre is `/resources/scripts/`

#### options.scriptDir

Type: `String`

The directory of the script files , use the directory to find maximum number of the splited files.


#### options.version
Default value: `'?version={{=it.version}}'`

Type: `String|Function`

you can specify the version of the script file.

if type is function , it will be the return value of the function

#### options.exclude
Default value: `'/async/'`

Type: `String`

you can specify the string to exclude import script tag , if the path is page/async/invite , and exclude is /async/ , it will skip this path.




### Usage Examples

```js
grunt.initConfig({
    scripttag : {
      dest : {
          options:{
              regex : "App\\.loadPageScript\\(['\"](.*?)['\"]\\)",
              index : 1,
              pathPre:"/resources/scripts/",
              scriptDir : path.resolve(__dirname , "dist/scripts"),
              version : "?ver={{=it.version}}",
              exclude : "/async/"
          },
          files : [{
              cwd : '<%= yeoman.views %>',
              src : ['**/*.dot'],
              expand : true,
              dest : '<%= yeoman.dist %>/views'
          }]
      }
    }
})
```



**October 5st, 2015** `0.1.2`

First Release Version.
