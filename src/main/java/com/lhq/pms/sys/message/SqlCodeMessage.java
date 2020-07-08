package com.lhq.pms.sys.message;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.core.io.support.PropertiesLoaderUtils;

import com.lhq.pms.logging.Log;
import com.lhq.pms.message.PMSTopic;
import com.lhq.pms.type.StateType;
import com.lhq.pms.utils.StringUtils;

/**
 * @author lhq
 *
 */
public class SqlCodeMessage {
	protected final static Log log = Log.get();


	private static final String SDP_CHANGE = "com.lhq.pms.system.sqlcode.change";

	private static final Map<String, String> SQL_CODE_CACHE = new ConcurrentHashMap<String, String>(50);

	/**
	 * @param locations
	 *            the locations to set
	 */
	public void setLocations(org.springframework.core.io.Resource[] locations) {
		if (locations != null && locations.length > 0) {
			for (org.springframework.core.io.Resource res : locations) {
				try {
					Map<Object, Object> prop = PropertiesLoaderUtils.loadProperties(res);
					for (Entry<Object, Object> entry : prop.entrySet()) {
						String key = (String) entry.getKey();
						String val = StringUtils.trim((String) entry.getValue());
						String[] codes = val.split(",");
						for (String code : codes) {
							SQL_CODE_CACHE.put(code, key);
						}
					}
				} catch (IOException e) {
					log.error(e);
				}
			}
		}
	}

	/**
	 * 发送消息
	 * 
	 * @param sqlCode
	 * @param data
	 *            影响数据
	 * @param type
	 *            数据操作类型
	 */
	public void sendMessage(String sqlCode, Object data, StateType type) {
		if (SQL_CODE_CACHE.containsKey(sqlCode)) {
			Map<String, Object> map = new HashMap<String, Object>(2);
			PMSTopic topic = new PMSTopic(SDP_CHANGE);
			topic.setType(sqlCode);
			map.put("action", type.getIndex());
			map.put("data", data);
			topic.setData(map);
			//messageHandel.send(topic);
		}
	}

	/**
	 * 获取sqlcode处理逻辑
	 * 
	 * @param sqlCode
	 * @return
	 */
	public String getSqlCodeBo(String sqlCode) {
		return SQL_CODE_CACHE.get(sqlCode);
	}
}
