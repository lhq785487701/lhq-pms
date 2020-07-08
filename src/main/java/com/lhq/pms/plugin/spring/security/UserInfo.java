package com.lhq.pms.plugin.spring.security;

import java.util.Collection;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;


public class UserInfo extends User {

	/**
	 * 语言
	 */
	public Locale locale = Locale.SIMPLIFIED_CHINESE;

	private Map<String, Object> attrs = new HashMap<String, Object>();

	private String password;

	/**
	 * @return the password
	 */
	@Override
	public String getPassword() {
		return password;
	}

	/**
	 * @return the attrs
	 */
	public Map<String, Object> getAttrs() {
		return attrs;
	}

	/**
	 * @param attrs
	 *            the attrs to set
	 */
	public void setAttrs(Map<String, Object> attrs) {
		this.attrs = attrs;
	}

	public Object getAttr(String name) {
		return this.attrs.get(name);
	}

	public void addAttr(String name, Object val) {
		this.attrs.put(name, val);
	}

	/**
	 * @return the locale
	 */
	public Locale getLocale() {
		return locale;
	}

	/**
	 * @param locale
	 *            the locale to set
	 */
	public void setLocale(Locale locale) {
		this.locale = locale;
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 1827449547703146725L;

	/**
	 * @param username
	 * @param password
	 * @param enabled
	 * @param accountNonExpired
	 * @param credentialsNonExpired
	 * @param accountNonLocked
	 * @param authorities
	 */
	public UserInfo(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked,
			Collection<? extends GrantedAuthority> authorities) {
		super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
		this.password = password;
	}

	public void setPassword(String p) {
		this.password = p;
	}

}
