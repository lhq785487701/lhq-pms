package com.lhq.pms.common.dao.impl;

import javax.annotation.Resource;

import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;

import com.lhq.pms.common.dao.CommonDao;

/**
 * 通用Dao实现
 * 
 * @author lhq 
 */
public class CommonDaoImpl implements CommonDao {

	/**
	 * 获取批量session
	 */
	@Override
	public SqlSession getBatchSqlSession() {
		return sqlSessionBatch.openSession(ExecutorType.BATCH, false);
	}

	@Resource(name = "sqlSession")
	private SqlSessionTemplate sqlSession;

	@Resource(name = "sqlSessionFactory")
	private SqlSessionFactory sqlSessionBatch;

	/**
	 * 获取单个session
	 */
	@Override
	public SqlSession getSqlSession() {
		return sqlSession;
	}

	/**
	 * 获取session
	 */
	@Override
	public SqlSession getSqlSession(String st) {
		return getSqlSession();
	}

	/**
	 * 获取批量session
	 */
	@Override
	public SqlSession getBatchSqlSession(String st) {
		return getBatchSqlSession();
	}
}
