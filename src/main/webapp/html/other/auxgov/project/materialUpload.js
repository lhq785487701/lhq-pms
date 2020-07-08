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
	// 数据字典
	var context = new SDP.SDPContext();
	var file = context.newDataStore("file");
	file.$queryUrl = "/api/common/selectList";
	file.statement = "SDP-MATERIAL-FILE-002";
	
		var columns = [ {
			key : 'checked',
			type : 'selection',
			width :40
		},{
			title : '单据编码',
			key : 'prj_id',
			width : 140
		}, {
			title : '文件名称',
			key : 'mate_name',
			width : 140
		}, {
			title : '上传日期',
			key : 'upload_date',
			width : 180,
		} 
		, {
			title : '上传人',
			key : 'upload_user',
			width : 180
		}];
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				mate_name:null
			},
			datas : [],
			fileList : {},
			columns : columns,
			impUrl : SDP.URL.getUrl('/api/auxMaterialFileManage/uploadFile'),
			impData : {},
			confirm_desc:'',
			prj_id : '',
			acceptFormat:'.xls,.xlsx,.doc,.docx',
			uploadFormat : [ 'xls', 'xlsx' , 'doc' , 'docx']
		}
	};

	var methods_page = page_conf.methods = {};

	// 查询
	methods_page.queryDatas = function() {
		var g = this;
		context.clearParam();
		context.put({prj_id : g.prj_id,confirm_desc : g.confirm_desc,
			 mate_name : g.params.mate_name});
		var loading = layer.load();
		file.doQuery(function(data) {
			g.fileList = data;
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

	methods_page.uploadSuccess = function() {
		this.queryDatas();
	};
	methods_page.uploadError = function() {
		alert("上传异常");
	};

	methods_page.beforeUpload = function(f) {
		var data = {
			'params' : {
				'prj_id' : this.prj_id,
				'confirm_desc' : this.confirm_desc,
				
			}
		};
		this.impData['sdpData'] = JSON.stringify(data, null, "");
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
			context.downFile("/api/auxMaterialFileManage/downFile?file_id="+itms[0].mate_id);
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
			"/api/auxMaterialFileManage/delFile?mate_id="+itms[0].mate_id,
			function(data, status){
				g.queryDatas();
				layer.msg("删除成功");
			});
			
		}
	}
	
	// 关闭窗体
	methods_page.closeWindow=function(){
		if(this.callback){
			this.callback(this.fileList);
		}
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};

	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.queryDatas();
		});	
	};
	
	
	
	var pageVue = new Vue(page_conf);
	
	
	

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
		pageVue.prj_id=obj.data.prj_id;
		pageVue.confirm_desc=obj.data.confirm_desc;
		pageVue.$nextTick(function(){
			pageVue.queryDatas();
		});
	};
});