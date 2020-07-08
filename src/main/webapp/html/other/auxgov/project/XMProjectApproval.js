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
	//数据字典
	var table = "gpm_prj_allocation";
	
	var dicConf = [ 'gpm_prj_month','gpm_prj_level', 'gpm_material_comfirm_state',
		'gpm_department','gpm_prj_type','gpm_prj_allocation','gpm_prj_units'];
	//使用者
	var context = new SDP.SDPContext();
	var context1 = new SDP.SDPContext(); 
	var user = context1.newDataStore("user");
	var pageUser = user.getPage();
	pageUser.setPageNumber(1);
	pageUser.setPageRowCount(20);
	user.$queryUrl = "/api/common/selectList";
	user.statement = "SDP-USER-002";
	//项目类立项申请
	var projectApproval=context.newDataStore("projectApproval");
	projectApproval.$keyField = "prj_id";
	//项目成员
	var projectMember = context.newDataStore("projectMember");
	projectMember.$insert = "SDP-PROJECTMEMBER-002";
	//计划及激励
	var ProjectIncentive = context.newDataStore("ProjectIncentive");
	ProjectIncentive.$insert="SDP-PROJECTPLAN-001";
	//联系人
	var ProjectContact = context.newDataStore("ProjectContact");
	ProjectContact.$insert="SDP-PROJECTCONTACT-001";
	//咨询机构
	var ProjectRefer = context.newDataStore("ProjectRefer");
	ProjectRefer.$insert="SDP-PROJECTCONSULTANT-001";
	//材料清单
	var ProjectMaterial = context.newDataStore("ProjectMaterial");
	//添加采集取证
	var file = context.newDataStore("file");
	file.$update="SDP-AUX-FILE-005";
	var files = context.newDataStore("files");
	files.$update="SDP-MATERIAL-FILE-005";
 //使用者列表信息
    
    var colsUser = [
		{
			title : '选择',
			type:'selection',
			width : 60
		},
		{
			title : '用户编码',
			key : 'user_code',
			width : 200
		},
		{
			title : '用户名称',
			key : 'user_name',
			width : 200
		}
		];
	//成员表单
    var cols = [
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
			type:'render',
			render : function(h,row,column,index){
				   return h('input',{
					   on:{
	                      click:function(event){
		                  		pageVue.curValue = event;
		                		pageVue.userQuery = true;
		                		pageVue.queryUserDates();
		                		pageVue.rowIndex = index;
		                		pageVue.dif = 'member';
	                	    },
	                     },
                      style : 'height:25px;width:120px;border:none;',
                      class : 'user_name'
				   },[]);
			},
			
		},
		{
			title : '担任角色',
			key : 'prj_role',
			width : 130,
			editRender : function(row, column) {
				return '<i-input v-model="row.prj_role"></i-input>';
			}
		},
		{
			title : '主要职责',
			key : 'prj_duty',
			width : 180,
			editRender : function(row, column) {
				return '<i-input v-model="row.prj_duty"></i-input>';
			}
		},
		{
			title : '备注',
			key : 'remarks',
			width : 130,
			editRender : function(row, column) {
				return '<i-input v-model="row.remarks"></i-input>';
			}
		},
		{
			title : '操作',
			key : 'action',
			align : 'left',
			type:'render',
			render : actionRender01
		}
		];
 
	 //计划及奖励
	 var planCols = [
			{
				title : '序号',
				align: 'center',
				width : 60,
				type:'index',
				
			},
			{
				title : '阶段',
				key : 'phase',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.phase"></i-input>';
				}
			},
			{
				title : '完成目标',
				key : 'finish_goal',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.finish_goal"></i-input>';
				}
			},
			{
				title : '完成时间',
				key : 'end_time',
				width : 180,
				type:'render',
				render : function(h,row,column,index){
					   return h('Date-Picker',{attrs : {
							style : 'width:180px;border:none;',
							type:'date',
							transfer:'true'
							},
							on:{
								'on-change':function(val){
									row.end_time=val;
								}
							}
						
					   });
				},
				
			},
			{
				title : '责任人',
				key : 'leader',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.leader" ></i-input>';
				}
			},
			{
				title : '备注',
				key : 'remarks',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.remarks"></i-input>';
				}
			},
			{
				title : '操作',
				key : 'action',
				align : 'left',
				type:'render',
				render : actionRender02
			}
			];
	
	 //联系人
	 var connectCols = [
			{
				title : '序号',
				align: 'center',
				width : 60,
				type:'index',
				
			},
			{
				title : '部门',
				key : 'depart_desc',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.depart_desc"></i-input>';
				}
			
			},
			{
				title : '姓名',
				key : 'per_name',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.per_name"></i-input>';
				}
			},
			{
				title : '手机号',
				key : 'mobile',
				width : 180,
				/*editRender : function(row, column) {
					return '<i-input v-model="row.MOBILE"></i-input>';
				},*/
				type:'render',
				render : function(h,row,column,index){
					   return h('i-input',{attrs : {
							style : 'border:none;',
							type : 'text'
							},
							on:{
								'on-change':function(val){
									row.mobile=val.target.value;
								},
								'on-blur':function(val){
									var value = val.target.value;
									if(value){
										var reg = /^1[3|4|5|7|8][0-9]{9}$/;
			                            var flag = reg.test(value); // true
			                            val.target.value = flag?value:'';
									}
									
								}
							},
						
					   });
				},
			},
			{
				title : 'Email',
				key : 'email',
				width : 130,
				/*editRender : function(row, column) {
					return '<i-input v-model="row.EMAIL"></i-input>';
				},*/
				type:'render',
				render : function(h,row,column,index){
					   return h('i-input',{attrs : {
							style : 'border:none;',
							},
							on:{
								'on-change':function(val){
									row.email=val.target.value;;
								},
								'on-blur':function(val){
									var value = val.target.value;
									if(value){
										var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
			                            var flag = reg.test(value); // true
			                            val.target.value = flag?value:'';
									}
									
								}
							},
						
					   });
				},
			},
			{
				title : '座机号',
				key : 'telephone',
				width : 130,
				/*editRender : function(row, column) {
					return '<i-input v-model="row.TELEPHONE"></i-input>';
				}*/
				type:'render',
				render : function(h,row,column,index){
					   return h('i-input',{attrs : {
							style : 'border:none;',
							},
							on:{
								'on-change':function(val){
									row.telephone=val.target.value;;
								},
								'on-blur':function(val){
									var value = val.target.value;
									if(value){
										var reg = /\d{3}-\d{8}|\d{4}-\d{7}/ ;
			                            var flag = reg.test(value); // true
			                            val.target.value = flag?value:'';
									}
									
								}
							},
							
						
					   });
				},
			},
			{
				title : '备注',
				key : 'remarks',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.remarks"></i-input>';
				}
			},
			{
				title : '操作',
				key : 'action',
				align : 'left',
				type:'render',
				render : actionRender03
			}
			];
	
	 //咨询机构
	 var referCols = [
			{
				title : '序号',
				align: 'center',
				width : 60,
				type:'index',
				
			},
			{
				title : '公司',
				key : 'org_name',
				width : 130,
				editRender : function(row, column) {
					return '<i-input v-model="row.org_name"></i-input>';
				}
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
				title : '手机号',
				key : 'phone',
				width : 180,
				/*editRender : function(row, column) {
					return '<i-input v-model="row.PHONE"></i-input>';
				},*/
				type:'render',
				render : function(h,row,column,index){
					   return h('i-input',{attrs : {
							style : 'border:none;',
							},
							on:{
								'on-change':function(val){
									row.phone=val.target.value;
								},
								'on-blur':function(val){
									var value = val.target.value;
									if(value){
										var reg = /^1[3|4|5|7|8][0-9]{9}$/;
			                            var flag = reg.test(value); // true
			                            val.target.value = flag?value:'';
									}
									
								}
							},
							
						
					   });
				},
			},
			{
				title : 'Email',
				key : 'email',
				width : 130,
				/*editRender : function(row, column) {
					return '<i-input  v-model="row.EMAIL"></i-input>';
				}*/
				type:'render',
				render : function(h,row,column,index){
					   return h('i-input',{attrs : {
							style :'border:none;',
							},
							on:{
								'on-change':function(val){
									row.email=val.target.value;;
								},
								'on-blur':function(val){
									var value = val.target.value;
									if(value){
										var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
			                            var flag = reg.test(value); // true
			                            val.target.value = flag?value:'';
									}
									
								}
							},
							
						
					   });
				},
			},
			{
				title : '座机号',
				key : 'tele',
				width : 180,
				/*editRender : function(row, column) {
					return '<i-input v-model="row.TELE"></i-input>';
				}*/
				type:'render',
				render : function(h,row,column,index){
					   return h('i-input',{attrs : {
							style : 'border:none;',
							},
							on:{
								'on-change':function(val){
									row.tele =val.target.value;;
								},
								'on-blur':function(val){
									var value = val.target.value;
									if(value){
										var reg = /\d{3}-\d{8}|\d{4}-\d{7}/ ;
			                            var flag = reg.test(value); // true
			                            val.target.value = flag?value:'';
									}
									
								}
							},
						
					   });
				},
			},{
				title : '备注',
				key : 'remarks',
				width : 180,
				editRender : function(row, column) {
					return '<i-input v-model="row.remarks"></i-input>';
				}
			},{
				title : '操作',
				key : 'action',
				align : 'left',
				type:'render',
				render : actionRender04
			}
			];
	  
	 //材料清单
	 var materialCols = [
			{
				title : '序号',
				align: 'center',
				width : 60,
				type:'index',
				
			},
			{
				title : '材料名称',
				key : 'mate_name',
				width : 130,
			/*	editRender : function(row, column) {
					return '<i-input v-model="row.MATE_NAME"></i-input>';
				}*/
			},
			{
				title : '上传日期',
				key : 'upload_date',
				width : 130,
			/*	type:'render',
				render : function(h,row,column,index){
					   return h('Date-Picker',{attrs : {
							style : 'width:120px;border:none;',
							class : 'UPLOAD_DATE',
							type:'date',
							transfer:'true'
							}
					   });
				},*/
			},
			{
				title : '上传人员',
				key : 'upload_user',
				width : 180,
			/*	editRender : function(row, column) {
					return '<i-input v-model="row.UPLOAD_USER"></i-input>';
				}*/
			},
			{
				title : '确认人',
				key : 'confirm_user',
				width : 130,
			/*	editRender : function(row, column) {
					return '<i-input v-model="row.CONFIRM_USER"></i-input>';
				}*/
			},
			{
				title : '确认日期',
				key : 'confirm_date',
				width : 130,
			/*	type:'render',
				render : function(h,row,column,index){
					   return h('Date-Picker',{attrs : {
							style : 'width:120px;border:none;',
							class : 'CONFIRM_DATE',
							type:'date',
							transfer:'true'
							}
					   });
				},*/
			},
			{
				title : '说明',
				key : 'confirm_desc',
				width : 130,
				/*editRender : function(row, column) {
					return '<i-input v-model="row.CONFIRM_DESC"></i-input>';
				}*/
			}/*,
			{
				title : '操作',
				key : 'action',
				align : 'left',
				type:'render',
				render : actionRender05
			}*/
			];
	 
	

		//校验货柜编码
		   var validateProjectCode  = (rule, value, callback) => {
		     	 if (!value) {
		              return callback(new Error('项目编码不能为空!'));
		          }
		          setTimeout(() => {
		             if ((value+'').length != 3) {
		                 callback(new Error('项目编码长度为3位数字'));
		             } else {
		           	  context.doAction({
			      				statement : "SDP-RYPROJECT-003",
		      				    params : {prj_code : value}
			      			}, '/api/common/selectList', function(data) {
			      				if(data.data[0].prj_count == 0) {
			      					   callback();
			      				} else {
			      					   callback(new Error('编码已存在！'));
			      				}
			      			}, function(data) {
			      				layer.alert(data.msg);
			      			});
		             }
		         }, 1000);
		     }; 
		   
		//项目立项字段校验
			var rules = {
					prj_name : [ {
						required : true,
						message : '请输入荣誉名称',
						trigger : 'blur'
					}, {
						max : 40,
						message : '长度在 0到 840个字符',
						trigger : 'blur'
						
					} ],
					/*PRJ_YEAR : [{
						required : true,
						trigger : 'blur',
						message : '请选择立项年份'
					} ],*/
					prj_month : [{
						required : true,
						trigger : 'blur',
						message : '请选择立项月份'
					} ],
					/*PRJ_START_TIME : [{
						required : true,
						trigger : 'blur',
						message : '请选择项目开始时间'
					}],
					PRJ_END_TIME : [{
						required : true,
						trigger : 'blur',
						message : '请选择项目结束时间'
					}],*/
					prj_desc : [{
						required : true,
						trigger : 'blur' ,
						message : '请输入项目说明'
					}],
					dominant_unit : [{
						required : true,
						trigger : 'blur',
						message : '请选择主导单位'
					}],
					declaration_company : [{
						required : true,
						trigger : 'blur' ,
						message : '请选择申报公司'
					}],
					prj_leader : [{
						required : true,
						trigger : 'change',
						message : '请选择项目负责人'
					}],
					acknowledgement : [{
						required : true,
						trigger : 'change' ,
						message : '请选择结项确认人'
					}],
					policy_no : [{
						required : true,
						trigger : 'blur' ,
						message : '请输入政策文号'
					}],
					honor_level : [{
						required : true,
						trigger : 'blur' ,
						message : '请选择荣誉级别'
					}],
					prj_code : [ 
					{
						validator : validateProjectCode,
						trigger : 'blur,change'
					}],
				};
	 
	 
	// 头部配置
	var page_conf = {
			el : "#mainContainer",
			data : {
				params:{
					prj_version:'1'
				
			},
				dicDatas : {},
				dicMaps : {},
				curRow : {},
				rules : rules,
				columnsUser:colsUser,
				columns : cols,
				columnsPlan:planCols,
				columnsConnect:connectCols,
				columnsRefer:referCols,
				columnsMaterial:materialCols,
				pageUser:pageUser,
				//使用者
				userQuery:false,
				datas:[],
				userDatas:[],
				planDatas:[],
				connectDatas:[],
				referDatas:[],
				materialDatas:[],
				material:{},
				fileList:{
					name : "file",
					rows : []
				},
				fileList01:{
					name : "Matfile",
					rows : []
				},
				curValue: {},
				rowIndex:-1,
				//表格多选的行
				rows:[],
				//不同点选择的情况
				dif:'',
				
			},
		};

	


	//初始化
var methods_page = page_conf.methods = {};

//激励总金额
methods_page.changeStimulate = function(){
	if(this.params.ratio){
		var number = this.params.ratio.replace("%","");
		pageVue.params.stimulate_sum = parseInt(pageVue.params.prj_goal) * parseInt(number)/100;
		if(!pageVue.params.stimulate_sum){
			pageVue.params.stimulate_sum = 0;
		}
	}
	
	
}

// 改变激励比例
methods_page.changeRatio = function() {
	this.params.ratio = this.stsFormatDetail(this.params.prj_type);
	this.changeStimulate();
};


methods_page.stsFormatDetail = function(col) {
	var m = this.dicMaps[table];
	if (typeof(col) !="undefined" && m[col] != null && m[col] != "") {
		return m[col];
	}
	return "";
};


//添加成员表格的一行
methods_page.addRow = function(){
	var r = projectMember.newRow();
	r.set('user_name', '');
	r.set('prj_role', '');
	r.set('prj_duty', '');
	r.set('remarks', '');
	this.datas.push(r)
}
//添加计划及激励表格一行
methods_page.addRowPlan = function(){
	var r = ProjectIncentive.newRow();
	r.set('phase', '');
	r.set('finish_goal', '');
	r.set('end_time', '');
	r.set('leader', '');
	r.set('remarks', '');
	this.planDatas.push(r)
}

//添加联系人表格一行
methods_page.addRowConnect = function(){
	var r = ProjectContact.newRow();
	r.set('depart_desc', '');
	r.set('per_name', '');
	r.set('mobile', '');
	r.set('email', '');
	r.set('telephone','');
	r.set('remarks', '');
	this.connectDatas.push(r)
}

//添加咨询机构表格一行
methods_page.addRowRefer = function(){
	var r = ProjectRefer.newRow();
	r.set('org_name', '');
	r.set('user_name', '');
	r.set('phone', '');
	r.set('email', '');
	r.set('tele','');
	r.set('remarks', '');
	this.referDatas.push(r)
}

//使用者信息查询
methods_page.queryUserDates = function() {
	var loading = layer.load();
	var obj = pageVue.params;
	context.clearParam();
	context.put(obj);
	var g=this;
	user.doQuery(function(data) {
		g.updateDatasUser();
		layer.close(loading);
	}, function(data) {
		layer.close(loading);
		layer.alert(data.msg);
	});
}
// 设置使用者数据
methods_page.updateDatasUser = function() {
	var vs = user.$rowSet.$views;
	if (vs.length == 0) {
		this.userDatas.splice(0, this.userDatas.length);
	} else {
		this.userDatas = vs;
	}
};

//项目负责人点击选择
methods_page.searchUserLeader = function() {
	this.userQuery=true;
	this.queryUserDates();
	this.dif = 'leader'
	
}


//结项确认人点击选择
methods_page.searchUserConfirmor = function() {
	this.userQuery=true;
	this.queryUserDates();
	this.dif = 'confirmor'
	
}
//使用者查询
methods_page.searchDatasUser = function() {
	this.queryUserDates();
}

//取消使用者选择
methods_page.searchUserCancel=function() {
	var g = this;
	g.userQuery = false;
}
//在多项的情况下勾线一行数据是触发
methods_page.userSelection = function(rows){
	this.rows = rows;
}

//点击用户列表的选择按钮是
methods_page.searchUserSave=function(){
	if(this.rows.length>0){
		//当选择的是项目成员时
		if(this.dif == 'member'){
			this.curValue.target.value = this.rows[0].user_name;
			this.datas[this.rowIndex].user_name = this.rows[0].user_name;
	    //当选择的是项目负责人时
		}else if(this.dif == 'leader'){
			this.params.prj_leader = this.rows[0].user_name;
		//当选择的是结项确认人时
		}else if(this.dif == 'confirmor'){
			this.params.acknowledgement = this.rows[0].user_name;
		}
		this.userQuery = false;
		this.rows = [];
	}else{
		layer.alert('请选择一行！');
	}
	
}

//使用者改变当前页号
methods_page.handleCurrentChangeUser = function(val) {
	pageUser.setPageNumber(val);
	if (pageUser.getIsChange()) {
		this.queryUserDates();
	}
};
// 使用者改变页大小
methods_page.handleSizeChangeUser = function(val) {
	pageUser.setPageRowCount(val);
	if (pageUser.getIsChange()) {
		this.queryUserDates();
	}
};





//初始化给表格加四行
page_conf.mounted = function() {};
//上传信息查询附件
methods_page.collectUpload = function() {
	this.commonUpload('C');
	
}
//上传附件
methods_page.accessoryUpload = function() {
	this.commonUpload('X');
	
}


methods_page.commonUpload = function(file_type) {
	var g = this;
	var fullcode = 'XM' + get_date() + this.params.prj_code;
	SDP.layer.open({
		title : '上传附件',
		type : 2,
		area : [ '700px', '450px' ],
		content : SDP.URL.getUrl('/html/common/commonUpload.html')
	}, {
		doc_type : 'N',
		file_type : file_type,
		main_id : fullcode,
	}, function(val) {
		for(var i = 0; i < val.dataStore.rows.length; i++) {
			g.fileList.rows.push(val.dataStore.rows[i]);
		}
		//file.$loadData(val.dataStore);
	},true);
}
//材料上传

methods_page.materialUpload = function() {
	var g = this;
	var fullcode = 'XM' + get_date() + this.params.prj_code;
	SDP.layer.open({
		title : '上传附件',
		type : 2,
		area : [ '700px', '450px' ],
		content : SDP.URL.getUrl('/html/project/materialUpload.html')
	}, {
		confirm_desc : 'M',
		prj_id : fullcode,
	}, function(val) {
		for(var i = 0; i < val.dataStore.rows.length; i++) {
			g.fileList01.rows.push(val.dataStore.rows[i]);
		}
		files.$loadData(val.dataStore);
		pageVue.updateDatas();
		
	},true);
}
//设置数据
methods_page.updateDatas = function() {
	var vs = files.$rowSet.$views;
	if (vs.length == 0) {
		this.materialDatas.splice(0, this.materialDatas.length);
	} else {
		this.materialDatas = vs;
	}
};


//立项提交
methods_page.projectXMSubmit = function(){
	this.insertDate('审批中');
	
}

//立项信息保存
methods_page.projectXMSave = function(){
	this.insertDate('保存');
}



//项目立项保存
methods_page.insertDate=function(status){
	var fullcode = 'XM' + get_date() + this.params.prj_code;
	var g=this;
	this.$refs['AddProject'].validate(function(valid) {
		if (valid) {
			var r = projectApproval.newRow();
			g.params.prj_code = fullcode;
			g.params.prj_start_time = format_date(g.params.prj_start_time);
			g.params.prj_year = format_date(g.params.prj_year).split('-')[0];
			context.clearParam();
			context.put(g.params);
			var loading = layer.load();
			//立项申请头表插入
			projectApproval.set("prj_class",'1');
			projectApproval.set("newest_flag",'Y');
			projectApproval.set("status",status);
			projectApproval.$saveUrl = "/api/common/insert";
			projectApproval.$insert = 'SDP-PROJECTAPPROVAL-001';
			projectApproval.doSave(function(data) {
				//成员表从表插入
				projectMember.set('prj_id',data.dataStore.rows[0].prj_id);
				//计划及奖励从表插入
				ProjectIncentive.set('prj_id',data.dataStore.rows[0].prj_id);
				//联系人从表插入
				ProjectContact.set('prj_id',data.dataStore.rows[0].prj_id);
				//咨询机构从表插入
				ProjectRefer.set('prj_id',data.dataStore.rows[0].prj_id);
				//信息采集,附件上传，材料上传
				file.$loadData(g.fileList);
				var temp = file.$rowSet.$views;
				if(temp.length > 0) {
					for(var i = 0 ; i < temp.length; i++) {
						temp[i].main_id = data.dataStore.rows[0].prj_id;
					}
				}
				
				files.$loadData(g.fileList01);
				var temp1 = files.$rowSet.$views;
				if(temp1.length > 0) {
					for(var i = 0 ; i < temp1.length; i++) {
						temp1[i].prj_id = data.dataStore.rows[0].prj_id;
					}
				}
					context.doDataStores("/api/common/save", function() {
					}, function(data) {
						layer.close(loading);
						layer.alert(data.msg);
					}, "save");
					layer.close(loading);
					layer.msg('项目立项保存成功');
					
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			}, "insert");
		} else {
			return false;
		}
	});
}
//项目立项材料提交
methods_page.materialSubmit=function(){
	var state=this.params.status;
	if(state!='审批通过'){
		layer.msg('项目没有审批结束还不能提交');
	}
}


//初始化
page_conf.mounted = function() {
	this.params.prj_start_time = getdate();
	this.params.prj_year = getdate().split('-')[0];
};



var pageVue = new Vue(page_conf);


// 初始化数据字典
SDP.DIC.initDatas(dicConf, function(data) {
	pageVue.dicDatas = data.data;
	pageVue.dicMaps = data.map;
});	


//初始化成员明细删除按钮
function actionRender01(h, row, column, index) {
	
	var arr = [];
	arr.push(initBtn(h, "删除", "fa fa-remove", function() {
		var tindex = layer.confirm('是否删除数据[' + row.user_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			pageVue.datas[index] = {}
			pageVue.datas.splice(index,1);
			setUser_names(pageVue.datas)
			layer.close(tindex);
		});
	}));
	return h('button-group', {
		attrs : {
			size : 'small'
		}
	}, arr);
}
///初始化项目计划及奖励明细删除按钮
function actionRender02(h, row, column, index) {
	var arr = [];
	arr.push(initBtn(h, "删除", "fa fa-remove", function() {
		var tindex = layer.confirm('是否删除数据[' + row.phase + ']', {
			btn : [ '是', '否' ]
		}, function() {
			//row.del()
			pageVue.planDatas.splice(index,1);
			setPHASE(pageVue.planDatas)
			layer.close(tindex);
		});
	}));
	return h('button-group', {
		attrs : {
			size : 'small'
		}
	}, arr);
}

///初始化联系人明细删除按钮
function actionRender03(h, row, column, index) {
	var arr = [];
	arr.push(initBtn(h, "删除", "fa fa-remove", function() {
		var tindex = layer.confirm('是否删除数据[' + row.depart_desc + ']', {
			btn : [ '是', '否' ]
		}, function() {
			//row.del()
			pageVue.connectDatas.splice(index,1);
			setConnect(pageVue.connectDatas)
			layer.close(tindex);
		});
	}));
	return h('button-group', {
		attrs : {
			size : 'small'
		}
	}, arr);
}
//初试话机构明细删除按钮
function actionRender04(h, row, column, index) {
	var arr = [];
	arr.push(initBtn(h, "删除", "fa fa-remove", function() {
		var tindex = layer.confirm('是否删除数据[' + row.user_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			//row.del()
			pageVue.referDatas.splice(index,1);
			setUser_names(pageVue.datas)
			layer.close(tindex);
		});
	}));
	return h('button-group', {
		attrs : {
			size : 'small'
		}
	}, arr);
}

//初始化材料清单明细删除按钮
/*function actionRender05(h, row, column, index) {
	var arr = [];
	arr.push(initBtn(h, "删除", "fa fa-remove", function() {
		var tindex = layer.confirm('是否删除数据[' + row.user_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			//row.del()
			pageVue.materialDatas.splice(index,1);
			setUser_names(pageVue.datas)
			layer.close(tindex);
		});
	}));
	return h('button-group', {
		attrs : {
			size : 'small'
		}
	}, arr);
}*/



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


//删除成员后出现刷新数据
function setUser_names(arr){
	$('.user_name').each(function(i,e){
		if(arr[i]){
		  $(this).val(arr[i].user_name);
		}
	})
}
//删除成员后出现刷新数据
function setPHASE(arr){
	$('.phase').each(function(i,e){
		if(arr[i]){
		  $(this).val(arr[i].phase);
		}
	})
}




//删除联系人出现刷新数据
function setConnect(arr){
	
	$('.depart_desc').each(function(i,e){
		if(arr[i]){
		  $(this).val(arr[i].depart_desc);
		}
	})
}



//日期问题
function get_date(){
	var myDate = new Date();
	var month = (myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1);
	var day = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
	return myDate.getFullYear()+''+month+''+day; 
}

function format_date(date){
	var myDate = new Date(date);
	var month = (myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1);
	var day = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
	return myDate.getFullYear()+'-'+month+'-'+day;

}

function getdate(){
	var myDate = new Date();
	var month = (myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1);
	var day = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
	return myDate.getFullYear()+'-'+month+'-'+day; 
}
});