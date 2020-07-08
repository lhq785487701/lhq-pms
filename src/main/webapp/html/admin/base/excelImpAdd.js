
"use strict";
$(function() {
	var dicConf = [ 'sdp_excel_imp_store','sdp_excel_imp_null' ];
	var context = new SDP.SDPContext();
	var excelimp = context.newDataStore("excelimp");
	excelimp.setDefaultCurRowIndex(1);
	
	var excelimp01 = context.newDataStore("excelimp01");
	
	excelimp.$queryUrl = "/api/common/selectList";
	excelimp.statement = "SDP-EXCEL-IMP-001";
	excelimp.$update = "SDP-EXCEL-IMP-007";
	var thisRow = excelimp.newRow();
	
	thisRow.set('imp_code', '');
	thisRow.set('imp_name', '');
	thisRow.set('start_line', 1);
	thisRow.set('imp_statement', '');
	thisRow.set('imp_remark', '');
	thisRow.set('is_store', '');
	
	excelimp01.setParentDS(excelimp);
	excelimp01.$parentKeys = {
		'imp_code' : 'imp_code'
	};
	excelimp01.$queryUrl = "/api/common/selectList";
	excelimp01.statement = "SDP-EXCEL-IMP-002";
	excelimp01.$insert = "SDP-EXCEL-IMP-004";
	excelimp01.$delete = "SDP-EXCEL-IMP-009";
	excelimp01.$update = "SDP-EXCEL-IMP-008";
	
	//验证
	var rulesAdd = {
			imp_code : [ {
				required : true,
				message : '请输入配置编码',
				trigger : 'blur'
			}, {
				min : 1,
				max : 80,
				message : '长度在 2 到 80 个字符',
				trigger : 'blur'
			} ],
			imp_name : [ {
				required : true,
				message : '请输入导入名称',
				trigger : 'blur'
			}, {
				min : 1,
				max : 80,
				message : '长度在 1到 80 个字符',
				trigger : 'blur'
			} ],
			imp_statement : [ {
				required : true,
				message : '请输入导入sql语句',
				trigger : 'blur'
			}, {
				min : 1,
				max : 80,
				message : '长度在 1到 80 个字符',
				trigger : 'blur'
			} ],
			is_store : [ {
				required : true,
				message : '是否存储',
				trigger : 'blur'
			}, {
				min : 1,
				max : 80,
				message : '选择',
				trigger : 'blur'
			} ]
		};
	//导入配置明细
	var cols01 = [
	  			{
	  				title : '排序',
	  				key : 'line_no',
	  				width : 80,
	  				editRender : function(row, column) {
	  					return '<input-number :min="1" v-model="row.line_no" style="width:70px;"></input-number>';
	  				}
	  			}, {
	  				title : 'excel列',
	  				key : 'excel_col',
	  				width : 100,
	  				editRender : function(row, column) {
	  					return '<input-number :min="1" v-model="row.excel_col" style="width:90px;"></input-number>';
	  				}
	  			}, {
	  				title : '导入字段',
	  				key : 'imp_col',
	  				width : 120,
	  				editRender : function(row, column) {
	  					return '<i-input v-model="row.imp_col" style="width:110px;"></i-input>';
	  				}
	  			}, {
	  				title : '是否为空',
	  				key : 'is_null',
	  				width : 100,
	  				editRender : function(row, column) {
	  					return '<i-switch size="large" v-model="row.is_null" :true-value="true?'+"'Y'"+":'N'" +'" :false-value="('+"'N')"+'"><span slot="open">是</span><span slot="close">否</span></i-switch>';
	  				},
		  			format:function(row,val){
						return pageVue.stsFormats('sdp_excel_imp_null', row,
						'is_null');
					}
	  			}, {
	  				title : 'SQL编码',
	  				key : 'sql_code',
	  				width : 140,
	  				editRender : function(row, column) {
	  					return '<i-input v-model="row.sql_code"></i-input>';
	  				}
	  			}, {
	  				title : '对应字典',
	  				key : 'dic_code',
	  				width : 120,
	  				editRender : function(row, column) {
	  					return '<i-input v-model="row.dic_code"></i-input>';
	  				}
	  			}, {
	  				title : '重复SQL校验',
	  				key : 'repeat_sql_code',
	  				width : 120,
	  				editRender : function(row,column){
	  					return '<i-input v-model="row.repeat_sql_code"></i-input>'
	  				}
	  			}, {
	  				title : '操作',
	  				key : 'action',
	  				align : 'left',
	  				width : 100,
	  				type:'render',
	  				render : actionRender01
	  			} ];
	
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				imp_code : '',
				imp_name : ''
			},
			dicDatas : {},
			dicMaps : {},
			datas : [],
			curRow : thisRow,
			datas01 : [],
			columns01 : cols01,
			rulesAdd : rulesAdd
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	// 新增导出配置明细
	methods_page.addData01 = function() {
		var r = excelimp01.newRow();
		var order = excelimp01.$rowSet.findByMaxValue('line_no');
		order++;
		var orders = excelimp01.$rowSet.findByMaxValue('excel_col');
		orders++;
		r.set('line_no', order);
		r.set('excel_col',orders);
		r.set('imp_col','');
		r.set('is_null','');
		r.set('sql_code','');
		r.set('dic_code','');
		r.set('repeat_sql_code','');
		this.datas01=excelimp01.$rowSet.$views;
	};
	
	// 新增保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				excelimp.$insert = 'SDP-EXCEL-IMP-003';
				context.doDataStores("/api/common/insert", function() {
					layer.close(loading);
					layer.msg('数据新增成功');
					g.$nextTick(function(){
						parent.layer.close(parent.layer.getFrameIndex(window.name));
					});	
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "insert");
			} else {
				return false;
			}
		});
	};
	// 取消
	methods_page.addDataCancel = function() {
		this.curRow = {};
		var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(index);
	}
	
	// 是否为空
	methods_page.stsFormats = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.is_null;
	};
	
	// 初始化
	page_conf.mounted = function() {
	};

	var pageVue = new Vue(page_conf);
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	// 初始化明细删除按钮
	function actionRender01(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			var tindex = layer.confirm('是否删除[' + row.exp_col + ']字段', {
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