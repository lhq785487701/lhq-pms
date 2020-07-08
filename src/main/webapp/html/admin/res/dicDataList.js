/**
 * 数据字典脚本
 * 
 * @文件名 dicDataList
 * @作者 李浩祺
 * @创建日期 2017-05-04
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_dic_sts' ];
	var context = new SDP.SDPContext();
	var dic = context.newDataStore("dicData");
	var dic01 = context.newDataStore("dic01Data");
	var page = dic.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	dic.$queryUrl = "/api/common/selectList";
	dic.statement = "SDP-DIC-002";
	dic.$update = 'SDP-DIC-005';

	dic01.setParentDS(dic);
	dic01.$parentKeys = {
		'dic_code' : 'dic_code'
	};
	dic01.$queryUrl = "/api/common/selectList";
	dic01.statement = "SDP-DIC-003";
	dic01.$insert = "SDP-DIC-009";
	dic01.$update = "SDP-DIC-010";
	dic01.$delete = "SDP-DIC-011";

	// 字段验证
	var rulesEdit = {
		dic_name : [ {
			required : true,
			message : '请输入名称',
			trigger : 'blur'
		}, {
			min : 2,
			max : 80,
			message : '长度在 2 到 80 个字符',
			trigger : 'blur'
		} ]
	};

	var rulesAdd = $.extend({
		dic_code : [ {
			required : true,
			message : '请输入编码',
			trigger : 'blur'
		}, {
			min : 3,
			max : 40,
			message : '长度在 3到 40 个字符',
			trigger : 'blur'
		} ]
	}, rulesEdit);

	var cols = [
			{
				title : '字典编码',
				key : 'dic_code',
				width : 180
			},
			{
				title : '字典名称',
				key : 'dic_name',
				width : 200
			},
			{
				title : '字典状态',
				key : 'dic_sts',
				width : 120,
				/*type:'render',
				render : function(h, row, column, index) {
					var ele = h('span', pageVue.stsFormat('sdp_dic_sts', row,
							'dic_sts'));
					return ele;
				}*/
				format : function(row,val) {
					return  pageVue.stsFormat('sdp_dic_sts', row,
							'dic_sts');
				}
			}, {
				title : '创建时间',
				key : 'create_date',
				width : 190
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				type:'render',
				render : actionRender
			} ];

	var cols01 = [
			{
				title : '排序',
				key : 'dic_order',
				width : 80,
				editRender : function(row, column) {
					return '<input-number :min="1" v-model="row.dic_order" style="width:60px;"></input-number>';
				}
			}, {
				title : '字典项名称',
				key : 'dic_label',
				width : 180,
				editRender : function(row, column) {
					return '<i-input v-model="row.dic_label"></i-input>';
				}
				/*
				//在table中加入下拉框（这里下拉框是数据字典的label，获取的是value） 
				type : 'render',
				render : function(h, row, column, index) {
					var arr = [];
					var dic = pageVue.dicDatas['sdp_dic_sts']
					for(var i = 0; i < dic.length; i++) {
						arr.push(h('Option', {
							 props: {  
					               value: dic[i].dic_value
					         }  
						}, dic[i].dic_label));
					}
					return h('Select', {  
						props: {
							value: row.dic_label
						},
				        on: {  
				            'on-change':(val) => {  
				            	row.dic_label = val;
				            }  
				        },  
				    }, arr);  
				}*/
			}, {
				title : '字典项编码',
				key : 'dic_value',
				width : 150,
				editRender : function(row, column) {
					if(row.$state == 1) {
						return '<i-input v-model="row.dic_value"></i-input>';
					} else if(row.$state == 0) {
						return '<i-input v-model="row.dic_value" :disabled="true"></i-input>';
					}
				}
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				type:'render',
				render : actionRender01
			} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				dic_code : '',
				dic_name : '',
				dic_sts : []
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			rulesEdit : rulesEdit,
			rulesAdd : rulesAdd,
			columns : cols,
			dataAdd : false,
			dataEdit : false,
			datas01 : [],
			columns01 : cols01
		}
	};

	var methods_page = page_conf.methods = {};
	// 点击查询按钮
	methods_page.searchDatas=function(){
		page.setPageNumber(1);
		this.queryDatas();
	};
	// 查询
	methods_page.queryDatas = function() {
		var g=this;
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		pageVue.curRow = {};
		var loading = layer.load();
		dic.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 查询明细数据
	methods_page.queryDatas01=function() {
		var obj = pageVue.curRow;
		var loading = layer.load();
		dic01.clearParam();
		dic01.set('dic_code', obj.dic_code);
		var g=this;
		dic01.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas01();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = dic.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		}
		this.datas = vs;
	};
	// 设置明细数据
	methods_page.updateDatas01 = function() {
		var vs = dic01.$rowSet.$views;
		if (vs.length == 0) {
			this.datas01.splice(0, this.datas01.length);
		}
		this.datas01 = vs;
	};
	// 新增字典明细
	methods_page.addData01 = function() {
		var r = dic01.newRow();
		var order = dic01.$rowSet.findByMaxValue('dic_order');
		order++;
		r.set('dic_order', order);
		r.set('dic_code', this.curRow.dic_code);
		r.set('dic_label', '');
		r.set('dic_value', '');
	};
	// 新增数据字典
	methods_page.addData = function() {
		var r = dic.newRow();
		r.set('dic_sts', 'Y');
		r.set('dic_code', '');
		r.set('dic_name', '');
		this.curRow = r;
		this.dataAdd = true;
		this.updateDatas01();
	};
	// 新增保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				dic.$insert = 'SDP-DIC-004';
				context.doDataStores("/api/common/insert", function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('数据新增成功');
					g.dataAdd = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "insert");
			} else {
				return false;
			}
		});
	};
	// 新增取消
	methods_page.addDataCancel = function() {
		dic.delRow(this.curRow);
		this.curRow = {};
	};

	// 编辑角色数据
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
		dic.setCurRow(row);
		this.queryDatas01();
	};
	// 修改保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['dataEditForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doDataStores("/api/common/save", function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('数据保存成功');
					g.dataEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
			} else {
				return false;
			}
		});
	};
	// 修改取消
	methods_page.editDataCancel = function() {
		this.curRow = {};
	}

	// 禁用数据字典
	methods_page.disableRow = function(scope) {
		var r = scope;
		var g=this;
		var tindex = layer.confirm('是否禁用数据字典[' + r.dic_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-DIC-006',
				params : {
					dic_code : r.dic_code
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功禁用");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	// 启用数据字典
	methods_page.enableRow = function(scope) {
		var r = scope;
		var g=this;
		var tindex = layer.confirm('是否解禁数据字典[' + r.dic_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-DIC-007',
				params : {
					dic_code : r.dic_code
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功解禁");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};

	// 删除数据字典头表
	methods_page.deleteRow = function(scope) {
		var r = scope;
		var g=this;
		var tindex = layer.confirm('是否删除数据字典[' + r.dic_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.statement =  'SDP-DIC-008';
			context.$deletes = [ 'SDP-DIC-012' ];
			context.clearParam();
			context.put({dic_code : r.dic_code});
			context.doData('/api/common/delete',function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功删除");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
			
			/*dic.doAction({
				statement : 'SDP-DIC-008',
				$deletes : [ 'SDP-DIC-012' ],
				params : {
					dic_code : r.dic_code
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功删除");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});*/
		});
	};

	// 角色状态格式化
	methods_page.stsFormat = function(dic, row, col) {
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
		// 查询字典数据
		this.$nextTick(function(){
			this.queryDatas();
		});	
	};

	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});

	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		if (row.dic_sts == 'Y') {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));

			arr.push(initBtn(h, "禁用", "fa fa-user-times", function() {
				pageVue.disableRow(row);
			}));

			arr.push(initBtn(h, "删除", "fa fa-remove", function() {
				pageVue.deleteRow(row);
			}));
		} else if (row.dic_sts == 'D') {
			arr.push(initBtn(h, "启用", "fa fa-user-o", function() {
				pageVue.enableRow(row);
			}));
		}
		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}

	// 初始化明细删除按钮
	function actionRender01(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			var tindex = layer.confirm('是否删除数据[' + row.dic_label + ']', {
				btn : [ '是', '否' ]
			}, function() {
				row.del();
				layer.close(tindex);
			});
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