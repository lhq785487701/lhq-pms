package com.lhq.pms.common.dao;

import org.apache.ibatis.session.SqlSession;

/**
 * 通用Dao接口
 * 
 * @author lhq 
 */
public interface CommonDao {
	/**
	 * 获取mybaties操作session
	 * 
	 * @param st
	 *            数据源类型
	 * @return
	 */
	public SqlSession getSqlSession(String st);

	/**
	 * 获取mybatis的Session采用BATCH方式执行语句
	 * 
	 * @param st
	 *            数据源类型
	 * @return
	 */
	public SqlSession getBatchSqlSession(String st);

	/**
	 * 获取mybaties操作session 采用默认数据源类型
	 * 
	 * @return
	 */
	public SqlSession getSqlSession();

	/**
	 * 获取mybatis的Session采用BATCH方式执行语句 采用默认数据源类型
	 * 
	 * @return
	 */
	public SqlSession getBatchSqlSession();
}
