package com.lhq.pms.logging.bo.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.data.LoginUser;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.data.Page;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.logging.bo.LogBo;
import com.lhq.pms.plugin.elasticsearch.ElasticsearchService;
import com.lhq.pms.utils.StringUtils;

/**
 * 搜索引擎日志处理实现
 * 
 * @author lhq 
 */
public class EsLogBoImpl extends CommonBoImpl implements LogBo {

	@Resource(name = "elasticsearchService")
	private ElasticsearchService elasticsearchService;

	private String indexType;

	public String getIndexType() {
		return indexType;
	}

	public void setIndexType(String indexType) {
		this.indexType = indexType;
	}

	private String index;

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	/**
	 * 写日志
	 */
	@Override
	public void doLog(Map<String, Object> data) {
		if (StringUtils.isNotEmpty(index) && StringUtils.isNotEmpty(indexType)) {
			try {
				elasticsearchService.write(index, indexType, data);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 查询日志
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void queryLog(PMSContext context) {
		if (StringUtils.isNotEmpty(index) && StringUtils.isNotEmpty(indexType)) {
			Map<String, Object> data = (Map<String, Object>) context.getParams();
			Map<String, Object> params = (Map<String, Object>) data.get("where");
			Page p = context.getPage();

			Map<String, String> order = (Map<String, String>) data.get("order");
			if (params == null) {
				throw new PMSException("exp-sdp-elastic-005");
			}
			if (order == null) {
				throw new PMSException("exp-sdp-elastic-006");
			}
			LoginUser user = context.getLoginUser();
			if (!user.isSystemAdmin()) {
				Map<String, Object> must = (Map<String, Object>) params.get("must");
				if (must == null) {
					must = new HashMap<String, Object>(10);
					params.put("must", must);
				}
				must.put("userId", user.getUserCode());
			}

			List<Map<String, Object>> res = elasticsearchService.query(index, indexType, p, params, order);
			context.setResult(res);
		}
	}
}
