<?php

use Workerman\Worker;
use Workerman\Lib\Timer;
require_once __DIR__ . '/Workerman/Autoloader.php';

// 创建一个Worker监听2346端口，使用websocket协议通讯
$worker = new Worker("websocket://0.0.0.0:8000");

// 启动4个进程对外提供服务
$worker->count = 4;
$worker->uidConnections = array();
$worker->sendUser = array();//机器人已经发言用户
// 心跳间隔25秒
define('HEARTBEAT_TIME', 60*30);
$worker->onConnect = function($connection){
	$connection->onWebSocketConnect = function($connection , $http_header)
	{
		// 可以在这里判断连接来源是否合法，不合法就关掉连接
		// $_SERVER['HTTP_ORIGIN']标识来自哪个站点的页面发起的websocket链接
		$domain = include __DIR__ . '/domain.php';
		if(!in_array($_SERVER['HTTP_ORIGIN'], $domain)){
			echo 'close';
			$connection->close();
		}
		// onWebSocketConnect 里面$_GET $_SERVER是可用的
		// var_dump($_SERVER['HTTP_ORIGIN']);
	};
};

// 当收到客户端发来的数据后返回hello $data给客户端
$worker->onMessage = function($connection, $data)
{
	global $worker;
	// 给connection临时设置一个lastMessageTime属性，用来记录上次收到消息的时间
	$connection->lastMessageTime = time();
    // 向客户端发送$data
	$obj = explode('|',$data);
	$msg_type = explode('=',$obj[0])[0];
	switch($msg_type){
		case 'SendMsg':
			$toChatId = explode('=',$obj[0])[2];
			$personal = $obj[1];
			$style = $obj[2];
			$chatId = $obj[4];
			$txt = $obj[3];
			$sendInfo = array(
					'type'=>'UMsg',
					'stat'=>'OK',
					'UMsg'=>array(
					'ChatId'=>$chatId,
					'ToChatId'=>$toChatId,
					'IsPersonal'=>$personal,
					'Txt'=>$txt,
					'Style'=>$style
			));
			break;
		case 'Login':
			$roomid = explode('=',$obj[0])[2];
			$chatid = $obj[1];
			$nick = $obj[2];
			$sex = $obj[3];
			$age = $obj[4];
			$qx = $obj[5];
			$ip = $obj[6];
			$vip = $obj[7];
			$color = $obj[8];
			$cam = $obj[9];
			$state = $obj[10];
			$mood = $obj[11];
//			curchatid = chatid;

			$user = array(
					'chatid'=>$chatid,
					'nick'=>$nick,
					'sex'=>$sex,
					'age'=>$age,
					'qx'=>$qx,
					'ip'=>$ip,
					'vip'=>$vip,
					'color'=>$color,
					'cam'=>$cam,
					'state'=>$state,
					'mood'=>$mood,
					'roomid'=>$roomid
			 );
			$sendInfo = array(
					'type'=>'Ulogin',
					'stat'=>'OK',
					'Ulogin'=>$user
			);

			// 判断当前客户端是否已经验证,即是否设置了 chatid
			if(!array_key_exists($chatid,$worker->uidConnections)){
				$connection->chatid = $user;
				/* 保存chatid到connection的映射，这样可以方便的通过chatid查找connection，
                 */
				$worker->uidConnections[$chatid] = $connection;
				echo 'login success, your uid is ' . $chatid.'--------';
			}
			break;
		case 'onlineUser':
			###################显示历史用户 begin ################################
			$roomListUser = array();
			foreach($worker->uidConnections as $connection)
			{
				array_push($roomListUser,$connection->chatid);
			}
			$sendInfo = array(
					'type'=>'UonlineUser',
					'stat'=>'OK',
					'roomListUser'=>$roomListUser
			);
			echo '????'.json_encode($sendInfo).'????';
			###################显示历史用户 end ################################
			break;
		case 'Logout':
			$chatid = $obj[1];
			$nick = $obj[2];
			$sendInfo = array(
					'type'=>'Ulogout',
					'stat'=>'OK',
					'Ulogout'=>array(
					'chatid'=>$chatid,
					'nick'=>$nick
					));
			break;
		case 'SPing':

			break;
		case 'Sysmsg':

			break;
		case 'error':

			break;
		default:
			echo '其他类型';
			break;
	}
	broadcast(json_encode($sendInfo));
};
// 向所有验证的用户推送数据
function broadcast($message)
{
	global $worker;
	foreach($worker->uidConnections as $connection)
	{
		$connection->send($message);
	}
}

// 针对uid推送数据
function sendMessageByUid($chatid, $message)
{
	global $worker;
	if(isset($worker->uidConnections[$chatid]))
	{
		$connection = $worker->uidConnections[$chatid];
		$connection->send($message);
	}
}

// 当有客户端连接断开时
$worker->onClose = function($connection)
{
	global $worker;
	if(isset($connection->chatid))
	{
		$user = $connection->chatid;
		// 连接断开时删除映射
		unset($worker->uidConnections[$user['chatid']]);
		$chatid = $user['chatid'];
		$nick = $user['nick'];
		$sendInfo = array(
				'type'=>'Ulogout',
				'stat'=>'OK',
				'Ulogout'=>array(
						'chatid'=>$chatid,
						'nick'=>$nick
				));
		$connection->send(json_encode($sendInfo));
		echo 'login out';
	}
};

// 进程启动后设置一个每秒运行一次的定时器
$worker->onWorkerStart = function($worker) {
	Timer::add(1, function()use($worker){
		$time_now = time();
		foreach($worker->uidConnections as $connection) {
			// 有可能该connection还没收到过消息，则lastMessageTime设置为当前时间
			if (empty($connection->lastMessageTime)) {
				$connection->lastMessageTime = $time_now;
				continue;
			}
			$user = $connection->chatid;
			// 上次通讯时间间隔大于心跳间隔，则认为客户端已经下线，关闭连接
			if ($time_now - $connection->lastMessageTime > HEARTBEAT_TIME) {
//				// 连接断开时删除映射
				unset($worker->uidConnections[$user['chatid']]);
				$connection->close();
			}else{
				$url = 'http://www.jrkz.net/ajax.php?act=auto_speak&rid='.$user['roomid'];
				$html = file_get_contents($url);
				if($html!='""'){
					$sendInfo = array(
							'type'=>'auto_speak',
							'stat'=>'OK',
							'data'=>$html
					);
					$rtn_html = json_decode($html);
					$msgdate = strtotime($rtn_html->msgdate);//定时发送要求时间
					$sendUser = $worker->sendUser;
					if(!array_key_exists($user['chatid'],$sendUser)){
						$worker->sendUser[$user['chatid']] = array('time'=>$rtn_html->msgdate);
						$connection->send(json_encode($sendInfo));
					}else if(strtotime($sendUser[$user['chatid']]['time'])!=$msgdate){
						$worker->sendUser[$user['chatid']] = array('time'=>$rtn_html->msgdate);
						$connection->send(json_encode($sendInfo));
					}
				}
			}
		}
	});
};

// 运行worker
Worker::runAll();


