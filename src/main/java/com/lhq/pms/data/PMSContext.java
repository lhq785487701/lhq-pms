package com.lhq.pms.data;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.FileItem;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.logging.Log;
import com.lhq.pms.utils.StringUtils;
import com.lhq.pms.utils.json.JsonParseUtils;

/**
 * 开发平台，前后端上下文对象
 * 
 * @author lhq 
 */
public class PMSContext {
	protected final static Log log = Log.get();

	private String boId = null;

	private String boMethod = null;

	protected DataStore dataStore = null;

	/** 数据源集合 **/
	protected Map<String, DataStore> dataStores = null;

	/** 删除语句集合 **/
	private List<String> deletes = null;

	private List<FileItem> files = null;

	/** 返回文件流 **/
	private InputStream inputStream = null;

	/** 插入语句集合 **/
	private List<String> inserts = null;

	/** 关键字段集合 **/
	private List<String> keyFields = null;

	/** 当前登录用户 **/
	private LoginUser loginUser = null;

	protected Page page = null;

	/** 参数列表 **/
	private Map<String, Object> params = new HashMap<String, Object>();

	/** 当前请求 **/
	private HttpServletRequest request = null;

	private HttpServletResponse response = null;

	/** 返回结果数据 **/
	protected Object result = null;

	/** 返回标记，true处理成功,false 处理失败 **/
	private boolean resultCode = true;
	/** 返回信息 **/
	private String resultMsg = "";
	/**
	 * 执行语句
	 */
	private String statement;

	/** 主子数据源分类集合 **/
	private Map<String, DataStore> stores = null;

	/** 更新语句集合 **/
	private List<String> updates = null;

	/**
	 * 添加文件
	 * 
	 * @param file
	 *            文件
	 */
	public void addFile(FileItem file) {
		if (this.files == null) {
			this.files = new ArrayList<FileItem>();
		}
		this.files.add(file);
	}

	/**
	 * 添加参数
	 * 
	 * @param key
	 * @param val
	 */
	public void addParam(String key, Object val) {
		this.params.put(key, val);
	}

	/**
	 * 资源释放
	 */
	protected void gc() {
		this.dataStore = null;
		this.dataStores = null;
		this.files = null;
		this.loginUser = null;
		this.page = null;
		this.params = null;
		this.request = null;
		this.response = null;
		this.result = null;
		this.resultMsg = null;
		this.stores = null;
		this.inserts = null;
		this.deletes = null;
		this.updates = null;
	}

	public String getBoId() {
		return boId;
	}

	public String getBoMethod() {
		return boMethod;
	}

	public Map<String, Object> getDataParams() {
		return this.params;
	}

	public DataStore getDataStore() {
		return dataStore;
	}

	public Map<String, DataStore> getDataStores() {
		return dataStores;
	}

	public List<String> getDeletes() {
		return deletes;
	}

	public List<FileItem> getFiles() {
		return this.files;
	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public List<String> getInserts() {
		return inserts;
	}

	public List<String> getKeyFields() {
		return keyFields;
	}

	public LoginUser getLoginUser() {
		return loginUser;
	}

	public Page getPage() {
		return page;
	}

	public Object getParam(String key) {

		return this.params.get(key);
	}

	public Set<Entry<String, Object>> getParamEntrys() {
		return this.params.entrySet();
	}

	/**
	 * 获取当前数据源参数 包含用户全局参数
	 * 
	 * @return
	 */
	public Map<String, Object> getParams() {
		Map<String, Object> m = new HashMap<String, Object>(40);
		if (this.params != null) {
			m.putAll(this.params);
		}
		if (this.loginUser != null) {
			m.putAll(this.loginUser.toJson());
		}
		return m;
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public Object getResult() {
		return this.result;
	}

	/**
	 * 返回json数据
	 * 
	 * @return
	 */
	public byte[] getResultJson() {
		if (this.inputStream != null) {
			return null;
		}
		Map<String, Object> m = new HashMap<String, Object>(10);
		m.put("code", this.resultCode ? 1 : 0);
		if (StringUtils.isNotEmpty(this.resultMsg)) {
			m.put("msg", this.resultMsg);
		}

		if (this.result == this.dataStores && this.dataStores != null) {
			m.put("dataStores", this.toDataStoresJSONMap());
		} else if (this.result == this.dataStore && this.dataStore != null) {
			m.put("dataStore", this.dataStore.toJSONMap());
		} else if (this.result != null) {
			m.put("data", this.result);
		}
		if (this.page != null) {
			m.put("page", this.page);
		}
		if (this.loginUser != null && this.loginUser.getSessionCode() != null) {
			m.put(LoginUser.SESSION_CODE, this.loginUser.getSessionCode());
		}

		String msg = "";

		try {
			byte[] data = JsonParseUtils.readJson(m);
			return data;
		} catch (JsonProcessingException e) {
			StringBuilder sb = new StringBuilder("{\"code\":0,");
			msg = e.getOriginalMessage();
			sb.append("\"msg\":\"").append(msg).append("\"}");
			try {
				return sb.toString().getBytes("utf-8");
			} catch (UnsupportedEncodingException ex) {
				log.error(ex);
			}
		}

		return null;
	}

	public String getResultMsg() {
		return resultMsg;
	}

	public DataStore getSingleDataStore() {
		if (this.stores == null || this.stores.size() <= 0) {
			return null;
		}
		Set<Map.Entry<String, DataStore>> entrys = this.stores.entrySet();
		Iterator<Entry<String, DataStore>> iter = entrys.iterator();
		if (iter.hasNext()) {
			return iter.next().getValue();
		}
		return null;
	}

	public String getStatement() {
		return statement;
	}

	public Map<String, DataStore> getStores() {
		return stores;
	}

	public List<String> getUpdates() {
		return updates;
	}

	public boolean isResultCode() {
		return resultCode;
	}

	/**
	 * 添加参数
	 * 
	 * @param key
	 * @param val
	 */
	public void put(String key, Object val) {
		this.params.put(key, val);
	}

	/**
	 * 设置参数,非覆盖策略
	 * 
	 * @param params
	 */
	public void putParams(Map<String, Object> params) {
		if (this.params == null) {
			this.setParams(params);
			return;
		}
		if (params == null) {
			return;
		}
		for (Entry<String, Object> entry : params.entrySet()) {
			this.params.put(entry.getKey(), entry.getValue());
		}
	}

	public void setBoId(String boId) {
		this.boId = boId;
	}

	public void setBoMethod(String boMethod) {
		this.boMethod = boMethod;
	}

	/**
	 * 设置数据源
	 * 
	 * @param dataStores
	 */
	public void setDataStores(Map<String, DataStore> dataStores) {
		this.dataStores = dataStores;

		if (this.dataStores != null && this.dataStores.size() > 0) {
			for (DataStore ds : this.dataStores.values()) {
				String p = ds.getParent();
				if (p != null && p.length() > 0) {
					DataStore pds = this.dataStores.get(p);
					if (pds != null) {
						if (p.equals(pds.getParent())) {
							throw new PMSException("exp-sdp-core-0120", ds.getName(), pds.getName());
						}
						ds.setParentDataStore(pds);
					}
				} else {
					if (this.stores == null) {
						this.stores = new HashMap<String, DataStore>(10);
					}
					this.stores.put(ds.getName(), ds);
				}
			}
		}
	}

	public void setDeletes(List<String> deletes) {
		this.deletes = deletes;
	}

	public void setFiles(List<FileItem> files) {
		this.files = files;
	}

	/**
	 * 设置返回的文件流
	 * 
	 * @param inputStream
	 */
	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

	public void setInserts(List<String> inserts) {
		this.inserts = inserts;
	}

	/**
	 * 设置关键字段
	 * 
	 * @param keyFields
	 */
	public void setKeyFields(List<String> keyFields) {
		this.keyFields = keyFields;
	}

	public void setLoginUser(LoginUser loginUser) {
		this.loginUser = loginUser;
	}

	public void setPage(Page page) {
		this.page = page;
	}

	public void setParams(Map<String, Object> params) {
		this.params = params;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}

	/**
	 * 返回结果
	 * 
	 * @param res
	 */
	public void setResult(Object res) {
		this.result = res;
	}

	public void setResultCode(boolean resultCode) {
		this.resultCode = resultCode;
	}

	/**
	 * 设置返回编码 true 正常,false 异常
	 * 
	 * @param resultCode
	 * @param msg
	 */
	public void setResultCode(boolean resultCode, String msg) {
		this.resultCode = resultCode;
		this.resultMsg = msg;
	}

	/**
	 * 设置返回信息
	 * 
	 * @param resultMsg
	 */
	public void setResultMsg(String resultMsg) {
		this.resultMsg = resultMsg;
	}

	public void setStatement(String statement) {
		this.statement = statement;
	}

	public void setStores(Map<String, DataStore> stores) {
		this.stores = stores;
	}

	public void setUpdates(List<String> updates) {
		this.updates = updates;
	}

	/**
	 * 转换为json
	 * 
	 * @return
	 */
	public Map<String, Object> toDataStoresJSONMap() {
		Map<String, Object> m = new HashMap<String, Object>(10);
		Set<Entry<String, DataStore>> t = this.dataStores.entrySet();
		for (Entry<String, DataStore> e : t) {
			m.put(e.getKey(), e.getValue().toJSONMap());
		}
		return m;
	}

}
