package com.lhq.pms.reflect;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class TestReflect {
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static void main(String[] args) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, ClassNotFoundException, InstantiationException {
		String templateFormId =  "com.lhq.pms.reflect.TestAAA";
		String functionName = "AAA";
		String AAA = "12132141421";
		Class cls = Class.forName(templateFormId) ;
		
		Method methodName = null;
		
		try {
			methodName = cls.getMethod(functionName, new Class[]{String.class});
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		}
		System.out.println(methodName);
		Object a = methodName.invoke(cls.newInstance(), new Object[]{AAA});
		System.out.println(a);
	}

}
