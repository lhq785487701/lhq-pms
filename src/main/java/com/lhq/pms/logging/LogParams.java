package com.lhq.pms.logging;

import com.lhq.pms.data.PMSContext;

/**
 * 输出日志参数
 */
public class LogParams {
	protected static ThreadLocal<PMSContext> currentBus = new ThreadLocal<PMSContext>();

	public static PMSContext current(PMSContext dp) {
		PMSContext obj = currentBus.get();
		if (null == obj && dp != null) {
			currentBus.set(dp);
			obj = dp;
		}
		return obj;
	}

	public static PMSContext current() {
		return currentBus.get();
	}

	public static Boolean isCurrent() {
		PMSContext obj = (PMSContext) currentBus.get();
		return (obj != null);
	}

	public static void clear() {
		currentBus.remove();
	}
}
