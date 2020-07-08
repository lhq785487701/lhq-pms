package com.lhq.pms.plugin.mongodb;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.RowBounds;

import com.mongodb.MongoClient;
import com.lhq.pms.common.dao.session.BasePMSSqlSession;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public class DefaultMongoDbSession extends BasePMSSqlSession {

	@Resource(name = "mongoClient")
	protected MongoClient mongoClient = null;

	/**
	 * 查找
	 */
	@Override
	public <T> T selectOne(String statement) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 查找
	 */
	@Override
	public <T> T selectOne(String statement, Object parameter) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 查找
	 */
	@Override
	public <E> List<E> selectList(String statement) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 查找
	 */
	@Override
	public <E> List<E> selectList(String statement, Object parameter) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 查找
	 */
	@Override
	public <E> List<E> selectList(String statement, Object parameter, RowBounds rowBounds) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 插入
	 */
	@Override
	public int insert(String statement) {
		// TODO Auto-generated method stub
		return 0;
	}

	/**
	 * 插入
	 */
	@Override
	public int insert(String statement, Object parameter) {
		// TODO Auto-generated method stub
		return 0;
	}

	/**
	 * 更新
	 */
	@Override
	public int update(String statement) {
		// TODO Auto-generated method stub
		return 0;
	}

	/**
	 * 更新
	 */
	@Override
	public int update(String statement, Object parameter) {
		// TODO Auto-generated method stub
		return 0;
	}

	/**
	 * 删除
	 */
	@Override
	public int delete(String statement) {
		// TODO Auto-generated method stub
		return 0;
	}

	/**
	 * 删除
	 */
	@Override
	public int delete(String statement, Object parameter) {
		// TODO Auto-generated method stub
		return 0;
	}

	/*@Override
	public void close() {
		mongoClient.close();
		// TODO Auto-generated method stub
		
	}*/
}
