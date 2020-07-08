/**
* CompressionServletResponseWrapper
* 版权声明广州赛意信息科技股份有限公司
* 版权所有违者必究
* 
*Copyright：Copyright(c)2017
*Company：广州赛意信息科技股份有限公司
*@author lhq 
*@date 2018年1月04日
*@version 0.0.1
*/
package com.lhq.pms.filter.gzip;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import com.lhq.pms.logging.Log;

/**
 * servlet解压缩
 * 
 * @author lhq 
 */
public class GzipResponseWrapper extends HttpServletResponseWrapper {

	protected final static Log log = Log.get();
	private HttpServletRequest request;

	// ----------------------------------------------------- Constructor

	/**
	 * Calls the parent constructor which creates a ServletResponse adaptor
	 * wrapping the given response object.
	 */

	public GzipResponseWrapper(HttpServletResponse response, HttpServletRequest request) {
		super(response);
		origResponse = response;
		this.request = request;
	}

	// ----------------------------------------------------- Instance Variables

	/**
	 * Original response
	 */

	protected HttpServletResponse origResponse = null;

	/**
	 * The ServletOutputStream that has been returned by
	 * <code>getOutputStream()</code>, if any.
	 */

	protected GzipResponseStream stream = null;

	/**
	 * The PrintWriter that has been returned by <code>getWriter()</code>, if
	 * any.
	 */

	protected PrintWriter writer = null;

	/**
	 * Create and return a ServletOutputStream to write the content associated
	 * with this Response.
	 * 
	 * @exception IOException
	 *                if an input/output error occurs
	 */
	public GzipResponseStream createOutputStream() throws IOException {
		GzipResponseStream stream = new GzipResponseStream(origResponse, request);

		return stream;
	}

	/**
	 * Finish a response.
	 */
	public void finishResponse() {
		try {
			if (writer != null) {
				writer.close();
			} else {
				if (stream != null) {
					stream.close();
				}
			}
		} catch (IOException e) {
			log.error(e);
		}
	}

	// ------------------------------------------------ ServletResponse Methods

	/**
	 * Flush the buffer and commit this response.
	 * 
	 * @exception IOException
	 *                if an input/output error occurs
	 */
	@Override
	public void flushBuffer() throws IOException {
		stream.flush();
	}

	/**
	 * Return the servlet output stream associated with this Response.
	 * 
	 * @exception IllegalStateException
	 *                if <code>getWriter</code> has already been called for this
	 *                response
	 * @exception IOException
	 *                if an input/output error occurs
	 */
	@Override
	public ServletOutputStream getOutputStream() throws IOException {
		if (writer != null) {
			throw new IllegalStateException("getWriter() has already been called for this response");
		}

		if (stream == null) {
			stream = createOutputStream();
		}

		return stream;
	}

	/**
	 * Return the writer associated with this Response.
	 * 
	 * @exception IllegalStateException
	 *                if <code>getOutputStream</code> has already been called
	 *                for this response
	 * @exception IOException
	 *                if an input/output error occurs
	 */
	@Override
	public PrintWriter getWriter() throws IOException {
		if (writer != null) {
			return (writer);
		}

		if (stream != null) {
			throw new IllegalStateException("getOutputStream() has already been called for this response");
		}

		stream = createOutputStream();

		// String charset = getCharsetFromContentType(contentType);
		String charEnc = origResponse.getCharacterEncoding();
		log.debug("character encoding is " + charEnc);

		// HttpServletResponse.getCharacterEncoding() shouldn't return null
		// according the spec, so feel free to remove that "if"
		if (charEnc != null) {
			writer = new PrintWriter(new OutputStreamWriter(stream, charEnc));
		} else {
			writer = new PrintWriter(stream);
		}

		return (writer);
	}

	@Override
	public void setContentLength(int length) {
	}
}
