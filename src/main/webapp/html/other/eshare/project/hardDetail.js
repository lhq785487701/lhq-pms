"use strict";
$(function(){
	//数据字典
	var dicConf = ['sdp_esp_hardDetail'];
	//上下文
	var context = new SDP.SDPContext();
	//角色数据
	var hardDetail = context.newDataStore("hardDetail");
	hardDetail.$keyField = "problem_id";
	hardDetail.$queryUrl = "/api/common/selectList";
	hardDetail.statement = "SDP-Hard-006"; //查看疑难信息详情

	var upAndDown = context.newDataStore("upAndDown");
	upAndDown.$keyField = "problem_id";
	upAndDown.$queryUrl = "/api/common/selectList";
	upAndDown.statement = "SDP-Hard-005"//疑难信息上下篇
		
	
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				user_id : '',//用户的id
			    problem_id :'',//文章id
				action: '', //不同页面进来 笔记的上下篇不同
			},
			
			datas:[],//文章数据集
			datasUpAndDown: [], //上下篇
			datasNoteTags: [], //标签
			user : {},//用户信息
			textarea:'',
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();//动画加载,2, {time: 3*1000}
		hardDetail.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		/*	g.queryNoteTags(); //查询文章相关标签
*/			g.queryUpAndDown(); //查询文章上下篇
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置数据
	methods_page.updateDatas = function() {
		debugger;
		var vs = hardDetail.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
			this.params.problem_id=this.datas[0].problem_id;
			this.collectNum=this.datas[0].note_collect;
		}
	};
	// 连接项目详情
	methods_page.queryRow = function(proj_code) {
		window.location.href="projInformation.html?proj_code="+proj_code;
	}
	//设置标签
	methods_page.updateNoteTags = function(){
		var vs = noteTags.$rowSet.$views;
		if (vs.length == 0) {
			this.datasNoteTags .splice(0, this.datasNoteTags.length);
		} else {
			this.datasNoteTags = vs;
		}
	}
	
	//文章上下篇查询
	methods_page.queryUpAndDown = function(){
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		upAndDown.doQuery(function(data) {
			g.updateUpAndDown();
		}, function(data) {
			layer.alert(data.msg);
		});
	}
	//设置上下篇的数据
	methods_page.updateUpAndDown = function(){
		debugger;
		var vs = upAndDown.$rowSet.$views;
		if (vs.length == 0) {
			this.datasUpAndDown.splice(0, this.upAndDown.length);
		} else {
			this.datasUpAndDown = vs;
		}
	}

	// 删除文章数据
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除[' + row.note_title + ']', {
			btn : ['是','否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTE-003',
				params : {
					problem_id : row.problem_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.msg("成功删除");
				window.location.href="../note/myNote.html";
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	//上下篇跳转
	 methods_page.redirect = function(id){
		 window.location.href="hardDetail.html?uuid="+ id + "&action=" + this.params.action;
	 }
	//获取用户信息
	methods_page.getUserInfo= function() {
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
				g.params.user_id=SDP.loginUser.userId;
				g.getReferUrl();
				g.queryDatas();//查询文章数据
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	//判断由哪个页面跳转到当前页面，便于获取不同的上下篇
	methods_page.getReferUrl = function(){
		var g = this;
		let url = document.referrer;
		if(url==''||url==null){
			return false;
		}
		debugger;
		var action = getUrlParam("action");
		if(!(action == null || action == '')){			
			g.params.action = action;
			return false;
		}else{
			if(url.indexOf("proHard")!= -1 || url.indexOf('createHard') != -1){
				g.params.action = "proHard";
			}
		}
		
	}
	

	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.params.problem_id=getUrlParam("uuid");
			this.getUserInfo();
		});	
	};
	
	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	
	//解析url参数
	function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r!=null) 
			return unescape(r[2]); 
		return null; 
	}
})