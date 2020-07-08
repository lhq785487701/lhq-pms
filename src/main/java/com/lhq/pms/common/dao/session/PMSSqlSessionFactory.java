package com.lhq.pms.common.dao.session;

import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;

/**
 * session工厂
 * 
 * @author lhq 
 */
public interface PMSSqlSessionFactory {
	/**
	 * 打开session
	 * 
	 * @return session
	 */
	BasePMSSqlSession openSession();

	/**
	 * @param batch
	 * @param b
	 * @return
	 */
	SqlSession openSession(ExecutorType batch, boolean b);
}
