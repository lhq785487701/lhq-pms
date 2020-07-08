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
	var ds = context.newDataStore("test");
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			datas : ds.$rowSet.$views,
			comDatas : {
				'10001' : {
					'mdm' : '10001',
					'chinldren' : [ {
						'dept' : '10001_001'
					}, {
						'dept' : '10001_002'
					} ]
				},
				'10002' : {
					'mdm' : '10002',
					'chinldren' : [ {
						'dept' : '10002_001'
					}, {
						'dept' : '10002_002'
					}, {
						'dept' : '10002_003'
					} ]
				}
			},
			columns : [
					{
						title : '组织',
						key : 'mdm',
						width : 120,
						type : "render",
						render : function(h, row, column, index) {
							var arr = [];
							for ( var n in pageVue.comDatas) {
								arr.push(pageVue.comDatas[n]);
							}
							return h(
									'i-select',
									{
										'props' : {
											'transfer' : true,
											'value' : row.mdm
										},
										'on' : {
											'on-change' : function(val) {
												row.mdm = val;
												row['$$chinldren'] = pageVue.comDatas[val]['chinldren'];
											}
										}
									}, arr.map(function(item) {
										return h('Option', {
											'props' : {
												'value' : item.mdm,
												'label' : item.mdm
											}
										});
									}));
						}
					}, {
						title : '部门',
						key : 'dept',
						width : 140,
						type : "render",
						render : function(h, row, column, index) {
							return h('i-select', {
								'props' : {
									'transfer' : true,
									'value' : row.dept
								},
								'on' : {
									'on-change' : function(val) {
										row.dept = val;
									}
								}
							}, row['$$chinldren'].map(function(item) {
								return h('Option', {
									'props' : {
										'value' : item.dept,
										'label' : item.dept
									}
								});
							}));
						}
					} ]
		}
	};

	var methods_page = page_conf.methods = {};

	var count = 0;
	// 新增数据
	methods_page.addData = function() {
		ds.newRow({
			"$$chinldren" : []
		});
	};
	methods_page.saveData = function() {
		alert(context.toDSJSON(ds, 'insert'));
	};
	// 初始化
	page_conf.mounted = function() {
	};

	var pageVue = new Vue(page_conf);
});