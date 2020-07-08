"use strict";
$(function() {
	var context = new SDP.SDPContext();
	
	//项目信息
	var prjApply = context.newDataStore("prjApply");
	prjApply.$queryUrl = "/api/common/selectList";
	prjApply.statement = "AUX-GOV-PRJ-CLOSE-001";
	
	//结项信息表
	var prjClose = context.newDataStore("prjClose");
	prjClose.$insert = 'AUX-GOV-PRJ-CLOSE-002';
	
	//成员及贡献
	var prjMember = context.newDataStore("prjMember");
	prjMember.setParentDS(prjClose);
	prjMember.$parentKeys = {
		'close_id' : 'close_id'
	};
	prjMember.$insert = 'AUX-GOV-PRJ-CLOSE-003';
	
	//激励分摊明细
	var prjRewardDetail = context.newDataStore("prjRewardDetail");
	prjRewardDetail.setParentDS(prjClose);
	prjRewardDetail.$parentKeys = {
		'close_id' : 'close_id'
	};
	prjRewardDetail.$insert = 'SAUX-GOV-PRJ-CLOSE-004';
	
	//项目进展说明
	var prjProgDesc = context.newDataStore("prjProgDesc");
	prjProgDesc.setParentDS(prjClose);
	prjProgDesc.$parentKeys = {
		'close_id' : 'close_id'
	};
	
	//数据字典
	var dicConf = [ 'gpm_phase','gpm_close_status','gpm_status'];
	
	//成员表单
	 var memberCols = [
			{
				title : '序号',
				align: 'center',
				width : 60,
				type:'index',
			},
			{
				title : '姓名',
				key : 'user_name',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.user_name"></i-input>';
				},
			},
			{
				title : '担任角色',
				key : 'prj_role',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.prj_role"></i-input>';
				},
			},
			{
				title : '主要职责',
				key : 'prj_duty',
				width : 180,
				editRender : function(row, column) {
					return '<i-input v-model="row.prj_duty"></i-input>';
				},
			},
			{
				title : '贡献度',
				key : 'contribution_degree',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.contribution_degree"></i-input>';
				},
			},
			{
				title : '激励金额',
				key : 'incentive_amount',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.incentive_amount"></i-input>';
				},
			},
			{
				title : '操作',
				key : 'action',
				width : 130,
				align : 'center',
				type : 'render',
				render : actionRender
			} 
			];
	 
	 //激励分摊明细
	 var rewardDetailCols = [
			{
				title : '序号',
				align: 'center',
				width : 60,
				type:'index',
				
			},
			{
				title : '部门',
				key : 'prj_org',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.prj_org"></i-input>';
				},
			},
			{
				title : '分配比例',
				key : 'share_ratio',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.share_ratio"></i-input>';
				},
			},
			{
				title : '奖励金额',
				key : 'share_amount',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.share_amount"></i-input>';
				},
			},
			{
				title : '备注',
				key : 'remarks',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.remarks"></i-input>';
				},
			},
			{
				title : '操作',
				key : 'action',
				width : 130,
				align : 'center',
				type:'render',
				render : actionRender
			} 
			];
	 
	 //项目进展说明
	 var projProgDescCols = [
			{
				title : '序号',
				align: 'center',
				width : 60,
				type:'index',
				
			},
			{
				title : '文件名',
				key : 'file_name',
				width : 130,
			},
			{
				title : '上传人',
				key : 'create_user',
				width : 130,
			},
			{
				title : '上传时间',
				key : 'create_date',
				width : 180,
			},
			{
				title : '备注',
				key : 'remarks',
				width : 130,
			},
			{
				title : '操作',
				key : 'action',
				width : 130,
				align : 'center',
				render : actionRender
			} 
			];
	 
	// 头部配置
	var page_conf = {
			el : "#mainContainer",
			data : {
				proCloseItem : {},
				memberCols : memberCols,
				rewardDetailCols : rewardDetailCols,
				projProgDescCols : projProgDescCols,
				memberDatas : [],
				rewardDetailDatas : [],
				projProgDescDatas : [],
				spread : 'projectMember',
				dicDatas : {},
				dicMaps : {},
			}
		};

	var methods_page = page_conf.methods = {};
	
	//查询项目数据
	methods_page.queryPrjApplyData = function(prjId) {
		var g = this;
		var obj = {prjId : prjId};
		context.put(obj);
		var loading = layer.load();
		prjApply.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	//设置项目数据
	methods_page.updateDatas = function() {
		var r = prjClose.newRow();
		this.proCloseItem = r;
		var vs = prjApply.$rowSet.$views;
		if (vs.length != 0) {
			this.proCloseItem = vs[0];
		}
		r.set('prj_id',this.proCloseItem.prj_id);
		r.set('close_year','');
		r.set('prj_leader',this.proCloseItem.prj_leader);
		r.set('plan_close_time','');
		r.set('fact_close_time','');
		r.set('close_account_company',this.proCloseItem.close_account_company);
		r.set('incentive_amount',this.proCloseItem.incentive_amount );
		r.set('negative_incentive_amount',this.proCloseItem.negative_incentive_amount );
		r.set('all_amount',this.proCloseItem.all_amount );
		r.set('prj_parsh_now',this.proCloseItem.prj_parsh_now );
		r.set('prj_status',this.proCloseItem.prj_status );
		r.set('acknowledgement',this.proCloseItem.acknowledgement );
		r.set('material_comfirm_state',this.proCloseItem.material_comfirm_state );
		r.set('prj_desc',this.proCloseItem.prj_desc );
		r.set('multiray_reason',this.proCloseItem.multiray_reason);
	};
	
	//添加表格的一行	
	methods_page.addRow = function(action){
		if(action == 'member'){
			var vs = prjMember.$rowSet.$views;
			if (vs.length == 0) {
				this.memberDatas.splice(0, this.memberDatas.length);
			}
			this.memberDatas = vs;
			var r = prjMember.newRow();
			r.set('close_id', this.proCloseItem.close_id);
			r.set('user_id', '');
			r.set('user_name', '');
			r.set('prj_role', '');
			r.set('prj_duty', '');
			r.set('contribution_degree', '');
			r.set('incentive_amount', '');
			r.set('remarks', '');
		}else if(action == 'rewardDetail'){
			var vs = prjRewardDetail.$rowSet.$views;
			if (vs.length == 0) {
				this.rewardDetailDatas.splice(0, this.rewardDetailDatas.length);
			}
			this.rewardDetailDatas = vs;
			var r = prjRewardDetail.newRow();
			r.set('close_id',this.proCloseItem.close_id);
			r.set('prj_org', '');
			r.set('user_name', '');
			r.set('share_ratio', '');
			r.set('share_amount', '');
			r.set('remarks', '');
		}else{
			/*var vs = prjProgDesc.$rowSet.$views;
			if (vs.length == 0) {
				this.projProgDescDatas.splice(0, this.projProgDescDatas.length);
			}
			this.projProgDescDatas = vs;
			var r = prjProgDesc.newRow();
			var order = prjProgDesc.$rowSet.findByMaxValue('prjProgDesc_order');
			order++;
			r.set('prjProgDesc_order', order);
			r.set('PRJ_ORG', '');
			r.set('SHARE_RATIO', '');
			r.set('SHARE_AMOUNT', '');
			r.set('REMARKS', '');*/
		}
	};
	
	// 提交
	methods_page.doSubmitClose = function() {
		this.proCloseItem.close_year = moment(this.proCloseItem.close_year).format("YYYY");
		this.proCloseItem.plan_close_time = moment(this.proCloseItem.plan_close_time).format("YYYY-MM-DD HH:mm:SS");
		this.proCloseItem.fact_close_time = moment(this.proCloseItem.fact_close_time).format("YYYY-MM-DD HH:mm:SS");
		
		console.log(prjClose);
		
		var loading = layer.load();
		context.doDataStores("/api/common/insert", function() {
			layer.close(loading);
			layer.msg('数据新增成功!');
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		}, "insert");
	};
	
	// 数据字典格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
	};
	
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.queryPrjApplyData(getUrlParam('prj_id'));
		});	
	};
	
	var pageVue = new Vue(page_conf);
	
	// 初始化明细删除按钮
	function actionRender(h, row, colum, index) {
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			var tindex = layer.confirm('是否删除数据', {
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
	};
	
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
	};
	
	//获取输入框的值
	function getTableInputValue(clazz){
		var arr = []
		$(clazz).each(function(){
			arr.push($(this).val())
		})
		return arr;
	};
	
	// 获取地址栏参数
	function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r!=null) 
			return unescape(r[2]); 
		return null; 
	} 
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});	
});