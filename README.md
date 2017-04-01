# php
# workman 实现的websocket项目
## workman中提示：Waring: Events::onMessage is not callable
  * 解决办法：
  
  * 1、找到public $eventHandler = 'Event';比如目录为：GatewayWorker/BusinessWorker.php，把Event修改为Events
  
  * 2、修改：Applications/xxx/Event.php 文件，改为Events.php ,同时修改文件中的classname: Event=>Events
  
# [安装方法](http://www.workerman.net/install)
