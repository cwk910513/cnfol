// 添加引用
var gulp = require('gulp');
var browesrSync = require('browser-sync');
var reload = browesrSync.reload;
var nodemon = require('gulp-nodemon');

// 启动express
gulp.task('node', function() {
  console.log('启动express服务器')
  nodemon({
    // script: '',
    ext: 'js',
    enc: {
      'NODE_ENV': 'development'
    }
  })
})

/**
 * 1：npm run dev    将此命令指向用于启动gulp server
 * 2：gulp server启动后，会默认启动npm start中指定的内容
 * 3：npm start      此命令用于指向webpack-dev-conf【程序自带命令，即编译前端文件命令】
 * 顺序：（1）npm run dev -->（2）gulp-server -->（3）【关键部分，启动gulp后会默认执行并启动npm start】npm start -->（4）npm run webpack-dev-conf
 */
gulp.task('server', ['node'], function() {
  console.log('启动server')
  var file = ['./mock/*.js'];

  gulp.watch(file).on('change', reload);
})