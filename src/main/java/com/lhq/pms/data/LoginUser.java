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
 * 
 * @author lhq 
 */
public class LoginUser {
	/**
	 * 验证码
	 */
	public static final String CAPTCHA = "captcha";

	/**
	 * ip
	 */
	public static final String IP = "$ip";

	/**
	 * 所在部门组织
	 */
	public static final String ORG = "org";
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
	/** 角色 **/
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

	/**
	 * 语言
	 */
	public Locale locale = Locale.SIMPLIFIED_CHINESE;

	/**
	 * 登录时间
	 */
	private Date loginTime;

	/**
	 * 用户组织部门 主组织
	 */
	private Map<String, Object> org;
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
	 * 
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
		String[] names = new String[] { LoginUser.USER_ID, LoginUser.CAPTCHA, LoginUser.LOGIN_TIME, LoginUser.ORG, LoginUser.REMEMBER, LoginUser.ROLES, LoginUser.SESSION_CODE,
				LoginUser.USER_CODE, LoginUser.USER_NAME, LoginUser.USER_PWD };
		List<String> lists = Arrays.asList(names);

		for (Entry<String, Object> entry : map.entrySet()) {
			if (lists.contains(entry.getKey())) {
				continue;
			}
			this.attributes.put(entry.getKey(), entry.getValue());
		}
	}

	@SuppressWarnings("unchecked")
	public void parseMap(Map<String, Object> map) {
		if (map == null || map.isEmpty()) {
			return;
		}

		for (Entry<String, Object> entry : map.entrySet()) {
			String k = entry.getKey();
			Object val = entry.getValue();
			if (LoginUser.LOGIN_TIME.equals(k)) {
				this.setLoginTime((Date) val);
				continue;
			} else if (LoginUser.USER_NAME.equals(k)) {
				this.setUserName((String) val);
				continue;
			} else if (LoginUser.USER_PWD.equals(k)) {
				this.setUserPwd((String) val);
				continue;
			} else if (LoginUser.USER_ID.equals(k)) {
				this.setUserId(val.toString());
				continue;
			} else if (LoginUser.ORG.equals(k)) {
				this.setOrg((Map<String, Object>) val);
				continue;
			} else if (LoginUser.CAPTCHA.equals(k)) {
				this.setValidCode((String) val);
				continue;
			} else if (LoginUser.USER_CODE.equals(k) || LoginUser.SESSION_CODE.equals(k)) {
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

	public Map<String, Object> getOrg() {
		return org;
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

	public void setOrg(Map<String, Object> org) {
		this.org = org;
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

	@SuppressWarnings("unchecked")
	public Map<String, Object> toJson() {
		Map<String, Object> u = new HashMap<String, Object>(20);
		u.put("$user_code", this.userCode);
		u.put("$user_name", this.userName);
		u.put("$session_code", this.sessionCode);
		u.put("$login_time", this.loginTime);
		u.put("$user_pwd", this.userPwd);
		u.put("$isAdmin", this.isSystemAdmin());
		Set<Entry<String, Object>> attrs = getAttrs();
		for (Entry<String, Object> entry : attrs) {
			Object val = entry.getValue();
			if (val instanceof Map) {
				for (Entry<String, Object> ent : ((Map<String, Object>) val).entrySet()) {
					u.put("$" + ent.getKey(), ent.getValue());
				}
			} else {
				u.put("$" + entry.getKey(), val);
			}

		}
		return u;
	}

	@SuppressWarnings("unchecked")
	public boolean isSystemAdmin() {
		List<Map<String, Object>> roles = (List<Map<String, Object>>) this.getAttr(LoginUser.ROLES);
		if (roles != null && roles.size() > 0) {
			for (Map<String, Object> role : roles) {
				if ("SYS001".equalsIgnoreCase((String) role.get("role_type"))) {
					return true;
				}
			}
		}
		return false;
	}
}
