package com.lhq.pms.filter.gzip;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lhq.pms.logging.Log;

/**
 * 压缩过滤器
 * 
 * @author lhq 
 */
public class GzipFilter implements Filter {

	protected final static Log log = Log.get();

	/**
	 * The filter configuration object we are associated with. If this value is
	 * null, this filter instance is not currently configured.
	 */
	private FilterConfig config = null;

	private static String excludeFile = null;
	private static final String FALSE = "false";
	private static final String EXCLUDE_FILE = "excludeFile";

	/**
	 * Place this filter into service.
	 * 
	 * @param filterConfig
	 *            The filter configuration object
	 */
	@Override
	public void init(FilterConfig filterConfig) {
		config = filterConfig;
		if (filterConfig != null) {
			String str = filterConfig.getInitParameter(EXCLUDE_FILE);

			if (str != null) {
				excludeFile = str;
			}
		}
	}

	/**
	 * Take this filter out of service.
	 */
	@Override
	public void destroy() {
		this.config = null;
	}

	/**
	 * The <code>doFilter</code> method of the Filter is called by the container
	 * each time a request/response pair is passed through the chain due to a
	 * client request for a resource at the end of the chain. The FilterChain
	 * passed into this method allows the Filter to pass on the request and
	 * response to the next entity in the chain.
	 * <p>
	 * This method first examines the request to check whether the client
	 * support compression. <br>
	 * It simply just pass the request and response if there is no support for
	 * compression.<br>
	 * If the compression support is available, it creates a
	 * CompressionServletResponseWrapper object which compresses the content and
	 * modifies the header if the content length is big enough. It then invokes
	 * the next entity in the chain using the FilterChain object
	 * (<code>chain.doFilter()</code>), <br>
	 */
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		String path = ((HttpServletRequest) request).getServletPath();
		if (excludeFile != null && excludeFile.indexOf(path) >= 0) {
			chain.doFilter(request, response);
			return;
		}

		boolean supportCompression = false;
		if (request instanceof HttpServletRequest) {

			String s = (String) ((HttpServletRequest) request).getParameter("gzip");
			if (FALSE.equalsIgnoreCase(s)) {
				chain.doFilter(request, response);
				return;
			}

			Enumeration<?> e = ((HttpServletRequest) request).getHeaders("Accept-Encoding");
			while (e.hasMoreElements()) {
				String name = (String) e.nextElement();
				if (name.indexOf("gzip") != -1) {
					log.debug("supports compression");
					supportCompression = true;
					break;
				}
			}
		}

		if (!supportCompression) {
			chain.doFilter(request, response);
			return;
		} else {
			if (response instanceof HttpServletResponse) {
				GzipResponseWrapper wrappedResponse = new GzipResponseWrapper((HttpServletResponse) response, (HttpServletRequest) request);
				try {
					chain.doFilter(request, wrappedResponse);
				} finally {
					wrappedResponse.finishResponse();
				}
				return;
			}
		}
	}

	/**
	 * Set filter config This function is equivalent to init. Required by
	 * Weblogic 6.1
	 * 
	 * @param filterConfig
	 *            The filter configuration object
	 */
	public void setFilterConfig(FilterConfig filterConfig) {
		init(filterConfig);
	}

	/**
	 * Return filter config Required by Weblogic 6.1
	 */
	public FilterConfig getFilterConfig() {
		return config;
	}
}
