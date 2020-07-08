package com.lhq.pms.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;

/**
 * 异常处理工具
 * 
 * @author lhq 
 */
public class ExceptionUtils {
	/**
	 * 凭借异常堆栈信息
	 * 
	 * @param msg
	 * @param t
	 * @return
	 */
	public static StringBuilder getException(String msg, Throwable t) {
		StringBuilder sb = new StringBuilder();
		if (StringUtils.isNotEmpty(msg)) {
			sb.append(msg).append("\r");
		}
		StringBuilder sbStr = getException(t);
		sb.append(sbStr);
		return sb;
	}

	/**
	 * 获取异常堆栈信息
	 * 
	 * @param t
	 * @return
	 */
	public static StringBuilder getException(Throwable t) {
		StringBuilder sb = new StringBuilder();
		ByteArrayOutputStream bas = new ByteArrayOutputStream();
		PrintStream ps = new PrintStream(bas);
		t.printStackTrace(ps);
		sb.append(new String(bas.toByteArray()));
		ps.close();
		try {
			bas.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sb;
	}
}
