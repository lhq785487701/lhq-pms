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
	var note = context.newDataStore("note");
	note.$keyField = "note_id";
	var page = note.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	note.$queryUrl = "/api/common/selectList";
	note.statement = "SDP-NOTE-001";//查看所有的笔记
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				data_sort : '',//选择月份
				note_name : '',//名字匹配查询
				user_id : '',//登陆用户的id
				note_id : '',
				sortSearch :'',
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
	
	// 点击查询按钮
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();//清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();//动画加载,2, {time: 3*1000}
		note.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = note.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
			for(var i = 0; i < this.datas.length; i++){
				if(this.datas[i].count == 0) {
					this.datas[i].state = false;
				} else {
					this.datas[i].state = true;
				}
			}
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
	
	//去除html标签
	methods_page.delHtmlTag = function(str) {
		return str.replace(/<[^>]+>/g, "");
	}
	// 查看笔记数据
	methods_page.queryRow = function(note_id) {
		window.location.href="../noteDetail/noteDetail.html?uuid="+note_id;
	};
	
	//收藏笔记
	methods_page.collect = function(datatext){
		console.log("收藏笔记");
		var g = this;
		var tindex = layer.confirm('是否收藏[' + datatext.note_title + ']', {
			btn : ['是','否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTE-004',
				params : {
					note_id : datatext.note_id,
					user_id : g.params.user_id
				}
			}, '/api/common/insert', function(data) {
				layer.close(loading);
				layer.close(tindex);
				pageVue.updateNoteTab(datatext);//收藏后笔记表收藏数加一
				g.queryDatas();
				layer.msg("收藏成功");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	}
	
	// 点击收藏对收藏数的影响
	methods_page.updateNoteTab = function(datatext){
		var g = this;
		context.doAction({
			statement : 'SDP-NOTE-008',
			params : {
				note_id : datatext.note_id,
				note_collect:datatext.note_collect+1,
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
	//排序搜索
	methods_page.sortSearch = function(val){
		this.page.setPageNumber(1);
		this.params.sortSearch=val;
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