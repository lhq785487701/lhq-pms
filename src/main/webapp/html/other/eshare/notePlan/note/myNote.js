/**
 * 笔记管理管理页面脚本
 * 
 * @文件名 note
 * @作者 佘晓鑫
 * @创建日期 2017-09-30
 */
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var myNote = context.newDataStore("myNote");
	myNote.$keyField = "myNote_id";
	var page = myNote.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	myNote.$queryUrl = "/api/common/selectList";
	myNote.statement = "SDP-NOTE-007";//查看所有的笔记
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				data_sort : '',//选择月份
				note_name : '',//名字匹配查询
				user_id : '',//用户的id
			},
			page : page,
			datas:[],
			user : {},//用户信息
		}
	};

	var methods_page = page_conf.methods = {};
	
	
	
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		myNote.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = myNote.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	// 点击创建笔记
	methods_page.createNote = function() {
		window.location.href="../createNote/createNote.html";
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
		var url="../noteDetail/noteDetail.html?uuid="+note_id;
		if(this.params.data_sort != null &&this.params.data_sort != ''){
			url=url+'&dataSort='+this.params.data_sort;
		}
		if(this.params.note_name != null&&this.params.note_name != ''){
			url=url+'&noteName='+this.params.note_name;
		}
		console.log(url);
		window.location.href=url;
	};
	
/*	// 查看笔记是否分享
	methods_page.ifShare = function(note_share) {
		if(note_share=="Y"){
			return true;
		}else{
			return false;
		}
	};*/
	// 查看笔记长度
	methods_page.noteLength = function(text) {
		if( text != null && text.length > 151){          /* 一行大概60个字,5行302*/
			return true;
		}
			return false;
	};
	//去除html标签
	methods_page.delHtmlTag = function(str) {
		return str.replace(/<[^>]+>/g, "");
	}
	
	// 编辑笔记数据
	methods_page.editRow = function(row) {
		/*this.curRow = row;
		this.dataEdit = true;*/
		if(row.note_share=='Y'){
			window.location.href="../noteDetail/noteDetail.html?uuid=" + row.note_id;
		}else{
			window.location.href="../createNote/createNote.html?uuid=" + row.note_id; 
		}
	};
	
	// 删除笔记数据
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除[' + row.note_title + ']', {
			btn : ['是','否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTE-003',
				params : {
					note_id : row.note_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功删除");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	// 分享笔记数据
	methods_page.shareRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否分享[' + row.note_title + ']',{
			btn : ['是' , '否']
		},function(){
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-NOTE-002',
				params : {
					note_id : row.note_id
				}
			},'/api/common/update',function(data){
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功分享");
			},function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
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
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.created();
		});	
	};
	var pageVue = new Vue(page_conf);

});