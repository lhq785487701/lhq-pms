package com.lhq.pms.utils;

import java.util.UUID;

/**
 * @author lhq
 *
 */
public class UuidUtils {
	/**
	 * 获取uuid
	 * 
	 * @return
	 */
	public static String getUuid() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
}
