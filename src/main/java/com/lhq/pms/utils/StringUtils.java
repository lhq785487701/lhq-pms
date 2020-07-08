package com.lhq.pms.utils;

/**
 * 字符串处理工具
 */
public class StringUtils extends org.springframework.util.StringUtils {

	/**
	 * 判断字符串是否不为空
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNotEmpty(String str) {
		return !isEmpty(str);
	}

	/**
	 * 去掉字串两边空格.
	 * 
	 * @param s
	 *            原字串,如为null,返回空串.
	 * @return 去掉两边空格的字串
	 * 
	 */
	public static String trim(String s) {
		return s == null ? "" : s.trim();
	}
}
