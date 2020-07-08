package com.lhq.pms.file.bo.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.FileItem;

import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.DataStore;
import com.lhq.pms.data.Row;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.file.FileInfo;
import com.lhq.pms.file.bo.FileBo;
import com.lhq.pms.file.bo.FileManageBo;
import com.lhq.pms.logging.Log;
import com.lhq.pms.utils.GlobalUtils;

/**
 * 文件管理接口实现
 * 
 * @author lhq
 */
public class FileManageBoImpl extends CommonBoImpl implements FileManageBo {
	protected final static Log log = Log.get();

	@Resource(name = "fileBo")
	private FileBo fileBo;

	@Override
	public void queryFiles(PMSContext context) {
		this.selectList(context);
	}

	@Override
	public void uploadFiles(PMSContext context) {
		DataStore ds = context.getStores().get("sdp_file");
		if (ds != null && fileBo != null) {
			List<FileItem> files = context.getFiles();
			List<Row> rs = ds.getInsertRows();
			if (files != null && files.size() > 0 && rs != null && rs.size() == files.size()) {
				Map<FileItem, Row> map = new HashMap<FileItem, Row>(20);
				for (Row r : rs) {
					String name = (String) r.get("file_name");
					FileItem f = getFileItemByName(files, name);
					if (f == null) {
						throw new PMSException("exp-sdp-file-0001", name);
					}
					map.put(f, r);
				}
				ds.setInsert("SDP-FILE-003");
				for (Map.Entry<FileItem, Row> entry : map.entrySet()) {
					FileItem f = entry.getKey();
					Row r = entry.getValue();
					try {
						String[] t = f.getName().split("\\.");
						FileInfo file = fileBo.saveFile(f.getName(), f.getInputStream());
						r.put("file_id", file.getId());
						r.put("file_suffix", t.length > 1 ? t[t.length - 1] : "");
						r.put("system_code", GlobalUtils.getSystemCode());
						r.put("bus_type", context.getParam("bus_type"));
						r.put("business_no", context.getParam("business_no"));
						r.put("line_no", context.getParam("line_no"));
					} catch (IOException e) {
						log.error("{0}文件上传出错", e, f.getName());
					}
				}

				this.insert(context);
			}
		}
	}

	/**
	 * 保存文件
	 */
	@Override
	public FileInfo saveFile(String name, InputStream inputStream, Map<String, Object> params) {
		FileInfo file = fileBo.saveFile(name, inputStream);
		if (params == null) {
			params = new HashMap<String, Object>(10);
		}
		String[] t = name.split("\\.");
		params.put("file_id", file.getId());
		params.put("file_suffix", t.length > 1 ? t[t.length - 1] : "");
		params.put("file_name", name);
		params.put("system_code", GlobalUtils.getSystemCode());

		this.insert("SDP-FILE-003", params);
		return file;
	}

	private FileItem getFileItemByName(List<FileItem> files, String name) {
		for (FileItem f : files) {
			if (name.equals(f.getName())) {
				return f;
			}
		}
		return null;
	}

	@Override
	public void delFiles(PMSContext context) {
		DataStore ds = context.getStores().get("sdp_file");
		if (ds != null && fileBo != null) {
			List<Row> rs = ds.getDeleteRows();
			if (rs != null && rs.size() > 0) {
				for (Row r : rs) {
					String fileId = (String) r.get("file_id");
					if (fileId != null) {
						fileBo.deleteFile(fileId);
					}
				}
				this.delete(context);
			}
		}
	}

	@Override
	public void delFile(PMSContext context) {
		String fileId = (String) context.getParam("file_id");
		if (fileId != null && fileBo != null) {
			fileBo.deleteFile(fileId);
			this.delete("SDP-FILE-004", fileId);
		}
	}

	@Override
	public void downFile(PMSContext context) {
		String fileId = (String) context.getParam("file_id");
		if (fileId != null && fileBo != null) {
			FileInfo file = fileBo.findFile(fileId);
			HttpServletResponse res = context.getResponse();
			HttpServletRequest req = context.getRequest();
			res.setContentLengthLong(file.getLength());
			String contentType = file.getContentType();

			if (contentType != null && contentType.length() > 0) {
				res.setContentType(contentType);
			} else {
				res.setContentType(req.getServletContext().getMimeType(file.getFilename()));
			}
			// 设置Content-Disposition
			try {
				String fileName = URLEncoder.encode(file.getFilename(), "utf-8");
				res.setHeader("Content-Disposition", "attachment;filename=" + fileName);
				context.setInputStream(file.getInputStream());
			} catch (UnsupportedEncodingException e) {
				throw new PMSException(e);
			}
		}
	}

	@Override
	public void uploadFile(PMSContext context) {
		if (fileBo != null) {
			List<FileItem> files = context.getFiles();
			if (files != null && files.size() > 0) {
				FileItem f = files.get(0);
				try {
					String[] t = f.getName().split("\\.");
					FileInfo file = fileBo.saveFile(f.getName(), f.getInputStream());
					Map<String, Object> r = new HashMap<String, Object>(10);
					r.put("file_id", file.getId());
					r.put("file_name", file.getFilename());
					r.put("file_suffix", t.length > 1 ? t[t.length - 1] : "");
					r.put("system_code", GlobalUtils.getSystemCode());
					r.put("bus_type", context.getParam("bus_type"));
					r.put("business_no", context.getParam("business_no"));
					r.put("line_no", context.getParam("line_no"));
					r.put("$user_code", context.getLoginUser().getUserCode());

					this.insert("SDP-FILE-003", r);
				} catch (IOException e) {
					log.error("{0}文件上传出错", e, f.getName());
				}
			}
		}

	}

	@Override
	public void updateFile(PMSContext context) {
		if (fileBo != null) {
			List<FileItem> files = context.getFiles();
			if (files != null && files.size() > 0) {
				FileItem f = files.get(0);
				try {
					String[] t = f.getName().split("\\.");
					String oldfileId = (String) context.getParam("file_id");
					FileInfo file = fileBo.updateFile(f.getName(), f.getInputStream(), oldfileId);
					Map<String, Object> r = new HashMap<String, Object>(10);
					r.put("file_old_id", oldfileId);
					r.put("file_id", file.getId());
					r.put("file_name", file.getFilename());
					r.put("file_suffix", t.length > 1 ? t[t.length - 1] : "");
					r.put("system_code", GlobalUtils.getSystemCode());
					r.put("bus_type", context.getParam("bus_type"));
					r.put("business_no", context.getParam("business_no"));
					r.put("$user_code", context.getLoginUser().getUserCode());

					this.update("SDP-FILE-006", r);
				} catch (IOException e) {
					log.error("{0}文件上传出错", e, f.getName());
				}
			}
		}
		
	}
}
