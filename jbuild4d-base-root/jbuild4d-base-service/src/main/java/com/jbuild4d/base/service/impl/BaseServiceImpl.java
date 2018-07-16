package com.jbuild4d.base.service.impl;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.IBaseService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.service.IGeneralService;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;
import java.util.Map;

/**
 * @Author: zhuangrb
 * @Date: 2018/4/5
 * @Description:
 * @Version 1.0.0
 */
public abstract class BaseServiceImpl<T> implements IBaseService<T> {
    private BaseMapper<T> defaultBaseMapper = null;
    protected SqlSessionTemplate sqlSessionTemplate = null;
    protected ISQLBuilderService sqlBuilderService = null;
    protected IGeneralService generalService;

    public BaseServiceImpl(BaseMapper<T> _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        defaultBaseMapper= _defaultBaseMapper;
        sqlSessionTemplate=_sqlSessionTemplate;
        sqlBuilderService=_sqlBuilderService;
    }

    @Override
    public void setGeneralService(IGeneralService _generalServiceImpl) {
        generalService = _generalServiceImpl;
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
    public int deleteByKey(JB4DSession jb4DSession, String id) {
        return defaultBaseMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int deleteAll(JB4DSession jb4DSession) {
        return defaultBaseMapper.deleteAll();
    }

    @Override
    public int add(JB4DSession jb4DSession,T record) {
        return defaultBaseMapper.insert(record);
    }

    @Override
    public int addSelective(JB4DSession jb4DSession,T record) {
        return defaultBaseMapper.insertSelective(record);
    }

    @Override
    public T getByPrimaryKey(JB4DSession jb4DSession,String id) {
        return defaultBaseMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<T> selectAll(JB4DSession jb4DSession) {
        return defaultBaseMapper.selectAll();
    }

    @Override
    public int updateByKeySelective(JB4DSession jb4DSession,T record) {
        return defaultBaseMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByKey(JB4DSession jb4DSession,T record) {
        return defaultBaseMapper.updateByPrimaryKey(record);
    }

    @Override
    public int save(JB4DSession jb4DSession,String id,T record){
        if(getByPrimaryKey(jb4DSession,id)==null){
            return add(jb4DSession,record);
        }
        else{
            return updateByKey(jb4DSession,record);
        }
    }

    /*@Override
    public int saveBySelective(JB4DSession jb4DSession,String id,T record) throws JBuild4DGenerallyException {
        if(getByPrimaryKey(jb4DSession,id)==null){
            return addSelective(jb4DSession,record);
        }
        else{
            return updateByKeySelective(jb4DSession,record);
        }
    }*/

    @Override
    public int saveBySelective(JB4DSession jb4DSession,String id, T record, IAddBefore<T> addBefore) throws JBuild4DGenerallyException {
        if(getByPrimaryKey(jb4DSession,id)==null){
            record=addBefore.run(jb4DSession,record);
            return addSelective(jb4DSession,record);
        }
        else{
            return updateByKeySelective(jb4DSession,record);
        }
    }

    @Override
    public PageInfo<T> getPage(JB4DSession jb4DSession,int pageNum, int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<T> lsit=defaultBaseMapper.selectAll();
        PageInfo<T> pageInfo = new PageInfo<T>(lsit);
        return pageInfo;
    }

    @Override
    public PageInfo<T> getPage(JB4DSession jb4DSession,int pageNum, int pageSize, Map<String,Object> searchItemMap){
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<T> lsit=defaultBaseMapper.searchByMap(searchItemMap);
        PageInfo<T> pageInfo = new PageInfo<T>(lsit);
        return pageInfo;
    }

    @Override
    public List<T> getALL(JB4DSession jb4DSession) {
        return defaultBaseMapper.selectAll();
    }

    @Override
    public int getNextOrderNum(JB4DSession jb4DSession){
        return defaultBaseMapper.nextOrderNum();
    }

    @Override
    public void statusChange(JB4DSession jb4DSession,String ids, String status) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("BaseServiceImpl<T>未实现statusChange方法，请在具体的Service中实现");
    }

    @Override
    public  List<T> searchByMap(JB4DSession jb4DSession,Map<String,Object> searchItemMap)
    {
        return defaultBaseMapper.searchByMap(searchItemMap);
    }

    @Override
    public void moveUp(JB4DSession jb4DSession,String id) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("请重写moveUp方法！");
    }

    @Override
    public void moveDown(JB4DSession jb4DSession,String id) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("请重写moveDown方法！");
    }
}
