"use strict";
$(function() {
	
	var layout = new SDP.SDPContext();
	
	var layoutData = layout.newDataStore("layoutData");
	
	var openFloors = {};// 已打开楼层
	
	var menu = document.querySelector("#menu");
	var bg = document.querySelector("#bg");
	var pMenu=document.querySelector("#pMenu");
	/*去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = function(e){
        e.preventDefault();
    };*/
    bg.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        menu.style.display = "block";
        menu.style.left = event.pageX + "px";
        menu.style.top = event.pageY + "px";
        pMenu.addEventListener("click",function () {
           alert("a");
        });
    });
    document.addEventListener("contextmenu", function (event) {
        if (event.pageX > 400 || event.pageY > 400) {
            menu.style.display = "none";
        }
    });
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			floor : [],
			floorTabs : [],
			headerName : '楼层',
			curFloor : {}
		}
	};
	
	var methods_page = page_conf.methods = {};

	// 初始化查询
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.queryLayoutData(getQueryString('level'));
		});	
	};
	
	
	//查询菜单
	methods_page.queryLayoutData = function(level) {
		var g = this;
		var loading = layer.load();
		layoutData.$queryUrl = "/api/common/selectList";
		layoutData.statement = "PMS-FINDROUTE-001";
		layoutData.set('level', level);
		layoutData.doQuery(function(data) {
			g.showLayout(data.dataStore.rows);
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	
	//生成二维图
	methods_page.showLayout = function(layoutData) {
		var bg = document.querySelector('#bg');
		for(var i = 0; i < layoutData.length; i++) {
			/*var li = document.createElement('div'); 
			if(layoutData[i].stuffing == 0) {
				li.className = 'white';
			} else if(layoutData[i].stuffing > 0) {
				li.className = 'black';
			}
			
			bg.append(li);
			li.style.top = i%40 * 10 + "px";
			li.style.left = parseInt(i/40) * 10 + "px";*/
		}
	}
	
	//获得url参数
	function getQueryString(name) {
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	
	
	
	var pageVue = new Vue(page_conf);
});
//离上面的距离和离左边的距离，计算平面图坐标
var moveTop =  parseInt($("#head1").css("height"));
var moveLeft = parseInt($("#bg").css("margin-left"));

//拖动开始
function drag(e) {
	//e.dataTransfer.setData("computer",e.target.id);
	//记录刚一拖动时，鼠标在飞机上的偏移量  
	//var offsetX= e.offsetX;  
	//var offsetY= e.offsetY;
    //console.log(offsetX + "   " + offsetY)
}
//拖动释放
function drop(e){
	e.preventDefault();
	//var data=e.dataTransfer.getData("computer");
	//e.target.appendChild(document.getElementById(data));
	var big = prompt("多大","1");
	//获得绝对位置
	var x= e.pageX;  
    var y= e.pageY;  
    var layoutX = parseInt((x-moveLeft-1)/10)+1;
    var layoutY = parseInt((y-moveTop-1)/10)+1;
    var bg = document.querySelector('#bg');
    var li = document.createElement('img');
	li.src = '../../../css/things/computer.jpg';
	li.width =  10 * big;
	li.height  = 10 * big;
	bg.append(li);
	li.style.top = (layoutY-1) * 10 + "px";
	li.style.left = (layoutX-1) * 10 + "px";
    
}
//允许释放的位置
function allowDrop(e){
	e.preventDefault();
}

//获得坐标
function getCoordinates(e) {
	//减的数量和实际的布局有关
	var x=e.clientX - moveLeft;
	var y=e.clientY - moveTop;
	if(x > 400 || y > 400 || x <=0 || y <= 0) {
		return;
	}
	//每1px的坐标
	document.getElementById("xycoordinates").innerHTML="Coordinates: (" + x + "," + y + ")";
	//sql中的坐标
	document.getElementById("layoutcoordinates").innerHTML="XYCoordinates: (" + (parseInt((x-1)/10)+1) + "," + (parseInt((y-1)/10)+1) + ")";
}
//通过滑轮改变大小
function changeImgSize(o) {
	var zoom=parseInt(o.style.zoom, 10)||100;
	zoom+=event.wheelDelta/12;
	if (zoom>0) {
		o.style.zoom=zoom+'%'; 
	}
	return false; 
}

 
//清除坐标
function clearCoordinates() {
	document.getElementById("xycoordinates").innerHTML="";
	document.getElementById("layoutcoordinates").innerHTML="";
}