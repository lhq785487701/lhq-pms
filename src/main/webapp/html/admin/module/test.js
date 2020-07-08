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
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			datas : [ {
				user_code : '0010',
				user_name : 'aaa',
				org_code : '001',
				org_name : 'abbb'
			}, {
				user_code : '0011',
				user_name : 'aaa1',
				org_code : '002',
				org_name : 'abbb1'
			} ],
			columns : [ {
				title : '用户编码',
				key : 'user_code',
				width : 120
			}, {
				title : '用户名称',
				key : 'user_name',
				width : 140
			} ],
			orgUser : {}
		}
	};

	var methods_page = page_conf.methods = {};
	// 打开选择框
	methods_page.openOrgUsers = function() {
		var g = this;
		SDP.layer.open({
			title : '组织人员多选',
			type : 2,
			area : [ "850px", "430px" ],
			content : SDP.URL.getUrl('/html/common/selectOrgUser.html')
		}, {
			mdmCode : 'HRSJ-MCC-ORG',
			selectUsers : this.datas
		}, function(val) {
			if (val && val.length > 0) {
				g.datas = val;
			}
		});
	};
	// 打开选择框
	methods_page.openOneOrgUser = function() {
		var g = this;
		SDP.layer.open({
			title : '组织人员单选',
			type : 2,
			area : [ "600px", "430px" ],
			content : SDP.URL.getUrl('/html/common/selectOneOrgUser.html')
		}, {
			mdmCode : 'HRSJ-MCC-ORG',
			selectUsers : []
		}, function(val) {
			if (val) {
				g.orgUser = val;
			}
		});
	};
	// 初始化
	page_conf.mounted = function() {
	};

	var pageVue = new Vue(page_conf);
});