package com.lhq.pms.plugin.mybatis.sqlmap;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.util.StringUtils;

import com.lhq.pms.logging.Log;
import com.lhq.pms.utils.SpringUtils;

public class SQLMapBean {
	protected final static Log log = Log.get();

	private static final Map<String, String> SQL_MAP_CACHE = new ConcurrentHashMap<String, String>(50);

	/**
	 * @param locations
	 *            the locations to set
	 */
	public void setLocations(Resource[] locations) {
		if (locations != null && locations.length > 0) {
			Locale tmp = (Locale) SpringUtils.getBean("locale");
			for (Resource res : locations) {
				try {
					Map<Object, Object> prop = PropertiesLoaderUtils.loadProperties(res);
					for (Entry<Object, Object> entry : prop.entrySet()) {
						String key = (String) entry.getKey();
						String val = (String) entry.getValue();
						if (SQL_MAP_CACHE.containsKey(key)) {
							String v = SQL_MAP_CACHE.get(key);
							String p = res.getFile().getAbsolutePath();
							log.error(SpringUtils.getMessage("exp-sdp-core-0121", new String[] { key, v, key, val, p }, tmp));
						}
						SQL_MAP_CACHE.put(key, val);
					}
				} catch (IOException e) {
					log.error(e);
				}
			}
		}
	}

	public static String getStatement(String code) {
		String val = SQL_MAP_CACHE.get(code);
		if (StringUtils.isEmpty(val)) {
			val = code;
		}
		return val;
	}
}
