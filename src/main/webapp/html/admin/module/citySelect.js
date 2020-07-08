/**
 * city
 * 
 * @文件名 portal
 * @作者 李浩祺
 * @创建日期 2017-11-17
 * @版本 V 1.0
 */
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var ds = context.newDataStore("city");
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			cityDatas : [],
			params : {
				province : -1,
				city : -1,
				area : -1
			},
			params01 : {},
			//onchange
			province : [],
			city : [],
			area : [],
		}
	};

	var methods_page = page_conf.methods = {};
	
	//查询城市
	methods_page.queryCityTree = function() {
		var g = this;
		var url = "/api/city/queryCity?t=" + new Date().getTime();
		context.doAction({}, url, function(data) {
			g.cityDatas = data.data;
			g.province = data.data;
		}, function(data) {
			layer.alert(data.msg);
		});
	}
	
	//查询（不通过onchange事件去实现联级下拉）
	methods_page.searchDatas = function () {
		var g = this;
		alert("省：" + g.cityDatas[g.params.province].city + "," + 
				"市：" + g.cityDatas[g.params.province].$childrens[g.params.city].city + "," + 
				 "区：" + g.cityDatas[g.params.province].$childrens[g.params.city].$childrens[g.params.area].city)
	}
	
	//查询（通过onchange事件去实现联级下拉）
	methods_page.searchDatas01 = function () {
		var g = this;
		alert("省：" + g.params01.province + "," + 
				"市：" + g.params01.city + "," + 
				"区：" + g.params01.area)
	}
	
	//改变数组
	methods_page.changeArr = function(value, action) {
		var g = this;
		if(action == 'province') {
			g.province.map(function(item) {
				if(item.city == value){
					g.city = item.$childrens;
				}
			});
			g.area = [];
		} else if(action == 'city') {
			g.city.map(function(item) {
				if(item.city == value){
					g.area = item.$childrens;
				}
			});
		}
	}
	
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.queryCityTree();
		});	
	};

	var pageVue = new Vue(page_conf);
});