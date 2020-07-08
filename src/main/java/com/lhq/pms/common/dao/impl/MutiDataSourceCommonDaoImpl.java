package com.lhq.pms.common.dao.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;

import com.lhq.pms.common.dao.CommonDao;
import com.lhq.pms.common.dao.session.PMSSqlSessionFactory;
import com.lhq.pms.exception.PMSException;

/**
 * 多数据源通用Dao实现
 * 
 * @author lhq 
 */
public class MutiDataSourceCommonDaoImpl implements CommonDao {

	@Resource(name = "sqlSession")
	private SqlSessionTemplate defaultSession;

	public SqlSessionTemplate getDefault() {
		return defaultSession;
	}

	@Resource(name = "sqlSessionFactory")
	private SqlSessionFactory defaultSessionBatch;

	public SqlSessionFactory getDefaultBatch() {
		return defaultSessionBatch;
	}

	private Map<String, Object> sqlSessions;

	/**
	 * @return the sqlSessions
	 */
	public Map<String, Object> getSqlSessions() {
		return sqlSessions;
	}

	/**
	 * @param sqlSessions
	 *            the sqlSessions to set
	 */
	public void setSqlSessions(Map<String, Object> sqlSessions) {
		this.sqlSessions = sqlSessions;
	}

	/**
	 * 获取session
	 */
	@Override
	public SqlSession getSqlSession(String st) {
		if (sqlSessions == null || !sqlSessions.containsKey(st)) {
			if (this.defaultSession == null) {
				throw new PMSException("exp-sdp-core-0111");
			}
			return this.defaultSession;
		}
		Object obj = sqlSessions.get(st);
		if (obj instanceof SqlSessionTemplate) {
			return ((SqlSessionTemplate) obj);
		} else if (obj instanceof PMSSqlSessionFactory) {
			return ((PMSSqlSessionFactory) obj).openSession();
		}
		throw new PMSException("exp-sdp-core-0111", st);
	}

	/**
	 * 获取批量session
	 */
	@Override
	public SqlSession getBatchSqlSession(String st) {
		boolean isContain = sqlSessions == null || (!sqlSessions.containsKey(st) && !sqlSessions.containsKey(st + "_batch"));
		if (isContain) {
			if (this.defaultSessionBatch == null) {
				throw new PMSException("exp-sdp-core-0111");
			}
			return this.defaultSessionBatch.openSession(ExecutorType.BATCH, false);
		}
		Object obj = sqlSessions.get(st);
		if (obj == null) {
			obj = sqlSessions.get(st + "_batch");
		}
		if (obj instanceof SqlSessionTemplate) {
			return ((SqlSessionTemplate) obj);
		} else if (obj instanceof PMSSqlSessionFactory) {
			return ((PMSSqlSessionFactory) obj).openSession(ExecutorType.BATCH, false);
		}
		throw new PMSException("exp-sdp-core-0111", st);
	}

	/**
	 * 获取session
	 */
	@Override
	public SqlSession getSqlSession() {
		if (this.defaultSession == null) {
			throw new PMSException("exp-sdp-core-0111");
		}
		return this.defaultSession;
	}

	/**
	 * 获取批量session
	 */
	@Override
	public SqlSession getBatchSqlSession() {
		if (this.defaultSessionBatch == null) {
			throw new PMSException("exp-sdp-core-0111");
		}
		return this.defaultSessionBatch.openSession(ExecutorType.BATCH, false);
	}
}
