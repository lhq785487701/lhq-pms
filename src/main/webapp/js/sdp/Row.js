/**
 * 行数据脚本
 * 
 * @文件名 row.js
 * @作者 李浩祺
 * @创建日期 2017-04-29
 * @版本 V 1.0
 */
"use strict";
$(function() {
	SDP.ds.Row = function(index, rs) {
		index = index || 0;

		var $selected = false;
		var $rowSet = rs;
		var $old = {};

		this.$state = SDP.ds.Status.NONE;
		this.$index = index;
		this.$pindex = -1;

		this.setRowStatus = function(status) {
			if (this.$state == status) {
				return;
			}
			if (this.$state == SDP.ds.Status.NEW) {
				return;
			} else {
				this.$state = status;
			}
		};

		this.isNewState = function() {
			return (this.$state == SDP.ds.Status.NEW);
		};

		this.del = function() {
			$rowSet.delRows([ this ]);
		};

		this.isSelected = function() {
			return $selected;
		};

		this.setSelected = function(b) {
			return $selected = b;
		};
		this.getOriValue = function(name) {
			return $old[name];
		};
		this.getRowSet = function() {
			return $rowSet;
		};
		this.set = function(name, value) {
			name = $.isPlainObject(name) ? name.alias : name;
			if (!(name in $old)) {
				$old[name] = null;
			}
			var n1 = name in this ? this[name] : null;

			if (n1 == value)
				return true;

			this[name] = value;
			this.setRowStatus(SDP.ds.Status.UPDATE);
			return true;
		};
		this.$loadData = function(data) {
			if ("$state" in data) {
				this.setRowStatus(data["$state"]);
				delete data["$state"];
			}
			var old = data["$old"] || {};
			if ("$old" in data) {
				delete data["$old"];
			}
			var g = this;
			$.each(data, function(n, val) {
				val = old[n] || data[n];
				$old[n] = val;
				g[n] = data[n];
			});
		};
		this.clear = function() {
			$rowSet = null;
			$old = {};
		};
		this.parent = function() {
			return $rowSet;
		};
		this.getFields = function() {
			return $rowSet.getDataStore().getFields();
		};
		this.fresh = function(r) {
			if (r == null) {
				return;
			}
			var g = this;
			$.each(r, function(n, val) {
				// && n != "$index" && n != "$pindex"
				if (n != null) {
					g[n] = val;
					if (!$.isFunction(g[n])) {
						$old[n] = val;
					}
				}
			});
		};

		this.copy = function(r, flds) {
			var g = this;
			flds = this.getFields() || flds;
			if (flds == null) {
				$.each(r, function(n, val) {
					if (n.indexOf("$") < 0 && !$.isFunction(r[n])) {
						g.set(n, val);
					}
				});
			} else {
				$.each(flds, function(index, n) {
					if (n in r) {
						g.set(n, r[n]);
					}
				});
			}
		};

		this.$apply = function() {
			if (this.$state == SDP.ds.Status.NONE) {
				var g = this;
				var flds = this.getFields();
				if (flds) {
					$.each(flds, function(index, n) {
						if (g[n] != $old[n]) {
							g.$state = SDP.ds.Status.UPDATE;
							return false;
						}
					});
				} else {
					$.each(g, function(n, val) {
						if (n.indexOf("$") < 0 && !$.isFunction(g[n])
								&& val != $old[n]) {
							g.$state = SDP.ds.Status.UPDATE;
							return false;
						}
					});
				}
			}
		};
	};
});