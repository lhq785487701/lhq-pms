/**
 * 门户脚本
 * 
 * @文件名 commonUpload
 * @作者 李浩祺
 * @创建日期 2017-11-17
 * @版本 V 1.0
 */
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var file = context.newDataStore("file");
	var defauth =  ['L', 'U', 'D', 'R'];
	file.$queryUrl = "/api/common/selectList";
	file.statement = "SDP-FILE-002";
	var page = file.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	context.set("bus_type","sdp-test-upload-001");
	context.set("business_no","20171121-00001");

		var columns = [ {
			key : 'checked',
			type : 'selection',
			width : 60
		},{
			title : '业务编码',
			key : 'bus_type',
			width : 140
		}, {
			title : '业务单号',
			key : 'business_no',
			width : 140
		}, {
			title : '序号',
			key : 'line_no',
			width : 80
		} , {
			title : '文件名称',
			key : 'file_name',
			width : 160
		},  {
			title : '上传时间',
			key : 'create_date',
			width : 140
		}];
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				file_name:null
			},
			authority : [],
			datas : [],
			columns : columns,
			page : page,
			impUrl : SDP.URL.getUrl('/api/fileManage/uploadFile'),
			impData : {},
			impUpdUrl : SDP.URL.getUrl('/api/fileManage/updateFile'),
			impUpdData : {},
			acceptFormat:'.xls,.xlsx,.doc,.docx,.jpg,.png,.jepg',
			uploadFormat : [ 'xls', 'xlsx' , 'doc' , 'docx', 'jpg', 'png', 'jepg']
		}
	};

	var methods_page = page_conf.methods = {};

	// 查询
	methods_page.queryDatas = function() {
		var g = this;
		var loading = layer.load();
		file.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 设置数据
	methods_page.updateDatas = function() {
		var vs = file.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	methods_page.isInArray = function(val) {
		for(var i = 0; i < this.authority.length; i++){
	        if(val === this.authority[i]){
	            return true;
	        }
	    }
	    return false;
	}

	methods_page.uploadSuccess = function() {
		this.queryDatas();
	};
	methods_page.uploadError = function() {
		alert("上传异常");
	};

	//上传前
	methods_page.beforeUpload = function(f) {
		var line=file.$rowSet.findByMaxValue("line_no");
		line++;
	
		var data = {
			'params' : {
				'business_no' : '20171121-00001',
				'bus_type' : 'sdp-test-upload-001',
				'line_no':line
			}
		};
		this.impData['sdpData'] = JSON.stringify(data, null, "");
	};
	
	//更新前
	methods_page.beforeUpdate = function(f) {
		debugger;
		var itms = this.$refs.dataFilesGrid.getSelection();
		if(itms == null || itms.length == 0 || itms.length > 1) {
			layer.msg("请选择单个文件更新");
			return;
		}
		var data = {
			'params' : {
				'business_no' : '20171121-00001',
				'bus_type' : 'sdp-test-upload-001',
				'file_id' : itms[0].file_id
			}
		};
		this.impUpdData['sdpData'] = JSON.stringify(data, null, "");
	};
	
	
	//下载文件
	methods_page.downloadFile = function() {
		var itms = this.$refs.dataFilesGrid.getSelection();
		if(itms == null || itms.length == 0) {
			layer.msg("请选择文件下载");
		} else if(itms.length > 1) {
			layer.msg("请选择单个文件下载");
		} else {
			layer.msg("文件准备下载");
			context.downFile("/api/fileManage/downFile?file_id="+itms[0].file_id);
		}
	}
	
	//删除文件
	methods_page.delFile = function() {
		var g = this;
		var itms = this.$refs.dataFilesGrid.getSelection();
		if(itms == null || itms.length == 0) {
			layer.msg("请选择文件删除");
		} else if(itms.length > 1) {
			layer.msg("请选择单个文件删除");
		} else {
			context.downFile(
			"/api/fileManage/delFile?file_id="+itms[0].file_id,
			function(data, status){
				g.queryDatas();
				layer.msg("删除成功");
			});
			
		}
	}
	
	// 关闭窗体
	methods_page.closeWindow=function(){
		if(this.callback){
			this.callback(file.$rowSet.$views);
		}
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};

	//选择行选中复选框
	methods_page.selectOne = function(row) {
		this.$refs.dataFilesGrid.selectAll(false);
		row._isChecked = true;
	}
	
	// 翻页改变
	methods_page.handleCurrentChange=function(val){
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	// 翻页每页大小改变
	methods_page.handleSizeChange=function(val){
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};

	var pageVue = new Vue(page_conf);
	
	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];

		arr.push(initBtn(h, "下载", "fa fa-download", function() {
			layer.msg("文件准备下载");
			context.downFile("/api/fileManage/downFile?file_id="+row.file_id);
		}));

		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}

	// 初始化按钮
	function initBtn(h, title, icon, click) {
		var ele = h('i-button', {
			attrs : {
				type : 'text',
				img : icon,
				title : title
			},
			on : {
				click : click
			}
		});
		return ele;
	}
	
	$.sendParams = function(obj) {
		pageVue.callback=obj.callback;
		console.log(Array.isArray(obj.data.authority))
		if(obj.data.authority != null && Array.isArray(obj.data.authority)) {
			pageVue.authority = obj.data.authority;
		} else {
			pageVue.authority = defauth;
		}
		pageVue.$nextTick(function(){
			pageVue.queryDatas();
		});
	};
});