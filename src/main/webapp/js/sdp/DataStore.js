/**
 * 数据中心脚本
 * 
 * @文件名 dataStore.js
 * @作者 李浩祺
 * @创建日期 2017-04-29
 * @版本 V 1.0
 */
"use strict";
$(function() {
	SDP.ds.Status = {
		NONE : 0,
		NEW : 1,
		UPDATE : 2,
		DELETE : 3
	};

	SDP.ds.DataStore = function(name, dc) {
		var $parameters = {};
		var $context = dc;
		var $parentDs = null;
		var $childDS = null;
		var $fields = null;

		var $defaultCurRowIndex = -1;
		var $curIndex = -1;
		this.$name = name;
		this.$curRow = null;

		this.$page = null;
		this.$keyField = "";
		this.names = null;
		this.$keyFields = null;

		this.$update = "";
		this.$insert = "";
		this.$delete = "";
		this.$inserts = null;
		this.$updates = null;
		this.$deletes = null;
		this.statement = "";

		this.$parentKeys = {};
		this.$queryUrl = "";
		this.$saveUrl = "";

		this.getCurIndex = function() {
			return $curIndex;
		};

		this.setParentDS = function(pds) {
			$parentDs = pds;
			if (pds) {
				pds.putChild(this);
			}
		};

		this.putFileds = function(flds) {
			$fields = flds;
		};

		this.getFields = function() {
			return $fields;
		};

		this.putChild = function(ds) {
			if ($childDS == null) {
				$childDS = [];
			}
			$childDS.push(ds);
		};

		this.getChildDS = function() {
			return $childDS;
		};

		this.getParentDS = function() {
			return $parentDs;
		};

		this.$rowSet = new SDP.ds.RowSet(this);

		if (arguments.length == 2) {
			$context = dc;
		}

		this.getRecordCount = function() {
			return this.$rowSet.getRecordCount();
		};

		this.setCurRow = function(r) {
			if (this.$curRow != r) {
				$curIndex = this.$rowSet.getIndex(r);
				this.$curRow = r;
				if ($childDS != null) {
					$.each($childDS, function(index, itm) {
						itm.setCurRow(null);
						itm.$rowSet.$initData();
						if (r == null) {

						} else {
							if (r.$state != SDP.ds.Status.NEW) {
								if (itm.$parentKeys != null) {
									$.each(itm.$parentKeys, function(n, v) {
										itm.set(v, r[n]);
									});
								}
							}
						}
					});
				}
			}
		};

		this.doQuery = function(success, error) {
			$context.doDataStore(this.$queryUrl, success, error, this, "query");
		};

		this.doSave = function(success, error, type) {
			$context.doDataStore(this.$saveUrl, success, error, this, type);
		};

		this.freshCurRow = function(url, success, error) {
			if (this.$curRow != null && this.$keyField != null
					&& this.$keyField != '') {
				var body = {};
				var pars = {};
				body['params'] = pars;
				pars[this.$keyField] = this.$curRow[this.$keyField];
				var g = this;
				$context.doAction(body, url, function(data) {
					g.$curRow.fresh(data.data);
					if (success) {
						success(data.data);
					}
				}, error);
			}
		};

		this.setOptions = function(op) {
			op = op || {};
			for ( var n in op) {
				try {
					this["set" + n.substr(0, 1).toUpperCase() + n.substr(1)]
							(obj[n]);
				} catch (e) {
				}
			}
		};
		this.setDefaultCurRowIndex = function(val) {
			$defaultCurRowIndex = val;
		};

		this.next = function() {
			var c = this.$rowSet.getViewCount();

			if ($curIndex + 1 < c) {
				this.setCurRow(this.$rowSet.$views[$curIndex + 1]);
			}
		};

		this.pre = function() {
			if ($curIndex >= 0) {
				this.setCurRow(this.$rowSet.$views[($curIndex == 0 ? 0
						: $curIndex - 1)]);
			} else {
				this.setCurRow(null);
			}
		};

		this.last = function() {
			var c = this.$rowSet.getViewCount();
			if (c > 0) {
				this.setCurRow(this.$rowSet.$views[c - 1]);
			}
		};

		this.first = function() {
			var c = this.$rowSet.getViewCount();
			if (c > 0) {
				this.setCurRow(this.$rowSet.$views[0]);
			}
		};

		this.$loadData = function(ds) {
			if ("page" in ds) {
				this.$page.$initData(ds["page"]);
				this.$page.resetIsChange();
			}
			if ("names" in ds) {
				this.names = ds["names"];
			}
			$curIndex = -1;
			ds = ds.rows;
			var pindex = -1;
			this.setCurRow(null);
			if ($parentDs != null && $parentDs.$curRow != null) {
				pindex = $parentDs.$curRow.$index;
			}
			this.$rowSet.$loadData(ds, pindex);
			if ($defaultCurRowIndex >= 0) {
				this.setCurRow(this.$rowSet.getRowByIndex($defaultCurRowIndex));
			}
		};

		this.getParameter = function(name) {
			var value = $parameters[name];
			return value;
		};
		this.set = function(name, value) {
			$parameters[name] = value;
		};
		this.put = function(ps) {
			for ( var n in ps) {
				var val = ps[n];
				if (val != null && val != "") {
					this.set(n, val);
				} else {
					this.removeParameter(n);
				}
			}
		};
		this.addParameter = function(name, value) {
			$parameters[name] = value;
		};
		this.clearParam = function() {
			$parameters = {};
		};
		this.removeParameter = function(name) {
			delete $parameters[name];
		};
		this.getPage = function() {
			if (this.$page == null) {
				this.$page = new SDP.ds.Page(this);
			}
			return this.$page;
		};

		this.newRow = function(defaultVal, index) {
			var r = null;
			if ($parentDs == null) {
				r = this.$rowSet.newRow(index, defaultVal);
			} else {
				if ($parentDs.$curRow == null) {
					layer.msg("父数据源没有当前行!");
					return null;
				}
				r = this.$rowSet.newRow(index, defaultVal);
				r.$pindex = $parentDs.$curRow.$index;
				if (this.$parentKeys != null) {
					$.each(this.$parentKeys, function(n, v) {
						r.set(v, $parentDs.$curRow[n]);
					});
				}
			}
			if ($childDS != null) {
				$.each($childDS, function(index, itm) {
					itm.$rowSet.$views = [];
				});
			}
			this.setCurRow(r);
			return r;
		};

		this.delCurRow = function() {
			if (this.$curRow) {
				this.delRow(this.$curRow);
				if ($curIndex > 1) {

				} else if (this.$rowSet.getViewCount() > 0) {
					$curIndex = 1;
				}

				this.pre();
			}
		};

		this.delRow = function(r) {
			if ($childDS != null) {
				$.each($childDS, function(index, itm) {
					var rs = itm.delRowByPIndex(r.$index);
					itm.delRows(rs);
				});
			}
			this.delRows([ r ]);
		};

		this.delRowByPIndex = function(index) {
			return this.$rowSet.getRowByPIndex(index);
		};

		this.delRows = function(rs) {
			this.$rowSet.delRows(rs);
		};

		this.parent = function() {
			return $context;
		};

		this.findByValue = function(fld, val) {
			return this.$rowSet.findByValue(fld, val);
		};

		this.isDO = function(type) {
			if (type == 'update') {
				this.$apply();
				return this.$rowSet.isState(SDP.ds.Status.UPDATE);
			} else if (type == "insert") {
				return this.$rowSet.isState(SDP.ds.Status.NEW);
			} else if (type == 'delete') {
				return this.$rowSet.isState(SDP.ds.Status.DELETE);
			} else if (type == 'change') {
				this.$apply();
				return this.$rowSet.isChange();
			}
			return true;
		};

		this.$apply = function() {
			this.$rowSet.$apply();
		};

		this.toObject = function(type) {
			var body = {
				name : this.$name,
				statement : this.statement
			};
			if (!$.isEmptyObject($parameters)) {
				body["params"] = $parameters;
			}
			if ($parentDs != null) {
				body["parent"] = $parentDs.$name;
			}
			if (this.$keyFields != null) {
				body["keyFields"] = this.$keyFields;
			}

			if (type == "query") {
				if (!$.isEmptyObject(this.$page)) {
					body["page"] = this.$page.toObject();
				}
				this.setCurRow(null);
			} else {
				if (type == 'save') {
					if (!$.isEmptyObject(this.$parentKeys)) {
						body["parentKeys"] = this.$parentKeys;
					}
					if (this.$keyField && this.$keyField != '') {
						body["keyField"] = this.$keyField;
					}
					body["insert"] = this.$insert;
					body["update"] = this.$update;
					body["delete"] = this.$delete;
					if (this.$inserts != null) {
						body["inserts"] = this.$inserts;
					}
					if (this.$updates != null) {
						body["updates"] = this.$updates;
					}
					if (this.$deletes != null) {
						body["deletes"] = this.$deletes;
					}
				} else if (type == "insert") {
					if (!$.isEmptyObject(this.$parentKeys)) {
						body["parentKeys"] = this.$parentKeys;
					}
					if (this.$keyField && this.$keyField != '') {
						body["keyField"] = this.$keyField;
					}
					body["insert"] = this.$insert;
					if (this.$inserts != null) {
						body["inserts"] = this.$inserts;
					}
				} else if (type == 'update') {
					if (!$.isEmptyObject(this.$parentKeys)) {
						body["parentKeys"] = this.$parentKeys;
					}
					if (this.$keyField && this.$keyField != '') {
						body["keyField"] = this.$keyField;
					}
					body["update"] = this.$update;
					if (this.$updates != null) {
						body["updates"] = this.$updates;
					}
				} else if (type == 'delete') {
					body["delete"] = this.$delete;
					if (this.$deletes != null) {
						body["deletes"] = this.$deletes;
					}
				}
				body["rows"] = this.$rowSet.toObject(type);
			}
			return body;
		};
	};
});