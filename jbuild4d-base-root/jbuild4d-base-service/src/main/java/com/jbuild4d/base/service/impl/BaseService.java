package com.jbuild4d.base.service.impl;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dao.GeneralMapper;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.IBaseService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;
import java.util.Map;

/**
 * @Author: zhuangrb
 * @Date: 2018/4/5
 * @Description:
 * @Version 1.0.0
 */
public class BaseService<T> implements IBaseService<T> {
    private BaseMapper<T> defaultBaseMapper = null;
    protected SqlSessionTemplate sqlSessionTemplate = null;
    protected GeneralMapper generalMapper = null;

    public BaseService(BaseMapper<T> _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, GeneralMapper _generalMapper){
        defaultBaseMapper= _defaultBaseMapper;
        sqlSessionTemplate=_sqlSessionTemplate;
        generalMapper=_generalMapper;
    }

    @Override
    public void setGeneralMapper(GeneralMapper _generalMapper) {
        generalMapper = _generalMapper;
    }

    @Override
    public void setSqlSessionTemplate(SqlSessionTemplate _sqlSessionTemplate) {
        sqlSessionTemplate=_sqlSessionTemplate;
    }

    @Override
    public void setDefaultBaseMapper(BaseMapper<T> _defaultBaseMapper){
        defaultBaseMapper=_defaultBaseMapper;
    }

    public BaseMapper getDefaultBaseMapper(){
        return defaultBaseMapper;
    }

    @Override
    public int deleteByKey(int id) {
        return defaultBaseMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int deleteAll() {
        return defaultBaseMapper.deleteAll();
    }

    @Override
    public int add(T record) {
        return defaultBaseMapper.insert(record);
    }

    @Override
    public int addSelective(T record) {
        return defaultBaseMapper.insertSelective(record);
    }

    @Override
    public T getByPrimaryKey(int id) {
        return defaultBaseMapper.selectByPrimaryKey(id);
    }

    @Override
    public T getByPrimaryKey(String id) {
        return defaultBaseMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<T> selectAll() {
        return defaultBaseMapper.selectAll();
    }

    @Override
    public int updateByKeySelective(T record) {
        return defaultBaseMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByKey(T record) {
        return defaultBaseMapper.updateByPrimaryKey(record);
    }

    @Override
    public int save(String id,T record){
        if(getByPrimaryKey(id)==null){
            return add(record);
        }
        else{
            return updateByKey(record);
        }
    }

    @Override
    public int saveBySelective(String id,T record){
        if(getByPrimaryKey(id)==null){
            return addSelective(record);
        }
        else{
            return updateByKeySelective(record);
        }
    }

    @Override
    public int saveBySelective(String id, T record, IAddBefore<T> addBefore) {
        if(getByPrimaryKey(id)==null){
            record=addBefore.run(record);
            return addSelective(record);
        }
        else{
            return updateByKeySelective(record);
        }
    }

    @Override
    public PageInfo<T> getPage(int pageNum, int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<T> lsit=defaultBaseMapper.selectAll();
        PageInfo<T> pageInfo = new PageInfo<T>(lsit);
        return pageInfo;
    }

    @Override
    public PageInfo<T> getPage(int pageNum, int pageSize, Map<String,Object> searchItemMap){
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<T> lsit=defaultBaseMapper.searchByMap(searchItemMap);
        PageInfo<T> pageInfo = new PageInfo<T>(lsit);
        return pageInfo;
    }

    @Override
    public List<T> getALL() {
        return defaultBaseMapper.selectAll();
    }

    @Override
    public int getNextId(){
        return defaultBaseMapper.nextId();
    }

    @Override
    public int getNextOrderNum(){
        return defaultBaseMapper.nextOrderNum();
    }

    @Override
    public  List<T> searchByMap(Map<String,Object> searchItemMap)
    {
        return defaultBaseMapper.searchByMap(searchItemMap);
    }
}
