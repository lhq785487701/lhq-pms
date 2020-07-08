/**
 * 数据容器脚本
 * 
 * @文件名 SDPContext
 * @作者 李浩祺
 * @创建日期 2017-04-18
 * @版本 V 1.0
 */
"use strict";
$(function() {
	window.SDP = $.SDP = $.SDP || {};
	SDP.ds = {};

	SDP.SDPContext = function() {
		var $dataStores = {};
		var $page = null;

		this.$parameters = {};

		this.statement = "";
		this.$keyField = "";
		this.$keyFields = null;
		this.$inserts = null;
		this.$updates = null;
		this.$deletes = null;

		var g = this;

		this.getPage = function() {
			if ($page == null) {
				$page = new SDP.ds.Page(this);
			}
			return $page;
		};

		this.setParameter = function(name, value) {
			this.$parameters[name] = value;
		};
		this.set = function(name, value) {
			this.$parameters[name] = value;
		};
		this.put = function(ps) {
			for ( var n in ps) {
				var val = "";
				if(ps[n] instanceof Array) {
					val = ps[n];
				} else {
					val = $.trim(ps[n]);
				}
				if (val != "") {
					this.set(n, val);
				} else {
					this.removeParameter(n);
				}
			}
		};
		this.clearParam = function() {
			this.$parameters = {};
		};
		this.removeParameter = function(name) {
			delete this.$parameters[name];
		};
		this.getDataStore = function(name) {
			return $dataStores[name];
		};

		this.getSingleDataStore = function() {
			if ($dataStores) {
				for ( var name in $dataStores) {
					return $dataStores[name];
				}
			}
			return null;
		};
		this.getDataStores = function() {
			return $dataStores;
		};
		this.addDataStore = function(name, dataStore) {
			if (arguments[0] == null)
				return;
			if (!$.isPlainObject(arguments[0])) {
				dataStore = arguments[0];
				name = dataStore.$name;
			}
			if (name in $dataStores) {
				return;
			}

			$dataStores[name] = dataStore;
		};
		this.removeDataStore = function(name) {
			delete $dataStores[name];
		};
		this.clear = function() {
			$parameters = {};
			$dataStores = {};
		};
		this.isEmpty = function() {
			var _empty = $.isEmptyObject;
			return (_empty($parameters) && _empty($dataStores));
		};
		this.newDataStore = function(name, options) {
			var ds = this.getDataStore(name);
			ds = ds || new SDP.ds.DataStore(name, this);
			options = options || {};

			this.addDataStore(ds);
			return ds;
		};
		this.containRowSet = function(name) {
			var dataStore = this.getDataStore(name);
			if (dataStore && !dataStore.getRowSet().isEmpty()) {
				return true;
			}
			return false;
		};

		function params() {
			var obj = {};
			$.each(SDP.params, function(n, val) {
				if($.isFunction(val)){
					return;
				}
				obj[n] = val;
			});
			$.each(g.$parameters, function(n, val) {
				obj[n] = val;
			});
			return obj;
		}

		this.doData = function(url, success, error) {
			var body = {
				params : params()
			};

			if (this.statement && this.statement != "") {
				body['statement'] = this.statement;
			}
			if (this.$inserts != null) {
				body["inserts"] = this.$inserts;
			}
			if (this.$updates != null) {
				body["updates"] = this.$updates;
			}
			if (this.$deletes != null) {
				body["deletes"] = this.$deletes;
			}

			if (this.$keyField && this.$keyField != '') {
				if (this.$keyFields == null) {
					this.$keyFields = [ this.$keyField ];
				} else if (this.$keyFields.indexOf(this.$keyField) < 0) {
					this.$keyFields.unshift(this.$keyField);
				}
			}

			if (this.$keyFields != null) {
				body["keyFields"] = this.$keyFields;
			}

			if ($page != null) {
				body["page"] = $page.toObject();
			}

			this.doAction(body, url, function(data) {
				if ("page" in data && $page != null) {
					$page.$initData(data["page"]);
					$page.resetIsChange();
				}
				if (success) {
					success(data.data, ('msg' in data) ? data.msg : "");
				}
			}, error);
		};

		this.doAction = function(data, url, success, error) {
			if (data) {
				if (data.params) {
					data.params['sdp_menu_code'] = SDP.params['sdp_menu_code'];
				} else {
					data.params = {
						'sdp_menu_code' : SDP.params['sdp_menu_code']
					};
				}
			}
			var request = $.ajax({
				cache : false,
				url : SDP.URL.getUrl(url),
				contentType : "application/json; charset=utf-8",
				method : "post",
				data : JSON.stringify(data, filterJson, ""),
				dataType : 'json'
			});
			var g = this;
			request.done(function(data) {
				if (data != null && ("session_code" in data)
						&& data["session_code"] != null) {
					SDP.params["session_code"] = data["session_code"];
				}
				if (data.code == 1) {
					if (success) {
						success(data);
					}
				} else {
					if (error) {
						error(data);
					}
				}
			});

			request.fail(function(jqXHR, textStatus) {
				if (errorFun(jqXHR)) {
					textStatus = "当前登录已失效，请重新登陆—-1—" + jqXHR.responseText;
				}
				if (error) {
					error({
						msg : textStatus + "1"
					});
				}
			});
		};

		this.toDSJSON = function(ds, type) {
			var body = {
				params : params()
			};
			body["dataStore"] = ds.toObject(type);
			return JSON.stringify(body, filterJson, "");
		};

		// $$属性不会被传入到服务端
		function filterJson(key, val) {
			if (key && key.indexOf("$$") == 0) {
				return;
			}
			return val;
		}

		function errorFun(jqXHR) {
			var txt = jqXHR.responseText;
			if (txt
					&& (txt.indexOf('请填写您的用户信息') > 0
							|| txt.indexOf('当前用户身份不合法') > 0
							|| txt.indexOf('用户登录') > 0 || txt
							.indexOf('未登录系统，禁止访问') >= 0)) {
				return true;
			}
			return false;
		}

		this.doDataStore = function(url, success, error, ds, type) {
			if (!ds.isDO(type)) {
				if (error) {
					error({
						msg : "数据无更新!"
					});
				} else {
					alert("数据无更新!");
				}
				return;
			}

			var body = {
				params : params()
			};

			body["dataStore"] = ds.toObject(type);

			this.doAction(body, url, function(data) {
				var dds = data.dataStore;
				if (type == "query") {
					ds.$loadData(dds);
				} else if (type == "save") {
					ds.$rowSet.freshSave(dds.rows);
				} else if (type == "update") {
					ds.$rowSet.fresh(dds.rows);
				} else if (type == "insert") {
					ds.$rowSet.fresh(dds.rows);
				} else if (type == "delete") {
					ds.$rowSet.freshDelRows(dds.rows);
				}
				if (success) {
					success(data);
				}
			}, error);
		};

		// type:insert 只有插入数据，update 只有变化数据，delete只有删除数据，save 所有数据
		this.doDataStores = function(url, success, error, type) {
			var store = {}, body = {};
			var ds;
			for ( var dataStore in $dataStores) {
				ds = $dataStores[dataStore];
				if (ds != null) {
					ds.$apply();
					store[ds.$name] = ds.toObject(type);
				}
			}
			body["dataStores"] = store;
			body["params"] = params();

			this.doAction(body, url, function(data) {
				var dss = data.dataStores;
				$.each(dss, function(n, d) {
					ds = $dataStores[n];
					if (type == "query") {
						ds.$loadData(d);
					} else if (type == "save") {
						ds.$rowSet.freshSave(d.rows);
					} else if (type == "update") {
						ds.$rowSet.fresh(d.rows);
					} else if (type == "insert") {
						ds.$rowSet.fresh(d.rows);
					} else if (type == "delete") {
						ds.$rowSet.freshDelRows(d.rows);
					}
				});

				if (success) {
					success(data);
				}
			}, error);
		};

		this.doDataStoreFile = function(url, success, error, ds, type,
				fileElementId) {
			var body = {
				params : params()
			};
			ds.$apply();
			body["dataStore"] = ds.toObject(type);
			var g = this;
			var conf = {
				url : SDP.URL.getUrl(url),
				type : 'post',
				secureuri : false, // 一般设置为false
				fileElementId : fileElementId, // 上传文件的id、name属性名
				dataType : "json",
				data : JSON.stringify(body, filterJson, ""),
				success : function(data, status) // 服务器成功响应处理函数
				{
					if ("session_code" in data && data["session_code"] != null) {
						SDP.params["session_code"] = data["session_code"];
					}
					if (data.code == 1) {
						var dds = data.dataStore;
						if (dds != null) {
							if (type == "query") {
								ds.$loadData(dds);
							} else if (type == "save") {
								ds.$rowSet.freshSave(dds.rows);
							} else if (type == "update") {
								ds.$rowSet.fresh(dds.rows);
							} else if (type == "insert") {
								ds.$rowSet.fresh(dds.rows);
							} else if (type == "delete") {
								ds.$rowSet.freshDelRows(dds.rows);
							}
						}
						if (success) {
							success(data);
						}
					} else {
						if (error) {
							error(data);
						}
					}
				},
				error : function(jqXHR, textStatus, e)// 服务器响应失败处理函数
				{
					if (errorFun(jqXHR)) {
						textStatus = "当前登录已失效，请重新登陆—-2—" + jqXHR.responseText;
					}
					if (error) {
						error({
							msg : textStatus + "2"
						});
					}
				}
			};

			$.ajaxFileUpload(conf);
		};

		this.doDataStoresFile = function(url, success, error, type,
				fileElementId) {
			var store = {}, body = {};
			var ds;
			for ( var dataStore in $dataStores) {
				ds = $dataStores[dataStore];
				if (ds != null) {
					ds.$apply();
					store[ds.$name] = ds.toObject(type);
				}
			}
			body["dataStores"] = store;
			body["params"] = params();

			$.ajaxFileUpload({
				url : SDP.URL.getUrl(url),
				type : 'post',
				secureuri : false, // 一般设置为false
				fileElementId : fileElementId, // 上传文件的id、name属性名
				dataType : "json",
				data : JSON.stringify(body, filterJson, ""),
				success : function(data, status) // 服务器成功响应处理函数
				{
					if (data.code == 1) {
						var dss = data.dataStores;
						$.each(dss, function(n, d) {
							ds = $dataStores[n];
							if (type == "query") {
								ds.$loadData(d);
							} else if (type == "save") {
								ds.$rowSet.freshSave(d.rows);
							} else if (type == "update") {
								ds.$rowSet.fresh(d.rows);
							} else if (type == "insert") {
								ds.$rowSet.fresh(d.rows);
							} else if (type == "delete") {
								ds.$rowSet.freshDelRows(d.rows);
							}
						});
						if (success) {
							success(data);
						}
					} else {
						if (error) {
							error(data);
						}
					}
				},
				error : function(jqXHR, textStatus, e)// 服务器响应失败处理函数
				{
					if (errorFun(jqXHR)) {
						textStatus = "当前登录已失效，请重新登陆—-3—" + jqXHR.responseText;
					}
					if (error) {
						error({
							msg : textStatus + "3"
						});
					}
				}
			});
		};

		this.downFile = function(url, success, error) {
			var body = {
				params : params()
			};

			if (this.statement && this.statement != "") {
				body['statement'] = this.statement;
			}

			if (!$.isEmptyObject($page)) {
				body["page"] = $page.toObject();
			}

			$.download({
				url : SDP.URL.getUrl(url),
				type : 'post',
				secureuri : false, // 一般设置为false
				dataType : "json",
				data : JSON.stringify(body, filterJson, ""),
				success : function(data, status) // 服务器成功响应处理函数
				{
					if (data.code == 1) {
						if (success) {
							success(data);
						}
					} else {
						if (error) {
							error(data);
						}
					}
				},
				error : function(jqXHR, textStatus, e)// 服务器响应失败处理函数
				{
					if (errorFun(jqXHR)) {
						textStatus = "当前登录已失效，请重新登陆—-4—" + jqXHR.responseText;
					}
					if (error) {
						error({
							msg : textStatus + "4"
						});
					}
				}
			});
		};
	};

	SDP.SDPContext = $.SDP.SDPContext;
});