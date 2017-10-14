# php
# workman 实现的websocket项目
## workman中提示：Waring: Events::onMessage is not callable
  * 解决办法：
  
  * 1、找到public $eventHandler = 'Event';比如目录为：GatewayWorker/BusinessWorker.php，把Event修改为Events
  
  * 2、修改：Applications/xxx/Event.php 文件，改为Events.php ,同时修改文件中的classname: Event=>Events
  
# [安装方法](http://www.workerman.net/install)
  1、命令行运行yum install php-cli php-process git gcc php-devel php-pear libevent-devel -y

  2、命令行运行pecl install event注意提示：Include libevent OpenSSL support [yes] : 时输入no回车，其它直接敲回车就行

  3、命令行运行echo extension=event.so > /etc/php.d/event.ini

  4、命令行运行git clone https://github.com/walkor/Workerman

  5、参考手册写例子运行或者从主页下载demo运行
  
  workman 安装：http://www.workerman.net/install
