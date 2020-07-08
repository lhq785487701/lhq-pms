/**
 * 笔记管理页面脚本
 * 
 * @文件名 note
 * @作者 佘晓鑫
 * @创建日期 2017-09-30
 */
"use strict";
$(function() {
	var context = new SDP.SDPContext();	
	var noteCollect = context.newDataStore("noteCollect");
	noteCollect.$keyField = "noteCollect_id";
	var page = noteCollect.getPage()
	page.setPageNumber(1);
	page.setPageRowCount(5);
	noteCollect.$queryUrl = "/api/common/selectList";
	noteCollect.statement = "SDP-NOTE-005";
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				data_sort : '',//选择月份
				note_name : '',//名字匹配查询
				user_id : '',//登陆用户的id
				note_id : '',
			},
			page : page,
			datas:[],
			user : {},//用户信息
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
				g.params.user_id=SDP.loginUser.userId;
				g.queryDatas();
				
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		noteCollect.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = noteCollect.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	

	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	// 查看笔记数据
	methods_page.queryRow = function(note_id) {
		window.location.href="../noteDetail/noteDetail.html?uuid="+note_id;
	};
	//去除html标签
	methods_page.delHtmlTag = function(str) {
		return str.replace(/<[^>]+>/g, "");
	}

	//取消收藏笔记
	methods_page.cancelCollect = function(dataText){
		console.log("取消收藏笔记");
		var g = this;
		var tindex = layer.confirm('是否取消收藏[' + dataText.note_title + ']', {
			btn : ['是','否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTE-006',
				params : {
					note_id : dataText.note_id,
					user_id : g.params.user_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.updateNoteTab(dataText);//收藏后笔记表收藏数减1
				g.queryDatas();
				layer.msg("取消收藏成功");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	}
	// 点击收藏对收藏数的影响
	methods_page.updateNoteTab = function(dataText){
		var g = this;
		context.doAction({
			statement : 'SDP-NOTE-008',
			params : {
				note_id : dataText.note_id,
				note_collect:dataText.note_collect-1,
			}
		}, '/api/common/update', function(data) {
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	// 查看笔记长度
	methods_page.noteLength = function(text) {
		if(text.length > 183){           /*一行大概60个字,5行302*/
			return true;
		}else{
			return false;
		}
	};
	//按月查询
	methods_page.dateFun = function(val){
		this.page.setPageNumber(1);
		this.params.data_sort = val;
		this.queryDatas();
	}
	//按名称查询
	methods_page.searchByNoteName = function(){
		this.page.setPageNumber(1);
		this.queryDatas();
	}
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.created();
		});	
	};
	var pageVue = new Vue(page_conf);

});