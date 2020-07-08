"use strict";
$(function() {
	var context = new SDP.SDPContext();
	
	// 页面配置
	var config_main = {
		el : "#mainContainer",
		data : {
            consumeHtml : 'consume/consume.html'
		}
	};
	var methods_main = config_main.methods = {};
	
	// 退出
	methods_main.loginout = function() {
		var tindex = layer.confirm('是否退出系统', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({}, "/user/logout", function(data) {
				layer.close(loading);
				window.location.href = "../../index.html";
			}, function(data) {
				layer.close(loading);
				layer.msg(data.msg);
			});
		});
	};
	
	
	var mainVue = new Vue(config_main);
});