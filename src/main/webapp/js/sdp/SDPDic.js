/**
 * 数据字典
 * 
 * @文件名 SDPDic
 * @作者 李浩祺
 * @创建日期 2017-04-30
 * @版本 V 1.0
 */
"use strict";
$(function() {
	SDP.DIC = new (function() {
		this.initDatas = function(arrs, success) {
			var context = new SDP.SDPContext();
			context.statement = "SDP-DIC-001";
			context.set("dic_code", arrs);
			var loading = layer.load();
			context.doData("/api/dicCache/queryDicCache", function(data) {
				layer.close(loading);
				loading = null;
				var obj = {};
				var d = obj.data = {};
				var map = obj.map = {};
				$.each(data, function(index, item) {
					d[item.dic_code] = item.items;
					var tmp = map[item.dic_code] = {};
					$.each(item.items, function(i, itm) {
						tmp[itm.dic_value] = itm.dic_label;
					});
				});
				success(obj);
			}, function(data) {
				layer.close(loading);
				loading = null;
				layer.alert(data.msg);
			});
		};
	});
});