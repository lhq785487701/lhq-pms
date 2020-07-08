
"use strict";
$(function(){
	
	var context = new SDP.SDPContext();	//得到context对象
	var menus = null; //菜单
	var dataMenus = {};// 菜单数据
	
	// 头部配置
	var page_conf = {
		el : "#mc",
		data : {
			modal1: false,
			errorTip : "",
			loading : false,
			value2:0,
			user:{},
			curSystem : {},
			sysMenus : null,
			menus : null,
			curMenu : ""
		}
	};
	
	 if (window.history && window.history.pushState) {
		 history.pushState(null, null, document.URL);
		    window.addEventListener('popstate', function () {
		            history.pushState(null, null, document.URL);
		    });
	 }
	
	var methods_page = page_conf.methods = {};
  	
	//查询菜单
	methods_page.queryMenu = function() {
		var g = this;
		var url = "/api/menu/queryUserMenus?t=" + new Date().getTime();
		context.doAction({}, url, function(data) {
			if (data.data != null && data.data.length > 0) {
				menus = data.data;
				g.curSystem = menus[1];
				var tmp = [].concat(menus);
				tmp.splice(0, 1);
				g.sysMenus = tmp;
				g.menus = g.curSystem['$chinldrens'];
				initMenus(menus);
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
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
				g.queryMenu();
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
 
	//菜单
	methods_page.menuSelect = function(id, name){
		var path = "/sdp" + id;
		if(name == "档案列表") {
			window.location.href=path;
		} else {
			$("#srcs").attr("src",path);
		}
	}
	
	
	// 初始化
	page_conf.mounted = function() {
		//查询首页数据
		this.$nextTick(function(){
			this.created();
		});	
	};
	
	// 登录
	methods_page.login = function() {
		var g = this;
		this.$refs['loginForm'].validate(function(valid) {
			if (valid) {
				g.loading = true;
				var request = $.ajax({
					cache : false,
					url : SDP.URL.getUrl("/user/login?userCode=")
							+ g.user.userCode + "&userPwd="
							+ hex_md5(g.user.userPwd),
					contentType : "application/json; charset=utf-8",
					method : "post",
					dataType : 'json'
				});
				request.done(function(data) {
					g.loading = false;
					if (data.code == 1) {
						window.location.href = "b.html";
					} else {
						g.errorTip = data.msg;
					}
				});

				request.fail(function(jqXHR, textStatus) {
					g.errorTip = textStatus;
					g.loading = false;
				});
			}
		});
	};
	
	//个人中心
	methods_page.toMyCenter=function(){
		//window.location.href = "/server-esp-cv/html/myCenter/myCenter.html";
		$("#srcs").attr("src","/sdp/html/myCenter/myCenter.html");

	}
	//回首页
	methods_page.ToIndex = function(){
		window.location.href='b.html';
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
	var pageVue = new Vue(page_conf);
	
	// 初始化菜单
	function initMenus(ms) {
		$.each(ms, function(index, item) {
			dataMenus[item.menu_code] = item;
			initUrl(item);
			var clds = item['$chinldrens'];
			if (clds != null && clds.length > 0) {
				initMenus(clds);
			}
		});
	}

	// 初始化地址
	function initUrl(item) {
		var url = item.menu_url;
		if (url == null || url.length <= 0) {
			return;
		}
		/*var u = "sdp_user_code=" + SDP.loginUser.userCode + "&sdp_menu_code="
				+ item.menu_code*/
		/*if (url.indexOf("?") > 0) {
			url = url + "&" + u;
		} else {
			url = url + "?" + u;
		}*/
	/*	if (item.menu_system != null && item.menu_system != '') {
			if (url.indexOf('/') == 0) {
				url = '/' + item.menu_system + url;
			} else {
				url = '/' + item.menu_system + '/' + url;
			}
		}*/
		item.menu_url = url;
	}

		
	
	
	//收藏
	function addFavoriteUrl() {
		var url = window.location;
		var title = document.title;
	    try {
	        window.external.addFavorite(url, title);
	    }
	    catch (e) {
	        try {
	            window.sidebar.addPanel(title, url, "");
	        }
	        catch (e) {
	            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加");
	        }
	    }
	}

})