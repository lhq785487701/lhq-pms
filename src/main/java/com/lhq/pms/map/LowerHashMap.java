package com.lhq.pms.map;

import java.util.HashMap;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
public class LowerHashMap extends HashMap<String, Object> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public Object put(String key, Object value) {
		key = key.toLowerCase();
		return super.put(key, value);
	}

	@Override
	public Object get(Object key) {
		String k = ((String) key).toLowerCase();
		return super.get(k);
	}
}
