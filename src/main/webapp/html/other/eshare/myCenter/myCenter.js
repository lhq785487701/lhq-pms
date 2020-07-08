"use strict";

$(function(){	
	var context = new SDP.SDPContext();	//得到context对象
	// 头部配置
	var page_conf = {
		el: "#myCenter",
		data : {
			user:{},
			src:'information.html'
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	// 组件创建
	methods_page.created= function() {
		var g = this;
		var url = "/api/user/getUserInfo?t=" + new Date().getTime();
		context.doAction({}, url, function(data) {
			if (data.data != null) {
				SDP.loginUser = data.data;
				$.each(data.data.attrs, function(index, itm) {
					for ( var n in itm) {
						SDP.loginUser[n] = itm[n];
					}
				});
				g.user = SDP.loginUser;
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	methods_page.curl = function(){
		$("#srcs").attr("src","information.html");
	}
	methods_page.curls = function(){
		$("#srcs").attr("src","pwdEdit.html");
	}
	
	//回首页
	methods_page.ToIndex = function(){
		window.location.href='../b.html';
	}
	//个人中心
	methods_page.toMyCenter=function(){
		window.location.href = "/sdp/html/myCenter/myCenter.html";
	}
	//注销
	methods_page.loginout = function() {
		var tindex = layer.confirm('是否退出系统', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
				layer.close(loading);
				window.location.href = "../a.html";
			
		});
	};
	
	// 初始化
	page_conf.mounted = function() {
		//查询首页数据
		this.$nextTick(function(){
			this.created();
		});	
	};
	
	var pageVue = new Vue(page_conf);
	
	

})
