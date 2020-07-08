/**
 * 用户脚本
 * 
 * @文件名 messageLog
 * @作者 李浩祺
 * @创建日期 2017-11-05
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system', 'spd_message_channel_name' ];
	// 上下文
	var context = new SDP.SDPContext();
	var msgId = SDP.params["msgId"];
	var isSend = msgId != null && msgId.length > 0;

	var page = context.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	var cols = [
			{
				type : 'expand',
				width : 50,
				render : function(h, row, column, index) {
					var msg = row['data'];
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
			},
			{
				title : '系统',
				key : 'system',
				width : 180,
				format : function(row, val) {
					return pageVue.systemFormat('sdp_system', row, 'system');
				}
			},
			{
				title : '消息',
				key : 'channelName',
				width : 160,
				format : function(row, val) {
					return pageVue.systemFormat('spd_message_channel_name',
							row, 'channelName');
					;
				}
			}, {
				title : '发生时间',
				key : 'create',
				width : 140
			}, {
				title : '类型',
				key : 'type',
				width : 160
			}, {
				title : '服务IP',
				key : 'serverIp',
				width : 160
			} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				channelName : '',
				type : '',
				system : '',
				dateTime : [ moment(new Date()).subtract(1, "days"),
						moment(new Date()).add(1, "days") ]
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
			notSend : !isSend
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
		var loading = layer.load();
		var g = this;
		var must = {
			"create" : {
				"gte" : dateTime[0],
				"lt" : dateTime[1]
			}
		};
		if (obj.system != null && obj.system != "") {
			must["system"] = obj.system;
		}
		if (obj.type != null && obj.type != "") {
			must["type"] = obj.type;
		}
		if (obj.channelName != null && obj.channelName != '') {
			must["channelName"] = obj.channelName;
		}
		if (isSend) {
			must["msgId"] = msgId;
		}
		var order = {
			"create" : "desc"
		};
		var where = {
			"must" : must
		};

		context.doAction({
			"params" : {
				"order" : order,
				"where" : where
			},
			page : page.toObject()
		}, "/api/messageAcceptLog/queryLog", function(data) {
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
});