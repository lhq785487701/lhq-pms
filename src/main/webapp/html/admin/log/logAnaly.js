/**
 * 日志脚本
 * 
 * @文件名 logAnaly
 * @作者 李浩祺
 * @创建日期 2017-10-28
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system' ];
	// 上下文
	var context = new SDP.SDPContext();

	var page = context.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	var cols = [ {
		type : 'expand',
		width : 50,
		render : function(h, row, column, index) {
			var msg = row['message'];
			if (msg != null && msg.length > 100) {
				return h("div", [ h("i-row", [ h("i-col", {
					attrs : {
						"span" : 1
					}
				}, [ initBtn(h, '详细', 'fa fa-file-text', function() {
					parent.layer.alert(msg);
				}) ]), h("i-col", {
					attrs : {
						"span" : 23
					}
				}, [ h("i-input", {
					attrs : {
						"type" : "textarea",
						"readonly" : "readonly",
						"value" : msg
					}
				}) ]) ]) ]);
			}
			return h("div", [ h("i-input", {
				attrs : {
					"type" : "textarea",
					"readonly" : "readonly",
					"value" : msg
				}
			}) ]);
		}
	}, {
		title : '系统',
		key : 'system',
		width : 180,
		format : function(row, val) {
			return pageVue.systemFormat('sdp_system', row, 'system');
		}
	}, {
		title : '功能',
		key : 'menuName',
		width : 200
	}, {
		title : '日志级别',
		key : 'level',
		width : 200
	}, {
		title : '用户',
		key : 'userName',
		width : 120
	}, {
		title : '异常编码',
		key : 'errorCode',
		width : 120
	}, {
		title : '发生时间',
		key : 'create',
		width : 150
	}, {
		title : '服务器',
		key : 'serverIp',
		width : 160
	}, {
		title : '客户端IP',
		key : 'userIp',
		width : 120
	}, {
		title : '运行编码',
		key : 'nodeId',
		width : 120
	}, {
		title : '访问地址',
		key : 'actionUrl',
		width : 200
	} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				level : '',
				system : '',
				userName : '',
				errorCode : '',
				content : '',
				dateTime : [ moment(new Date()).subtract(1, "days"),
						moment(new Date()).add(1, "days") ]
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
		}
	};

	var methods_page = page_conf.methods = {};
	// 点击查询按钮
	methods_page.searchDatas = function() {
		page.setPageNumber(1);
		this.queryDatas();
	};
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		var dateTime = obj.dateTime;
		if (dateTime == null || dateTime.length < 2) {
			layer.alert("查询条件时间必填!");
			return;
		}
		var must = {
			"create" : {
				"gte" : dateTime[0],
				"lt" : dateTime[1]
			}
		};
		var matchMulti = null;
		if (obj.userName != null && obj.userName != "") {
			must["userName"] = obj.userName;
			matchMulti = {};
			matchMulti[obj.userId] = [ 'userId', 'userName' ];
		}
		if (obj.content != null && obj.content != '') {
			if (matchMulti == null) {
				matchMulti = {};
			}
			matchMulti[obj.content] = [ 'message', 'logger' ];
		}
		if (obj.system != null && obj.system != "") {
			must["system"] = obj.system;
		}
		if (obj.level != null && obj.level != "") {
			must["level"] = obj.level;
		}
		if (obj.errorCode != null && obj.errorCode != '') {
			must['errorCode'] = obj.errorCode;
		}
		var order = {
			"create" : "desc"
		};
		var where = {
			"must" : must
		};
		if (matchMulti != null) {
			where['matchMulti'] = matchMulti;
		}
		var loading = layer.load();
		var g = this;
		context.doAction({
			"params" : {
				"order" : order,
				"where" : where
			},
			page : page.toObject()
		}, "/api/log/queryLog", function(data) {
			layer.close(loading);
			var arr = data.data;
			$.each(arr, function(index, itm) {
				itm["create"] = moment(itm["create"]).format(
						"YYYY-MM-DD hh:mm:ss");
			});
			page.$initData(data['page']);
			g.datas = arr;
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 系统格式化
	methods_page.systemFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.role_sts;
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

	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function() {
			this.queryDatas();
		});
	};

	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
});