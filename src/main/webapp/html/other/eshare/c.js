
"use strict";
$(function(){
	var context = new SDP.SDPContext();	//得到context对象
	var menus = null; //菜单
	var dataMenus = {};// 菜单数据
	var note = context.newDataStore("note");//datastore对象
	var page = note.getPage();//得到page分页对象，分页操作
	page.setPageNumber(1);//初始化
	page.setPageRowCount(5);
	
	note.$queryUrl = "/api/common/selectList";
	note.statement = "SDP-INDEX-001";//查看所有的笔记
	
	
	//热点技术
	var esp_h=context.newDataStore("esp_h");
	/*esp_h.$keyField = "esp_hot_code";*/
	esp_h.$queryUrl="/api/common/selectList";
	esp_h.statement="SDP-INDEX-002" //
		
	//标签
	var esp_tags=context.newDataStore("esp_tags");
	esp_tags.$keyField="tags_id";
	esp_tags.$queryUrl="/api/common/selectList";
	esp_tags.statement="SDP-INDEX-003";
	
	//大神
	var persons=context.newDataStore("persons");
	persons.$keyField="resume_id";
	persons.$queryUrl="/api/common/selectList";
	persons.statement="SDP-INDEX-004";
	
	
	
	// 头部配置
	var page_conf = {
		el : "#mc",
		data : {
			modal1: false,
			errorTip : "",
			loading : false,
			value2:0,
			datas:[],
			user:{},
			itemsList:[],
			tagList:[],
			page:page,
			personList:[],
			curSystem : {},
			sysMenus : null,
			menus : null,
			curMenu : ""
		}
	};
	
	var methods_page = page_conf.methods = {};
  	
	//查询菜单
	methods_page.queryMenu = function() {
		var g = this;
		var url = "/api/menu/queryUserMenus?t=" + new Date().getTime();
		context.doAction({}, url, function(data) {
			if (data.data != null && data.data.length > 0) {
				menus = data.data;
				g.curSystem = menus[1];
				console.log(g.curSystem);
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
	
	
	
	
	//page
	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryDatas('ischangeSize');
		}
	};
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas('ischangeSize');
		}
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
				g.queryDatas();
				g.queryMenu();
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
 
	//加载笔记
	methods_page.queryDatas = function(action) {
		context.clearParam();//清空参数列表
		var g = this;
		note.doQuery(function(data){
			g.updateDatas();
			if(action == 'ischangeSize'){
				var size = data.dataStore.rows.length;
				iframeHeight(size);
			}
		},function(data){
			layer.alert(data.msg);
		});
	};
	methods_page.updateDatas = function() {
		var vs = note.$rowSet.$views;
		this.datas=vs;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	//菜单
	methods_page.menuSelect = function(id){
		/*window.location.href="/html/note_plan/note/myNote.html";*/
	}
	
	//热点技术
	methods_page.queryItemsDatas = function() {
		context.clearParam();//清空参数列表
		var g = this;
		esp_h.doQuery(function(data){
			g.updateItemsDatas();
		},function(data){
			layer.alert(data.msg);
		});
	};
	methods_page.updateItemsDatas = function(){
		var vs = esp_h.$rowSet.$views;
		this.itemsList=vs;
		if (vs.length == 0) {
			this.itemsList.splice(0, this.datas.length);
		} else {
			this.itemsList = vs;
		}
	}
	
	//大神推荐
	methods_page.queryPersons = function() {
		context.clearParam();//清空参数列表
		var g = this;
		persons.doQuery(function(data){
			g.updatePersons();
		},function(data){
			layer.alert(data.msg);
		});
	};
	methods_page.updatePersons = function(){
		var vs = persons.$rowSet.$views;
		this.personList=vs;
		if (vs.length == 0) {
			this.personList.splice(0, this.datas.length);
		} else {
			this.personList = vs;
		}
	}
	//changeLimit
	methods_page.changeLimit = function(){
		this.$nextTick(function(){
			this.created();
			this.queryItemsDatas();
			this.queryPersons();
			this.queryTagsDatas();
		});	
	}
	//查看
	methods_page.queryP = function(id){
		window.location.href="professionPlan/goddetail.html?resume_id="+id;
	}
	
	
	
	//文章标签
	methods_page.queryTagsDatas = function() {
		context.clearParam();//清空参数列表
		var g = this;
		esp_tags.doQuery(function(data){
			g.updateTagsDatas();
		},function(data){
			layer.alert(data.msg);
		});
	};
	methods_page.updateTagsDatas = function(){
		var vs = esp_tags.$rowSet.$views;
		this.tagList=vs;
		if (vs.length == 0) {
			this.tagList.splice(0, this.datas.length);
		} else {
			this.tagList = vs;
		}
	}
	
	

	
	//查看笔记详细
	methods_page.queryNote = function(note_id) {
		var url="note_plan/noteDetail/noteDetail.html?uuid="+note_id;
		window.location.href=url;
	};
	
	//热门技术标签选中
	methods_page.selectHotTags = function(){
		window.location.href='#';
	}
	
	//选择标签(笔记标签字段)
	methods_page.selectTags = function(obj){
		alert(obj);
	}
	//回首页
	methods_page.ToIndex = function(){
		window.location.href='b.html';
	}
	
	// 初始化
	page_conf.mounted = function() {
		//查询首页数据
		this.$nextTick(function(){
			this.created();
			this.queryItemsDatas();
			this.queryPersons();
			this.queryTagsDatas();
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
		window.location.href = "/server-esp-cv/html/myCenter/myCenter.html";
	};

	methods_page.loginout = function() {
		var tindex = layer.confirm('是否退出系统', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
				layer.close(loading);
				window.location.href = "../a.html";
			
		});
	};
	
	/*methods_page.iframeHeight=function(){
        // obj 这里是要获取父页面的iframe对象
            var obj = parent.document.getElementById('srcs');
        // 调整父页面的高度为此页面的高度
            obj.height = this.document.body.scrollHeight;
       };*/
	
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
	
/*	function addFavoriteUrl() {
		var url = window.location;
		var title = document.title;
		var ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf("360se") > -1) {
				alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
			}
			else if (ua.indexOf("msie 8") > -1) {
				window.external.AddToFavoritesBar(url, title); //IE8
			}
			else if (document.all) {
				try{
					window.external.addFavorite(url, title);
				}catch(e){
					alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
				}
			}
			else if (window.sidebar) {
				window.sidebar.addPanel(title, url, "");
			}
			else {
				alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
			}
	}*/
})

function iframeHeight(size){
	
             // obj 这里是要获取父页面的iframe对象
                 var obj = parent.document.getElementById('srcs');
             // 调整父页面的高度为此页面的高度
                 obj.height =1600+"px";
                 if(size != undefined){
                	 if(size <= 5){
                		 obj.height =1500+"px";
                     } else{
                    	 obj.height = ( size - 5 ) * 180 + 1500 +"px";
                     }
                 }
                
             }