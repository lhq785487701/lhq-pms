package com.lhq.pms.file.bo.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

import com.lhq.pms.cache.bo.DicCacheBo;
import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.Page;
import com.lhq.pms.data.Row;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.file.FileInfo;
import com.lhq.pms.file.bo.ExcelExportBo;
import com.lhq.pms.file.bo.FileManageBo;
import com.lhq.pms.logging.Log;
import com.lhq.pms.plugin.thread.PMSThread;
import com.lhq.pms.plugin.thread.PMSThreadPoolExecutor;
import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.GlobalUtils;
import com.lhq.pms.utils.MathUtils;
import com.lhq.pms.utils.StringUtils;
import com.lhq.pms.utils.UuidUtils;

/**
 * excel导出
 * 
 * @包名 com.lhq.pms.file.bo.impl
 * @author lhq
 */
public class ExcelExportImpl extends CommonBoImpl implements ExcelExportBo {
	protected final static Log log = Log.get();

	/** 导出配置 **/
	private static final String CODE_EXP = "exp_code";
	/** 业务类型 **/
	private static final String BUS_TYPE = "bus_type";

	@Resource(name = "threadPool")
	private PMSThreadPoolExecutor threadPool;

	@Resource(name = "fileManageBo")
	private FileManageBo fileManageBo;

	@Resource(name = "dicCacheBo")
	private DicCacheBo dicCacheBo;

	/**
	 * 导出
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void doExport(final PMSContext content) {
		String codeExp = StringUtils.trim((String) content.getParam(CODE_EXP));
		String busType = StringUtils.trim((String) content.getParam(BUS_TYPE));
		String menuCode = StringUtils.trim((String) content.getParam("PMS_menu_code"));
		if (codeExp.length() > 0) {
			Map<String, Object> m = this.selectOne("SDP-EXCEL-EXP-010", codeExp);
			if (m != null) {
				final List<Map<String, Object>> cons = this.selectList("SDP-EXCEL-EXP-002", codeExp);
				if (cons == null || cons.size() < 1) {
					throw new PMSException("exp-sdp-file-0005", codeExp);
				}

				final String busTypeTmp = busType == null
						? (content.getDataStore() != null ? content.getDataStore().getName() + "_exp" : (menuCode == null ? "sdp_exp" : menuCode + "_exp")) : busType;

				int curSize = MathUtils.getInteger(GlobalUtils.getVariant("sdp-excel-exp-page-size"));
				int sheetNum = MathUtils.getInteger(GlobalUtils.getVariant("sdp-excel-exp-sheet-num"));
				int sheetSize = MathUtils.getInteger(GlobalUtils.getVariant("sdp-excel-exp-sheet-size"));

				curSize = curSize <= 0 ? 10000 : curSize;
				sheetNum = sheetNum <= 0 ? 3 : sheetNum;
				sheetSize = sheetSize <= 0 ? 60000 : sheetSize;
				int t = sheetSize * sheetNum;
				Page p = null;
				if (content.getDataStore() == null) {
					p = content.getPage();
					if (p == null) {
						p = new Page();
						content.setPage(p);
					}
					p.setStartRow(0);
					p.setEndRow(curSize);
				} else {
					p = content.getDataStore().getPage();
					if (p == null) {
						p = new Page();
						content.getDataStore().setPage(p);
					}
					p.setStartRow(0);
					p.setEndRow(curSize);
				}

				List<SXSSFWorkbook> wbs = new ArrayList<SXSSFWorkbook>();
				try {
					final String title = (String) m.get("exp_title");
					this.selectList(content);
					final List<Row> rs = (List<Row>) content.getResult();
					if (p.getTotal() > t) {
						String st = content.getStatement();
						if (st == null || st.trim().length() <= 0) {
							st = content.getDataStore().getStatement();
						}
						final Map<String, Object> mm = new HashMap<String, Object>(20);
						mm.put("big_id", UuidUtils.getUuid());
						mm.put("row_num", p.getTotal());
						mm.put("exp_sts", "S");
						mm.put("sql_code", st);
						mm.put("exp_title", title);
						mm.put("server_ip", GlobalUtils.getServerIp());
						mm.put("client_ip", content.getParam("$client_ip"));
						mm.put("system_code", GlobalUtils.getSystemCode());
						mm.put("menu_code", content.getParam("sdp_menu_code"));
						mm.put("$user_code", content.getLoginUser().getUserCode());

						content.setResult(PMSException.getMsg("SDPP-EXCEL-EXP-BIG-001", title));

						final Page p1 = p;
						final int pageNum1 = sheetSize;
						final int sheetNum1 = sheetNum;
						final ExcelExportImpl g = this;
						PMSThread th = new PMSThread() {
							@Override
							public void run() {
								List<SXSSFWorkbook> wbs = new ArrayList<SXSSFWorkbook>();
								Map<String, Map<String, String>> dics = new HashMap<String, Map<String, String>>(20);
								SXSSFWorkbook wb = creatWorkbook(wbs);
								SXSSFSheet sxssfSheet = creatSheet(wb, title + "-1", cons);
								doProcess(content, cons, dics, p1, wbs, pageNum1, sheetNum1, wb, sxssfSheet, title, rs);
								ByteArrayOutputStream stream = new ByteArrayOutputStream();

								ZipOutputStream zipfile = new ZipOutputStream(stream);
								int i = 0;
								mm.put("row_num", p1.getTotal());
								try {
									for (SXSSFWorkbook wb1 : wbs) {
										i++;
										ZipEntry entry = new ZipEntry(title + "_" + i + ".xlsx");
										zipfile.putNextEntry(entry);
										wb1.write(zipfile);
									}
									zipfile.flush();

									byte[] bytes = stream.toByteArray();
									ByteArrayInputStream input = new ByteArrayInputStream(bytes);

									String name = title + ".zip";

									Map<String, Object> params = new HashMap<String, Object>(10);
									params.put("bus_type", busTypeTmp);
									params.put("line_no", 0);
									params.put("$user_code", content.getLoginUser().getUserCode());
									FileInfo info = fileManageBo.saveFile(name, input, params);

									mm.put("file_id", info.getId());
									mm.put("exp_sts", "C");
									mm.put("error_code", null);
									g.update("SDP-EXCEL-EXP-BIG-003", mm);
								} catch (IOException e) {
									String errorCode = UuidUtils.getUuid();
									content.put("$error_code", errorCode);
									mm.put("exp_sts", "E");
									mm.put("error_code", errorCode);
									g.update("SDP-EXCEL-EXP-BIG-003", mm);
									log.error(e);
								}
							}
						};
						th.setTitle("Excel大数据导出,总记录数:" + p.getTotal());
						th.setUser(content.getLoginUser().getUserCode());
						mm.put("thread_code", th.getCode());

						// 插入文件记录
						this.insert("SDP-EXCEL-EXP-BIG-002", mm);

						threadPool.execute(th);
					} else {
						Map<String, Map<String, String>> dics = new HashMap<String, Map<String, String>>(20);
						SXSSFWorkbook wb = creatWorkbook(wbs);
						SXSSFSheet sxssfSheet = creatSheet(wb, title + "-1", cons);

						doProcess(content, cons, dics, p, wbs, sheetSize, sheetNum, wb, sxssfSheet, title, rs);

						content.setResult(null);

						ByteArrayOutputStream stream = new ByteArrayOutputStream();
						String fileName = URLEncoder.encode(title, "utf-8");
						String name = "";
						if (wbs.size() == 1) {
							name = title + ".xlsx";
							content.getResponse().setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");
							content.getResponse().setContentType("application/vnd.ms-excel charset=GBK");
							wb = wbs.get(0);
							wb.write(stream);
						} else {
							name = title + ".zip";
							content.getResponse().setHeader("Content-Disposition", "attachment;filename=" + fileName + ".zip");
							content.getResponse().setContentType("application/zip charset=GBK");

							ZipOutputStream zipfile = new ZipOutputStream(stream);
							int i = 0;
							for (SXSSFWorkbook wb1 : wbs) {
								i++;
								ZipEntry entry = new ZipEntry(title + "_" + i + ".xlsx");
								zipfile.putNextEntry(entry);
								wb1.write(zipfile);
							}
							zipfile.flush();
						}
						byte[] bytes = stream.toByteArray();
						ByteArrayInputStream input = new ByteArrayInputStream(bytes);
						content.setInputStream(input);

						Map<String, Object> params = new HashMap<String, Object>(10);
						params.put("bus_type", busTypeTmp);
						params.put("line_no", 0);
						params.put("$user_code", content.getLoginUser().getUserCode());
						fileManageBo.saveFile(name, new ByteArrayInputStream(bytes), params);
					}
				} catch (Exception e) {
					throw new PMSException(e);
				} finally {
					for (SXSSFWorkbook wb : wbs) {
						wb.dispose();
						try {
							wb.close();
						} catch (IOException e) {
							log.error(e);
						}
					}
				}
			} else {
				throw new PMSException("exp-sdp-file-0004", codeExp);
			}
		} else {
			throw new PMSException("exp-sdp-file-0003");
		}
	}

	private SXSSFSheet creatSheet(SXSSFWorkbook wb, String title, List<Map<String, Object>> cons) {
		SXSSFSheet sxssfSheet = wb.createSheet(title);
		SXSSFRow row = sxssfSheet.createRow(0);
		String name = "";
		Map<String, Object> co = null;
		for (int i = 0, j = cons.size(); i < j; i++) {
			co = cons.get(i);
			SXSSFCell cell = row.createCell(i);
			name = (String) co.get("col_name");
			XSSFRichTextString text = new XSSFRichTextString(name);
			cell.setCellValue(text);
			Long w = MathUtils.getLongObject(co.get("col_width"));
			w = w <= 0 ? 150 * 50 : w * 50;
			sxssfSheet.setColumnWidth(i, w.intValue());
		}
		return sxssfSheet;
	}

	/**
	 * 创建excel sheet
	 * 
	 * @param wbs
	 * @return
	 */
	private SXSSFWorkbook creatWorkbook(List<SXSSFWorkbook> wbs) {
		SXSSFWorkbook wb = new SXSSFWorkbook(100);
		wbs.add(wb);
		return wb;
	}

	/**
	 * 处理数据
	 * 
	 * @param sxssfSheet
	 * @param cons
	 * @param dics
	 * @param rowIndex
	 * @param rs
	 */
	private void doData(SXSSFSheet sxssfSheet, List<Map<String, Object>> cons, Map<String, Map<String, String>> dics, int rowIndex, List<Row> rs) {
		SXSSFRow row = null;
		Map<String, Object> co = null;
		for (int rowNum = 0, t = rs.size(); rowNum < t; rowNum++) {
			Row r = rs.get(rowNum);
			row = sxssfSheet.createRow(rowIndex + rowNum + 1);

			String fld, codeDic;
			String val;
			for (int i = 0, j = cons.size(); i < j; i++) {
				co = cons.get(i);
				fld = (String) co.get("exp_col");
				codeDic = (String) co.get("dic_code");

				SXSSFCell cell = row.createCell(i);

				if (codeDic != null && codeDic.length() > 0) {
					Map<String, String> dic = dics.get(codeDic);
					if (dic == null) {
						dic = new HashMap<String, String>(20);
						dics.put(codeDic, dic);
						/**
						 * 弃用this.selectList("SDP-DIC-003", codeDic) 不从数据库查询
						 * 直接缓存
						 **/
						List<Map<String, String>> ts = dicCacheBo.getDicCache(codeDic);

						initDicMap(dic, ts);
					}
					val = dic.get(r.get(fld));
				} else {
					val = initExcelValue(r.get(fld));
				}
				cell.setCellValue(val);
			}
		}
	}

	/**
	 * 分析查询数据
	 * 
	 * @param content
	 * @param cons
	 * @param dics
	 * @param p
	 * @param wbs
	 * @param pageNum
	 * @param sheetNum
	 * @param wb
	 * @param sxssfSheet
	 * @param title
	 * @param rs
	 */
	@SuppressWarnings("unchecked")
	private void doProcess(PMSContext context, List<Map<String, Object>> cons, Map<String, Map<String, String>> dics, Page p, List<SXSSFWorkbook> wbs, int pageNum, int sheetNum,
			SXSSFWorkbook wb, SXSSFSheet sxssfSheet, String title, List<Row> rs) {
		int total = 0, pnum = 0, rowIndex = 0;
		while (rs != null && rs.size() > 0) {
			total += rs.size();
			if (total > pageNum) {
				total = 0;
				pnum++;
				if (pnum > sheetNum) {
					pnum = 0;
					wb = creatWorkbook(wbs);
				}
				sxssfSheet = creatSheet(wb, title + "-" + (pnum + 1), cons);
				rowIndex = 0;
			}
			doData(sxssfSheet, cons, dics, rowIndex, rs);
			rowIndex += rs.size();
			p.setStartRow(p.getStartRow() + p.getEndRow());
			this.selectList(context);
			rs = (List<Row>) context.getResult();
		}
	}

	/**
	 * 初始化excel
	 * 
	 * @param value
	 * @return
	 */
	private String initExcelValue(Object value) {
		String textValue = "";
		if (value instanceof Date) {
			Date date = (Date) value;
			textValue = DateUtils.toDateString(date);
		} else {
			// 其它数据类型都当作字符串简单处理
			textValue = value == null ? "" : value.toString();
		}
		return textValue;
	}

	/**
	 * 初始化数据字典
	 * 
	 * @param dic
	 * @param rs
	 */
	private void initDicMap(Map<String, String> dic, List<Map<String, String>> rs) {
		if (rs != null && rs.size() > 0) {
			for (Map<String, String> en : rs) {
				dic.put(en.get("dic_value"), en.get("dic_label"));
			}
		}
	}
}
