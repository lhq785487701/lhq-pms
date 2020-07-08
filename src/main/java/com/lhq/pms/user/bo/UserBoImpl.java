package com.lhq.pms.user.bo;

import java.util.HashMap;
import java.util.Map;

import com.lhq.pms.common.bo.UserBo;
import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.LoginUser;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.utils.StringUtils;

/**
 * @author lhq
 *
 */
public class UserBoImpl extends CommonBoImpl implements UserBo {

	/**
	 * 查询用户
	 */
	@Override
	public Map<String, Object> findUser(String userCode) {
		Map<String, Object> user = this.selectOne("SDP-USER-001", userCode);

		return user;
	}

	/**
	 * 获取用户信息
	 */
	@Override
	public void getUserInfo(PMSContext context) {
		if (context.getLoginUser() == null) {
			throw new PMSException("exp-sdp-login-0002");
		}
		context.setResult(context.getLoginUser());
	}

	/**
	 * 更新用户密码
	 */
	@Override
	public void updateUserPwd(PMSContext context) {
		LoginUser user = context.getLoginUser();
		String oldPwd = StringUtils.trim((String) context.getParam("oldPwd"));
		String userPwd = StringUtils.trim((String) context.getParam("user_pwd"));
		if (userPwd.length() <= 0) {
			throw new PMSException("exp-sdp-login-0006");
		}
		Map<String, Object> u = findUser(user.getUserCode());
		if (u == null) {
			throw new PMSException("exp-sdp-login-0007");
		}
		String ow = (String) u.get("user_pwd");
		if (oldPwd.equalsIgnoreCase(ow)) {
			this.update("SDP-USER-009", context.getParams());
		} else {
			throw new PMSException("exp-sdp-login-0008");
		}
	}

	/**
	 * 修改密码
	 */
	@Override
	public void updateUserPwd(String userCode, String pwd) {
		Map<String, String> param = new HashMap<String, String>(2);
		param.put("$user_code", userCode);
		param.put("user_pwd", pwd);
		this.update("SDP-USER-009", param);
	}
}
