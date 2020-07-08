package com.lhq.pms.file.bo;

import com.lhq.pms.data.PMSContext;

/**
 * excel数据导入
 * 
 * @author lhq
 * 
 */
public interface ExcelImportBo {
	/**
	 * 导入
	 * 
	 * @param content
	 *            content params 必传参数 imp_code 导出编码
	 */
	public void doImport(PMSContext content);
}
