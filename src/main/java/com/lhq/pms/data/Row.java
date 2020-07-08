package com.lhq.pms.data;

import com.lhq.pms.map.LowerHashMap;
import com.lhq.pms.type.StateType;

/**
 * 数据
 * 
 * @author lhq 
 */
public class Row extends LowerHashMap {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4881356887334665763L;

	public Row() {
		this.put("$state", StateType.NONE.getIndex());
	}

	public StateType getReState() {
		return StateType.getType(getState());
	}

	public int getState() {
		return (Integer) this.get("$state");
	}

	public void setState(int state) {
		this.put("$state", state);
	}

	public int getIndex() {
		return (Integer) this.get("$index");
	}

	public void setIndex(int index) {
		this.put("$index", index);
	}

	public int getParentIndex() {
		return (Integer) this.get("$pindex");
	}

	public void setParentIndex(int pindex) {
		this.put("$pindex", pindex);
	}

	@Override
	public int hashCode() {
		return super.hashCode();
	}

	@Override
	public boolean equals(Object o) {
		return super.equals(o);
	}
}
