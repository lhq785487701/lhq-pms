/**
 * 项目指派数据容器脚本
 * 
 */
"use strict";
$(function() {
	//建立高度
	$(".heightStyle").css('height', window.innerHeight-600);
	//数据字典
	var dicConf = ['sdp_esp_myProject'];
	// 上下文
	var context = new SDP.SDPContext();
	
	var myProject = context.newDataStore("myProject");
	myProject.$keyField = "proj_code";
	myProject.$queryUrl = "api/common/selectList";
	myProject.statement = "SDP-PROJECT-001";
	
	var page = myProject.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);	
	
	//头部配置
	var page_config = {
		el: "#myProject",
		data : {
			page : page,
			params : {
				percent : 0,
			},
			studyPlanData:{},
		}
	};
	
	var methods_main = page_config.methods = {};
	
	//标签选择
	methods_main.dataAddMenuSelect = function(code) {
		showMess(code);
	}

	//打开当前学习计划明细页面
	methods_main.planDetail = function() {
		planDetailShow();
	}

	//打开当前学习计划明细编辑页面
	methods_main.editDetail = function(){
		editDetailShow();
	}
	
	//打开当前学习计划明细编辑页面
	methods_main.studySearch = function(){
		
	}
	

	//计划明细添加进度条
	methods_main.addDetail = function(){
		
        if (this.params.percent >= 100) {
                return false;
        }else{
        	this.params.percent += 10;
        }   
              
	}
	/*methods_main.minusDetail = function(){
		 minus () {
                if (this.percent <= 0) {
                    return false;
                }
                this.percent -= 10;
            }
	}*/


	//关闭详细页面
	methods_main.closeDetails = function(){
		closeDetail();
	}
	
	// 改变当前页号
	methods_main.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryHisProjData();
		}
	};
	// 改变页大小
	methods_main.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryHisProjData();
		}
	};
	
	//改变标签
	function showMess(code) {
		var projMess = "projMess";
		var stuMess = "stuMess";
		var inteMess = "inteMess";
		var planDetail = "planDetail";
		var editDetail = "editDetail";
		var editPlanDetails = "editPlanDetails";
		var closeDetail = "closeDetail";
		$("." + projMess).hide();
		$("." + stuMess).hide();
		$("." + inteMess).hide();
		$("." + planDetail).hide();
		$("." + editDetail).hide();
		$("." + editPlanDetails).hide();
		if(projMess == code) {
			$("." + projMess).show();
		} else if (stuMess == code) {
			$("." + stuMess).show();
		} else if (inteMess == code) {
			$("." + inteMess).show();
		} 
	}
	
	// 初始化查询
	page_config.mounted = function() {
		this.$nextTick(function(){

		});	
	};

	//实例化vue
	var pageVue = new Vue(page_config);
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});

	function planDetailShow(){
		var planDetail = "planDetail";
		var stuMess = "stuMess";
		$("." + stuMess).hide();
		$("." + planDetail).show();
	}

	function editDetailShow(){
		var planDetail = "planDetail";
		var editPlanDetails = "editPlanDetails";
		$("."+ planDetail).hide();
		$("." + editPlanDetails).show();
	}
	
	function closeDetail(){
		var planDetail = "planDetail";
		var stuMess = "stuMess";
		$("." + planDetail).hide();
		$("."+ stuMess).show();
	}
});