package com.lhq.pms.plugin.mongodb;

import java.io.InputStream;

import org.bson.types.ObjectId;

import com.lhq.pms.exception.PMSException;
import com.lhq.pms.file.FileInfo;
import com.lhq.pms.file.bo.FileBo;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.WriteResult;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;

/**
 * mongo文件处理
 * 
 * @author lhq
 */
public class DefaultFileMongoDbSession extends DefaultMongoDbSession implements FileBo {

	/** 存储文件库 **/
	private String dbName = "files";
	/** 文件存储前缀 **/
	private String bucket = "fs";

	/**
	 * @return the dbName
	 */
	public String getDbName() {
		return dbName;
	}

	/**
	 * @param dbName
	 *            the dbName to set
	 */
	public void setDbName(String dbName) {
		this.dbName = dbName;
	}

	/**
	 * @return the bucket
	 */
	public String getBucket() {
		return bucket;
	}

	/**
	 * @param bucket
	 *            the bucket to set
	 */
	public void setBucket(String bucket) {
		this.bucket = bucket;
	}

	/**
	 * 保存文件
	 */
	@SuppressWarnings("deprecation")
	@Override
	public FileInfo saveFile(String name, InputStream ins) {
		DB db = this.mongoClient.getDB(dbName);
		GridFS gridFs = new GridFS(db, bucket);
		GridFSFile f = gridFs.createFile(ins, name);
		f.save();
		FileInfo info = new FileInfo();
		info.setId(f.getId().toString());
		info.setChunkSize(f.getChunkSize());
		info.setFilename(f.getFilename());
		info.setContentType(f.getContentType());
		info.setLength(f.getLength());
		info.setMd5(f.getMD5());
		info.setUploadDate(f.getUploadDate());
		info.setInputStream(ins);
		return info;
	}

	/**
	 * 查找文件
	 */
	@SuppressWarnings("deprecation")
	@Override
	public FileInfo findFile(String name) {
		DB db = this.mongoClient.getDB(dbName);
		GridFS gridFs = new GridFS(db, bucket);
		GridFSDBFile f = gridFs.findOne(new ObjectId(name));
		if (f == null) {
			throw new PMSException("exp-sdp-file-0002", name);
		}
		FileInfo info = new FileInfo();
		info.setId(f.getId().toString());
		info.setChunkSize(f.getChunkSize());
		info.setFilename(f.getFilename());
		info.setContentType(f.getContentType());
		info.setLength(f.getLength());
		info.setMd5(f.getMD5());
		info.setUploadDate(f.getUploadDate());
		info.setInputStream(f.getInputStream());
		return info;
	}

	/**
	 * 删除文件
	 */
	@SuppressWarnings("deprecation")
	@Override
	public void deleteFile(String name) {
		DB db = this.mongoClient.getDB(dbName);
		//无作用
		GridFS gridFs = new GridFS(db, bucket);
		gridFs.remove(name);
		//可删fs.files中的内容，无法删除fs.chunks中的内容
		DBCollection dbCollection = db.getCollection(bucket + '.' + dbName);  
		BasicDBObject delete = new BasicDBObject("_id", new ObjectId(name)); 
		WriteResult result = dbCollection.remove(delete);
        System.out.println(result.toString());  
		
	}
	
	
	/**
	 * 更新文件
	 */
	@SuppressWarnings("deprecation")
	@Override
	public FileInfo updateFile(String name, InputStream ins, String oldfileId) {
		DB db = this.mongoClient.getDB(dbName);
		
		//先删除原来的文件
		deleteFile(oldfileId);
		//再新建现在的文件
		GridFS gridFs = new GridFS(db, bucket);
		GridFSFile f = gridFs.createFile(ins, name);
		f.save();
		FileInfo info = new FileInfo();
		info.setId(f.getId().toString());
		info.setChunkSize(f.getChunkSize());
		info.setFilename(f.getFilename());
		info.setContentType(f.getContentType());
		info.setLength(f.getLength());
		info.setMd5(f.getMD5());
		info.setUploadDate(f.getUploadDate());
		info.setInputStream(ins);
		return info;
	}
}
