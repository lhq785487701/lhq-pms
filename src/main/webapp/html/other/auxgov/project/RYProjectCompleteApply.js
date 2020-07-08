$(function() {
	// 头部配置
	var context = new SDP.SDPContext();
	var file = context.newDataStore("file");
	file.$queryUrl = "/api/common/selectList";
	file.statement = "SDP-FILE-002";
	context.set("bus_type","sdp-aux-xm-complete");
	context.set("business_no","11111111111");
	
	var proItem = {
			proName:'奥克斯财务优化项目',
			proNumber:'XXXXXXXXXXXX',
			version:'version1.0',
			proYear:'2018',
			proManager:'刁忠行',
			proStartTime:'2017-06-11',
			planEndTime:'2017-06-11',
			proEndTime:'2017-06-11',
			completePerson:'李浩祺',
			accountedComplany:'赛意股份有限公司',
			proPresentStage:'结项',
			proState:'结项',
			proStage:'AAAAA',
			proTotalIncentive:'200000'
		};

	var page_conf = {
		el : "#mainContainer",
		data : {
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			proItem : proItem,
			spread : 'projectMember',
			//rules : rules,
			impUrl : SDP.URL.getUrl('/api/fileManage/uploadFile'),
			impData : {},
			acceptFormat:'.xls,.xlsx,.doc,.docx',
			uploadFormat : [ 'xls', 'xlsx', '.doc', '.docx' ],
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	methods_page.uploadSuccess = function() {
		//this.queryFileDatas();
	};
	
	methods_page.uploadError = function() {
		alert("上传异常");
	};
	
	methods_page.beforeUpload = function(f) {
		var line=file.$rowSet.findByMaxValue("line_no");
		line++;
		var data = {
			'params' : {
				'business_no' : '11111111111',
				'bus_type' : 'sdp-aux-xm-complete',
				'line_no':line
			}
		};
		this.impData['sdpData'] = JSON.stringify(data, null, "");
	}
	
	var pageVue = new Vue(page_conf);
	
	
	//获取输入框的值
	function getTableInputValue(clazz){
		var arr = []
		$(clazz).each(function(){
			arr.push($(this).val())
		})
		return arr;
	}
	
	function  packageTableDatas(){
		
	}
})
	
	
	
	
	
	