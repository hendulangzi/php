# php

#apache 解决跨域问题 在httpd.conf下，"\<Directory\>"中

    Header always set Access-Control-Allow-Origin "*"
	  Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
	  Header always set Access-Control-Max-Age "1000"
	  Header always set Access-Control-Allow-Headers "authorization"

# 第二种
	Header always set Access-Control-Allow-Origin "*"
	Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
	Header always set Access-Control-Max-Age "1000"
	Header always set Access-Control-Allow-Headers "x-requested-with, Content-Type, origin, authorization, accept, client-security-token"

# 'URL_MODEL'	=>	2, // 如果你的环境不支持PATHINFO 请设置为3

# php curl 下载https图片
	$url = "http://www.thinkphp.cn/Public/new/img/header_logo.png";
	$filename = '../uploads/'.rand(1,99).'.gif';
	$ch = curl_init($url);
	$fp = fopen($filename, "wb");
	curl_setopt($ch, CURLOPT_FILE, $fp);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, false);
	$res=curl_exec($ch);
	curl_close($ch);
	fclose($fp);
	return $res;

#  php 5.6安装
 http://blog.csdn.net/zhaozuosui/article/details/48394409
 
# 通过ip获取所属城市，获取用户所在城市
 https://www.cnblogs.com/ginowang42/p/7127569.html

# phpstrom-激活方法
jetbrains-agent.rar

# 判断是否是节假日
	 public function get_type_by_date(){
	    $today = date('Ymd');//工作日为0，休息日1，节假日2
	    if (cache($today) !== false) {
	        return cache($today);
	    } else {
	        $api1 = file_get_contents('https://tool.bitefu.net/jiari/?d='.$today);
	        var_dump($api1,11);exit;
	        if (is_numeric($api1)) {
	            cache($today, $api1, 86400);
	            return cache($today);
	        } else {
	            $api2 = json_decode(file_get_contents('https://www.easybots.cn/api/holiday.php?d='.$today));
	            if (is_numeric($api2)) {
	                cache($today, $api2->$today, 86400);
	                return cache($today);
	            } else {
	                return -1;
	            }
	        }
	    }
	}
	
	
 # 汉子转拼音 
  * https://www.cnblogs.com/xielong/p/8652789.html

 # mysql 触发器
 	* CREATE TRIGGER `rel` AFTER UPDATE ON `user` FOR EACH ROW begin
	* INSERT INTO userlog(b_money,aft_money,uid) values(old.account,new.account,old.id);
	* END;

 # php 加密工具
  * http://dezend.qiling.org/encrypt/  测试可用
