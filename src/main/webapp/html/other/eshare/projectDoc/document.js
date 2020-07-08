$(function(){
	
	var dicConf = [ 'sdp_doc_type' ];
	var context = new SDP.SDPContext();
	// 角色数据
	var doc = context.newDataStore("doc");
	doc.$keyField = "doc_id";
	var page = doc.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	doc.$queryUrl = "/api/common/selectList";
	doc.statement = "SDP-DOC-001";
	
	var proj = context.newDataStore("proj");
	proj.$keyField = "proj_code";
	var page = doc.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	proj.$queryUrl = "/api/common/selectList";
	proj.statement = "SDP-DOC-004";
	
	var rulesEdit = {
		doc_name : [{
			required : true,
			message : '请输入名称',
			trigger : 'blur'
		}, {
			min : 2,
			max : 60,
			message : '长度在2到60个字符',
			trigger : 'blur'
		}]
	};
	
	var cols = [
	        {
				title : '文档编码',
				key : 'doc_id',
				width : 150
			},
			{
				title : '文档名称',
				key : 'doc_name',
				width : 150
			},
			{
				title : '文档描述',
				key : 'doc_intro',
				width : 150
			},
			{
				title : '创建人',
				key : 'create_user',
				width : 150
			}, 
			{
				title : '创建时间',
				key : 'create_date',
				width : 150
			},
			{
				title : '所属项目',
				key : 'proj_name',
				width : 150
			}, 
			{
				title : '文档类型',
				key : 'doc_type',
				width : 150,
				type: 'render',
				render : function(h, row, column, index) {
					var ele = h('span', pageVue.stsFormat('sdp_doc_type', row,
							'doc_type'));
					
					return ele;
				}
			}, 
			{
				title : '操作',
				key : 'action',
				align : 'left',
				type: 'render',
				render : actionRender
			}];
	
	var cols1 = [
		        {
					title : '项目编码',
					key : 'proj_code',
					width : 130
				},
				{
					title : '项目名称',
					key : 'proj_name',
					width : 130
				},
				{
					title : '项目经理',
					key : 'proj_mgr',
					width : 100
				},
				{
					title : '创建时间',
					key : 'create_date',
					width : 150
				}];

	var page_conf = {
		el: "#mainContainer",
		data : {
			params : {
				doc_owner : '',
				doc_name : '',
				doc_range : [],
				doc_types : [],
				proj_name : '',
				proj_mgr : ''
			},
			datas : [],
			datas1 : [],
			columns : cols,
			columns1 : cols1,
			//初始化数据字典所用数据
			dicDatas : {},
			dicMaps : {},
			//分页
			page : page,
			//设置具体的行,以确定修改的位置
			curRow : {},
			//编辑时的规则   定义了就必须立马出现对应的属性.不然页面报错.
			rulesEdit : rulesEdit,
			//供页面绑定
			dataEdit : false,
			dataUpload : false,
			projChoose : false
		}
			
	};

	
	var methods_page = page_conf.methods = {};
	
	methods_page.dateChange = function(date){
		this.params.doc_range = date;
	}
	
	methods_page.queryDatas = function() {
		/*page.setPageNumber(1);*/
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;//保留对pageVue的引用.
		doc.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
		
	};
	
	methods_page.queryDatas1 = function() {
/*		page.setPageNumber(1);*/
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;//保留对pageVue的引用.
		proj.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas1();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
		
	};
	
	// 设置返回数据,填充至表格
	methods_page.updateDatas = function() {
		
		
		var vs = doc.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	methods_page.updateDatas1 = function() {
		var vs = proj.$rowSet.$views;
		if (vs.length == 0) {
			this.datas1.splice(0, this.datas1.length);
		} else {
			this.datas1 = vs;
		}
	};
	
	methods_page.queryProj = function() {
		this.queryDatas1();
		this.projChoose = true;
	}
	
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
	};
	
	methods_page.getCurData = function(row) {
		this.curRow.proj_name = row.item.proj_name;
		this.curRow.proj_code = row.item.proj_code;
		this.curRow.proj_mgr = row.item.proj_mgr;
	};
	
	// 修改保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['dataEditForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				doc.$saveUrl = "/api/common/update";
				doc.$update = 'SDP-DOC-003';
				doc.doSave(function() {
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
	
	// 修改取消
	methods_page.editDataCancel = function() {
		this.curRow = {};
	};
	
	methods_page.downloadRow = function(row) {
	};
	
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除该文档[' + row.doc_name + ']', {
			btn : [ '是', '否']
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-DOC-002',
				params : {
					doc_id : row.doc_id
				}
			},'/api/common/delete', function(data) {
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
	};
	
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.queryDatas();
		});	
	};
	
	
	// 资料类型格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.doc_type;
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
	
	
	var pageVue = new Vue(page_conf);
	
	//初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	

	//操作的渲染
	function actionRender(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
			pageVue.editRow(row);
		}));
		arr.push(initBtn(h, "下载", "fa fa-cloud-download", function() {
			pageVue.downloadRow(row);
		}));
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			pageVue.deleteRow(row);
		}));
		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}
	
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