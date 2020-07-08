package com.lhq.pms.data;

/**
 * 翻页
 */
public class Page {
	/**
	 * 总行数
	 */
	private long total = 0;
	/**
	 * 起始行
	 */
	private int startRow = 0;
	/**
	 * 结束行
	 */
	private int endRow = 0;

	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	public int getStartRow() {
		return startRow;
	}

	public void setStartRow(int startRow) {
		if (startRow < 0) {
			startRow = 0;
		}
		this.startRow = startRow;
	}

	public int getEndRow() {
		return endRow;
	}

	public void setEndRow(int endRow) {
		if (endRow < 0) {
			endRow = 0;
		}
		this.endRow = endRow;
	}
}
