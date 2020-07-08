/**
* CompressionResponseStream
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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lhq.pms.logging.Log;

/**
 * 压缩流
 * 
 * @author lhq 
 */
public class GzipResponseStream extends ServletOutputStream {
	protected final static Log log = Log.get();

	protected ByteArrayOutputStream baos = null;
	private HttpServletRequest request;

	// ----------------------------------------------------------- Constructors

	/**
	 * Construct a servlet output stream associated with the specified Response.
	 * 
	 * @param response
	 *            The associated response
	 */
	public GzipResponseStream(HttpServletResponse response, HttpServletRequest request) throws IOException {
		super();
		closed = false;
		this.response = response;
		this.output = response.getOutputStream();
		baos = new ByteArrayOutputStream();
		gzipstream = new GZIPOutputStream(baos);
		this.request = request;
	}

	// ----------------------------------------------------- Instance Variables

	/**
	 * The underlying gzip output stream to which we should write data.
	 */
	protected GZIPOutputStream gzipstream = null;

	/**
	 * Has this stream been closed?
	 */
	protected boolean closed = false;

	/**
	 * The response with which this servlet output stream is associated.
	 */
	protected HttpServletResponse response = null;

	/**
	 * The underlying servket output stream to which we should write data.
	 */
	protected ServletOutputStream output = null;

	/**
	 * Close this output stream, causing any buffered data to be flushed and any
	 * further output data to throw an IOException.
	 */
	@Override
	public void close() throws IOException {
		if (closed) {
			throw new IOException("This output stream has already been closed");
		}
		gzipstream.finish();
		byte[] bytes = baos.toByteArray();
		response.addHeader("Content-Length", Integer.toString(bytes.length));
		response.addHeader("Content-Encoding", "gzip");
		output.write(bytes);
		output.flush();
		output.close();
		int len = bytes.length / 1024;
		baos.close();
		closed = true;
		String url = ((HttpServletRequest) request).getServletPath();
		log.debug(url + "压缩后大小:" + len + "KB");
	}

	/**
	 * Flush any buffered data for this output stream, which also causes the
	 * response to be committed.
	 */
	@Override
	public void flush() throws IOException {
		if (closed) {
			throw new IOException("Cannot flush a closed output stream");
		}

		gzipstream.flush();
	}

	/**
	 * Write the specified byte to our output stream.
	 * 
	 * @param b
	 *            The byte to be written
	 * 
	 * @exception IOException
	 *                if an input/output error occurs
	 */
	@Override
	public void write(int b) throws IOException {
		if (closed) {
			throw new IOException("Cannot write to a closed output stream");
		}

		gzipstream.write((byte) b);
	}

	/**
	 * Write <code>b.length</code> bytes from the specified byte array to our
	 * output stream.
	 * 
	 * @param b
	 *            The byte array to be written
	 * 
	 * @exception IOException
	 *                if an input/output error occurs
	 */
	@Override
	public void write(byte b[]) throws IOException {
		write(b, 0, b.length);
	}

	/**
	 * Write <code>len</code> bytes from the specified byte array, starting at
	 * the specified offset, to our output stream.
	 * 
	 * @param b
	 *            The byte array containing the bytes to be written
	 * @param off
	 *            Zero-relative starting offset of the bytes to be written
	 * @param len
	 *            The number of bytes to be written
	 * 
	 * @exception IOException
	 *                if an input/output error occurs
	 */
	@Override
	public void write(byte b[], int off, int len) throws IOException {
		if (closed) {
			throw new IOException("Cannot write to a closed output stream");
		}

		gzipstream.write(b, off, len);
	}

	// -------------------------------------------------------- Package Methods

	/**
	 * Has this response stream been closed?
	 */
	public boolean closed() {
		return (this.closed);
	}

	/**
	 * 
	 */
	@Override
	public boolean isReady() {
		return false;
	}

	/**
	 * 
	 */
	@Override
	public void setWriteListener(WriteListener arg0) {
		// TODO Auto-generated method stub
	}
}
