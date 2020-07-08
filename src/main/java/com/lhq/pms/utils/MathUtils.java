package com.lhq.pms.utils;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.lhq.pms.exception.PMSException;

/**
 * 主要提供了BigDecimal类的一些数学运算的方法,如加减乘除.
 * 和直接使用BigDecimal方法相比,该类提供了对NULL值的保护,将NULL值作为0参与运算. 并且，提供了判断浮点数是否相等、为0等统一的方法.
 * 
 * @包名 com.lhq.pms.utils
 * @文件名 MathUtils.java
 * @author lhq 
 */
public class MathUtils {

	private static final Logger log = LoggerFactory.getLogger(MathUtils.class);

	private static final String STRING_ZERO = "0.00";

	public static final BigDecimal ZERO = new BigDecimal(STRING_ZERO);

	private static final double MIN = 0.0000001;
	/** 和目前数据库设计保持一致，取6位小数. **/
	private static final int DFT_SCALE = 6;

	private static final String ZERO_STR = "0";

	/**
	 * 判断是否为 0.
	 * 
	 * @param d
	 *            要判断的参数.
	 * @return true/false.
	 */
	public static boolean isZero(double d) {
		return Math.abs(d) <= MIN;
	}

	/**
	 * 判断是否为 0.
	 * 
	 * @param f
	 *            要判断的参数.
	 * @return true/false.
	 */
	public static boolean isZero(float f) {
		return Math.abs(f) <= MIN;
	}

	/**
	 * 判断是否为 0.
	 * 
	 * @param bd
	 *            要判断的参数.
	 * @return true/false.
	 */
	public static boolean isZero(BigDecimal bd) {
		if (bd == null) {
			return true;
		}

		return isZero(bd.doubleValue());
	}

	/**
	 * 返回字串对应的BigDecimal，如为空串/NULL返回 0. 只支持10进制数字，不支持其他进制.
	 * 
	 * @param s
	 *            要转变的数字型字串.
	 * @return 字串对应的BigDecimal，精度和数字字串保持一致.
	 * @exception 如格式不满足要求
	 *                ，抛出 NumberFormatException .
	 */
	public static BigDecimal getBigDecimal(String s) {
		s = StringUtils.trim(s);
		String ss = trimZeroPrefix(s);
		if (ss.length() < 1) {
			return ZERO;
		} else {
			try {
				return new BigDecimal(ss);
			} catch (Exception e) {
				return new BigDecimal(s);
			}
		}
	}

	/** 传给null,返回空串"". */
	private static String trimZeroPrefix(String s) {
		if (s == null) {
			return "";
		}

		s = s.trim();
		if (s.length() < 1) {
			return s;
		}

		String c = s.substring(0, 1);

		while (s.length() > 1 && ZERO_STR.equals(c)) {
			s = s.substring(1, s.length());
			if (s.length() > 1) {
				c = s.substring(0, 1);
			} else {
				break;
			}
		}

		return s;
	}

	/**
	 * 返回数字对应的BigDecimal.
	 * 
	 * @param d
	 *            要转变的数字.
	 * @return 数字对应的BigDecimal，精度和数字保持一致.
	 */
	public static BigDecimal getBigDecimal(double d) {
		return new BigDecimal(d + "");
	}

	/**
	 * 返回数字对应的BigDecimal,精度为指定精度,自动四舍五入.
	 * 
	 * @param d
	 *            要转变的数字.
	 * @param scale
	 *            精度.
	 * @return 数字对应的BigDecimal，精度为指定精度,自动四舍五入.
	 */
	public static BigDecimal getBigDecimal(double d, int scale) {
		if (scale == 0) {
			d = Math.round(d);
			BigDecimal bd = new BigDecimal(d);
			return bd.setScale(0);
		} else {
			BigDecimal bd = new BigDecimal(d + "");
			bd = bd.setScale(scale, BigDecimal.ROUND_HALF_UP);
			return bd;
		}
	}

	/**
	 * 返回数字对应的BigDecimal,精度为指定精度,自动四舍五入.
	 * 
	 * @param bd
	 *            要转变的数字.
	 * @param scale
	 *            精度.
	 * @return 数字对应的BigDecimal，精度为指定精度,自动四舍五入.
	 */
	public static BigDecimal getBigDecimal(BigDecimal bd, int scale) {
		return getBigDecimal(doubleValue(bd), scale);
	}

	/**
	 * 返回BigDecimal对应的数字字串,为NULL则返回0.
	 * 
	 * @param bd
	 *            要转变的数字.
	 * @return 返回BigDecimal对应的数字字串,为NULL则返回0.
	 */
	public static String toString(BigDecimal bd) {

		if (bd == null || isZero(bd)) {
			return STRING_ZERO;
		} else {
			return new BigDecimal(String.valueOf(bd.doubleValue())).toString();
		}
	}

	/**
	 * 返回参数1是否大于参数2.
	 * 
	 * @param bd1
	 *            参数1,如果为NULL,视为0对待.
	 * @param bd2
	 *            参数2,如果为NULL,视为0对待.
	 * @return 如果参数1大于参数2，返回真，否则返回假.
	 */
	public static boolean moreThan(BigDecimal bd1, BigDecimal bd2) {
		return moreThan(doubleValue(bd1), doubleValue(bd2));
	}

	/**
	 * 返回参数1是否大于参数2.
	 * 
	 * @param b1
	 *            参数1.
	 * @param b2
	 *            参数2.
	 * @return 如果参数1大于参数2，返回真，否则返回假.
	 */
	public static boolean moreThan(double d1, double d2) {
		double d = d1 - d2;
		if (isZero(d) || d < 0) {
			return false;
		}
		return true;
	}

	/**
	 * 返回参数1是否小于参数2.
	 * 
	 * @param bd1
	 *            参数1,如果为NULL,视为0对待.
	 * @param bd2
	 *            参数2,如果为NULL,视为0对待.
	 * @return 如果参数1小于参数2，返回真，否则返回假.
	 */
	public static boolean lessThan(BigDecimal bd1, BigDecimal bd2) {
		return lessThan(doubleValue(bd1), doubleValue(bd2));
	}

	/**
	 * 返回参数1是否小于参数2.
	 * 
	 * @param d1
	 *            参数1.
	 * @param d2
	 *            参数2.
	 * @return 如果参数1小于参数2，返回真，否则返回假.
	 */
	public static boolean lessThan(double d1, double d2) {
		double d = d1 - d2;
		if (isZero(d) || d > 0) {
			return false;
		}
		return true;
	}

	/**
	 * 返回参数1是否等于参数2.
	 * 
	 * @param bd1
	 *            参数1,如果为NULL,视为0对待.
	 * @param bd2
	 *            参数2,如果为NULL,视为0对待.
	 * @return 如果参数1等于参数2，返回真，否则返回假.
	 */
	public static boolean equals(BigDecimal bd1, BigDecimal bd2) {
		return isZero(doubleValue(bd1) - doubleValue(bd2));
	}

	/**
	 * 返回BigDecimal的doubleValue.
	 * 
	 * @param bd
	 *            要返回其值的参数.
	 * @return bd.doubleValue() 如果参数为NULL，返回0.0.
	 */
	public static double doubleValue(BigDecimal bd) {
		if (bd == null) {
			return 0.0;
		}
		return bd.doubleValue();
	}

	/**
	 * 返回参数1与参数2的和.
	 * 
	 * @param bd1
	 *            参数1，如为NULL，视为0.
	 * @param bd2
	 *            参数2，如为NULL，视为0.
	 * @return 参数1与参数2的和.
	 */
	public static BigDecimal add(BigDecimal bd1, BigDecimal bd2) {

		int scale = getScale(bd1, bd2);

		return getBigDecimal(doubleValue(bd1) + doubleValue(bd2), scale);
	}

	/**
	 * 获得最大的精度数.
	 */
	private static int getScale(BigDecimal bd1, BigDecimal bd2) {
		int scale1 = 0;
		int scale2 = 0;
		if (bd1 != null) {
			scale1 = bd1.scale();
		}

		if (bd2 != null) {
			scale2 = bd2.scale();
		}

		return (scale1 > scale2 ? scale1 : scale2);
	}

	/**
	 * 返回参数1与参数2的和.
	 * 
	 * @param bd1
	 *            参数1,如果为NULL,视为0对待.
	 * @param d
	 *            参数2.
	 * @return 参数1与参数2的和.
	 */
	public static BigDecimal add(BigDecimal bd1, double d) {
		return getBigDecimal(doubleValue(bd1) + d);
	}

	/**
	 * 返回参数1加参数2的和.
	 * 
	 * @param bd1
	 *            参数1.
	 * @param bd2
	 *            参数2.
	 * @return 参数1加参数2的和.
	 */
	public static BigDecimal add(double d1, double d2) {
		return getBigDecimal(d1 + d2);
	}

	/**
	 * 返回参数1减去参数2的差.
	 * 
	 * @param bd1
	 *            参数1,如果为NULL,视为0对待.
	 * @param bd2
	 *            参数2,如果为NULL,视为0对待.
	 * @return 参数1减去参数2的差.
	 */
	public static BigDecimal subtract(BigDecimal bd1, BigDecimal bd2) {
		int scale = getScale(bd1, bd2);

		return getBigDecimal(doubleValue(bd1) - doubleValue(bd2), scale);
	}

	/**
	 * 返回参数1减去参数2的差.
	 * 
	 * @param bd1
	 *            参数1,如果为NULL,视为0对待.
	 * @param bd2
	 *            参数2.
	 * @return 参数1减去参数2的差.
	 */
	public static BigDecimal subtract(BigDecimal bd1, double d) {
		return getBigDecimal(doubleValue(bd1) - d);
	}

	/**
	 * 返回参数1减去参数2的差.
	 * 
	 * @param bd1
	 *            参数1.
	 * @param bd2
	 *            参数2.
	 * @return 参数1减去参数2的差.
	 */
	public static BigDecimal subtract(double d1, double d2) {
		return getBigDecimal(d1 - d2);
	}

	/**
	 * 返回参数1乘参数2的积.
	 * 
	 * @param bd1
	 *            参数1,如果为NULL,视为0对待.
	 * @param bd2
	 *            参数2,如果为NULL,视为0对待.
	 * @return 参数1乘参数2的积.
	 */
	public static BigDecimal multiply(BigDecimal bd1, BigDecimal bd2) {
		if (isZero(bd1) || isZero(bd2)) {
			return ZERO;
		}

		return bd1.multiply(bd2);
	}

	/**
	 * 返回参数1乘参数2的积.
	 * 
	 * @param bd1
	 *            参数1,如果为NULL,视为0对待.
	 * @param bd2
	 *            参数2,如果为NULL,视为0对待.
	 * @return 参数1乘参数2的积.
	 */
	public static BigDecimal divide(BigDecimal bd1, BigDecimal bd2, int scale) {
		if (isZero(bd1)) {
			return ZERO;
		}

		if (isZero(bd2)) {
			throw new PMSException("exp-sdp-utils-math-001", bd1, bd2);
		}

		return bd1.divide(bd2, scale, BigDecimal.ROUND_HALF_UP);
	}

	/**
	 * 返回参数1乘参数2的积.
	 * 
	 * @param bd1
	 *            参数1,如果为NULL,视为0对待.
	 * @param bd2
	 *            参数2,如果为NULL,视为0对待.
	 * @return 参数1乘参数2的积.
	 */
	public static BigDecimal divide(BigDecimal bd1, BigDecimal bd2) {
		return divide(bd1, bd2, DFT_SCALE);
	}

	/**
	 * 返回字符串对应的整数,如果数字非法,返回0.
	 * 
	 * @param s
	 *            要转变的字符串,如为NULL或空串,返回 0.
	 * @return 字符串对应的整数.
	 */
	public static Integer getInteger(String s) {
		try {
			return Integer.valueOf(s);
		} catch (Exception e) {
			log.warn(s + "转换成数字出错!");
			return new Integer(0);
		}
	}

	/**
	 * 返回参数1与参数2的和.
	 * 
	 * @param a
	 *            参数1,如果为NULL,视为0对待.
	 * @param b
	 *            参数2,如果为NULL,视为0对待.
	 * @return 参数1与参数2的和.
	 */
	public static Integer add(Integer a, Integer b) {
		return new Integer(intValue(a) + intValue(b));
	}

	/**
	 * 返回参数1与参数2的和.
	 * 
	 * @param a
	 *            参数1,如果为NULL,视为0对待.
	 * @param b
	 *            参数2,如果为NULL,视为0对待.
	 * @return 参数1与参数2的和.
	 */
	public static Integer add(BigDecimal a, Integer b) {
		return new Integer(intValue(a) + intValue(b));
	}

	/**
	 * 返回参数1与参数2的和.
	 * 
	 * @param a
	 *            参数1,如果为NULL,视为0对待.
	 * @param b
	 *            参数2,如果为NULL,视为0对待.
	 * @return 参数1与参数2的和.
	 */
	public static Integer add(Integer a, BigDecimal b) {
		return new Integer(intValue(b) + intValue(a));
	}

	/**
	 * 返回参数的整数值.
	 * 
	 * @param a
	 *            参数.
	 * @return 参数的整数值,如果参数为null,返回0.
	 */
	public static int intValue(Integer a) {
		if (a == null) {
			return 0;
		}

		return a.intValue();
	}

	/**
	 * 返回参数的整数值.
	 * 
	 * @param a
	 *            参数.
	 * @return 参数的整数值,如果参数为null,返回0.
	 */
	public static int intValue(BigDecimal a) {
		if (a == null) {
			return 0;
		}

		return a.intValue();
	}

	/**
	 * 上取整.如传入3.1,返回 4.传入 -3.1,返回 -4.
	 * 
	 * @param a
	 *            要上取整的数字.
	 * @return int 向上取整后的值.此处的上指相对0值的距离.
	 */
	public static int roundUp(BigDecimal a) {
		if (isZero(a)) {
			return 0;
		}

		int i = a.intValue();

		System.out.println("roundUp a=" + a.doubleValue() + ",i=" + i);

		double diff = a.doubleValue() - i;

		if (isZero(diff)) {
			return i;
		} else {
			if (a.signum() > 0) {
				return i + 1;
			} else {
				return i - 1;
			}
		}
	}

	/**
	 * 下取整.如传入3.1,返回 3.传入 -3.1,返回 -3.
	 * 
	 * @param a
	 *            要下取整的数字.
	 * @return int 向下取整后的值.此处的下指相对0值的距离.
	 */
	public static int roundDown(BigDecimal a) {
		if (isZero(a)) {
			return 0;
		}

		int i = a.intValue();

		System.out.println("roundDown a=" + a.doubleValue() + ",i=" + i);

		@SuppressWarnings("unused")
		double diff = a.doubleValue() - i;

		return i;
	}

	/**
	 * 字符串到BigDecimal 空串转为0.
	 * 
	 * @deprecated 请使用#getBigDecimal(String).
	 */
	public static BigDecimal toBigDecimal(String s) {
		return getBigDecimal(s);
	}

	/**
	 * 返回数字对应的BigDecimal.
	 * 
	 * @param d
	 *            要转变的数字.
	 * @return 数字对应的BigDecimal，精度和数字保持一致.
	 */
	public static BigDecimal getBigDecimal(Double d) {
		if (d == null) {
			return ZERO;
		}

		return new BigDecimal(d.toString());
	}

	public static long getLongObject(Object obj) {
		if (obj == null) {
			return -1;
		}
		if (obj instanceof Long) {
			return (Long) obj;
		} else if (obj instanceof BigDecimal) {
			return ((BigDecimal) obj).longValue();
		} else if (obj instanceof Integer) {
			return ((Integer) obj).longValue();
		} else {
			return getInteger(obj.toString()).longValue();
		}
	}

	public static void main(String[] s) {
		Double d = null;
		System.out.println(toString(getBigDecimal(d)));

		d = new Double(2.0);
		System.out.println(toString(getBigDecimal(d)));

		String n = "0000123";
		n = trimZeroPrefix(n);
		System.out.println(n);
		System.out.println(getBigDecimal(n));

		// n = "0x123";
		// n = trimZeroPrefix(n);
		// System.out.println(n);
		// System.out.println(getBigDecimal(n));

		n = "";
		n = trimZeroPrefix(n);
		System.out.println(n);
		System.out.println(getBigDecimal(n));

		n = "0";
		n = trimZeroPrefix(n);
		System.out.println(n);
		System.out.println(getBigDecimal(n));

		n = "00";
		n = trimZeroPrefix(n);
		System.out.println(n);
		System.out.println(getBigDecimal(n));

	}
}