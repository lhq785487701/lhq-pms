"use strict";
$(function() {
	// 菜单查询
	var context = new SDP.SDPContext();
	//数据字典
	var dicConf = [ 'pms_consume_time' ];
	
	var page = consumeDetail.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(10);
	
	
	
	// 页面配置
	var config_main = {
		el : "#mainContainer",
		data : {
            dicDatas : {},
			dicMaps : {},
            page : page,
		}
	};
	

	var methods_main = config_main.methods = {};
	
	
	// 初始化查询
	config_main.mounted = function() {
		this.$nextTick(function(){
			this.queryMenuTree();
		});	
	};
	
	
	
	//转化日期格式
	methods_main.changeDateFormat = function(value) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
		if(value != null && value != ""){
			if(value.toString().match(reg) == null) {
				return value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
			} 
		} else if (value == "") {
			return null;
		}
	}
	
	// 改变当前页号
	methods_main.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryConsumeDatas();
		}
	}
	
	// 改变页大小(暂不使用)
	//<!--  @on-page-size-change="handleSizeChange" show-sizer -->
	methods_main.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryConsumeDatas();
		}
	}
	
	// 角色状态格式化(表格)
	methods_main.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.user_state;
	};
	
	// 角色状态格式化(页面)
	methods_main.stsFormatDetail = function(col) {
		var m = this.dicMaps['pms_consume_time'];
		if (typeof(col) !="undefined" && m[col] != null && m[col] != "") {
			return m[col];
		}
		return "";
	};
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		mainVue.dicDatas = data.data;
		mainVue.dicMaps = data.map;
	});
	
	

	var mainVue = new Vue(config_main);
	

});