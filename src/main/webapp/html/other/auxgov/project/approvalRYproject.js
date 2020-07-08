"use strict";
$(function() {
	//数据字典
	var dicConf = [ 'gpm_prj_month','gpm_prj_units'];
	//使用者
	var context = new SDP.SDPContext();
	var context1 = new SDP.SDPContext();
	var user = context1.newDataStore("user");
	var pageUser = user.getPage();
	pageUser.setPageNumber(1);
	pageUser.setPageRowCount(20);
	user.$queryUrl = "/api/common/selectList";
	user.statement = "SDP-USER-002";
	
	//项目
	var project = context.newDataStore("project");
	project.$keyField = "prj_id";
	//项目成员
	var projectMember = context.newDataStore("projectMember");
	projectMember.$insert = "SDP-PROJECTMEMBER-002";
	
	//主导单位
	var dominantUnit = context.newDataStore("dominantUnit");
	dominantUnit.$queryUrl = "/api/common/selectList";
	dominantUnit.statement = "SDP-DOMINANTUNIT-001";
	
	
	//申报公司
	var reportingCompany = context.newDataStore("reportingCompany");
	reportingCompany.$queryUrl = "/api/common/selectList";
	reportingCompany.statement = "SDP-DOMINANTUNIT-001";
	
	//添加采集取证
	var file = context.newDataStore("file");
	file.$update="SDP-AUX-FILE-005";
	
//使用者列表信息
    
    var colsUser = [
		{
			title : '全选',
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
					return '<i-input v-model="row.prj_role"  ></i-input>';
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
   
// 字段验证
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
			
			prj_month : [{
				required : true,
				trigger : 'blur',
				message : '请选择立项月份'
			} ],
			
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
	
	
	
	
	
	var page_conf = {
		el : "#mainContainer",
		data : {
			dicDatas : {},
			dicMaps : {},
			curRow : {
				PRJ_MONTH:[],
				dominant_unit:[]
			},
			columns : cols,
			rules : rules,
			rowIndex:-1,
			datas:[],
			//使用者
			userQuery:false,
			params : {
				
			},
			columnsUser:colsUser,
			pageUser:pageUser,
			userDatas:[],
			f_action : {},
			curValue: {},
			//表格多选的行
			rows:[],
			//不同点选择的情况
			dif:'',
			//主导单位数据
			dominantUnitDatas: [],
			//申报公司数据
			reportingCompanyDatas:[]


		}
	};
	
	
	
	
	var methods_page = page_conf.methods = {};
	
	
	//添加表格的一行
	methods_page.addRow = function(){
		var r = projectMember.newRow();
		r.set('user_name', '');
		r.set('prj_role', '');
		r.set('prj_duty', '');
		r.set('remarks', '');
		this.datas.push(r)
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
			this.userDatas.splice(0, this.datas.length);
		} else {
			this.userDatas = vs;
		}
	};
	
	
	//使用者查询
	methods_page.searchDatasUser = function() {
		this.queryUserDates();
	}
	//点击查询项目负责人弹出框
	methods_page.searchUser=function(){
		this.userQuery=true;
		this.queryUserDates();
	}
	
	
	
	
	//主导单位查询
	methods_page.queryDominantUnit = function() {
		var loading = layer.load();
		var obj = {'org_pcode':'BASE-001'};
		context.clearParam();
		context.put(obj);
		var g=this;
		dominantUnit.doQuery(function(data) {
			g.updateDatasDominantUnit();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	
	
	
	// 设置主导单位数据
	methods_page.updateDatasDominantUnit = function() {
		var vs = dominantUnit.$rowSet.$views;
		if (vs.length == 0) {
			this.dominantUnitDatas.splice(0, this.datas.length);
		} else {
			this.dominantUnitDatas = vs;
		}
	};
	
	//主导单位下申报公司查询
	methods_page.queryReportingCompany = function(org_pcode) {
		var loading = layer.load();
		var obj = {'org_pcode':org_pcode};
		context.clearParam();
		context.put(obj);
		var g=this;
		reportingCompany.doQuery(function(data) {
			g.updateDatasReportingCompany();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	
	
	// 设置申报公司数据
	methods_page.updateDatasReportingCompany = function() {
		var vs = reportingCompany.$rowSet.$views;
		if (vs.length == 0) {
			this.reportingCompanyDatas.splice(0, this.datas.length);
		} else {
			this.reportingCompanyDatas = vs;
		}
	};
	
	
	//选择主导单位时
	methods_page.selectDominantUnit = function(value) {
		this.queryReportingCompany(value)
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

	//保存使用者选择
	methods_page.searchUserSave=function(){
		if(this.rows.length>0){
			//当选择的是项目成员时
			if(this.dif == 'member'){
				this.curValue.target.value = this.rows[0].user_name;
				this.datas[this.rowIndex].user_name = this.rows[0].user_name;
				this.datas[this.rowIndex].user_id = this.rows[0].user_id;
		    //当选择的是项目负责人时
			}else if(this.dif == 'leader'){
				this.curRow.prj_leader = this.rows[0].user_name;
			//当选择的是结项确认人时
			}else if(this.dif == 'confirmor'){
				this.curRow.acknowledgement = this.rows[0].user_name;
			}
			this.userQuery = false;
			this.rows = [];
		}else{
			layer.alert('请选择一行！');
		}
	}
	
	//上传附件
	methods_page.commonUpload = function() {
		var fullcode = 'RY' + get_date() + this.curRow.prj_code;
		SDP.layer.open({
			title : '上传附件',
			type : 2,
			area : [ '700px', '450px' ],
			content : SDP.URL.getUrl('/html/common/commonUpload.html')
		}, {
			doc_type : 'N',
			file_type : 'X',
			main_id : fullcode
		}, function(val) {
			file.$loadData(val.dataStore);
		},true);
	}
	
	//立项提交
	methods_page.projectRYSubmit = function(){
		this.insertDate('审批中');
		
	}
	//立项信息保存
	methods_page.projectRYSave = function(){
		this.insertDate('保存');
	}
	
	
	
	
	//把立项数据插入数据库
	methods_page.insertDate = function(status){
		var fullcode = 'RY' + get_date() + this.curRow.prj_code;
		var g=this;
		this.$refs['Project'].validate(function(valid) {
			if (valid) {
				var r = project.newRow();
				var loading = layer.load();
				g.curRow.prj_class = '2';
				g.curRow.status = status;
				g.curRow.prj_version = '1';
				g.curRow.prj_code = fullcode;
				g.curRow.newest_flag = 'Y';
				g.curRow.prj_start_time = format_date(g.curRow.prj_start_time);
				g.curRow.prj_year = format_date(g.curRow.prj_year).split('-')[0];
				context.clearParam();
				context.put(g.curRow);
				project.$saveUrl = "/api/common/insert";
				project.$insert = 'SDP-RYPROJECT-004';
				project.doSave(function(data) {
					projectMember.set('prj_id',data.dataStore.rows[0].prj_id);
					
					//信息采集,附件上传，材料上传
					var temp = file.$rowSet.$views;
					if(temp.length > 0) {
						for(var i = 0 ; i < temp.length; i++) {
							temp[i].main_id = data.dataStore.rows[0].prj_id;
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
	
	

	
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.curRow.prj_start_time = getdate();
			this.curRow.prj_year = getdate().split('-')[0];
			this.queryDominantUnit();
		});	
	};
	
	
	
	
	
	var pageVue = new Vue(page_conf);
	
	
	
	
	

	
	// 初始化明细删除按钮
	function actionRender01(h, row, column, index) {
		
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			var tindex = layer.confirm('是否删除数据[' + row.user_name + ']', {
				btn : [ '是', '否' ]
			}, function() {
				//row.del()
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
	
	//删除后出现刷新数据
	function setUser_names(arr){
		$('.user_name').each(function(i,e){
			if(arr[i]){
			  $(this).val(arr[i].user_name);
			}
		})
	}
	
	//日期问题
	function get_date(){
		var myDate = new Date();
		var month = (myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1);
		var day = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
		console.log(myDate.getFullYear()+''+month+''+day)
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
	
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});	
});	
	

	
	