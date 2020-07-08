package com.lhq.pms.common.bo;

import java.util.Map;

import com.lhq.pms.data.PMSContext;


public interface UserBo {
	/**
	 * 根据用户编码获取用户信息
	 * 
	 * @param userCode
	 * @return
	 */
	public Map<String, Object> findUser(String userCode);

	/**
	 * 获取当前登录用户信息
	 * 
	 * @param context
	 */
	public void getUserInfo(PMSContext context);

	/**
	 * 用户密码
	 * 
	 * @param context
	 */
	public void updateUserPwd(PMSContext context);

	/**
	 * 修改密码
	 * 
	 * @param userCode
	 *            用户帐号
	 * @param pwd
	 *            密码
	 */
	public void updateUserPwd(String userCode, String pwd);
}
