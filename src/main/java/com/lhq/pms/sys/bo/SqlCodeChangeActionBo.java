package com.lhq.pms.sys.bo;

import com.lhq.pms.type.StateType;

/**
 * @author lhq
 *
 */
public interface SqlCodeChangeActionBo {

	/**
	 * 数据处理
	 * 
	 * @param sqlCode
	 * @param data
	 *            数据
	 * @param type
	 *            类型
	 */
	public void doAction(String sqlCode, Object data, StateType type);
}
