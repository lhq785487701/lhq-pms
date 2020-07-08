package com.lhq.pms.data;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

/**
 * 登录用户信息
 */
public class LoginUserBak {
	/**
	 * 验证码
	 */
	public static final String CAPTCHA = "captcha";

	/**
	 * ip
	 */
	public static final String IP = "$ip";

	/**
	 * 部门编码
	 */
	public static final String ORG_CODE = "org_code";
	/**
	 * 用户组织
	 */
	public static final String ORG_ID = "org_id";
	/**
	 * 部门名称
	 */
	public static final String ORG_NAME = "org_name";
	/**
	 * 是否记住
	 */
	public static final String REMEMBER = "remember";
	/**
	 * 登录时间
	 */
	public static final String LOGIN_TIME = "login_time";
	/**
	 * sessionCode
	 */
	public static final String SESSION_CODE = "session_code";
	/**
	 * 用户状态 Y正常,D禁用,L锁定
	 */
	public static final String USER_STS = "user_sts";
	// session key
	public static final String ROLES = "roles";
	/**
	 * 用户流水号
	 */
	public static final String USER_ID = "user_id";
	/**
	 * 用户编码
	 */
	public static final String USER_CODE = "user_code";

	/**
	 * 用户名称
	 */
	public static final String USER_NAME = "user_name";

	/**
	 * 用户密码
	 */
	public static final String USER_PWD = "user_pwd";

	private Map<String, Object> attributes = new HashMap<String, Object>();

	/*
	 * 语言
	 */
	public Locale locale = Locale.SIMPLIFIED_CHINESE;

	/**
	 * 登录时间
	 */
	private Date loginTime;

	/**
	 * 组织结构CODE
	 */
	private String orgCode;
	/**
	 * 组织结构
	 */
	private String orgId;
	/**
	 * 组织结构NAME
	 */
	private String orgName;
	/**
	 * 登录session
	 */
	private String sessionCode;
	/**
	 * 用户编码
	 */
	private String userCode;
	/**
	 * 用户流水号
	 **/
	private String userId;

	/**
	 * @return the userId
	 */
	public String getUserId() {
		return userId;
	}

	/**
	 * @param userId
	 *            the userId to set
	 */
	public void setUserId(String userId) {
		this.userId = userId;
	}

	/**
	 * 用户名称
	 */
	private String userName;
	/**
	 * 用户密码
	 */
	private String userPwd;

	/**
	 * 登录验证码
	 */
	private String validCode;
	/**
	 * 最后访问时间
	 */
	private Date visitTime;

	public void addAttr(String k, Object val) {
		this.attributes.put(k, val);
	}

	public Object getAttr(String k) {
		return this.attributes.get(k);
	}

	public Map<String, Object> getAttributes() {
		return attributes;
	}

	public Set<Entry<String, Object>> getAttrs() {
		return this.attributes.entrySet();
	}

	public void putAttrs(Map<String, Object> map) {
		if (map == null || map.isEmpty()) {
			return;
		}
		String[] names = new String[] { LoginUserBak.USER_ID, LoginUserBak.CAPTCHA, LoginUserBak.LOGIN_TIME, LoginUserBak.ORG_CODE, LoginUserBak.ORG_ID, LoginUserBak.ORG_NAME, LoginUserBak.REMEMBER,
				LoginUserBak.ROLES, LoginUserBak.SESSION_CODE, LoginUserBak.USER_CODE, LoginUserBak.USER_NAME, LoginUserBak.USER_PWD };
		List<String> lists = Arrays.asList(names);

		for (Entry<String, Object> entry : map.entrySet()) {
			if (lists.contains(entry.getKey())) {
				continue;
			}
			this.attributes.put(entry.getKey(), entry.getValue());
		}
	}

	public void parseMap(Map<String, Object> map) {
		if (map == null || map.isEmpty()) {
			return;
		}

		for (Entry<String, Object> entry : map.entrySet()) {
			String k = entry.getKey();
			Object val = entry.getValue();
			if (LoginUserBak.LOGIN_TIME.equals(k)) {
				this.setLoginTime((Date) val);
				continue;
			} else if (LoginUserBak.USER_NAME.equals(k)) {
				this.setUserName((String) val);
				continue;
			} else if (LoginUserBak.USER_PWD.equals(k)) {
				this.setUserPwd((String) val);
				continue;
			} else if (LoginUserBak.USER_ID.equals(k)) {
				this.setUserId(val.toString());
				continue;
			} else if (LoginUserBak.ORG_CODE.equals(k)) {
				this.setOrgCode((String) val);
				continue;
			} else if (LoginUserBak.ORG_ID.equals(k)) {
				this.setOrgId(val.toString());
				continue;
			} else if (LoginUserBak.ORG_NAME.equals(k)) {
				this.setOrgName((String) val);
				continue;
			} else if (LoginUserBak.CAPTCHA.equals(k)) {
				this.setValidCode((String) val);
				continue;
			} else if (LoginUserBak.USER_CODE.equals(k) || LoginUserBak.SESSION_CODE.equals(k)) {
				continue;
			} else {
				this.attributes.put(k, val);
			}
		}
	}

	/**
	 * @return the locale
	 */
	public Locale getLocale() {
		return locale;
	}

	public Date getLoginTime() {
		return loginTime;
	}

	public String getOrgCode() {
		return orgCode;
	}

	public String getOrgId() {
		return orgId;
	}

	public String getOrgName() {
		return orgName;
	}

	public String getSessionCode() {
		return sessionCode;
	}

	public String getUserCode() {
		return userCode;
	}

	public String getUserName() {
		return userName;
	}

	public String getUserPwd() {
		return userPwd;
	}

	public String getValidCode() {
		return validCode;
	}

	public Date getVisitTime() {
		return visitTime;
	}

	public void setAttributes(Map<String, Object> attributes) {
		this.attributes = attributes;
	}

	/**
	 * @param locale
	 *            the locale to set
	 */
	public void setLocale(Locale locale) {
		this.locale = locale;
	}

	public void setLoginTime(Date loginTime) {
		this.loginTime = loginTime;
	}

	public void setOrgCode(String orgCode) {
		this.orgCode = orgCode;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public void setSessionCode(String sessionCode) {
		this.sessionCode = sessionCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public void setUserPwd(String userPwd) {
		this.userPwd = userPwd;
	}

	public void setValidCode(String validCode) {
		this.validCode = validCode;
	}

	public void setVisitTime(Date visitTime) {
		this.visitTime = visitTime;
	}

	public Map<String, Object> toJson() {
		Map<String, Object> u = new HashMap<String, Object>();
		u.put("$user_code", this.userCode);
		u.put("$user_name", this.userName);
		u.put("$session_code", this.sessionCode);
		u.put("$login_time", this.loginTime);
		u.put("$user_pwd", this.userPwd);
		Set<Entry<String, Object>> attrs = getAttrs();
		for (Entry<String, Object> entry : attrs) {
			u.put("$" + entry.getKey(), entry.getValue());
		}
		return u;
	}
}
