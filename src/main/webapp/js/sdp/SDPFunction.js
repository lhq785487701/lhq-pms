/**
 * 功能权限
 * 
 * @文件名 SDPFunction
 * @作者 李浩祺
 * @创建日期 2018-03-15
 * @版本 V 1.0
 */
"use strict";
$(function() {
	SDP.FUNCTION = new (function() {
		this.initDatas = function(url, success) {
			var context = new SDP.SDPContext();
			var menu_url = url.substring(url.split('/')[1].length+1, url.length);
			context.statement = "SDP-FUNCTION-015";
			context.set("menu_url", menu_url);
			var loading = layer.load();
			context.doData('/api/common/selectList', function(data) {
				var obj = {};
				$.each(data, function(index, item) {
					obj[item.function_code] = item.function_sts == '1' ? true : false;
				});
				success(obj)
			}, function(data) {
				layer.close(loading);
				loading = null;
				layer.alert(data.msg);
			});
		};
	});
});