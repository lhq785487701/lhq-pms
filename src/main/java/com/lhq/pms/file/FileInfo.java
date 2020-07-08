package com.lhq.pms.file;

import java.io.InputStream;
import java.util.Date;

/**
 * 文件信息
 * 
 * @author lhq
 */
public class FileInfo {
	/** 文件编码 **/
	private String id;
	/** 文件名称 **/
	private String filename;
	/** 文件类型 **/
	private String contentType;
	/** 文件大小 **/
	private long length;
	/** 文件头大小 **/
	private long chunkSize;
	/** 文件上传时间 **/
	private Date uploadDate;
	/** 文件内容 **/
	private InputStream inputStream;

	/**
	 * @return the inputStream
	 */
	public InputStream getInputStream() {
		return inputStream;
	}

	/**
	 * @param inputStream
	 *            the inputStream to set
	 */
	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the filename
	 */
	public String getFilename() {
		return filename;
	}

	/**
	 * @param filename
	 *            the filename to set
	 */
	public void setFilename(String filename) {
		this.filename = filename;
	}

	/**
	 * @return the contentType
	 */
	public String getContentType() {
		return contentType;
	}

	/**
	 * @param contentType
	 *            the contentType to set
	 */
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	/**
	 * @return the length
	 */
	public long getLength() {
		return length;
	}

	/**
	 * @param length
	 *            the length to set
	 */
	public void setLength(long length) {
		this.length = length;
	}

	/**
	 * @return the chunkSize
	 */
	public long getChunkSize() {
		return chunkSize;
	}

	/**
	 * @param chunkSize
	 *            the chunkSize to set
	 */
	public void setChunkSize(long chunkSize) {
		this.chunkSize = chunkSize;
	}

	/**
	 * @return the uploadDate
	 */
	public Date getUploadDate() {
		return uploadDate;
	}

	/**
	 * @param uploadDate
	 *            the uploadDate to set
	 */
	public void setUploadDate(Date uploadDate) {
		this.uploadDate = uploadDate;
	}

	/**
	 * @return the md5
	 */
	public String getMd5() {
		return md5;
	}

	/**
	 * @param md5
	 *            the md5 to set
	 */
	public void setMd5(String md5) {
		this.md5 = md5;
	}

	private String md5;
}
