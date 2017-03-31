var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<h1>Welcome Realtime Server</h1>');
});

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;
//当前允许访问的域名
var doMains = {};
doMains['http://www.zb3.com'] = 1;
doMains['http://www.jrkz.net'] = 1;
//当前操作用户
var curchatid = '';
//在线房间
var roomIds = {};
function domainAuth(socket){
    var curdomain = socket.handshake.headers.origin;
    if(curdomain==''||curdomain==undefined||curdomain=='undefined'){
        console.log(curdomain+'此域名已经授权')
        return true;
    }else if(!doMains.hasOwnProperty(curdomain)) {
        console.log(curdomain+'此域名没有授权');
        var sendInfo = {type:'Sysmsg',stat:'OK',Sysmsg:{txt:'此域名没有授权'}};
        sendInfo = JSON.stringify(sendInfo);
        io.emit('message', sendInfo);
        return false;
    }else{
        console.log(curdomain+'此域名已经授权')
        return true;
    };
}

function createRoom(socket,chatId){
    if(!onlineUsers[chatId]||!onlineUsers[chatId].hasOwnProperty('roomid')){
        return '';
    }
    var roomid = onlineUsers[chatId].roomid.split('/')[1];
    if(!roomIds.hasOwnProperty(chatId)){
        if(!roomIds[roomid]){
            roomIds[roomid] = [];
        }
        if(roomIds[roomid].length<1){
            roomIds[roomid].push(chatId);
        }
        var in_flag = false;
        for(var i in roomIds[roomid]){
            if(roomIds[roomid][i]==chatId){
                in_flag = true;
            }
        }
        if(!in_flag){
            roomIds[roomid].push(chatId);
        }
        //console.log(roomIds[roomid]);
        socket.join(roomid);//leave:离开
        console.log('加入人员ID'+chatId);
    }
    return roomid;
}

io.on('connection', function(socket){
    /*		socket.on('auto_speak', function(obj){
     var request = require('request');
     request('http://www.jrkz.net/ajax.php?act=auto_speak&rid='+obj.rid, function (error, response, body) {
     if (!error && response.statusCode == 200) {
     io.emit('auto_speak', body);
     //console.log(body); // Print the google web page.
     //console.log(obj.rid); // Print the google web page.
     }
     });
     */			});


if(!domainAuth(socket)){
    return;
}
//监听新用户加入
socket.on('login', function(obj){
    console.log(obj.nick+'加入了聊天室');
    //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
    socket.name = obj.userid;

    //检查在线列表，如果不在里面就加入
    if(!onlineUsers.hasOwnProperty(obj.userid)) {
        onlineUsers[obj.userid] = obj.username;
        //在线人数+1
        onlineCount++;
    }

    //向所有客户端广播用户加入
    //io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
    io.emit('onlineUser', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
});

//监听用户退出(非正常退出的操作，此方法待开发)
socket.on('disconnect', function(obj){
    //console.log(obj);
    //将退出的用户从在线列表中删除
    if(onlineUsers.hasOwnProperty(socket.name)) {
        //退出用户的信息
        var obj = {userid:socket.name, username:onlineUsers[socket.name]};

        //删除
        delete onlineUsers[socket.name];
        //在线人数-1
        onlineCount--;

        //向所有客户端广播用户退出
        io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
        console.log(obj.username+'退出了聊天室');
    }
});
//监听用户统计
socket.on('onlineUser', function(){
    console.log(obj+'onlineUser_socket init');
});

//监听用户发布聊天内容
socket.on('message', function(obj){
    //向所有客户端广播发布的消息
    //向客户端发送信息
    console.log('sendinfo：'+obj);
    //socket.send('======================');

    var msg_type = obj.split('|')[0].split('=')[0];
    console.log(msg_type);
    //发送消息
    if(msg_type=='SendMsg'){
        console.log(obj);
        var toChatId = obj.split('|')[0].split('=')[2];
        var personal = obj.split('|')[1];
        var style = obj.split('|')[2];
        var chatId = obj.split('|')[4];
        var txt = obj.split('|')[3];
        curchatid = chatId;
        var sendInfo = {type:'UMsg',stat:'OK',UMsg:{ChatId:chatId,ToChatId:toChatId,IsPersonal:personal,Txt:txt,Style:style}};
        sendInfo = JSON.stringify(sendInfo);
    }else if(msg_type=='Login'){//登录
        var roomid = obj.split('|')[0];
        var chatid = obj.split('|')[1];
        var nick = obj.split('|')[2];
        var sex = obj.split('|')[3];
        var age = obj.split('|')[4];
        var qx = obj.split('|')[5];
        var ip = obj.split('|')[6];
        var vip = obj.split('|')[7];
        var color = obj.split('|')[8];
        var cam = obj.split('|')[9];
        var state = obj.split('|')[10];
        var mood = obj.split('|')[11];
        curchatid = chatid;
        //如果之前登录过，就退出登录begin(将退出的用户从在线列表中删除)
        if(onlineUsers.hasOwnProperty(chatid)) {
            //删除
            delete onlineUsers[chatid];
            //在线人数-1
            onlineCount--;

            //向所有客户端广播用户退出
            var sendInfo = {type:'Ulogout',stat:'OK',Ulogout:{chatid:chatid,nick:nick}};
            sendInfo = JSON.stringify(sendInfo);
            io.emit('message', sendInfo);
            //提示
            var logoutInfo = {stat:'OtherLogin',Ulogout:{chatid:chatid,nick:nick}};
            logoutInfo = JSON.stringify(logoutInfo);
            io.emit('message', logoutInfo);
            console.log(nick+'在其他地方已经登录过，不能重复登录');
            console.log('在线人数：'+onlineCount);
            //return;
        }
        //如果之前登录过，就退出登录 end

        var user = {chatid:chatid,nick:nick,sex:sex,age:age,qx:qx,ip:ip,vip:vip,color:color,cam:cam,state:state,mood:mood,roomid:roomid};
        var sendInfo = {type:'Ulogin',stat:'OK',Ulogin:user};
        sendInfo = JSON.stringify(sendInfo);
        //历史登录人员信息
        //检查在线列表，如果不在里面就加入
        if(!onlineUsers.hasOwnProperty(chatid)) {
            onlineUsers[chatid] = user;
            //在线人数+1
            onlineCount++;
            console.log('在线人数：'+onlineCount);
        }
        for(var idx=0 in onlineUsers){
            var sendInfo = {type:'Ulogin',stat:'OK',Ulogin:onlineUsers[idx]};
            sendInfo = JSON.stringify(sendInfo);
            io.emit('message',sendInfo);
            //console.log(onlineUsers[idx]);
        }
        console.log('在线人数：'+onlineCount);

    }else if(msg_type=='onlineUser'){//统计在线人数
        console.log('onlineuser:'.sendInfo);
    }else if(msg_type=='Logout'){//退出
        var chatid = obj.split('|')[1];
        var nick = obj.split('|')[2];
        curchatid = chatid;
        var sendInfo = {type:'Ulogout',stat:'OK',Ulogout:{chatid:chatid,nick:nick}};
        sendInfo = JSON.stringify(sendInfo);
        //将退出的用户从在线列表中删除
        if(onlineUsers.hasOwnProperty(chatid)) {
            // 从房间名单中移除
            var roomID = onlineUsers[chatid].roomid.split('/')[1];
            console.log('roomID='+roomID);
            var index = roomIds[roomID].indexOf(chatid);
            console.log('index='+index);
            roomIds[roomID].splice(index,1);
            console.log(chatid+'移除房间'+roomID);

            console.log(nick+'退出了聊天室');
            //删除
            delete onlineUsers[chatid];
            //在线人数-1
            onlineCount--;

            //向所有客户端广播用户退出
            io.emit('message', sendInfo);
            console.log(nick+'退出了聊天室');
        }
    }else if(msg_type=='SPing'){
        console.log('sping');
    }else if(msg_type='Sysmsg'){
        console.log('sysmsg');
    }else if(msg_type=='error'){
        console.log('error');
    }else{
        console.log('outher');
        sendInfo = 'outher';
    }
    //2016-09-21
    //socket.send(sendInfo);
    var roomId = createRoom(socket,curchatid);
    //	console.log(roomId);
//		io.emit('message', sendInfo);
    //io.sockets.in(roomId).emit('message',sendInfo);
    //
    //if(roomId!=''){
    console.log('msg-======='+sendInfo);
    io.in(roomId).emit('message',sendInfo);
    //}
});
socket.on('error', function(){
    console.log('error function');
});

});


http.listen(8000, function(){
    console.log('listening on *:'+8000);
});

