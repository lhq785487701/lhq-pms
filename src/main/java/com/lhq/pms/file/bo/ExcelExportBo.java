package com.lhq.pms.file.bo;

import com.lhq.pms.data.PMSContext;

/**
 * excel数据导出
 * 
 * @包名 com.lhq.pms.file.bo
 * @author lhq
 */
public interface ExcelExportBo {
	/**
	 * 导出
	 * 
	 * @param content
	 *            content params 必传参数 exp_code 导出编码,bus_type 业务类型
	 *            不传默认是当前menu_code+'_exp'
	 */
	public void doExport(PMSContext content);
}
