"use strict";
$(function() {
	var context = new SDP.SDPContext();
	
	//console.log($("#commonTree")[0].contentWindow);
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			curItem:"test"
		}
	};
	var methods_page = page_conf.methods = {};
	
	// 初始化页面
	methods_page.pageLoad=function(evt,itm){
	    const vm = this.$refs.iframe.contentWindow.vm
	    console.log(vm)
	}
	
	// 初始化
	page_conf.mounted = function() {
		// 查询树数据
		this.$nextTick(function(){
			//this.queryDatas();
		});	
	};
	
	
	
	var pageVue = new Vue(page_conf);
	
	
	
});