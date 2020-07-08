package com.lhq.pms.system.bo;

import com.lhq.pms.data.PMSContext;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public interface SystemManageBo {
	/**
	 * 查询所有分布式节点系统信息
	 * 
	 * @param context
	 */
	public void queryAllSystems(PMSContext context);

	/**
	 * 刷新系统信息
	 * 
	 * @param context
	 */
	public void freshSystem(PMSContext context);
}
