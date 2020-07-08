package com.lhq.pms.file.bo.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.tomcat.util.http.fileupload.FileItem;

import com.lhq.pms.cache.bo.DicCacheBo;
import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.DataStore;
import com.lhq.pms.data.Row;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.file.FileInfo;
import com.lhq.pms.file.bo.ExcelImportBo;
import com.lhq.pms.file.bo.FileManageBo;
import com.lhq.pms.logging.Log;
import com.lhq.pms.plugin.thread.PMSThread;
import com.lhq.pms.plugin.thread.PMSThreadPoolExecutor;
import com.lhq.pms.type.StateType;
import com.lhq.pms.utils.GlobalUtils;
import com.lhq.pms.utils.MathUtils;
import com.lhq.pms.utils.StringUtils;
import com.lhq.pms.utils.UuidUtils;

/**
 * excel导入
 * 
 * @包名 com.lhq.pms.file.bo.impl
 * @author lhq
 */
public class ExcelImportImpl extends CommonBoImpl implements ExcelImportBo {
	protected final static Log log = Log.get();

	/** 导入配置 **/
	private static final String CODE_IMP = "imp_code";
	/** 业务类型 **/
	private static final String BUS_TYPE = "bus_type";
	/** 导入statement **/
	private static final String STATEMENT = "imp_statement";

	private static final String XLSX = "xlsx";

	private static final String N = "N";
	private static final String Y = "Y";

	@Resource(name = "threadPool")
	private PMSThreadPoolExecutor threadPool;

	@Resource(name = "fileManageBo")
	private FileManageBo fileManageBo;

	@Resource(name = "dicCacheBo")
	private DicCacheBo dicCacheBo;

	/**
	 * 导入
	 */
	@Override
	public void doImport(final PMSContext content) {
		String codeImp = StringUtils.trim((String) content.getParam(CODE_IMP));
		String busType = StringUtils.trim((String) content.getParam(BUS_TYPE));
		String varFlagTmp = "N";
		if (codeImp.length() > 0) {
			Map<String, Object> m = this.selectOne("SDP-EXCEL-IMP-010", codeImp);
			if (m != null) {
				//导入新增语句不能为空
				if(m.get(STATEMENT) == null || StringUtils.isEmpty(m.get(STATEMENT))) {
					throw new PMSException("exp-sdp-core-0116", content.getDataStore().getName());
				}
				content.getDataStore().setInsert(StringUtils.trim((String) m.get(STATEMENT)));
				varFlagTmp = StringUtils.trim((String) m.get("is_store"));
				varFlagTmp = "Y".equalsIgnoreCase(varFlagTmp) ? "Y" : "N";
				final String varFlag = varFlagTmp;
				final List<Map<String, Object>> cons = this.selectList("SDP-EXCEL-IMP-002", codeImp);
				if (cons == null || cons.size() < 1) {
					content.setResultCode(false, PMSException.getMsg("exp-sdp-file-0011", codeImp));
					return;
				}
				final DataStore ds = content.getDataStore();
				if (ds == null) {
					content.setResultCode(false, PMSException.getMsg("exp-sdp-file-0010"));
					return;
				}
				List<FileItem> fs = content.getFiles();
				if (fs != null && fs.size() > 0) {
					FileItem f = fs.get(0);
					int startTmp = (int) m.get("start_line");
					int sheet = 0;
					if (startTmp < 0) {
						startTmp = 1;
					}
					final int start = startTmp;

					busType = busType == null ? ds.getName() + "_imp" : busType;

					Map<String, Object> params = new HashMap<String, Object>(10);
					params.put("bus_type", busType);
					params.put("$user_code", content.getLoginUser().getUserCode());
					params.put("line_no", 0);

					String type = getExtensionName(f.getName());
					Workbook wb = null;
					try {
						final FileInfo info = fileManageBo.saveFile(f.getName(), f.getInputStream(), params);

						if (XLSX.equalsIgnoreCase(type)) {
							wb = new XSSFWorkbook(f.getInputStream());
						} else {
							wb = new HSSFWorkbook(f.getInputStream());
						}
						final Map<String, Map<String, String>> dics = new HashMap<String, Map<String, String>>(20);
						final Sheet wbSheet = wb.getSheetAt(sheet);
						String impNum = StringUtils.trim(GlobalUtils.getVariant("sdp_excel_imp_num"));
						int maxNum = 200000;
						if (impNum.length() > 0) {
							maxNum = MathUtils.getInteger(impNum);
							if (maxNum < 0) {
								maxNum = 200000;
							}
						}

						if (wbSheet != null) {
							final List<Map<String, Object>> repeats = new ArrayList<Map<String, Object>>();
							final List<Map<String, Object>> codesqls = new ArrayList<Map<String, Object>>();
							for (int i = 0, j = cons.size(); i < j; i++) {
								Map<String, Object> con = cons.get(i);
								String sql = (String) con.get("repeat_sql_code");
								if (sql != null && sql.trim().length() > 0) {
									con.put("repeat_sql_code", sql.trim());
									repeats.add(con);
								}
								sql = (String) con.get("sql_code");
								if (sql != null && sql.trim().length() > 0) {
									con.put("sql_code", sql.trim());
									codesqls.add(con);
								}
								String codeDic = (String) con.get("dic_code");
								if (codeDic != null && codeDic.trim().length() > 0) {
									con.put("dic_code", codeDic.trim());
								}
							}
							final int excelNum = wbSheet.getLastRowNum();

							if (excelNum < maxNum) {
								final Map<String, Object> mm = new HashMap<String, Object>(20);
								mm.put("big_id", UuidUtils.getUuid());
								mm.put("row_num", excelNum);
								mm.put("imp_sts", "S");
								mm.put("sql_code", ds.getInsert());
								mm.put("imp_title", f.getName());
								mm.put("server_ip", GlobalUtils.getServerIp());
								mm.put("client_ip", content.getParam("$client_ip"));
								mm.put("system_code", GlobalUtils.getSystemCode());
								mm.put("menu_code", content.getParam("sdp_menu_code"));
								mm.put("$user_code", content.getLoginUser().getUserCode());

								content.setResult(PMSException.getMsg("SDPP-EXCEL-IMP-BIG-001", f.getName()));

								final ExcelImportImpl g = this;
								PMSThread th = new PMSThread() {
									@Override
									public void run() {
										try {
											doData(content, ds, wbSheet, start, excelNum, cons, dics, codesqls, repeats, varFlag);

											mm.put("file_id", info.getId());
											mm.put("imp_sts", "C");
											mm.put("error_code", null);
											g.update("SDP-EXCEL-IMP-BIG-003", mm);
										} catch (Exception e) {
											String errorCode = UuidUtils.getUuid();
											content.put("$error_code", errorCode);
											mm.put("imp_sts", "E");
											mm.put("error_code", errorCode);
											g.update("SDP-EXCEL-IMP-BIG-003", mm);
											log.error(e);
										}
									}
								};

								th.setTitle("Excel大数据导入,总记录数:" + excelNum);
								th.setUser(content.getLoginUser().getUserCode());
								mm.put("thread_code", th.getCode());
								// 插入文件记录
								this.insert("SDP-EXCEL-IMP-BIG-002", mm);

								threadPool.execute(th);
							} else {
								doData(content, ds, wbSheet, start, excelNum, cons, dics, codesqls, repeats, varFlag);
							}
						} else {
							content.setResultCode(false, PMSException.getMsg("exp-sdp-file-0009", sheet));
						}
					} catch (Exception e) {
						throw new PMSException(e);
					} finally {
						if (wb != null) {
							try {
								wb.close();
							} catch (IOException e) {
								log.error(e);
							}
						}
					}
				} else {
					content.setResultCode(false, PMSException.getMsg("exp-sdp-file-0008"));
				}
			} else {
				content.setResultCode(false, PMSException.getMsg("exp-sdp-file-0007"));
			}
		} else {
			content.setResultCode(false, PMSException.getMsg("exp-sdp-file-0006"));
		}
	}

	/**
	 * 处理数据
	 * 
	 * @param content
	 * @param ds
	 * @param wbSheet
	 * @param start
	 * @param excelNum
	 * @param cons
	 * @param dics
	 * @param codesqls
	 * @param repeats
	 */
	private void doData(PMSContext content, DataStore ds, Sheet wbSheet, int start, int excelNum, List<Map<String, Object>> cons, Map<String, Map<String, String>> dics,
			List<Map<String, Object>> codesqls, List<Map<String, Object>> repeats, String varFlag) {
		for (int rowNum = start; rowNum <= excelNum; rowNum++) {
			org.apache.poi.ss.usermodel.Row row = wbSheet.getRow(rowNum);
			if (row == null) {
				continue;
			}
			String fld, varNull, codeDic, varReapetSql;
			int intCol = 0;
			Map<String, Object> co = null;
			Row r = new Row();
			r.setState(StateType.ADD.getIndex());
			for (int i = 0, j = cons.size(); i < j; i++) {
				co = cons.get(i);
				intCol = (int) co.get("excel_col")-1;
				varNull = (String) co.get("is_null");
				fld = (String) co.get("imp_col");
				codeDic = (String) co.get("dic_code");

				Cell cell = row.getCell(intCol);
				Object val = getValue(cell);
				if (N.equalsIgnoreCase(varNull)) {
					if (val == null) {
						content.setResultCode(false, PMSException.getMsg("exp-sdp-file-0012", rowNum, intCol));
						return;
					}
				}
				if (codeDic != null && codeDic.length() > 0) {
					Map<String, String> dic = dics.get(codeDic);
					if (dic == null) {
						dic = new HashMap<String, String>(20);
						dics.put(codeDic, dic);
						/**
						 * 弃用this.selectList("SDP-DIC-003", codeDic) 不从数据库查询
						 * 直接缓存
						 **/
						List<Map<String, String>> rs = dicCacheBo.getDicCache(codeDic);
						initDicMap(dic, rs);
					}
					val = dic.get(val);
				}

				r.put(fld, val);
			}
			/*for (int i = 0, j = codesqls.size(); i < j; i++) {
				co = codesqls.get(i);
				varCodeSql = (String) co.get("sql_code");
				varNull = (String) co.get("is_null");
				intCol = (int) co.get("excel_col");
				fld = (String) co.get("imp_col");
				Map<String, Object> mm = content.getParams();
				mm.putAll(r);
				String val = this.selectOne(varCodeSql, mm);
				if (N.equalsIgnoreCase(varNull)) {
					if (val == null) {
						content.setResultCode(false, PMSException.getMsg("exp-sdp-file-0012", rowNum, intCol));
						return;
					}
				}
				r.put(fld, val);
			}*/
			boolean b = true;
			for (int i = 0, j = repeats.size(); i < j; i++) {
				co = repeats.get(i);
				varReapetSql = (String) co.get("repeat_sql_code");
				Map<String, Object> mm = content.getParams();
				mm.putAll(r);
				int count = this.selectOne(varReapetSql, mm);
				if (count > 0) {
					b = false;
				}
			}
			if (b) {
				ds.addRow(r);
			}
		}
		if (Y.equalsIgnoreCase(varFlag)) {
			this.insert(content);
			content.setResult(null);
		} else {
			content.setResult(ds);
		}
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
				dic.put(en.get("dic_label"), en.get("dic_value"));
			}
		}
	}

	/**
	 * 获取扩展名称
	 * 
	 * @param filename
	 * @return
	 */
	public static String getExtensionName(String filename) {
		if ((filename != null) && (filename.length() > 0)) {
			int dot = filename.lastIndexOf('.');
			if ((dot > -1) && (dot < (filename.length() - 1))) {
				return filename.substring(dot + 1);
			}
		}
		return filename;
	}

	/**
	 * 得到Excel表中的值
	 * 
	 * @param hssfCell
	 *            Excel中的每一个格子
	 * @return Excel中每一个格子中的值
	 */
	@SuppressWarnings({ "deprecation" })
	private Object getValue(Cell hssfCell) {
		if (hssfCell == null) {
			return "";
		}
		if (hssfCell.getCellType() == CellType.BOOLEAN.getCode()) {
			// 返回布尔类型的值
			return hssfCell.getBooleanCellValue();
		} else if (hssfCell.getCellType() == CellType.NUMERIC.getCode()) {
			// 返回数值类型的值
			return hssfCell.getNumericCellValue();
		} else {
			// 返回字符串类型的值
			return StringUtils.trim(hssfCell.getStringCellValue());
		}
	}
}
