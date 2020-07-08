package com.lhq.pms.exception;

import java.util.Locale;

import com.lhq.pms.data.LoginUser;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.logging.LogParams;
import com.lhq.pms.utils.SpringUtils;

/**
 * 平台异常处理类
 */
public class PMSException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String code;

	private static Locale locale = null;
	private String detailMessage = null;

	public PMSException(Throwable t) {
		super(t);
	}

	public PMSException(String code) {
		this.code = code;
		this.detailMessage = initMsg(code, null);
	}

	public PMSException(String code, Throwable t) {
		super(t);
		this.code = code;
		this.detailMessage = initMsg(code, t);
	}

	@Override
	public String getMessage() {
		return detailMessage;
	}

	public PMSException(String code, Object... args) {
		this.code = code;
		this.detailMessage = initMsg(code, null, args);
	}

	public PMSException(String code, Throwable t, Object... args) {
		super(t);
		this.code = code;
		this.detailMessage = initMsg(code, t, args);
	}

	public String getCode() {
		return this.code;
	}

	private static String initMsg(String code, Throwable t, Object... args) {
		PMSContext context = LogParams.current();
		Locale tmp = null;
		if (context != null) {
			LoginUser user = context.getLoginUser();
			if (user != null) {
				tmp = user.getLocale();
			}
		}
		if (tmp == null) {
			if (locale == null) {
				locale = (Locale) SpringUtils.getBean("locale");
			}
			tmp = locale;
		}
		String str = SpringUtils.getMessage(code, args, tmp);
		return str;
	}

	public static String getMsg(String code, Object... args) {
		PMSContext context = LogParams.current();
		Locale tmp = null;
		if (context != null) {
			LoginUser user = context.getLoginUser();
			if (user != null) {
				tmp = user.getLocale();
			}
		}
		if (tmp == null) {
			if (locale == null) {
				locale = (Locale) SpringUtils.getBean("locale");
			}
			tmp = locale;
		}
		String str = SpringUtils.getMessage(code, args, tmp);
		return str;
	}
}
