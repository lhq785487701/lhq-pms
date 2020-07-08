package com.lhq.pms.plugin.mongodb;

import javax.annotation.Resource;

import org.apache.ibatis.session.ExecutorType;
import org.springframework.stereotype.Service;

import com.lhq.pms.common.dao.session.BasePMSSqlSession;
import com.lhq.pms.common.dao.session.PMSSqlSessionFactory;

/**
 * 类功能描述
 * 
 * @author lhq
 */
@Service("mongoSqlSessionFactory")
public class MongoDbSessionFactory implements PMSSqlSessionFactory {

	@Resource(name = "mongoDBSession")
	private BasePMSSqlSession sqlSession;

	/**
	 * 打开session
	 */
	@Override
	public BasePMSSqlSession openSession() {
		return this.sqlSession;
	}

	@Override
	public BasePMSSqlSession openSession(ExecutorType batch, boolean b) {
		// TODO Auto-generated method stub
		return null;
	}
}
