package com.lhq.pms.common.bo;

import com.lhq.pms.data.PMSContext;


public interface MenuBo {
	/**
	 * 获取当前登录用户菜单
	 * 
	 * @param userCode
	 * @return
	 */
	public void queryUserMenus(PMSContext context);
}
