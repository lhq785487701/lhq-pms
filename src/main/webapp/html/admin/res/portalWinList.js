"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system' ];
	var context = new SDP.SDPContext();
	var portals = context.newDataStore("portals");
	var page = portals.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	portals.$queryUrl = "/api/common/selectList";
	portals.statement = "SDP-PORTAL-WIN-001";
	
	// 字段验证
	var rules = {
			win_name : [ {
				required : true,
				message : '请输入窗体名称',
				trigger : 'blur'
			}, {
				max : 80,
				message : '长度在 0到 80个字符',
				trigger : 'blur'
			} ]
		};
	
	var cols = [
			{
				title : '窗口名称',
				key : 'win_name',
				width : 160
			}, {
				title : '窗体标题',
				key : 'win_title',
				width : 160
			}, {
				title : '窗体图标',
				key : 'win_icon',
				width : 160
			}, {
				title : '占用列数',
				key : 'col_span',
				width : 80
			}, {
				title : '占用行数',
				key : 'row_span',
				width : 80
			}, {
				title : '系统',
				key : 'system_code',
				width : 120,
				format:function(row,val){
					return pageVue.stsFormat('sdp_system', row,
					'system_code');
				}
			}, {
				title : '窗体页面地址',
				key : 'win_url',
				width : 200
			}, {
				title : '窗体描述',
				key : 'win_remark',
				width : 200
			},{
				title : '创建时间' ,
				key : 'create_date',
				width : 160
			}, {
				title : '创建人',
				key : 'create_user',
				width : 120
			}, {
				title : '最后修改时间' ,
				key : 'update_date',
				width : 160
			}, {
				title : '最后修改人' ,
				key : 'update_user',
				width : 120
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				width : 100,
				fixed : 'right',
				type : 'render',
				render : actionRender
			}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				win_name : ''
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
			dataAdd : false,
			dataEdit : false,
			rules : rules
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
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		portals.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = portals.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 新增窗体
	methods_page.addData = function() {
		var r = portals.newRow();
		r.set('win_name', '');
		r.set('win_title', '');
		r.set('win_icon', '');
		r.set('col_span', 5);
		r.set('row_span', 10);
		r.set('system_code', '');
		r.set('win_url', '');
		r.set('win_remark', '');
		this.curRow = r;
		this.dataAdd = true;
	};
	// 新增窗体把偶才能
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				portals.$saveUrl = "/api/common/insert" 
				portals.$insert = 'SDP-PORTAL-WIN-004';
				portals.doSave(function() {
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
	// 新增窗口取消
	methods_page.addDataCancel = function() {
		portals.delRow(this.curRow);
	}
	
	// 编辑窗口信息
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
	};
	// 编辑后保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['dataEditForm'].validate(function(valid) {
			 if (valid) {
				var loading = layer.load();
				portals.$saveUrl = "/api/common/update";
				portals.$update = 'SDP-PORTAL-WIN-005';
				portals.doSave(function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('数据保存成功');
					g.dataEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "update");
			 } else {
				 return false;
			 }
		});
	};
	// 编辑窗口取消
	methods_page.editDataCancel = function() {
		this.curRow = {};
	}
	
	// 删除窗口
	methods_page.deleteRow = function(row) {
		var g = this;
		if(row.is_del == 'N' ){
			var tindexs = layer.confirm('此窗口已被授权,无法删除',{
				btn : ['确定']
			})
		}else if(row.is_del == 'Y'){
			var tindex = layer.confirm('是否删除窗口[' + row.win_name + ']', {
				btn : [ '是', '否' ]
			}, function() {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-PORTAL-WIN-006',
					params : {
						win_code : row.win_code,
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
				});
			});
		}
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
		this.$nextTick(function(){
			 this.queryDatas();
		});	
	};

	//格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
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
		if (row.is_del == 'Y') {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));
			arr.push(initBtn(h, "删除", "fa fa-remove", function() {
				pageVue.deleteRow(row);
			}));
		}else if (row.is_del == 'N'){
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));
			arr.push(initBtn(h, "删除", "fa fa-remove", function() {
				pageVue.deleteRow(row);
			}));
			
		}
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