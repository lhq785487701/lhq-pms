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
	var file = context.newDataStore("file");
	file.$queryUrl = "/api/common/selectList";
	file.statement = "SDP-FILE-002";
	context.set("bus_type","sdp-test-upload-001");
	context.set("business_no","20171121-00001");

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			datas : [],
			columns : [ {
				title : '业务编码',
				key : 'bus_type',
				width : 120
			}, {
				title : '业务单号',
				key : 'business_no',
				width : 120
			}, {
				title : '序号',
				key : 'line_no',
				width : 60
			} , {
				title : '文件名称',
				key : 'file_name',
				width : 140
			},  {
				title : '上传时间',
				key : 'create_date',
				width : 140
			},{
				title : '操作',
				key : 'action',
				align : 'left',
				width : 80,
				type:'render',
				render : actionRender
			} ],
			impUrl : SDP.URL.getUrl('/api/fileManage/uploadFile'),
			impData : {},
			acceptFormat:'.xls,.xlsx',
			uploadFormat : [ 'xls', 'xlsx' ]
		}
	};

	var methods_page = page_conf.methods = {};

	// 查询
	methods_page.queryDatas = function() {
		var g = this;
		var loading = layer.load();
		file.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 设置数据
	methods_page.updateDatas = function() {
		var vs = file.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	methods_page.commonUpload = function() {
		SDP.layer.open({
			title : '上传附件',
			type : 2,
			area : [ '800px', '450px' ],
			closeBtn: 0,
			content : SDP.URL.getUrl('/html/admin/common/commonUpload.html')
		}, {
			doc_type : 'N',
			file_type : 'C',
			main_id : '1123456',
			//authority : ['L', 'U']
		}, function(val) {},true);
	}

	methods_page.uploadSuccess = function() {
		this.queryDatas();
	};
	methods_page.uploadError = function() {
		alert("上传异常");
	};

	methods_page.beforeUpload = function(f) {
		var line=file.$rowSet.findByMaxValue("line_no");
		line++;
	
		var data = {
				'params' : {
					'business_no' : '20171121-00001',
					'bus_type' : 'sdp-test-upload-001',
					'line_no':line
				}
			};
			this.impData['sdpData'] = JSON.stringify(data, null, "");
	};
	
	//获取main.js中所需要的内容
	methods_page.selectParentNode = function(){
		var i = 0;
		var p = parent;
		while(i<5){
			if(p.$.addTab){
				return p;
			}
			i++;
			p = p.parent;
		}
		return null;
	}
	
	//打开不同的tab页
	methods_page.openNewTab = function(menu_code) {
		var g = this;
    	var menu={}
    	if(menu_code == "test001") {
    		menu.menu_url = 'html/admin/module/testFile.html';
    	} else if(menu_code == "test002") {
    		menu.menu_url = 'html/admin/module/testChart.html';
    	}
		menu.menu_name = menu_code;
		menu.menu_code = menu_code;
		menu.menu_system = 'pms';
		g.parentNode.$.addTab(menu);
	}
	
	//关闭code的页面
	methods_page.closeNewTab = function(code) {
		var g = this;
		g.parentNode.$.removeTab(code);
		//调用其他页面的方法，例如刷新之类的
		g.parentNode.document.getElementById('test002').contentWindow.$.testCallFromTab()
	}
	
	//打开同一个tab页
	methods_page.openOnlyTab = function(url, name) {
		var g = this;
    	var menu={}
    	
    	menu.menu_url = url;
		menu.menu_name = name;
		menu.menu_code = 'onlyTab';
		menu.menu_system = 'pms';
		g.parentNode.$.changeTab(menu);
	}

	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.queryDatas();
			this.parentNode = this.selectParentNode();
		});	
	};

	var pageVue = new Vue(page_conf);
	
	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];

		arr.push(initBtn(h, "下载", "fa fa-download", function() {
			layer.msg("文件准备下载");
			context.downFile("/api/fileManage/downFile?file_id="+row.file_id);
		}));

		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}

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