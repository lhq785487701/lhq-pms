package com.lhq.pms.plugin.spring.security;

import org.springframework.security.access.ConfigAttribute;

public class PMSConfigAttribute implements ConfigAttribute {
	private String role;
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public PMSConfigAttribute(String role) {
		this.role = role;
	}

	@Override
	public String getAttribute() {
		return role;
	}

}
