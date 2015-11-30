angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("player.html","<div class=\"player\">\r\n  <audio></audio>\r\n  <div class=\"button\" ng-if=\"!playing\" ng-click=\"play()\"><i class=\"material-icons\">play_arrow</i></div>\r\n  <div class=\"button pressed\" ng-if=\"playing\"><i class=\"material-icons\">play_arrow</i></div>\r\n  <div class=\"button\" ng-click=\"stop()\"><i class=\"material-icons\">stop</i></div>\r\n  <div class=\"button\" ng-click=\"pause()\"><i class=\"material-icons\">pause</i></div>\r\n</div>\r\n");
$templateCache.put("song.html","<div class=\"delete\" ng-click=\"delete(); $event.stopPropagation()\"><i class=\"material-icons\">delete</i></div>\r\n<div class=\"title\">\r\n  {{song.meta.title}}\r\n</div>\r\n\r\n<div class=\"datas\">\r\n  <div><span>Album:</span> {{song.meta.album}}</div>\r\n</div>\r\n");
$templateCache.put("songs.html","<h1>Zenelejátszó</h1>\r\n<a href=\"/#/upload\">Feltöltés</a>\r\n<div class=\"songs\">\r\n  <div ng-class=\"{song:true, current:song.current}\" ng-click=\"select(song)\" ng-repeat=\"song in songs\" song=\"song\" on-delete=\"delete(song)\"></div>\r\n</div>\r\n<player></player>\r\n");
$templateCache.put("upload.html","<div>\r\n  <a href=\"/#/\">Lejátszó</a>\r\n  <h1>Upload files here</h1>\r\n  <div class=\"button\" ngf-select=\"upload($files)\" multiple=\"multiple\">Upload on file select</div>\r\n  <h2>Selected files</h2>\r\n  <ul>\r\n    <li ng-repeat=\"file in files\">\r\n      {{file.name}} - {{file.type}}\r\n      <span ng-if=\"file.error\"> - {{file.error}}</span>\r\n    </li>\r\n  </ul>\r\n  <div ng-if=\"process\">\r\n    {{process}}%\r\n  </div>\r\n  <div ng-if=\"success\">\r\n    <div ng-if=\"error\">\r\n      Hiba történt a feltöltés során\r\n    </div>\r\n    <div ng-if=\"!error\">\r\n      A feltöltés sikerült\r\n    </div>\r\n  </div>\r\n</div>\r\n");}]);