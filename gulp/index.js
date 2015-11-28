'use strict';

let fs = require('fs');
let jsFilter = require('./helper/scriptFilter');
let tasks = fs.readdirSync('./gulp/tasks/').filter(jsFilter);

tasks.forEach(function(task){
	require('./tasks/' + task);
});
