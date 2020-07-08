package com.lhq.pms.type;

import com.lhq.pms.exception.PMSException;

/**
 * 类功能描述
 */
public enum StateType {
	NONE(0, "none"), ADD(1, "add"), MODIFY(2, "modify"), DELETE(3, "delete");
	// 成员变量
	private String name;
	private int index;

	// 构造方法
	private StateType(int index, String name) {
		this.name = name;
		this.index = index;
	}

	// 普通方法
	public static StateType getType(int index) {
		for (StateType c : StateType.values()) {
			if (c.getIndex() == index) {
				return c;
			}
		}
		throw new PMSException("10020000", index);
	}

	public String getName() {
		return name;
	}

	public int getIndex() {
		return index;
	}
}
