/**
 * 门户脚本
 * 
 * @文件名 portal
 * @作者 李浩祺
 * @创建日期 2017-11-17
 * @版本 V 1.0
 */
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var file = context.newDataStore("file");
	file.$queryUrl = "/api/common/selectList";
	file.statement = "SDP-FILE-002";
	context.set("bus_type","sdp-aux-xm-complete");
	context.set("business_no","11111111111");
	// 头部配置
	var page_conf = {
			el : "#mainContainer",
			data : {
				params : {task_code : 'aaaa',year : '2018',date : '2018-06-11'},
				spread : 'projectMember',
				impUrl : SDP.URL.getUrl('/api/fileManage/uploadFile'),
				impData : {},
				acceptFormat:'.xls,.xlsx,.doc,.docx',
				uploadFormat : [ 'xls', 'xlsx', '.doc', '.docx' ],
			}
		};
	var methods_page = page_conf.methods = {};
	
	methods_page.uploadSuccess = function() {
		//this.queryFileDatas();
	};
	
	methods_page.uploadError = function() {
		alert("上传异常");
	};
	
	methods_page.beforeUpload = function(f) {
		var line=file.$rowSet.findByMaxValue("line_no");
		line++;
		var data = {
			'params' : {
				'business_no' : '11111111111',
				'bus_type' : 'sdp-aux-xm-complete',
				'line_no':line
			}
		};
		this.impData['sdpData'] = JSON.stringify(data, null, "");
	}
	
	var pageVue = new Vue(page_conf);
	//添加表格的一行	
	
});