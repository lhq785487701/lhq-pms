package com.lhq.pms.common.bo.impl;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;

import com.github.pagehelper.PageInfo;
import com.lhq.pms.common.bo.CommonBo;
import com.lhq.pms.common.dao.CommonDao;
import com.lhq.pms.data.DataStore;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.data.Page;
import com.lhq.pms.data.Row;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.plugin.mybatis.sqlmap.SQLMapBean;
import com.lhq.pms.sys.message.SqlCodeMessage;
import com.lhq.pms.type.StateType;
import com.lhq.pms.utils.StringUtils;
import com.lhq.pms.utils.UuidUtils;

/**
 * 通用Bo实现
 * 
 * @author lhq 
 */
public class CommonBoImpl implements CommonBo {

	private static final String ERROR_CODE = "$error_code";

	@Resource(name = "commonDao")
	private CommonDao commonDao = null;

	@Resource(name = "sqlCodeMesaage")
	private SqlCodeMessage sqlCodeMesaage = null;

	/**
	 * 批量删除
	 */
	@Override
	public void batchDelete(String statement, List<Object> params, int batchNum) {
		if (params == null || params.size() <= 0) {
			return;
		}
		StatementConfig sc = StatementConfig.buildBatch(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		try {
			// 每批commit的个数
			int batchCount = batchNum;
			int l = params.size();
			for (int index = 0; index < l; index++) {
				Object t = params.get(index);
				ss.delete(sc.getStatement(), t);
				if (index != 0 && index % batchCount == 0) {
					ss.commit();
					ss.clearCache();
				}
			}
			ss.commit();
			ss.clearCache();

			sqlCodeMesaage.sendMessage(statement, params, StateType.DELETE);
		} catch (Exception e) {
			throw new PMSException(e);
		} finally {
			if (ss != null) {
				// ss.close();
			}
		}
	}

	/**
	 * 批量插入
	 */
	@Override
	public void batchInsert(String statement, List<Object> params, int batchNum) {
		if (params == null || params.size() <= 0) {
			return;
		}
		StatementConfig sc = StatementConfig.buildBatch(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		try {
			// 每批commit的个数
			int batchCount = batchNum;
			int l = params.size();
			for (int index = 0; index < l; index++) {
				Object t = params.get(index);
				ss.insert(sc.getStatement(), t);
				if (index != 0 && index % batchCount == 0) {
					ss.commit();
					ss.clearCache();
				}
			}
			ss.commit();
			ss.clearCache();

			sqlCodeMesaage.sendMessage(statement, params, StateType.ADD);
		} catch (Exception e) {
			throw new PMSException(e);
		} finally {
			if (ss != null) {
				// ss.close();
			}
		}
	}

	/**
	 * 批量更新
	 */
	@Override
	public void batchUpdate(String statement, List<Object> params, int batchNum) {
		if (params == null || params.size() <= 0) {
			return;
		}
		StatementConfig sc = StatementConfig.buildBatch(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		try {
			// 每批commit的个数
			int batchCount = batchNum;
			int l = params.size();
			for (int index = 0; index < l; index++) {
				Object t = params.get(index);
				ss.update(sc.getStatement(), t);
				if (index != 0 && index % batchCount == 0) {
					ss.commit();
					ss.clearCache();
				}
			}
			ss.commit();
			ss.clearCache();

			sqlCodeMesaage.sendMessage(statement, params, StateType.MODIFY);
		} catch (Exception e) {
			throw new PMSException(e);
		} finally {
			if (ss != null) {
				// ss.close();
			}
		}
	}

	/**
	 * 删除
	 */
	@Override
	public void delete(PMSContext context) {
		String statement = context.getStatement();
		if (StringUtils.isNotEmpty(statement)) {
			this.delete(statement, context.getParams());
			this.initContextStatement(context);
			return;
		}

		DataStore ds = context.getDataStore();
		if (ds != null) {
			deleteDataStore(ds, context);
			context.setResult(ds);
			return;
		}
		Map<String, DataStore> ls = context.getDataStores();
		if (ls != null && ls.size() > 0) {
			Collection<DataStore> ss = ls.values();
			for (DataStore ds1 : ss) {
				deleteDataStore(ds1, context);
			}
			context.setResult(ls);
			return;
		}

		throw new PMSException("exp-sdp-core-0112");
	}

	/**
	 * 删除
	 */
	@Override
	public int delete(String statement) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		int i = ss.delete(sc.getStatement());

		return i;
	}

	/**
	 * 删除
	 */
	@Override
	public void delete(String statement, List<Object> params) {
		if (params != null && params.size() > 0) {
			StatementConfig sc = StatementConfig.build(statement, commonDao);
			SqlSession ss = sc.getSqlSession();
			for (Object par : params) {
				ss.delete(sc.getStatement(), par);
			}

			sqlCodeMesaage.sendMessage(statement, params, StateType.DELETE);
		}
	}

	/**
	 * 删除
	 */
	@Override
	public int delete(String statement, Object parameter) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		int i = ss.delete(sc.getStatement(), parameter);

		sqlCodeMesaage.sendMessage(statement, parameter, StateType.DELETE);

		return i;
	}

	/**
	 * 删除数据集
	 * 
	 * @param ds
	 * @param context
	 */
	protected void deleteDataStore(DataStore ds, PMSContext context) {
		String statement = ds.getDelete();
		if (StringUtils.isNotEmpty(statement)) {
			if (ds.existDeletet()) {
				List<Row> rs = ds.getDeleteRows();
				if (rs != null && rs.size() > 0) {
					List<String> dels = ds.getDeletes();
					for (Row r : rs) {
						Map<String, Object> m = context.getParams();
						m.putAll(ds.getParams());
						m.putAll(r);

						this.delete(statement, m);

						if (dels != null && dels.size() > 0) {
							m.clear();
							m.putAll(context.getParams());
							m.putAll(r);

							for (String s : dels) {
								this.update(s, m);
							}
						}
					}
				}
			}
		} else {
			throw new PMSException("exp-sdp-core-0114", ds.getName());
		}
	}

	/**
	 * 获取当前数据库时间
	 */
	@Override
	public Date getDBCurDate() {
		return this.selectOne("SDP-SYS-001");
	}

	/**
	 * 初始化参数
	 * 
	 * @param context
	 * @param m
	 */
	protected void initContextResultParams(PMSContext context, Map<String, Object> m) {
		String errorCode = StringUtils.trim((String) m.get(ERROR_CODE));
		if (errorCode.length() > 0) {
			throw new PMSException(errorCode);
		}
		if (context.getKeyFields() != null) {
			for (String fld : context.getKeyFields()) {
				context.addParam(fld, m.get(fld));
			}
		}
	}

	protected void initContextStatement(PMSContext context) {
		if (context.getInserts() != null) {
			Map<String, Object> m = context.getParams();
			for (String statement : context.getInserts()) {
				m.put("$uuid", UuidUtils.getUuid());
				this.insert(statement, m);
				initContextResultParams(context, m);
			}
		}
		if (context.getUpdates() != null) {
			Map<String, Object> m = context.getParams();
			for (String statement : context.getUpdates()) {
				this.update(statement, m);
				initContextResultParams(context, m);
			}
		}
		if (context.getDeletes() != null) {
			Map<String, Object> m = context.getParams();
			for (String statement : context.getDeletes()) {
				this.delete(statement, m);
			}
		}
	}

	/**
	 * 插入
	 */
	@Override
	public void insert(PMSContext context) {
		String statement = context.getStatement();
		if (StringUtils.isNotEmpty(statement)) {
			Map<String, Object> m = context.getParams();
			m.put("$uuid", UuidUtils.getUuid());
			this.insert(statement, m);
			initContextResultParams(context, m);
			initContextStatement(context);

			context.setResult(context.getDataParams());
			return;
		}

		DataStore ds = context.getDataStore();
		if (ds != null) {
			saveDataStore(ds, context, false);
			context.setResult(ds);
			return;
		}
		Map<String, DataStore> ls = context.getStores();
		if (ls != null && ls.size() > 0) {
			Collection<DataStore> ss = ls.values();
			for (DataStore ds1 : ss) {
				saveDataStore(ds1, context, true);
			}
			context.setResult(context.getDataStores());
			return;
		}

		throw new PMSException("exp-sdp-core-0112");
	}

	/**
	 * 插入
	 */
	@Override
	public int insert(String statement) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		int i = ss.insert(sc.getStatement());

		return i;
	}

	/**
	 * 插入
	 */
	@Override
	public void insert(String statement, List<Object> params) {
		if (params != null && params.size() > 0) {
			StatementConfig sc = StatementConfig.build(statement, commonDao);
			SqlSession ss = sc.getSqlSession();
			for (Object par : params) {
				ss.insert(sc.getStatement(), par);
			}

			sqlCodeMesaage.sendMessage(statement, params, StateType.ADD);
		}
	}

	/**
	 * 插入
	 */
	@Override
	public int insert(String statement, Object parameter) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		int i = ss.insert(sc.getStatement(), parameter);

		sqlCodeMesaage.sendMessage(statement, parameter, StateType.ADD);

		return i;
	}

	/**
	 * 保存
	 */
	@Override
	public void save(PMSContext context) {
		DataStore ds = context.getDataStore();
		if (ds != null) {
			saveDataStore(ds, context, false);
			context.setResult(ds);
			return;
		}
		Map<String, DataStore> ls = context.getStores();
		if (ls != null && ls.size() > 0) {
			Collection<DataStore> ss = ls.values();
			for (DataStore ds1 : ss) {
				saveDataStore(ds1, context, true);
			}
			context.setResult(context.getDataStores());
			return;
		}
	}

	/**
	 * 添加数据
	 * 
	 * @param ds
	 *            数据集
	 * @param context
	 *            上下文
	 * @param b
	 *            是否主子关系
	 */
	protected void saveDataStore(DataStore ds, PMSContext context, boolean b) {
		String insert = ds.getInsert(), update = ds.getUpdate(), delete = ds.getDelete();
		if (ds.existInsert() && StringUtils.isEmpty(insert)) {
			throw new PMSException("exp-sdp-core-0116", ds.getName());
		}
		if (ds.existUpdate() && StringUtils.isEmpty(update)) {
			throw new PMSException("exp-sdp-core-0117", ds.getName());
		}
		if (ds.existDeletet() && StringUtils.isEmpty(delete)) {
			throw new PMSException("exp-sdp-core-0118", ds.getName());
		}
		saveDataStore(ds, context);
		if (b) {
			Map<String, DataStore> childs = ds.getChilds();
			if (childs != null && childs.size() > 0) {
				for (DataStore child : childs.values()) {
					saveMCDataStore(child, context);
				}
			}
		}
	}

	/**
	 * 有主数据集,按照主数据集分类子数据集数据
	 * 
	 * @param ds
	 * @param context
	 */
	protected void saveMCDataStore(DataStore ds, PMSContext context) {
		String insert = ds.getInsert(), update = ds.getUpdate(), delete = ds.getDelete();

		Map<Row, List<Row>> rs = ds.getCateRows();
		if (rs != null && rs.size() > 0) {
			for (Entry<Row, List<Row>> es : rs.entrySet()) {
				Row p = es.getKey();
				Map<String, Object> vals = ds.getParentKeyValues(p);
				for (Row r : es.getValue()) {
					ds.setParentKeyValues(vals, r);

					Map<String, Object> m = context.getParams();
					m.putAll(ds.getParams());
					m.putAll(r);

					if (r.getReState() == StateType.ADD) {
						m.put("$uuid", UuidUtils.getUuid());
						this.insert(insert, m);
					} else if (r.getReState() == StateType.MODIFY) {
						this.update(update, m);
					} else if (r.getReState() == StateType.DELETE) {
						this.delete(delete, m);
					}

					initDataStore(ds, r, m);
					if (r.getReState() == StateType.ADD) {
						if (ds.getKeyField().length() > 0) {
							Object v = m.get(ds.getKeyField());
							if (v == null) {
								throw new PMSException("exp-sdp-core-0119", ds.getName(), ds.getKeyField());
							}
							r.put(ds.getKeyField(), v);
						}
						if (ds.getKeyFields() != null) {
							for (String fld : ds.getKeyFields()) {
								r.put(fld, m.get(fld));
							}
						}
					}

					if (r.getReState() != StateType.DELETE) {
						r.setState(StateType.NONE.getIndex());
					}
				}
			}
		}
	}

	protected void saveDataStore(DataStore ds, PMSContext context) {
		String insert = ds.getInsert(), update = ds.getUpdate(), delete = ds.getDelete();

		List<Row> rs = ds.getRows();
		if (rs != null && rs.size() > 0) {
			for (Row r : rs) {
				Map<String, Object> m = context.getParams();
				m.putAll(ds.getParams());
				m.putAll(r);

				if (r.getReState() == StateType.ADD) {
					m.put("$uuid", UuidUtils.getUuid());
					this.insert(insert, m);
				} else if (r.getReState() == StateType.MODIFY) {
					this.update(update, m);
				} else if (r.getReState() == StateType.DELETE) {
					this.delete(delete, m);
				}

				initDataStore(ds, r, m);
				if (r.getReState() == StateType.ADD) {
					if (ds.getKeyField().length() > 0) {
						Object v = m.get(ds.getKeyField());
						if (v == null) {
							throw new PMSException("exp-sdp-core-0119", ds.getName(), ds.getKeyField());
						}
						r.put(ds.getKeyField(), v);
					}
					if (ds.getKeyFields() != null) {
						for (String fld : ds.getKeyFields()) {
							r.put(fld, m.get(fld));
						}
					}
				}

				if (r.getReState() != StateType.DELETE) {
					r.setState(StateType.NONE.getIndex());
				}
			}
		}
	}

	/**
	 * 数据集其它语句处理
	 * 
	 * @param ds
	 * @param r
	 * @param m
	 */
	private void initDataStore(DataStore ds, Row r, Map<String, Object> m) {
		List<String> ins = ds.getInserts();
		List<String> ups = ds.getUpdates();
		List<String> dels = ds.getDeletes();
		if (r.getReState() == StateType.ADD) {
			if (ins != null && ins.size() > 0) {
				for (String s : ins) {
					m.put("$uuid", UuidUtils.getUuid());
					this.insert(s, m);
				}
			}
		} else if (r.getReState() == StateType.MODIFY) {
			if (ups != null && ups.size() > 0) {
				for (String s : ups) {
					this.update(s, m);
				}
			}
		} else if (r.getReState() == StateType.DELETE) {
			if (dels != null && dels.size() > 0) {
				for (String s : dels) {
					this.update(s, m);
				}
			}
		}
	}

	/**
	 * 数据集查询
	 * 
	 * @param ds
	 * @param context
	 */
	protected void selectDataStore(DataStore ds, PMSContext context) {
		String statement = ds.getStatement();
		if (statement != null && statement.length() > 0) {
			Page page = ds.getPage();
			Map<String, Object> m = context.getParams();
			if (ds.getParams() != null) {
				m.putAll(ds.getParams());
			}

			List<Row> ls = null;
			if (page == null) {
				ls = this.selectList(statement, m);
			} else {
				ls = this.selectList(statement, m, page);
			}

			ds.setRows(ls);
		}
	}

	/**
	 * 查询
	 */
	@Override
	public void selectList(PMSContext context) {
		String statement = context.getStatement();
		if (StringUtils.isNotEmpty(statement)) {
			Map<String, Object> params = context.getParams();
			Page page = context.getPage();
			if (page == null) {
				context.setResult(this.selectList(statement, params));
				return;
			} else {
				List<Map<String, Object>> ls = this.selectList(statement, params, page);
				context.setResult(ls);

				return;
			}
		}
		DataStore ds = context.getDataStore();
		if (ds != null) {
			selectDataStore(ds, context);
			context.setResult(ds);
			return;
		}
		Map<String, DataStore> ls = context.getDataStores();
		if (ls != null && ls.size() > 0) {
			Collection<DataStore> ss = ls.values();
			for (DataStore ds1 : ss) {
				selectDataStore(ds1, context);
			}
			context.setResult(ls);
			return;
		}
		throw new PMSException("exp-sdp-core-0112");

	}

	/**
	 * 查询
	 */
	@Override
	public <T> List<T> selectList(String statement) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		return ss.selectList(sc.getStatement());
	}

	/**
	 * 查询
	 */
	@Override
	public <T> List<T> selectList(String statement, Object parameter) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		return ss.selectList(sc.getStatement(), parameter);
	}

	/**
	 * 查询
	 */
	@Override
	public <T> List<T> selectList(String statement, Object parameter, Page page) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		List<T> ls = ss.selectList(sc.getStatement(), parameter, new RowBounds(page.getStartRow(), page.getEndRow()));
		PageInfo<T> p = new PageInfo<T>(ls);
		page.setTotal(p.getTotal());
		return ls;
	}

	/**
	 * 查询
	 */
	@Override
	public <T> List<T> selectList(String statement, Page page) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		return ss.selectList(sc.getStatement(), new RowBounds(page.getStartRow(), page.getEndRow()));
	}

	/**
	 * 查询
	 */
	@Override
	public void selectOne(PMSContext context) {
		String statement = context.getStatement();
		if (StringUtils.isNotEmpty(statement)) {
			Map<String, Object> params = context.getParams();

			context.setResult(this.selectOne(statement, params));
			return;
		}

		DataStore ds = context.getDataStore();
		if (ds != null) {
			statement = ds.getStatement();
			if (StringUtils.isNotEmpty(statement)) {
				Map<String, Object> params = context.getParams();
				params.putAll(ds.getParams());
				Row r = (Row) this.selectOne(statement, params);
				ds.addRow(r);
				context.setResult(ds);
				return;
			}
		}
		throw new PMSException("exp-sdp-core-0112");
	}

	/**
	 * 查询
	 */
	@Override
	public <T> T selectOne(String statement) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		return ss.selectOne(sc.getStatement());
	}

	/**
	 * 查询
	 */
	@Override
	public <T> T selectOne(String statement, Object param) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		return ss.selectOne(sc.getStatement(), param);
	}

	/**
	 * 更新
	 */
	@Override
	public void update(PMSContext context) {
		String statement = context.getStatement();
		if (StringUtils.isNotEmpty(statement)) {
			Map<String, Object> m = context.getParams();
			this.update(statement, m);
			initContextResultParams(context, m);
			context.setResult(context.getDataParams());
			return;
		}

		DataStore ds = context.getDataStore();
		if (ds != null) {
			updateDataStore(ds, context);
			context.setResult(ds);
			return;
		}
		Map<String, DataStore> ls = context.getDataStores();
		if (ls != null && ls.size() > 0) {
			Collection<DataStore> ss = ls.values();
			for (DataStore ds1 : ss) {
				updateDataStore(ds1, context);
			}
			context.setResult(ls);
			return;
		}

		throw new PMSException("exp-sdp-core-0112");
	}

	/**
	 * 更新
	 */
	@Override
	public int update(String statement) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		return ss.update(sc.getStatement());
	}

	/**
	 * 更新
	 */
	@Override
	public void update(String statement, List<Object> params) {
		if (params != null && params.size() > 0) {
			StatementConfig sc = StatementConfig.build(statement, commonDao);
			SqlSession ss = sc.getSqlSession();
			for (Object par : params) {
				ss.update(sc.getStatement(), par);
			}

			sqlCodeMesaage.sendMessage(statement, params, StateType.MODIFY);
		}
	}

	/**
	 * 更新
	 */
	@Override
	public int update(String statement, Object parameter) {
		StatementConfig sc = StatementConfig.build(statement, commonDao);
		SqlSession ss = sc.getSqlSession();
		int i = ss.update(sc.getStatement(), parameter);

		sqlCodeMesaage.sendMessage(statement, parameter, StateType.MODIFY);

		return i;
	}

	/**
	 * 更新数据集
	 * 
	 * @param ds
	 * @param context
	 */
	protected void updateDataStore(DataStore ds, PMSContext context) {
		String statement = ds.getUpdate();
		if (StringUtils.isNotEmpty(statement)) {
			if (ds.existUpdate()) {
				List<Row> rs = ds.getUpdateRows();
				if (rs != null && rs.size() > 0) {
					List<String> ups = ds.getUpdates();
					for (Row r : rs) {
						Map<String, Object> m = context.getParams();
						m.putAll(ds.getParams());
						m.putAll(r);

						this.update(statement, m);

						if (ups != null && ups.size() > 0) {
							m.clear();
							m.putAll(context.getParams());
							m.putAll(r);

							for (String s : ups) {
								this.update(s, m);
							}
						}

						r.setState(StateType.NONE.getIndex());
					}
				}
			}
		} else {
			throw new PMSException("exp-sdp-core-0115", ds.getName());
		}
	}
}

final class StatementConfig {
	private static final String PRE_ST = "$";

	public static StatementConfig build(String statement, CommonDao commonDao) {
		return build(statement, commonDao, false);
	}

	private static StatementConfig build(String statement, CommonDao commonDao, boolean b) {
		if (StringUtils.isEmpty(statement)) {
			throw new PMSException("exp-sdp-core-0112");
		}
		String st = SQLMapBean.getStatement(statement), sess = null;
		if (statement.startsWith(PRE_ST)) {
			int len = statement.indexOf(".");
			sess = statement.substring(0, len);
			sess = sess.replace(PRE_ST, "");
			st = statement.substring(len + 1, statement.length());
		}
		SqlSession ss = null;
		if (StringUtils.isEmpty(sess)) {
			if (b) {
				ss = commonDao.getBatchSqlSession();
			} else {
				ss = commonDao.getSqlSession();
			}
		} else {
			if (b) {
				ss = commonDao.getBatchSqlSession(sess);
			} else {
				ss = commonDao.getSqlSession(sess);
			}
		}
		StatementConfig sc = new StatementConfig(st, sess, ss);
		return sc;
	}

	public static StatementConfig buildBatch(String statement, CommonDao commonDao) {
		return build(statement, commonDao, true);
	}

	private String session;

	private SqlSession sqlSession;

	private String statement;

	private StatementConfig(String statement, String session, SqlSession sqlSession) {
		this.statement = statement;
		this.session = session;
		this.sqlSession = sqlSession;
	}

	public String getSession() {
		return this.session;
	}

	/**
	 * @return the sqlSession
	 */
	public SqlSession getSqlSession() {
		SqlSession ss = sqlSession;
		sqlSession = null;
		return ss;
	}

	public String getStatement() {
		return this.statement;
	}

	public boolean isSession() {
		return StringUtils.isNotEmpty(this.session);
	}
}
