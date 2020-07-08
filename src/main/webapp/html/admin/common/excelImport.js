/**
 * 门户脚本
 * 
 * @文件名 excelImport.js
 * @作者 李浩祺
 * @创建日期 2017-11-17
 * @版本 V 1.0
 */
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var excel = context.newDataStore("excel");

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			uploadParam : {},
			datas : [],
			impUrl:SDP.URL.getUrl('/api/excelImport/doImport'),
			impData : {},
			excelContent : {},
			impFormat :['xls','xlsx']
		}
	};

	var methods_page = page_conf.methods = {};
	
	// 上传前
	methods_page.beforeUpload = function(f) {
		var data = this.uploadParam;
		this.impData['sdpData'] = JSON.stringify(data, null, "");
	};
	
	// 上传成功
	methods_page.impSuccess=function(response, file, fileList){
		this.$refs.userUpload.clearFiles();
		this.closeWindow("导入成功");
	};
	
	// 上传失败
	methods_page.impError=function(error, file, fileList){
		this.$refs.userUpload.clearFiles();
		this.closeWindow("导入失败");
	}
	
	// 关闭窗体
	methods_page.closeWindow=function(result){
		if(this.callback){
			this.callback(result);
		}
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};

	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
		});	
	};

	var pageVue = new Vue(page_conf);

	$.sendParams = function(obj) {
		pageVue.callback=obj.callback;
		pageVue.excelContent = obj.data.excelContent;
		pageVue.uploadParam = obj.data.uploadParam;
		pageVue.$nextTick(function(){
			$('#fileUpload').removeClass("hide");
		});
	};
});