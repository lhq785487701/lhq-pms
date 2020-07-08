package com.lhq.pms.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lhq.pms.exception.PMSException;
import com.lhq.pms.logging.Log;
import com.lhq.pms.logging.LogParams;
import com.lhq.pms.utils.ExceptionUtils;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
public class PMSBaseFilter extends AbstractPMSFilter {
	protected final static Log log = Log.get();

	/**
	 * 过滤器
	 */
	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		@SuppressWarnings("unused")
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		try {
			chain.doFilter(req, res);
		} catch (Exception e) {
			log.error(e);
			Throwable ex = e.getCause();
			String msg = null;
			while (ex != null) {
				if (ex instanceof PMSException) {
					msg = ((PMSException) ex).getMessage();
					log.error(msg);
					break;
				}
				Throwable tex = ex.getCause();
				if (tex == null) {
					msg = ex.getMessage();
					break;
				} else {
					ex = tex;
				}
			}
			StringBuilder sb = new StringBuilder();
			sb.append("{\"code\":1000,\"msg\":\"");
			sb.append(msg == null ? ExceptionUtils.getException("exp-sdp-base-filter-001", e) : msg);
			sb.append("\"}");
			response.getOutputStream().write(sb.toString().getBytes("utf-8"));
		} finally {
			LogParams.clear();
		}
	}
}
