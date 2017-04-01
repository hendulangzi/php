<?php

use Workerman\Worker;
use Workerman\Lib\Timer;
require_once __DIR__ . '/Workerman/Autoloader.php';

// 创建一个Worker监听2346端口，使用websocket协议通讯
$evnt = new Event();
$worker = new Worker("websocket://0.0.0.0:8000");
$evnt->init($worker);
//$worker2 = new Worker("websocket://0.0.0.0:3000");
//$evnt->init($worker3);

// 运行worker
Worker::runAll();


