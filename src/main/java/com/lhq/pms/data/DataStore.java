package com.lhq.pms.data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.lhq.pms.exception.PMSException;
import com.lhq.pms.type.StateType;
import com.lhq.pms.utils.StringUtils;

/**
 * 数据集
 * 
 * @author lhq 
 */
public class DataStore implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4208429314939042558L;

	/** 子数据源 **/
	private Map<String, DataStore> childs = null;

	/** 删除语句 **/
	private String delete = null;

	/** 删除语句集合 **/
	private List<String> deletes = null;
	/** 插入语句 **/
	private String insert = null;
	/** 插入语句集合 **/
	private List<String> inserts = null;
	/** 主键字段 **/
	private String keyField = "";

	/** 关键字段集合 **/
	private List<String> keyFields = null;

	/** 数据源名称 **/
	private String name = "";
	/** 分页 **/
	private Page page = null;

	/** 参数 **/
	private Map<String, Object> params = null;

	/** 父数据源 **/
	private String parent = "";

	private DataStore parentDataStore = null;

	/** key 主表字段，value 当前表字段 **/
	private Map<String, String> parentKeys = null;

	private List<Row> rows = null;

	/**
	 * 执行语句
	 */
	private String statement;

	/** 更新语句 **/
	private String update = null;
	/** 更新语句集合 **/
	private List<String> updates = null;

	/**
	 * 添加数据源
	 * 
	 * @param ds
	 */
	public void addChild(DataStore ds) {
		if (this.childs == null) {
			this.childs = new HashMap<String, DataStore>(10);
		}
		this.childs.put(ds.getName(), ds);
	}

	/**
	 * @return the childs
	 */
	public Map<String, DataStore> getChilds() {
		return childs;
	}

	/**
	 * 添加参数
	 * 
	 * @param key
	 *            参数名称
	 * @param val
	 *            参数值
	 */
	public void addParam(String key, Object val) {
		if (this.params == null) {
			this.params = new HashMap<String, Object>(20);
		}
		this.params.put(key, val);
	}

	/**
	 * 添加数据
	 * 
	 * @param row
	 */
	public void addRow(Row row) {
		if (this.rows == null) {
			this.rows = new ArrayList<Row>();
		}
		this.rows.add(row);
	}

	/**
	 * 是否存在删除记录集
	 * 
	 * @return
	 */
	public boolean existDeletet() {
		return existState(StateType.DELETE);
	}

	/**
	 * 是否存在新增记录
	 * 
	 * @return
	 */
	public boolean existInsert() {
		return existState(StateType.ADD);
	}

	/**
	 * 返回末个状态是否存在数据集
	 * 
	 * @param st
	 * @return
	 */
	protected boolean existState(StateType st) {
		if (rows != null && rows.size() > 0) {
			for (Row r : this.rows) {
				if (r.getReState() == st) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 是否存在更新数据集
	 * 
	 * @return
	 */
	public boolean existUpdate() {
		return existState(StateType.MODIFY);
	}

	/**
	 * 获取当前数据源父数据源数据分类集合
	 * 
	 * @return
	 */
	public Map<Row, List<Row>> getCateRows() {
		if (rows != null && rows.size() > 0) {
			if (this.parentDataStore != null) {
				Map<Row, List<Row>> ms = new HashMap<Row, List<Row>>(20);
				for (Row r : this.rows) {
					Row pr = this.parentDataStore.getRowByIndex(r.getParentIndex());
					if (pr == null) {
						throw new PMSException("exp-sdp-core-0113", name, r.getIndex(), this.parent);
					} else {
						List<Row> rs = ms.get(pr);
						if (rs == null) {
							rs = new ArrayList<Row>();
							ms.put(pr, rs);
						}
						rs.add(r);
					}
				}
				return ms;
			}
		}
		return null;
	}

	/**
	 * @return the delete
	 */
	public String getDelete() {
		return delete;
	}

	/**
	 * 返回删除记录
	 * 
	 * @return
	 */
	public List<Row> getDeleteRows() {
		return getStateRows(StateType.DELETE);
	}

	/**
	 * @return the deletes
	 */
	public List<String> getDeletes() {
		return deletes;
	}

	/**
	 * @return the insert
	 */
	public String getInsert() {
		return insert;
	}

	/**
	 * 返回新增记录
	 * 
	 * @return
	 */
	public List<Row> getInsertRows() {
		return getStateRows(StateType.ADD);
	}

	/**
	 * @return the inserts
	 */
	public List<String> getInserts() {
		return inserts;
	}

	/**
	 * @return the keyField
	 */
	public String getKeyField() {
		return keyField;
	}

	public List<String> getKeyFields() {
		return keyFields;
	}

	public String getName() {
		return name;
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page p) {
		this.page = p;
	}

	public Object getParam(String key) {
		return this.params.get(key);
	}

	public Map<String, Object> getParams() {
		if (params == null) {
			return new HashMap<String, Object>(5);
		}
		return params;
	}

	public String getParent() {
		return parent;
	}

	/**
	 * @return the parentDataStore
	 */
	public DataStore getParentDataStore() {
		return parentDataStore;
	}

	/**
	 * 获取父子映射值
	 * 
	 * @param prow
	 *            父数据行
	 * @return
	 */
	public Map<String, Object> getParentKeyValues(Row prow) {
		Map<String, Object> m = new HashMap<String, Object>(5);
		if (this.parentKeys != null && this.parentKeys.size() > 0) {
			for (Entry<String, String> e : this.parentKeys.entrySet()) {
				m.put(e.getValue(), prow.get(e.getKey()));
			}
		}
		return m;
	}

	/**
	 * 根据下标获取行
	 * 
	 * @param index
	 * @return
	 */
	public Row getRowByIndex(int index) {
		if (rows != null && rows.size() > 0) {
			for (Row r : this.rows) {
				if (r.getIndex() == index) {
					return r;
				}
			}
		}
		return null;
	}

	public List<Row> getRows() {
		return rows;
	}

	public Row getSingleRow() {
		if (this.rows == null || this.rows.size() <= 0) {
			return null;
		}
		return this.getRows().get(0);
	}

	/**
	 * @return the statement
	 */
	public String getStatement() {
		return statement;
	}

	/**
	 * 获取末个状态记录集
	 * 
	 * @param st
	 * @return
	 */
	protected List<Row> getStateRows(StateType st) {
		List<Row> rs = new ArrayList<Row>();
		if (rows != null && rows.size() > 0) {
			for (Row r : this.rows) {
				if (r.getReState() == st) {
					rs.add(r);
				}
			}
		}
		return rs;
	}

	/**
	 * @return the update
	 */
	public String getUpdate() {
		return update;
	}

	/**
	 * 返回更新记录
	 * 
	 * @return
	 */
	public List<Row> getUpdateRows() {
		return getStateRows(StateType.MODIFY);
	}

	/**
	 * @return the updates
	 */
	public List<String> getUpdates() {
		return updates;
	}

	/**
	 * @param delete
	 *            the delete to set
	 */
	public void setDelete(String delete) {
		this.delete = delete;
	}

	/**
	 * @param deletes
	 *            the deletes to set
	 */
	public void setDeletes(List<String> deletes) {
		this.deletes = deletes;
	}

	/**
	 * @param insert
	 *            the insert to set
	 */
	public void setInsert(String insert) {
		this.insert = insert;
	}

	/**
	 * @param inserts
	 *            the inserts to set
	 */
	public void setInserts(List<String> inserts) {
		this.inserts = inserts;
	}

	/**
	 * 设置主键
	 * 
	 * @param keyField
	 */
	public void setKeyField(String keyField) {
		this.keyField = StringUtils.trim(keyField);
	}

	/**
	 * 设置关键字段
	 * 
	 * @param keyFields
	 */
	public void setKeyFields(List<String> keyFields) {
		this.keyFields = keyFields;
	}

	public void setName(String name) {
		this.name = name;
	}

	/**
	 * 设置参数集合
	 * 
	 * @param params
	 */
	public void setParams(Map<String, Object> params) {
		this.params = params;
	}

	/**
	 * 设置父数据源
	 * 
	 * @param parentDataStore
	 */
	public void setParentDataStore(DataStore parentDataStore) {
		this.parentDataStore = parentDataStore;
		parentDataStore.addChild(this);
	}

	/**
	 * 设置父子数据源关系
	 * 
	 * @param parentKeys
	 */
	public void setParentKeys(Map<String, String> parentKeys) {
		this.parentKeys = parentKeys;
	}

	/**
	 * 根据父子赋值当前数据行
	 * 
	 * @param m
	 * @param r
	 */
	public void setParentKeyValues(Map<String, Object> m, Row r) {
		if (m != null && m.size() > 0) {
			for (Entry<String, Object> e : m.entrySet()) {
				r.put(e.getKey(), e.getValue());
			}
		}
	}

	/**
	 * @param rows
	 *            the rows to set
	 */
	public void setRows(List<Row> rows) {
		this.rows = rows;
	}

	public void setStatement(String statement) {
		this.statement = statement;
	}

	/**
	 * @param update
	 *            the update to set
	 */
	public void setUpdate(String update) {
		this.update = update;
	}

	/**
	 * @param updates
	 *            the updates to set
	 */
	public void setUpdates(List<String> updates) {
		this.updates = updates;
	}

	/**
	 * 数据集转json对象
	 * 
	 * @return
	 */
	public Map<String, Object> toJSONMap() {
		Map<String, Object> m = new HashMap<String, Object>(5);
		m.put("name", this.name);
		if (StringUtils.isNotEmpty(this.parent)) {
			m.put("parent", this.parent);
		}
		if (this.page != null) {
			m.put("page", this.page);
		}
		if (this.rows != null) {
			m.put("rows", this.rows);
		}
		return m;
	}
}
