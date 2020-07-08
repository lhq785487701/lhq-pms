package com.lhq.pms.utils;

import java.util.HashMap;
import java.util.Map;

import com.lhq.pms.sys.vo.SystemNode;

/**
 * 类功能描述
 */
public class GlobalUtils {
	/** 当前系统节点 **/
	public static SystemNode NODE;

	private static Map<String, String> hash = new HashMap<String, String>(40);

	/** 系统编码 **/
	private static final String APP_SYSTEM = "APP_SYSTEM";
	/** 服务地址 **/
	private static final String APP_SERVER_IP = "APP_SERVER_IP";

	/**
	 * 获取节点
	 * 
	 * @return
	 */
	public synchronized static SystemNode getNode() {
		if (NODE == null) {
			NODE = new SystemNode();
			NODE.setNodeCode(UuidUtils.getUuid());
			NODE.setCreateDate(DateUtils.currTimestamp());
			NODE.setServerIp(getSystemCode());
			NODE.setSystemCode(getServerIp());
		}
		return NODE;
	}

	/**
	 * 注册参数
	 * 
	 * @param name
	 * @param value
	 */
	public static void registerVariant(final String name, String value) {
		value = StringUtils.trim(value);
		hash.put(name, value);
	}

	/**
	 * 是否存在参数
	 * 
	 * @param name
	 * @return
	 */
	public static boolean isExitVariant(String name) {
		return hash.containsKey(name);
	}

	/**
	 * 获取全局参数
	 * 
	 * @param name
	 *            名称
	 * @return 值
	 */
	public static String getVariant(String name) {
		return (String) hash.get(name);
	}

	/**
	 * 删除参数
	 * 
	 * @param name
	 */
	public static void removeVariant(String name) {
		hash.remove(name);
	}

	/**
	 * 获取系统编码
	 * 
	 * @return
	 */
	public static String getSystemCode() {
		return hash.get(APP_SYSTEM);
	}

	/**
	 * 设置系统编码
	 * 
	 * @param systemCode
	 */
	public static void setSystemCode(String systemCode) {
		registerVariant(APP_SYSTEM, systemCode);
	}

	/**
	 * 获取系统服务
	 * 
	 * @return
	 */
	public static String getServerIp() {
		return hash.get(APP_SERVER_IP);
	}

	/**
	 * 设置服务地址
	 * 
	 * @param ip
	 */
	public static void setServerIp(String ip) {
		registerVariant(APP_SERVER_IP, ip);
	}
}
