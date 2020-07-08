/**
 * 个人档案
 * 
 * @文件名 resumeList.js
 * @作者 李浩祺
 * @创建日期 2017-10-10
 * @版本 V 1.0
 */
$(function() {
	//开始动画
	setTimeout(function(){
		$("#wait").css("display","none");
		$("#mainContainer").css("display","block");
		},
	2000);
	
	//建立高度
	$(".dataDetailStyle").css('height', window.innerHeight-160);
	$(".dataAddStyle").css('height', window.innerHeight-140);
	$(".dataEditStyle").css('height', window.innerHeight-140);
	
	//声明变量
	var table = 'sdp_esp_resume';
	var dicConf = [table];
	var context = new SDP.SDPContext();
	
	var resume = context.newDataStore("resume");
	var resumeEdu = context.newDataStore("resumeEdu");
	var resumeWork = context.newDataStore("resumeWork");
	var resumePreProj = context.newDataStore("resumePreProj");
	var resumeComProj = context.newDataStore("resumeComProj");
	var post = context.newDataStore("post");
	var project = context.newDataStore("project");
	var user = context.newDataStore("user");
	var file = context.newDataStore("file");
	
	var page = resume.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(10);
	//resume
	resume.$keyField = "resume_id";
	resume.$queryUrl = "/api/common/selectList";
	resume.statement = "SDP-RESUME-001";
	resume.$update = "SDP-RESUME-002";
	//resumeEdu
	resumeEdu.setParentDS(resume);
	resumeEdu.$parentKeys = {
		'resume_id' : 'resume_id'
	};
	resumeEdu.$queryUrl = "/api/common/selectList";
	resumeEdu.statement = "SDP-RESUME-005";
	resumeEdu.$insert = "SDP-RESUME-011";
	resumeEdu.$update = "SDP-RESUME-010";
	resumeEdu.$delete = "SDP-RESUME-012";
	//resumeWork
	resumeWork.setParentDS(resume);
	resumeWork.$parentKeys = {
		'resume_id' : 'resume_id'
	};
	resumeWork.$queryUrl = "/api/common/selectList";
	resumeWork.statement = "SDP-RESUME-006";
	resumeWork.$insert = "SDP-RESUME-013";
	resumeWork.$update = "SDP-RESUME-014";
	resumeWork.$delete = "SDP-RESUME-015";
	//resumePreProj
	resumePreProj.setParentDS(resume);
	resumePreProj.$parentKeys = {
		'resume_id' : 'resume_id'
	};
	resumePreProj.$queryUrl = "/api/common/selectList";
	resumePreProj.statement = "SDP-RESUME-007";
	resumePreProj.$insert = "SDP-RESUME-016";
	resumePreProj.$update = "SDP-RESUME-017";
	resumePreProj.$delete = "SDP-RESUME-018";
	//resumeProj
	resumeComProj.setParentDS(resume);
	resumeComProj.$parentKeys = {
		'resume_id' : 'resume_id'
	};
	resumeComProj.$queryUrl = "/api/common/selectList";
	resumeComProj.statement = "SDP-RESUME-008";
	resumeComProj.$insert = "SDP-RESUME-019";
	resumeComProj.$update = "SDP-RESUME-020";
	resumeComProj.$delete = "SDP-RESUME-021";
	
	//post
	post.$keyField = "post_code";
	post.$queryUrl = "/api/common/selectList";
	post.statement = "SDP-RESUME-022";
	
	//project
	project.$keyField = "proj_code";
	project.$queryUrl = "/api/common/selectList";
	project.statement = "SDP-RESUME-023";
	
	//user
	user.$keyField = "user_id";
	user.$queryUrl = "/api/common/selectList";
	user.statement = "SDP-USER-002";
	
	var cols = [{
			title : '用户编码',
			key : 'user_code',
			align : 'center',
			width : 120,
			ellipsis : true
		},{
			title : '用户名称',
			align : 'center',
			key : 'name',
			width : 120
		},{
			title : '性别',
			align : 'center',
			key : 'sex',
			width : 70,
			type:'render',
			render : function(h, row, column, index) {
				var ele = h('span', pageVue.stsFormat('sdp_esp_resume', row,
						'sex'));
				return ele;
			}
		},{
			title : '年龄',
			align : 'center',
			key : 'age',
			width : 80
		},{
			title : '学历',
			align : 'center',
			key : 'education',
			width : 100,
			type:'render',
			render : function(h, row, column, index) {
				var ele = h('span', pageVue.stsFormat('sdp_esp_resume', row,
						'education'));
				return ele;
			}
		},{
			title : '司领',
			align : 'center',
			key : 'com_date',
			width : 80
		},{
			title : '岗位等级',
			align : 'center',
			key : 'post_name',
			width : 150
		},{
			title : '技术能力',
			align : 'center',
			key : 'skill',
			width : 260,
			ellipsis : true,
			type:'render',
			render : function(h, row) {
				(row.skill == null) && (row.skill = '暂无')
				return row.skill;
			}
		},{
			title : '电话号码',
			align : 'center',
			key : 'phone',
			width : 140
		},{
			title : '档案状态',
			key : 'user_state',
			align : 'center',
			width : 90,
			type:'render',
			render : function(h, row, column, index) {
				var ele = h('span', pageVue.stsFormat('sdp_esp_resume', row,
						'user_state'));
				return ele;
			}
		},{
			title : '操作',
			key : 'action',
			align : 'center',
			type:'render',
			width : 155 ,
			render : actionRender
		} ];
	
	var colsWork = [{
			title : '公司名称',
			align : 'center',
			key : 'comName',
			width : 250
		},{
			title : '开始时间',
			align : 'center',
			key : 'starttime',
			width : 100
		},{
			title : '结束时间',
			align : 'center',
			key : 'endtime',
			width : 100
		},{
			title : '职位',
			align : 'center',
			key : 'post',
			width : 150
		},{
			title : '绩效描述',
			align : 'center',
			key : 'individual',
			width : 512
		}];
	
	var colsProj = [{
			title : '项目名称',
			align : 'center',
			key : 'projName',
			width : 150
		},{
			title : '项目周期',
			align : 'center',
			key : 'projPeriod',
			width : 100
		},{
			title : '开始时间',
			align : 'center',
			key : 'starttime',
			width : 100
		},{
			title : '结束时间',
			align : 'center',
			key : 'endtime',
			width : 100
		},{
			title : '主要职责',
			align : 'center',
			key : 'projRemark',
			width : 561
		},{
			title : '项目规模',
			align : 'center',
			key : 'projScale',
			width : 100
		}];
	
	var colsEdu = [{
			title : '学校',
			align : 'center',
			key : 'school',
			width : 220
		},{
			title : '开始时间',
			align : 'center',
			key : 'starttime',
			width : 100
		},{
			title : '结束时间',
			align : 'center',
			key : 'endtime',
			width : 100
		},{
			title : '描述(荣誉、担任职务)',
			align : 'center',
			key : 'description',
			width : 675
		}];
	
	
	var colsPost = [{
			title : '岗位名称',
			align : 'center',
			key : 'post_name',
			width : 200
		},{
			title : '岗位类型',
			align : 'center',
			key : 'post_type',
			width : 100
		},{
			title : '岗位级别',
			align : 'center',
			key : 'post_level',
			width : 100
		},{
			title : '下个岗位',
			align : 'center',
			key : 'post_next',
			width : 200
	}];
	
	var colsProject = [{
		title : '项目名称',
		align : 'center',
		key : 'proj_name',
		width : 150
	},{
		title : '项目开始时间',
		align : 'center',
		key : 'proj_start_date',
		width : 100
	},{
		title : '项目结束时间',
		align : 'center',
		key : 'proj_end_date',
		width : 100
	},{
		title : '项目经理',
		align : 'center',
		key : 'proj_mgr',
		width : 100
	},{
		title : '项目阶段',
		align : 'center',
		key : 'proj_step',
		width : 100
	},{
		title : '项目状态',
		align : 'center',
		key : 'proj_state',
		width : 100
	},{
		title : '项目规模',
		align : 'center',
		key : 'proj_scale',
		width : 100
	},{
		title : '项目介绍',
		align : 'center',
		key : 'proj_intro',
		width : 300
	}];
	
	
	var validateAge  = (rule, value, callback) => {
		if (value == null) {
			   callback();
        }
        setTimeout(() => {
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
            } else {
                if (value > 200 || value < 0) {
                    callback(new Error('请输入正确的年龄！'));
                } else {
                    callback();
                }
            }
        }, 1000);
    };
    var validateQqNumber  = (rule, value, callback) => {
		if (value == null || value == "") {
			   callback();
        }
        setTimeout(() => {
            if (!Number.isInteger(parseInt(value)) ) {
                callback(new Error('请输入数字值！'));
            } else {
            	//强制转换成int类型
                if (value.length > 30 || value < 0) {
                    callback(new Error('请输入正确的QQ号！'));
                } else {
                    callback();
                }
            }
        }, 1000);
    };
    var validatePhone  = (rule, value, callback) => {
   	 if (!value) {
            return callback(new Error('手机号码不能为空!'));
        }
        // 模拟异步验证效果
        setTimeout(() => {
           if (!Number.isInteger(parseInt(value))) {
               callback(new Error('请输入数字值！'));
           } else {
           	//强制转换成int类型
               if (value.length > 20 || value < 0) {
                   callback(new Error('请输入正确的手机号码！'));
               } else {
                   callback();
               }
           }
       }, 1000);
   };
   var validateCellphone  = (rule, value, callback) => {
	   	 if (!value) {
	            return callback(new Error('联系电话不能为空!'));
	        }
	        // 模拟异步验证效果
	        setTimeout(() => {
	           if (!Number.isInteger(parseInt(value))) {
	               callback(new Error('请输入数字值！'));
	           } else {
	           	//强制转换成int类型
	               if (value.length > 20 || value < 0) {
	                   callback(new Error('请输入正确的联系电话！'));
	               } else {
	                   callback();
	               }
	           }
	       }, 1000);
	   };
   var validateIdCard  = (rule, value, callback) => {
	    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
	   	 if (!value) {
	            return callback(new Error('身份证号不能为空!'));
	        }
	        // 模拟异步验证效果
	        setTimeout(() => {
	        	 if (value.match(reg) == null) {
	        		 callback(new Error('请输入正确的身份证号！'));
	           } else {
	                   callback();
	           }
	       }, 1000);
	   };
	   var validateHeight  = (rule, value, callback) => {
			if (value == null || value == "") {
				   callback();
	       }
	       setTimeout(() => {
	           if (!Number.isInteger(parseInt(value))) {
	               callback(new Error('请输入数字值！'));
	           } else {
	           	//强制转换成int类型
	               if (value.length > 10 || value < 0) {
	                   callback(new Error('请输入正确的身高！'));
	               } else {
	                   callback();
	               }
	           }
	       }, 1000);
	   };
	   var validateComDate  = (rule, value, callback) => {
		   if (value == null) {
			   callback();
           }
        setTimeout(() => {
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值!'));
            } else {
                if (value > 150 || value < 0) {
                    callback(new Error('请输入正确的司龄！'));
                } else {
                    callback();
                }
            }
        }, 1000);
    };
    var validateWorkDate  = (rule, value, callback) => {
    	if (value == null) {
			   callback();
        }
        setTimeout(() => {
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值!'));
            } else {
                if (value > 150 || value < 0) {
                    callback(new Error('请输入正确的工龄！'));
                } else {
                    callback();
                }
            }
        }, 1000);
    };
	
	// 修改字段验证
	var rulesEdit = {
		name : [ {
			required : true,
			message : '姓名不能为空！',
			trigger : 'blur'
		}, {
			min : 2,
			max : 50,
			message : '请输入2-50个字符！',
			trigger : 'blur'
		} ],
		nationality : [ {
			required : true,
			message : '国籍不能为空！',
			trigger : 'blur'
		}, {
			min : 2,
			max : 50,
			message : '请输入2-50个字符！',
			trigger : 'blur'
		} ],
		nation : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		age : [{
			validator: validateAge,
			trigger : 'blur'
		} ],
		education : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		phone : [ {
			validator: validatePhone,
			trigger : 'blur'
		} ],
		id_card : [ {
			validator: validateIdCard,
			trigger : 'blur'
		} ],
		address : [{
			min : 0,
			max : 250,
			message : '超出有效250个字符！',
			trigger : 'blur'
		} ],
		graduate_from : [{
			min : 0,
			max : 50,
			message : '超出有效50个字符！',
			trigger : 'blur'
		} ],
		major : [{
			min : 0,
			max : 50,
			message : '超出有效50个字符！',
			trigger : 'blur'
		} ],
		english_level : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		good_skill : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		politics : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		height : [ {
			validator: validateHeight,
			trigger : 'blur'
		} ],
		qq_number : [ {
			validator: validateQqNumber,
			trigger : 'blur'
		} ],
		mail : [{
			min : 0,
			max : 50,
			type: 'email', 
			message : '邮箱格式不正确！',
			trigger : 'blur'
		} ],
		post_code : [{
			min : 0,
			max : 40,
			message : '超出有效40个字符！',
			trigger : 'blur'
		} ],
		in_level : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		com_date : [{
			validator: validateComDate,
			trigger : 'blur'
		} ],
		work_date : [{
			validator: validateWorkDate,
			trigger : 'blur'
		} ],
		emergency : [ {
			required : true,
			message : '紧急联系人不能为空！',
			trigger : 'blur'
		}, {
			min : 2,
			max : 50,
			message : '请输入2-50个字符！',
			trigger : 'blur'
		} ],
		emergency_phone : [ {
			validator: validateCellphone,
			trigger : 'blur'
		} ],
		self_remark : [{
			min : 0,
			max : 250,
			message : '超出有效250个字符！',
			trigger : 'blur'
		} ],
		personal_goals : [{
			min : 0,
			max : 255,
			message : '超出有效255个字符！',
			trigger : 'blur'
		} ],
		hobby : [{
			min : 0,
			max : 50,
			message : '超出有效50个字符！',
			trigger : 'blur'
		} ],
	};
	//新增验证规则
	var rulesAdd = {
		name : [ {
			required : true,
			message : '姓名不能为空！',
			trigger : 'blur'
		}, {
			min : 2,
			max : 50,
			message : '请输入2-50个字符！',
			trigger : 'blur'
		} ],
		nationality : [ {
			required : true,
			message : '国籍不能为空！',
			trigger : 'blur'
		}, {
			min : 2,
			max : 50,
			message : '请输入2-50个字符！',
			trigger : 'blur'
		} ],
		nation : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		age : [{
			validator: validateAge,
			trigger : 'blur'
		} ],
		education : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		phone : [ {
			validator: validatePhone,
			trigger : 'blur'
		} ],
		id_card : [ {
			validator: validateIdCard,
			trigger : 'blur'
		} ],
		address : [{
			min : 0,
			max : 250,
			message : '超出有效250个字符！',
			trigger : 'blur'
		} ],
		graduate_from : [{
			min : 0,
			max : 50,
			message : '超出有效50个字符！',
			trigger : 'blur'
		} ],
		major : [{
			min : 0,
			max : 50,
			message : '超出有效50个字符！',
			trigger : 'blur'
		} ],
		english_level : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		good_skill : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		politics : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		height : [ {
			validator: validateHeight,
			trigger : 'blur'
		} ],
		qq_number : [ {
			validator: validateQqNumber,
			trigger : 'blur'
		} ],
		mail : [{
			min : 0,
			max : 50,
			type: 'email', 
			message : '邮箱格式不正确！',
			trigger : 'blur'
		} ],
		post_code : [{
			min : 0,
			max : 40,
			message : '超出有效40个字符！',
			trigger : 'blur'
		} ],
		in_level : [{
			min : 0,
			max : 20,
			message : '超出有效20个字符！',
			trigger : 'blur'
		} ],
		com_date : [{
            validator: validateComDate,
			trigger : 'blur'
		} ],
		work_date : [{ 
            validator: validateWorkDate,
			trigger : 'blur'
		} ],
		emergency : [ {
			required : true,
			message : '请输入紧急联系人！',
			trigger : 'blur'
		}, {
			min : 2,
			max : 50,
			message : '请输出2-50个字符！',
			trigger : 'blur'
		} ],
		emergency_phone : [ {
			validator: validateCellphone,
			trigger : 'blur'
		} ],
		self_remark : [{
			min : 0,
			max : 250,
			message : '超出有效250个字符！',
			trigger : 'blur'
		} ],
		self_remark : [{
			min : 0,
			max : 250,
			message : '超出有效250个字符！',
			trigger : 'blur'
		} ],
		personal_goals : [{
			min : 0,
			max : 255,
			message : '超出有效255个字符！',
			trigger : 'blur'
		} ],
		hobby : [{
			min : 0,
			max : 50,
			message : '超出有效50个字符！',
			trigger : 'blur'
		} ],
	};
	
	var rulesUser = {
		user_code :[ {
			required : true,
			message : '请输入编码！',
			trigger : 'blur'
		}, {
			min : 3,
			max : 40,
			message : '请输入3-40个字符！',
			trigger : 'blur'
		} ],user_pwd : [ {
			validator : validatePass,
			trigger : 'blur,change'
		} ],user_pwd1 : [ {
			validator : validatePass1,
			trigger : 'blur,change'
		} ]
	};
	
	
	var curRowAdd = {
		resume_id : "",
		name : "",
		post_code : null,
		nationality:"",
		sex:"",
		nation:"",
		birth_date:null,
		politics:"",
		height:"",
		phone:"",
		id_card:"",
		address:"",
		qq_number:"",
		mail:"",
		emergency:"",
		emergency_phone:"",
		english_level:"",
		good_skill:"",
		in_date:null,
    	in_level:"",
    	work_date:null,
    	com_date:null,
    	post_and_level:"",
    	skill:"",
    	education:"",
    	age:null,
    	self_remark:"",
    	personal_goals:"",
    	hobby:"",
    	graduate_from:"",
    	major:"",
    	marry_state:null,
    	img_code:null
	}
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {resume_id : ''},
			datas : [],
			dataEdu  : [],
			dataWork : [],
			dataProj : [],
			dataComProj : [],
			dataPost : [],
			dataProject : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			curRowEdu : {},
			curRowWork : {},
			curRowProj : {},
			curRowComProj :{},
			curRowUser : {
				//设置默认密码11111
				user_code : "",
				user_pwd : "111111",
				user_pwd1 : "111111"
			},
			rulesEdit : rulesEdit,
			rulesAdd : rulesAdd,
			rulesUser : rulesUser,
			columns : cols,
			columnsEdu : colsEdu,
			columnsWork : colsWork,
			columnsProj : colsProj,
			columnPost : colsPost,
			columnProject : colsProject,
			dataDetail : false,
			dataAdd : false,
			dataEdit : false,
			exportData : false,
			postData :false,
			projectData : false,
			userAdd : false,
			dataDetailMenuMess : "light",
			collapseDetail1 : "1",
			collapseDetail2 : null,
			collapseDetail3 : null,
			collapseDetail4 : null,
			collapseDetail5 : null,
			collapseDetail6 : "1",
			collapseDetail7 : "1",
			collapseDetail8 : "1",
			exportOption : {
				style : 'default',
				format : ''
			},
		}
	};

	var methods_page = page_conf.methods = {};
	
	//标签选择明细
	methods_page.dataDetailMenuSelect = function(code) {
		showMess(code, "Detail");
	}
	//标签选择新增
	methods_page.dataAddMenuSelect = function(code) {
		showMess(code, "Add");
	}
	//标签选择修改
	methods_page.dataEditMenuSelect = function(code) {
		showMess(code, "Edit");
	}
	
	
	//确定项目
	methods_page.projectDataOk = function() {
		var proj_code = this.projectCurrentRow.item.proj_code;
		//先做一个项目的判断，选过了的不可以再次选择
		for(var i = 0; i < this.dataComProj.length; i++) {
			if(proj_code == this.dataComProj[i].proj_code) {
				layer.alert("项目信息重复");
				this.projectCurrentRow = null;
				this.projectCurrentRowIndex = null;
				this.projectData = false;
				return;
			}
		}
		this.dataComProj[this.projectCurrentRowIndex].proj_code = proj_code;
		//虽然ok可以关闭，但是双击事件不会关闭，所以执行关闭
		this.projectData = false;
	}
	
	//选中一行项目，回传一个当前行
	methods_page.selectOneProject = function(val) {
		this.projectCurrentRow = val;
	}
	
	//取消项目选择
	methods_page.projectDataCancel = function() {
		this.projectCurrentRow = null;
		this.projectCurrentRowIndex = null;
	}
	
	//打开选择项目
	methods_page.selectProject = function(index) {
		//记住当前修改的
		this.projectCurrentRowIndex = index;
		this.projectData = true;
		var loading = layer.load();
		var g = this;
		project.clearParam();
		project.set('resume_id', g.curRow.resume_id);
		project.doQuery(function(data) {
			layer.close(loading);
			g.updateDataProject();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
		
	}
	
	//确定岗位
	methods_page.postDataOk = function() {
		this.curRow.post_code = this.postCurrentRow.item.post_code;
		this.curRow.post_name = this.postCurrentRow.item.post_name;
		//虽然ok可以关闭，但是双击事件不会关闭，所以执行关闭
		this.postData = false;
	}
	
	//选中一行岗位，回传一个当前行
	methods_page.selectOnePost = function(val) {
		this.postCurrentRow = val;
	}
	
	//取消岗位选择
	methods_page.postDataCancel = function() {
		this.postCurrentRow = null;
	}
	
	//打开选择岗位
	methods_page.selectPost = function() {
		this.postData = true;
		var loading = layer.load();
		var g = this;
		post.doQuery(function(data) {
			layer.close(loading);
			g.updateDataPost();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}

	//导入
	methods_page.resumeImport = function(/*res, file*/) {
		var g = this;
		var url = "/api/resume/importResume?t=" + new Date().getTime();
		context.doAction({/*params : {path : "D://" + file.name}*/}, url, function(data) {
			if(data.data.state == "noFile") {
				//取消。没有选择文件
			} else if(data.data.state == "success") {
				if (confirm('是否覆盖原有数据')==true){ 
					g.getImportMess(g.curRow, data.data, true);
				}else{ 
					g.getImportMess(g.curRow, data.data, false);
				} 
			} else {
				layer.alert("选择文件错误");
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	}
	
	//写入导入数据
	methods_page.getImportMess = function(curRow, data, type) {
		curRow.name = type ? data.name : (curRow.name == "" ? data.name : curRow.name);
		curRow.nationality = type ? data.nationality : (curRow.nationality == "" ? data.nationality : curRow.nationality);
		curRow.sex = type ? data.sex : (curRow.sex == "" ? data.sex : curRow.sex);
		curRow.nation = type ? data.nation : (curRow.nation == "" ? data.nation : curRow.nation);
		curRow.birth_date = type ? data.birth_date : (curRow.birth_date == null ? data.birth_date : curRow.birth_date);
		curRow.politics = type ? data.politics : (curRow.politics == "" ? data.politics : curRow.politics);
		curRow.height = type ? data.height : (curRow.height == "" ? data.height : curRow.height);
		curRow.phone = type ? data.phone : (curRow.phone == "" ? data.phone : curRow.phone);
		curRow.id_card = type ? data.id_card : (curRow.id_card == "" ? data.id_card : curRow.id_card);
		curRow.address = type ? data.address : (curRow.address == "" ? data.address : curRow.address);
		curRow.qq_number = type ? data.qq_number : (curRow.qq_number == "" ? data.qq_number : curRow.qq_number);
		curRow.mail = type ? data.mail : (curRow.mail == "" ? data.mail : curRow.mail);
		curRow.emergency = type ? data.emergency : (curRow.emergency == "" ? data.emergency : curRow.emergency);
		curRow.emergency_phone = type ? data.emergency_phone : (curRow.emergency_phone == "" ? data.emergency_phone : curRow.emergency_phone);
		curRow.english_level = type ? data.english_level : (curRow.english_level == "" ? data.english_level : curRow.english_level);
		curRow.good_skill = type ? data.good_skill : (curRow.good_skill == "" ? data.good_skill : curRow.good_skill);
		curRow.in_date = type ? data.in_date : (curRow.in_date == null ? data.in_date : curRow.in_date);
		curRow.in_level = type ? data.in_level : (curRow.in_level == "" ? data.in_level : curRow.in_level);
		curRow.work_date = type ? parseInt(data.work_date) : (curRow.work_date == null ? parseInt(data.work_date) : curRow.work_date);
		curRow.com_date = type ? parseInt(data.com_date) : (curRow.com_date == null ?parseInt(data.com_date) : curRow.com_date);
		curRow.education = type ? data.education : (curRow.education == "" ? data.education : curRow.education);
		curRow.age = type ? parseInt(data.age) : (curRow.age == null ? parseInt(data.age) : curRow.age);
		curRow.self_remark = type ? data.self_remark : (curRow.self_remark == "" ? data.self_remark : curRow.self_remark);
		curRow.personal_goals = type ? data.personal_goals : (curRow.personal_goals == "" ? data.personal_goals : curRow.personal_goals);
		curRow.hobby = type ? data.hobby : (curRow.hobby == "" ? data.hobby : curRow.hobby);
		curRow.graduate_from = type ? data.graduate_from : (curRow.graduate_from == "" ? data.graduate_from : curRow.graduate_from);
		curRow.major = type ? data.major : (curRow.major == "" ? data.major : curRow.major);
		curRow.marry_state = type ? data.marry_state : (curRow.marry_state == "" ? data.marry_state : curRow.marry_state);
		if(data.eduMess != "") {
			if(this.dataEdu[this.dataEdu.length-1].description == "") {
				this.dataEdu[this.dataEdu.length-1].description = data.eduMess;
			} else {
				this.handleAdd("edu");
				this.dataEdu[this.dataEdu.length-1].description = data.eduMess;
			}
		}
		if(data.workMess != "") {
			if(this.dataWork[this.dataWork.length-1].individual == "") {
				this.dataWork[this.dataWork.length-1].individual = data.workMess;
			} else {
				this.handleAdd("work");
				this.dataWork[this.dataWork.length-1].individual = data.workMess;
			}
		}
		if(data.preProjMess != "") {
			if(this.dataProj[this.dataProj.length-1].projRemark == ""){
				this.dataProj[this.dataProj.length-1].projRemark = data.preProjMess;
			} else {
				this.handleAdd("proj");
				this.dataProj[this.dataProj.length-1].projRemark = data.preProjMess;
			}
		}
	}
	
	//导出选择框
	methods_page.exportSelect = function() {
		this.exportData = true;
	}
	
	//提交确认导出
	methods_page.exportDataOk = function() {
		var format=this.exportOption.format;
		var paramData={
				resume : this.curRow,
				resumeEduList:this.dataEdu,
				resumeWorkList:this.dataWork,
				resumeProjList:this.dataProj
			}
		if(format=="wordFormat"){
			paramData.type = 'word';
		} else if(format=="pdfFormat"){
			paramData.type = 'pdf';
		} else if(format=="htmlFormat"){
			paramData.type = 'html';
		} else {
			layer.msg("请选择类型");
			return;
		}
		var url = "/api/resume/export?t=" + new Date().getTime();			
		context.doAction({
			params : paramData
		}, url, function(data) {
			layer.msg("导出成功！");
		}, function(data) {
			layer.alert(data.msg);
		});	
		return;
	}
	
	//取消导出
	methods_page.exportDataCancel = function() {
		this.exportOption.style = "default"
		$("#defaultOption").css("display", "block");
		$("#definedOption").css("display", "none");
	}
	
	//选择导出方式
	methods_page.select = function() {
		if(this.exportOption.style == "default") {
			$("#defaultOption").css("display", "block");
			$("#definedOption").css("display", "none");
		} else if (this.exportOption.style == "defined") {
			$("#definedOption").css("display", "block");
			$("#defaultOption").css("display", "none");
		}
	}
	
	//预览导出的文件
	methods_page.preview = function() {
		var format=this.exportOption.format;
		var paramData={
				resume : this.curRow,
				resumeEduList:this.dataEdu,
				resumeWorkList:this.dataWork,
				resumeProjList:this.dataProj,
		}
		if(format == "wordFormat" || format=="pdfFormat"){
			paramData.type = "word";
		}else if(format=="htmlFormat"){
			paramData.type = "html";
		} else {
			layer.msg("请选择类型");
			return;
		}
		var url = "/api/resume/preview?t=" + new Date().getTime();			
		context.doAction({
			params : paramData
		}, url, function(data) {
			var path = data.data.filePath.split('\\');
			window.open("resumePreview.html?path=" + path[path.length-1]);
		}, function(data) {
			layer.alert(data.msg);
		});	
		
	}
	
	
	//新增按钮
	methods_page.handleAdd = function(action) {
		if(action == 'edu') {
			if(this.dataEdu.length != 0 && this.dataEdu[this.dataEdu.length-1].school == "") {
				layer.msg("学校名称为空，无法新增");
				return;
			}
			var r = resumeEdu.newRow();
			var number = resumeEdu.$rowSet.findByMaxValue('number')+1;
			r.set('number', number);
			r.set('school', '');
			r.set('starttime', null);
			r.set('endtime', null);
			r.set('description', '');
		} else if (action == 'work') {
			if(this.dataWork.length != 0 && this.dataWork[this.dataWork.length-1].comName == "") {
				layer.msg("公司名为空，无法新增");
				return;
			}
			var r = resumeWork.newRow();
			var number = resumeWork.$rowSet.findByMaxValue('number')+1;
			r.set('number', number);
			r.set('comName', '');
			r.set('starttime', null);
			r.set('endtime', null);
			r.set('type', '');
			r.set('individual', '');
			r.set('post', '');
		} else if (action == 'proj') {
			if(this.dataProj.length != 0 && this.dataProj[this.dataProj.length-1].projName == "") {
				layer.msg("项目名为空，无法新增");
				return;
			}
			var r = resumePreProj.newRow();
			var number = resumePreProj.$rowSet.findByMaxValue('number')+1;
			r.set('number', number);
			r.set('projName', '');
			r.set('starttime', null);
			r.set('endtime', null);
			r.set('projRemark', '');
			r.set('projScale', '');
			r.set('projPeriod', '');
		} else if (action == 'comProj') {
			if(this.dataComProj.length != 0 && this.dataComProj[this.dataComProj.length-1].proj_code == "") {
				layer.msg("项目编码为空，无法新增");
				return;
			}
			var r = resumeComProj.newRow();
			r.set('proj_code', '');
			r.set('projMajor', '')
		}
    }; 
    
    //移除一条记录(目前做法直接删除，因为save无法判断删除的状态)
    methods_page.handleRemove =  function(index, action) {
    	// 当新增时，会获得一个当前的curRow（newRow中有setCurRow函数），修改时则不会
    	//所以当删除新增的数据时候，只需要删除dataXXX和resumeXXX中的一个即可，但是
    	//但是修改的时候，需要删除两个，因为没有双向绑定,但是因为修改的curRow为空，所以也只需要删一个
    	var g=this;
    	if(action == 'work') {
    		if(this.dataWork[index].$state == 1) {
    			resumeWork.$rowSet.delRow(this.dataWork[index]);
    		} else {
    			context.doAction({
    				statement : "SDP-RESUME-015",
    				params : {
    					exp_code : this.dataWork[index].exp_code
    				}
    			}, '/api/common/delete', function(data) {
    				g.dataWork.splice(index, 1);
    				layer.msg("删除成功");
    			}, function(data) {
    				layer.close(tindex);
    				layer.alert(data.msg);
    			});
    		}
    	} else if (action == 'proj') {
    		if(this.dataProj[index].$state == 1) {
    			resumePreProj.$rowSet.delRow(this.dataProj[index]);
    		} else {
    			context.doAction({
    				statement : "SDP-RESUME-018",
    				params : {
    					proj_code : this.dataProj[index].proj_code
    				}
    			}, '/api/common/delete', function(data) {
    				g.dataProj.splice(index, 1);
    				layer.msg("删除成功");
    			}, function(data) {
    				layer.close(tindex);
    				layer.alert(data.msg);
    			});
    		}
    	} else if (action == 'edu') {
    		if(this.dataEdu[index].$state == 1) {
    			resumeEdu.$rowSet.delRow(this.dataEdu[index]);
    		}  else {
    			context.doAction({
    				statement : "SDP-RESUME-012",
    				params : {
    					edu_code : this.dataEdu[index].edu_code
    				}
    			}, '/api/common/delete', function(data) {
    				g.dataEdu.splice(index, 1);
    				layer.msg("删除成功");
    			}, function(data) {
    				layer.close(tindex);
    				layer.alert(data.msg);
    			});
    		}
    	} else if (action == 'comProj') {
    		if(this.dataComProj[index].$state == 1) {
    			resumeComProj.$rowSet.delRow(this.dataComProj[index]);
    		}  else {
    			context.doAction({
    				statement : "SDP-RESUME-021",
    				params : {
    					proj_code : this.dataComProj[index].proj_code,
    					resume_id : this.dataComProj[index].resume_id
    				}
    			}, '/api/common/delete', function(data) {
    				g.dataComProj.splice(index, 1);
    				layer.msg("删除成功");
    			}, function(data) {
    				layer.close(tindex);
    				layer.alert(data.msg);
    			});
    		}
    	}
    };

	// 点击查询按钮
	methods_page.queryDatas = function() {
		page.setPageNumber(page.getPageNumber());
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		resume.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	
	// 设置项目列表数据
	methods_page.updateDataProject = function() {
		var vs = project.$rowSet.$views;
		if (vs.length == 0) {
			this.dataProject.splice(0, this.dataProject.length);
		} else {
			this.dataProject = vs;
		}
	};
	
	// 设置岗位列表数据
	methods_page.updateDataPost = function() {
		var vs = post.$rowSet.$views;
		if (vs.length == 0) {
			this.dataPost.splice(0, this.dataPost.length);
		} else {
			this.dataPost = vs;
		}
	};
	
	// 设置主列表数据
	methods_page.updateDatas = function() {
		var vs = resume.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	// 设置教育数据
	methods_page.updateDatasEdu = function() {
		var vs = resumeEdu.$rowSet.$views;
		if (vs.length == 0) {
			this.dataEdu.splice(0, this.dataEdu.length);
		}
		this.dataEdu = vs;
	};
	
	// 设置工作经历数据
	methods_page.updateDatasWork = function() {
		var vs = resumeWork.$rowSet.$views;
		if (vs.length == 0) {
			this.dataWork.splice(0, this.dataWork.length);
		}
		this.dataWork = vs;
	};
	
	// 设置入公司之前工作项目数据
	methods_page.updateDatasPreProj = function() {
		var vs = resumePreProj.$rowSet.$views;
		if (vs.length == 0) {
			this.dataProj.splice(0, this.dataProj.length);
		}
		this.dataProj = vs;
	};

	// 设置入公司之后工作项目数据
	methods_page.updateDatasComProj = function() {
		var vs = resumeComProj.$rowSet.$views;
		if (vs.length == 0) {
			this.dataComProj.splice(0, this.dataComProj.length);
		}
		this.dataComProj = vs;
	};
	
	// 新增用户档案
	methods_page.addData = function() {
		this.dataAdd = true;
    	this.curRow = curRowAdd;
    	//不新增则新增时无父源
    	var r = resume.newRow();
		this.updateDatasEdu();
		this.updateDatasWork();
		this.updateDatasPreProj();
		this.updateDatasComProj();
		this.handleAdd("edu");
		this.handleAdd("work");
		this.handleAdd("proj");
		this.handleAdd("comProj");
	};
	
	//新增将数据写入resume中
	methods_page.writeDataResume = function() {
		var r = resume.$curRow;
    	r.set('post_code', this.curRow.post_code);
    	r.set('name', this.curRow.name);
    	r.set('nationality', this.curRow.nationality);
    	r.set('sex', this.curRow.sex);
    	r.set('nation', this.curRow.nation);
    	r.set('birth_date', this.curRow.birth_date);
    	r.set('politics', this.curRow.politics);
    	r.set('height', this.curRow.height);
    	r.set('phone', this.curRow.phone);
    	r.set('id_card', this.curRow.id_card);
    	r.set('address', this.curRow.address);
    	r.set('qq_number', this.curRow.qq_number);
    	r.set('mail', this.curRow.mail);
    	r.set('emergency', this.curRow.emergency);
    	r.set('emergency_phone', this.curRow.emergency_phone);
    	r.set('english_level', this.curRow.english_level);
    	r.set('good_skill', this.curRow.good_skill);
    	r.set('in_date', this.curRow.in_date);
    	r.set('in_level', this.curRow.in_level);
    	r.set('work_date', this.curRow.work_date);
    	r.set('com_date', this.curRow.com_date);
    	r.set('post_and_level', this.curRow.post_and_level);
    	r.set('skill', this.curRow.skill);
    	r.set('education', this.curRow.education);
    	r.set('age', this.curRow.age);
    	r.set('self_remark', this.curRow.self_remark);
    	r.set('personal_goals', this.curRow.personal_goals);
    	r.set('hobby', this.curRow.hobby);
    	r.set('graduate_from', this.curRow.graduate_from);
    	r.set('major', this.curRow.major);
    	r.set('marry_state', this.curRow.marry_state);
    	r.set('img_code', this.curRow.img_code);
	}

	// 新增档案保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				//新增用户表数据
				g.userAdd = true;
			} else {
				layer.msg('数据新增失败!');
			}
		});
	};
	
	//新增档案插入resume和从表信息
	methods_page.insertResume = function() {
		var g = this;
		var loading = layer.load();
		//删除空白行，改变日期格式，将数据写入resume对象
		g.delBlankRow();
		g.changeDates();
		g.writeDataResume();
		//插入主表数据
		resume.$saveUrl = "/api/common/insert";
		resume.$insert = 'SDP-RESUME-004';
		resume.doSave(function(data) {
			//插入从表数据
			//resume.$keyField =  data.dataStore.rows[0].resume_id
			resumeEdu.set("resume_id", data.dataStore.rows[0].resume_id);
			resumeEdu.$saveUrl = "/api/common/insert";
			resumeEdu.doSave(null, function(data) {layer.msg('无教育数据');}, "insert");
			resumeWork.set("resume_id", data.dataStore.rows[0].resume_id);
			resumeWork.$saveUrl = "/api/common/insert";
			resumeWork.doSave(null, function(data) {layer.msg('无工作经验数据');}, "insert");
			resumePreProj.set("resume_id", data.dataStore.rows[0].resume_id);
			resumePreProj.$saveUrl = "/api/common/insert";
			resumePreProj.doSave(null, function(data) {layer.msg('无公司前项目');}, "insert");
			resumeComProj.set("resume_id", data.dataStore.rows[0].resume_id);
			resumeComProj.$saveUrl = "/api/common/insert";
			resumeComProj.doSave(null, function(data) {layer.msg('无公司项目');}, "insert");
			layer.close(loading);
			g.queryDatas();
			layer.msg('数据新增成功');
			g.dataAdd = false;
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		}, "insert");
		//新增完恢复按钮
		g.$refs.dataAddForm.resetFields();
		g.recover('Add');
	}
	
	// 新增档案取消
	methods_page.addDataCancel = function() {
		this.recover('Add');
		this.$refs.dataAddForm.resetFields();
		this.queryDatas();
		this.dataAdd = false;
	}
	
	
	//新增用户数据确定
	methods_page.addUserSave = function() {
		var g = this;
		this.$refs['userAddForm'].validate(function(valid) {
			if (valid) {
				var flag = false;
				//判断用户编码是否重复（用户编码唯一）
				user.doQuery(function(data) {
					for(var i = 0; i < data.dataStore.rows.length; i++) {
						if(data.dataStore.rows[i].user_code == g.curRowUser.user_code) {
							flag = true;
						}
					}
					if(flag) {
						layer.alert("用户编码有重复");
					} else {
						//新建用户数据
						var r = user.newRow();
						r.set('user_sts', 'Y');
						r.set('user_code', g.curRowUser.user_code);
						r.set('user_name', g.curRow.name);
						r.set('user_email', g.curRow.mail);
						r.set('user_mobile', g.curRow.phone);
						r.set('user_pwd', hex_md5(g.curRowUser.user_pwd));
						user.$saveUrl = "/api/common/insert";
						user.$insert = 'SDP-USER-008';
						user.doSave(function(data) {
							resume.$curRow.set('user_id', data.dataStore.rows[0].user_id)
							g.userAdd = false;
							//上传图片
							if($("#basicInfoHeadAdd")[0].value == ""||$("#basicInfoHeadAdd")[0].value ==null){
								g.insertResume();
							} else {
								context.doDataStoreFile('/api/fileImg/upload', function(data){
									//设置图片信息
									g.curRow.img_code = data.data[0];
									//调用插入方法
									g.insertResume();
									layer.msg('上传图片成功');
								}, function(data) {
									layer.msg('上传图片失败');
								}, file, "query", "basicInfoHeadAdd");
							}
						}, function(data) {
							layer.alert(data.msg);
						}, "insert");
					}
				}, function(data) {
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	}
	
	//新增用户数据取消
	methods_page.addUserCancel = function() {
		this.curRowUser.user_code = "";
		this.curRowUser.user_pwd = "111111";
		this.curRowUser.user_pwd1 = "111111";
		this.userAdd = false;
	}
	
	
	
	// 明细确定和取消一样
	methods_page.detailDataCancel = function() {
		this.recover('Detail');
		this.curRow = {};
		this.dataDetail = false;
	}

	//查看用户档案明细数据
	methods_page.detailRow = function(row) {
		this.curRow = row;
		//转化状态
		this.queryOtherMess('detail');
		this.dataDetail = true;
	};
	
	//查询其他数据
	methods_page.queryOtherMess = function(action) {
		var obj = pageVue.curRow;
		var loading = layer.load();
		var g=this;
		//显示图片
		if(g.curRow.img_code != null) {
			if(action == "edit") {
				$(".imgHeadEdit").attr("src",  "../../img/userImg/"+g.curRow.img_code)
				$(".uploadDiv").css("display","none");
				$(".imgDiv").css("display","inline-block");
			} else {
				$(".imgHeadDetail").attr("src",  "../../img/userImg/"+g.curRow.img_code)
			}
		}
		//resumeEdu
		resumeEdu.clearParam();
		resumeEdu.set('resume_id', obj.resume_id);
		resumeEdu.doQuery(function(data) {
			g.updateDatasEdu();
			if(g.dataEdu.length == 0 && action == 'edit'){
				g.handleAdd("edu");
			}
		}, function(data) {
			layer.alert(data.msg);
		});
		//resumeWork
		resumeWork.clearParam();
		resumeWork.set('resume_id', obj.resume_id);
		resumeWork.doQuery(function(data) {
			g.updateDatasWork();
			if(g.dataWork.length == 0 && action == 'edit'){
				g.handleAdd("work");
			}
		}, function(data) {
			layer.alert(data.msg);
		});
		//resumePreProj
		resumePreProj.clearParam();
		resumePreProj.set('resume_id', obj.resume_id);
		resumePreProj.doQuery(function(data) {
			g.updateDatasPreProj();
			if(g.dataProj.length == 0 && action == 'edit'){
				g.handleAdd("proj");
			}
		}, function(data) {
			layer.alert(data.msg);
		});
		//resumeComProj
		resumeComProj.clearParam();
		resumeComProj.set('resume_id', obj.resume_id);
		resumeComProj.doQuery(function(data) {
			g.updateDatasComProj();
			if(g.dataComProj.length == 0 && action == 'edit'){
				g.handleAdd("comProj");
			}
		}, function(data) {
			layer.alert(data.msg);
		});
		
		layer.close(loading);
	}

	// 修改取消
	methods_page.editDataCancel = function() {
		this.recover('Edit');
		this.curRow = {};
		this.queryDatas();
		this.$refs['dataEditForm'].resetFields();
		this.dataEdit = false;
	}
	
	
	// 修改用户档案数据
	methods_page.editRow = function(row) {
		this.dataEdit = true;
		this.curRow = row;
		resume.setCurRow(row);
		//这句话间接绑定了从表data和resumeData之间的关系，
		//先进入queryOtherMess()方法，里面有updateDatas方法，即可绑定
		this.queryOtherMess('edit');
	};
	
	// 修改档案保存
	methods_page.editDataSave = function() {
		var g = this;
		/*
		 * console.log(resumeEdu.$rowSet);
		 * for(var i = 0; i <resumeEdu.$rowSet.$views.length; i++) {
		 *	console.log(resumeEdu.$rowSet.$views[i].$state);
		 *	}
		*/
		this.$refs['dataEditForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				g.delBlankRow();
				g.changeDates();
				//更新从表的数据
				resumeEdu.$saveUrl = "/api/common/save";
				resumeEdu.doSave(null, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
				resumeWork.$saveUrl = "/api/common/save";
				resumeWork.doSave(null, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
				resumePreProj.$saveUrl = "/api/common/save";
				resumePreProj.doSave(null, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
				resumeComProj.$saveUrl = "/api/common/save";
				resumeComProj.doSave(null, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
				//上传图片this.curRow.img_code
				if(g.curRow.img_code != null){
					g.EditInsertResume();
				} else {
					if($("#basicInfoHeadEdit")[0].value != null && $("#basicInfoHeadEdit")[0].value != "") {
						context.doDataStoreFile('/api/fileImg/upload', function(data){
							//设置图片信息
							g.curRow.img_code = data.data[0];
							g.EditInsertResume();
							layer.msg('上传图片成功');
						}, function(data) {
							layer.msg('上传图片失败');
						}, file, "query", "basicInfoHeadEdit");
					} else {
						g.EditInsertResume();
					}
				}
				layer.close(loading);
				//恢复按钮等		
				g.recover('Edit');
			} else {
				layer.msg('修改失败！');
			}
		});
	};
	
	//修改保存时插入主表数据
	methods_page.EditInsertResume = function() {
		var g = this;
		//更新主表的数据
		resume.$saveUrl = "/api/common/update";
		resume.doSave(function() {
			g.queryDatas();
			layer.msg('数据保存成功');
			g.dataEdit = false;
		}, function(data) {
			layer.alert(data.msg);
		}, "update");
	}
	
	
	// 删除角色(修改用户档案失效)
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否失效档案用户[' + row.name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-RESUME-009',
				params : {
					resume_id : row.resume_id
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("用户档案失效");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	//新增修改时，去除空白行插入数据库
	methods_page.delBlankRow = function() {
		for(var i = this.dataWork.length-1; i >= 0 ; i--) {
			if(this.dataWork[i].$state == 1) {
				if(this.dataWork[i].comName == "" && (this.dataWork[i].starttime == null || this.dataWork[i].starttime == "")
					&& (this.dataWork[i].endtime == null || this.dataWork[i].endtime == "") && this.dataWork[i].type == "" 
					&& this.dataWork[i].individual == "" && this.dataWork[i].post == "") {
					resumeWork.$rowSet.delRow(this.dataWork[i]);
				}
			}
		}
		for(var i = this.dataEdu.length-1; i >= 0 ; i--) {
			if(this.dataEdu[i].$state == 1) {
				if(this.dataEdu[i].school == "" && (this.dataEdu[i].starttime == null || this.dataEdu[i].starttime == "")
					&& (this.dataEdu[i].endtime == null || this.dataEdu[i].endtime == "") && this.dataEdu[i].description == "") {
					resumeEdu.$rowSet.delRow(this.dataEdu[i]);
				}
			}
		}
		for(var i = this.dataProj.length-1; i >= 0 ; i--) {
			if(this.dataProj[i].$state == 1) {
				if(this.dataProj[i].projName == "" && (this.dataProj[i].starttime == null || this.dataProj[i].starttime == "")
					&& (this.dataProj[i].endtime == null || this.dataProj[i].endtime == "") && this.dataProj[i].projRemark == ""
					&& this.dataProj[i].projScale == "" && this.dataProj[i].projPeriod == "") {
					resumePreProj.$rowSet.delRow(this.dataProj[i]);
				}
			}
		}
		for(var i = this.dataComProj.length-1; i >= 0 ; i--) {
			if(this.dataComProj[i].$state == 1) {
				if(this.dataComProj[i].proj_code == "" && this.dataComProj[i].projMajor == "") {
					resumeComProj.$rowSet.delRow(this.dataComProj[i]);
				}
			}
		}
	}
	
	//改变所有日期类型的格式
	methods_page.changeDates = function() {
		var g = this;
		g.curRow.in_date = g.changeDateFormat(g.curRow.in_date);
		g.curRow.birth_date = g.changeDateFormat(g.curRow.birth_date);
		for(var i = 0; i < g.dataEdu.length; i++) {
			g.dataEdu[i].starttime = g.changeDateFormat(g.dataEdu[i].starttime);
			g.dataEdu[i].endtime = g.changeDateFormat(g.dataEdu[i].endtime);
		}
		for(var i = 0; i < g.dataWork.length; i++) {
			g.dataWork[i].starttime = g.changeDateFormat(g.dataWork[i].starttime);
			g.dataWork[i].endtime = g.changeDateFormat(g.dataWork[i].endtime);
		}
		for(var i = 0; i < g.dataProj.length; i++) {
			g.dataProj[i].starttime = g.changeDateFormat(g.dataProj[i].starttime);
			g.dataProj[i].endtime = g.changeDateFormat(g.dataProj[i].endtime);
		}
		
	}
	
	//转化日期格式
	methods_page.changeDateFormat = function(value) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
		if(value != null && value != ""){
			if(value.toString().match(reg) == null) {
				return value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
			} 
		} else if (value == "") {
			return null;
		}
	}

	// 角色状态格式化(表格)
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.user_state;
	};
	
	
	// 角色状态格式化(页面)
	methods_page.stsFormatDetail = function(col) {
		var m = this.dicMaps[table];
		if (typeof(col) !="undefined" && m[col] != null && m[col] != "") {
			return m[col];
		}
		return "";
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
	
	//恢复按钮页面等
	methods_page.recover = function(action) {
		var baseMessAction = "baseMess"+action;
		var fileId = '.imgHead' + action;
		if(action == "Add") {
			this.$refs.iMenuAdd.currentActiveName = baseMessAction;
			$(".uploadDiv").css("display","inline-block");
			$(".imgDiv").css("display","none");	
		} else if (action == "Detail") {
			this.$refs.iMenuDetail.currentActiveName = baseMessAction;
			$(fileId).attr('src','../../img/touxiang.png'); 
		} else if (action == "Edit") {
			this.$refs.iMenuEdit.currentActiveName = baseMessAction;
			$(".uploadDiv").css("display","inline-block");
			$(".imgDiv").css("display","none");	
		}
		$(".baseMess" + action).show();
        $(".preMess" + action).hide();
        $(".projMess" + action).hide();
        $(".otherMess" + action).hide();
    }
	
	//清空重置
	methods_page.reset = function(action) {
		if(action == 'Add') {
			this.$refs['dataAddForm'].resetFields();
		} else if (action == 'Edit') {
			this.$refs['dataEditForm'].resetFields();
		}
    }
	
	//上传图片($.when无法同步ajaxfileupload异步问题)
	methods_page.uploadHead=function(targetId){
		var g = this;
		if($('#' + targetId)[0].value == ""||$('#' + targetId)[0].value ==null){
			return 1;
		}
		context.doDataStoreFile('/api/fileImg/upload', function(data){
			g.curRow.img_code = data.data[0];
			layer.msg('上传图片成功');
			return 2;
		}, function(data) {
			layer.msg('上传图片失败');
			return 3;
		}, file, "query", targetId);
	};  
	
	// 点击删除图片
	methods_page.clearFile=function(targetId){
		this.curRow.img_code != null && (this.curRow.img_code = null)
		$(".uploadDiv").css("display","inline-block");
		$(".imgDiv").css("display","none");		
		$("#basicInfoHeadAdd")[0].value = "";
		$("#basicInfoHeadEdit")[0].value = "";
		$(targetId).src=""; 
	}
		
	// 触发点击文件上传按钮
	methods_page.clickFile=function(targetId){	
		$(targetId).click();			
	}

	//回到首页
	methods_page.returnHome = function() {
		window.location.href='../b.html';
	}
	

	// 初始化查询
	page_conf.mounted = function() {
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

	// 表格内行操作
	function actionRender(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "详情", "fa fa-clipboard", function() {
			pageVue.detailRow(row);
		}));
		arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
			pageVue.editRow(row);
		}));
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			pageVue.deleteRow(row);
		}));
		return h('button-group', {
		attrs : {size : 'small'}
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
	
	//改变标签
	function showMess(code, action) {
		var baseMessClass = "baseMess" + action;
		var preMessClass = "preMess" + action;
		var projMessClass = "projMess" + action;
		var otherMessClass = "otherMess" + action;
		$("." + baseMessClass).hide();
		$("." + preMessClass).hide();
		$("." + projMessClass).hide();
		$("." + otherMessClass).hide();
		if(baseMessClass == code) {
			$("." + baseMessClass).show();
		} else if (preMessClass == code) {
			$("." + preMessClass).show();
		} else if (projMessClass == code) {
			$("." + projMessClass).show();
		} else if (otherMessClass == code) {
			$("." + otherMessClass).show();
		}
	}
	
	// 验证密码
	function validatePass(rule, value, callback) {
		if (!value) {
			return callback(new Error('请输入密码'));
		}
		if (value.length < 6 || value.length > 20) {
			return callback(new Error('长度在 6到 20 个字符'));
		}

		if (pageVue.curRowUser.user_pwd1 !== '') {
			pageVue.$refs.userAddForm.validateField('user_pwd1');
		}
		return callback();
	}

	// 验证确认密码
	function validatePass1(rule, value, callback) {
		if (!value) {
			return callback(new Error('请再次输入密码'));
		}
		if (value !== pageVue.curRowUser.user_pwd) {
			return callback(new Error('两次输入密码不一致!'));
		}
		return callback();
	}
	
	//键盘事件
	document.onkeydown=function(event){ 
		var data = page_conf.data;
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e.keyCode == 13) {
			if(data.dataAdd == false && data.dataEdit == false && data.dataDetail == false) {
				pageVue.queryDatas();
			} else if(data.dataAdd == true) {
				//pageVue.addDataSave();//会影响多行输入的enter
			} else if(data.dataEdit == true) {
				//pageVue.editDataSave();
			} else if(data.dataDetail == true) {
				pageVue.detailDataCancel();
			}
		}
		if(e && e.keyCode == 27) {
			if(data.dataAdd == true) {
				pageVue.addDataCancel();
			} else if(data.dataEdit == true) {
				pageVue.editDataCancel();
			} else if(data.dataDetail == true) {
				pageVue.detailDataCancel();
			}
		}
		if(e && e.keyCode == 9) {
			if(data.dataAdd == false && data.dataEdit == false && data.dataDetail == false) {
				$('#paramName').focus();
			} 
		}
		
	};

});

//显示更多
function getMoreMess(action) {
	$(".moreMess" + action).toggle();
	if($(".moreMess" + action).css('display') == 'inline' 
		|| $(".moreMess" + action).css('display') == 'block') {
		$(".moreBut" + action).text("收起");
		$(".mainBody" + action).css('height', '400px');
	} else if ($(".moreMess" + action).css('display') == 'none'){
		$(".moreBut" + action).text("更多");
		$(".mainBody" + action).css('height', '250px');
	}
}

// 鼠标滑入出现删除按钮
function showClear(){
    $(".imgDiv").css("opacity","0.3");
    $(".clearFileDiv").css("display","block");
}
//鼠标移除时隐藏
function hiddenClear(){
	$(".imgDiv").css("opacity","1");
	$(".clearFileDiv").css("display","none");	
}	

//将本地图片 显示到浏览器上
function preImg(sourceId, targetId) { 
	if(validate_edit_logo(sourceId)) {
		var url = getFileUrl(sourceId); 
		var imgPre = $(targetId); 
		imgPre.attr('src', url);
		$(".uploadDiv").css("display","none");
		$(".imgDiv").css("display","inline-block");
	} 
} 

//预览
function getFileUrl(sourceId) { 
	var url; 
	if (navigator.userAgent.indexOf("MSIE")>=1) { // IE
		url = document.getElementById(sourceId).value; 
	} else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox
		url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0)); 
	} else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome
		url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0)); 
	} 
	return url;
} 

//图片校验
function validate_edit_logo(sourceId){ 
	var file = $("#" + sourceId)[0].value;  
	if(!/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(file)){   
		alert("图片类型必须是.gif,jpeg,jpg,png中的一种")
		file="";
		return false;    
	}else{
		var filesize = $("#" + sourceId)[0].files[0].size   		  
		if(filesize>1024000){   
			alert('请传大小小于1M的图片');  
			file="";
			return false;   
		}   
		else{   
			return true;   
		}   
	}   
}   


