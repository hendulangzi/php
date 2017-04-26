# php

#apache 解决跨域问题 在httpd.conf下，"\<Directory\>"中

    Header always set Access-Control-Allow-Origin "*"
	  Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
	  Header always set Access-Control-Max-Age "1000"
	  Header always set Access-Control-Allow-Headers "authorization"
