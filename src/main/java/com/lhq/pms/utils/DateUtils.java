package com.lhq.pms.utils;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.lhq.pms.logging.Log;

/**
 * 提供对日期时间操作的几个日常方法.
 */
public class DateUtils {
	private static final Log log = Log.get();

	private static final long ONE_DAY = 24 * 3600000;

	private static String datePattern = "yyyy-MM-dd";

	private static String timePattern = "HH:mm:ss";

	private static SimpleDateFormat dateFormat = new SimpleDateFormat(datePattern);

	private static SimpleDateFormat datetimeFormat = new SimpleDateFormat(datePattern + " " + timePattern);

	/**
	 * 将日期对象转换为字符串，格式为yyyy-MM-dd.
	 * 
	 * @param date
	 *            日期.
	 * @return 日期对应的日期字符串.
	 */
	public static String toDateString(Date date) {
		if (date == null) {
			return null;
		}
		return dateFormat.format(date);
	}

	/**
	 * 将字符串转换为日期对象，字符串必须符合yyyy-MM-dd的格式.
	 * 
	 * @param s
	 *            要转化的字符串.
	 * @return 字符串转换成的日期.如字符串为NULL或空串,返回NULL.
	 */
	public static Date toDate(String s) {
		s = StringUtils.trim(s);
		if (s.length() < 1) {
			return null;
		}

		try {
			if (s.length() <= 10) {
				return dateFormat.parse(s);
			}
			try {
				return datetimeFormat.parse(s);
			} catch (Exception e) {
				return toDate(Timestamp.valueOf(s));
			}
		} catch (Exception e) {
			log.error("1001000", e);
			return null;
		}
	}

	/**
	 * 将Timestamp转换为日期.
	 * 
	 * @param timestamp
	 *            时间戳.
	 * @return 日期对象.如时间戳为NULL,返回NULL.
	 */
	public static Date toDate(Timestamp timestamp) {
		if (timestamp == null) {
			return null;
		}
		return new Date(timestamp.getTime());
	}

	/**
	 * 将日期对象转换为字符串，转换后的格式为yyyy-MM-dd HH:mm:ss.
	 * 
	 * @param date
	 *            要转换的日期对象.
	 * @return 字符串,格式为yyyy-MM-dd HH:mm:ss.
	 */
	public static String toDatetimeString(Date date) {
		if (date == null) {
			return null;
		}
		return datetimeFormat.format(date);
	}

	/**
	 * 将日期转换为Timestamp.
	 * 
	 * @param date
	 *            日期.
	 * @return 时间戳.如日期为NULL,返回NULL.
	 */
	public static Timestamp toTimestamp(Date date) {
		if (date == null) {
			return null;
		}

		return new Timestamp(date.getTime());
	}

	/**
	 * 将时间戳对象转化成字符串.
	 * 
	 * @param t
	 *            时间戳对象.
	 * @return 时间戳对应的字符串.如时间戳对象为NULL,返回NULL.
	 */
	public static String toDateString(Timestamp t) {
		if (t == null) {
			return null;
		}
		return toDateString(toDate(t));
	}

	/**
	 * 将Timestamp转换为日期时间字符串.
	 * 
	 * @param t
	 *            时间戳对象.
	 * @return Timestamp对应的日期时间字符串.如时间戳对象为NULL,返回NULL.
	 */
	public static String toDatetimeString(Timestamp t) {
		if (t == null) {
			return "";
		}
		return toDatetimeString(toDate(t));
	}

	/**
	 * 将日期字符串转换为Timestamp对象.
	 * 
	 * @param s
	 *            日期字符串.
	 * @return 日期时间字符串对应的Timestamp.如字符串对象为NULL,返回NULL.
	 */

	public static Timestamp toTimestamp(String s) {
		return toTimestamp(toDate(s));
	}

	/**
	 * 获得系统的当前时间.
	 */
	public static String currDate() {
		return toDatetimeString(now());
	}

	/**
	 * 获取当前时间
	 * 
	 * @return
	 */

	public static Date now() {
		return new Date();
	}

	/**
	 * 获取当前时间
	 * 
	 * @return
	 */
	public static Timestamp currTimestamp() {
		return new Timestamp(now().getTime());
	}

	/**
	 * 获得将来的日期.如果timeDiffInMillis > 0,返回将来的时间;否则，返回过去的时间
	 * 
	 * @param currDate
	 *            现在日期.
	 * @param timeDiffInMillis
	 *            毫秒级的时间差.
	 * @return 经过 timeDiffInMillis 毫秒后的日期.
	 */
	public static Date getFutureDate(Date currDate, long timeDiffInMillis) {
		long l = currDate.getTime();

		l += timeDiffInMillis;
		return new Date(l);
	}

	/**
	 * 获得将来的日期.如果timeDiffInMillis > 0,返回将来的时间;否则，返回过去的时间.
	 * 
	 * @param currDate
	 *            现在日期.
	 * @param timeDiffInMillis
	 *            毫秒级的时间差.
	 * @return 经过 timeDiffInMillis 毫秒后的日期.
	 */
	public static Date getFutureDate(String currDate, long timeDiffInMillis) {
		return getFutureDate(toDate(currDate), timeDiffInMillis);
	}

	/**
	 * 获得将来的日期.如果 days > 0,返回将来的时间;否则，返回过去的时间.
	 * 
	 * @param currDate
	 *            现在日期.
	 * @param days
	 *            经过的天数.
	 * @return 经过days天后的日期.
	 */
	public static Date getFutureDate(Date currDate, int days) {
		long l = currDate.getTime();
		long l1 = (long) days * ONE_DAY;

		l += l1;
		return new Date(l);
	}
}
