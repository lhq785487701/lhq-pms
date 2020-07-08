package com.lhq.pms.common.dao.session;

import java.sql.Connection;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.cursor.Cursor;
import org.apache.ibatis.executor.BatchResult;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;

import com.lhq.pms.exception.PMSException;

/**
 * 连接器
 * 
 * @author lhq 
 */
public abstract class BasePMSSqlSession implements SqlSession {

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public <K, V> Map<K, V> selectMap(String statement, String mapKey) {
		throw new PMSException("exp-sdp-core-0100");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey) {
		throw new PMSException("exp-sdp-core-0100");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey, RowBounds rowBounds) {
		throw new PMSException("exp-sdp-core-0100");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public <T> Cursor<T> selectCursor(String statement) {
		throw new PMSException("exp-sdp-core-0101");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public <T> Cursor<T> selectCursor(String statement, Object parameter) {
		throw new PMSException("exp-sdp-core-0101");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public <T> Cursor<T> selectCursor(String statement, Object parameter, RowBounds rowBounds) {
		throw new PMSException("exp-sdp-core-0101");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public void select(String statement, Object parameter, @SuppressWarnings("rawtypes") ResultHandler handler) {
		throw new PMSException("exp-sdp-core-0102");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public void select(String statement, @SuppressWarnings("rawtypes") ResultHandler handler) {
		throw new PMSException("exp-sdp-core-0102");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public void select(String statement, Object parameter, RowBounds rowBounds, @SuppressWarnings("rawtypes") ResultHandler handler) {
		throw new PMSException("exp-sdp-core-0102");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public void commit() {
		throw new PMSException("exp-sdp-core-0103");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public void commit(boolean force) {
		throw new PMSException("exp-sdp-core-0103");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public void rollback() {
		throw new PMSException("exp-sdp-core-0104");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public void rollback(boolean force) {
		throw new PMSException("exp-sdp-core-0104");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public List<BatchResult> flushStatements() {
		throw new PMSException("exp-sdp-core-0105");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public void close() {
		throw new PMSException("exp-sdp-core-0106");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public void clearCache() {
		throw new PMSException("exp-sdp-core-0107");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public Configuration getConfiguration() {
		throw new PMSException("exp-sdp-core-0108");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public <T> T getMapper(Class<T> type) {
		throw new PMSException("exp-sdp-core-0109");
	}

	/**
	 * 弃用
	 */
	@Deprecated
	@Override
	public Connection getConnection() {
		throw new PMSException("exp-sdp-core-0110");
	}
}
