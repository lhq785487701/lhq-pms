
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var hard= context.newDataStore("hard");
	hard.$queryUrl = "/api/common/selectList";
	hard.statement = "SDP-Hard-003";//项目	
	var page = hard.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				data_sort : '',//选择月份
				problem_name : '',//名字匹配查询
				user_id : '',//用户的id
				create_user:''//创建人
			},
			page : page,
			datas:[],
			datas3:[],
			user : {},//用户信息
		}
	};

	var methods_page = page_conf.methods = {};
	
	// 组件创建
	methods_page.create= function() {
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
			/*	g.queryDatas();*/
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryHard();
		}
	};
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryHard();
		}
	};
	/*查询所有疑难信息*/
	methods_page.queryHard = function(){
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		hard.doQuery(function(data) {
			layer.close(loading);
			g.updatehardDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};	
	
	// 设置数据
	methods_page.updatehardDatas = function() {
		debugger;
		var vs = hard.$rowSet.$views;
		if (vs.length == 0) {
			this.datas3.splice(0, this.datas3.length);
		} else {
			this.datas3 = vs;
		}
	};
	
	// 查看疑难数据
	methods_page.queryRow = function(problem_id) {
		var url="hardDetail.html?uuid="+problem_id;
		if(this.params.data_sort != null &&this.params.data_sort != ''){
			url=url+'&dataSort='+this.params.data_sort;
		}
		if(this.params.problem_name != null&&this.params.problem_name != ''){
			url=url+'&problem_name='+this.params.problem_name;
		}
		console.log(url);
		window.location.href=url;
	};
	// 查看文章长度
	methods_page.noteLength = function(text) {
		if( text != null && text.length > 183){          /* 一行大概60个字,5行302*/
			return true;
		}
			return false;
	};
	// 点击创建疑难笔记
	methods_page.createNote = function() {
		window.location.href="createHard.html";
	};
	// 编辑笔记数据
	methods_page.editRow = function(row) {
			window.location.href="createHard.html?uuid=" + row.problem_id; 
		};
	//去除html标签
	methods_page.delHtmlTag = function(str) {
		debugger;
		return str.replace(/<[^>]+>/g, "");
	}
	// 删除笔记数据
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除[' + row.problem_name + ']', {
			btn : ['是','否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-Hard-011',
				params : {
					problem_id : row.problem_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryHard();
				layer.msg("成功删除");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};

	//模糊查询
	methods_page.searchByNoteName = function(){
	/*	this.page.setPageNumber(1);*/
		this.queryHard();
	}
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			/*this.created();*/
			this.queryHard();
			this.create();
		});	
	};
	var pageVue = new Vue(page_conf);

});