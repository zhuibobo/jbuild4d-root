package com.jbuild4d.base.service.impl;

import com.jbuild4d.base.dbaccess.anno.DBAnnoUtility;
import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.service.*;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.base.tools.common.UUIDUtility;
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
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        return defaultBaseMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int deleteByKeyNotValidate(JB4DSession jb4DSession, String id, String warningOperationCode ) throws JBuild4DGenerallyException {
        if(JBuild4DProp.getWarningOperationCode().equals(warningOperationCode)) {
            return defaultBaseMapper.deleteByPrimaryKey(id);
        }
        throw new JBuild4DGenerallyException("删除失败WarningOperationCode错误");
    }

    @Override
    public int deleteAll(JB4DSession jb4DSession) {
        return defaultBaseMapper.deleteAll();
    }

    @Override
    public int add(JB4DSession jb4DSession,T entity) {
        return defaultBaseMapper.insert(entity);
    }

    @Override
    public int addSelective(JB4DSession jb4DSession,T entity) {
        return defaultBaseMapper.insertSelective(entity);
    }

    @Override
    public T getByPrimaryKey(JB4DSession jb4DSession,String id) throws JBuild4DGenerallyException {
        return defaultBaseMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByKeySelective(JB4DSession jb4DSession,T entity) {
        return defaultBaseMapper.updateByPrimaryKeySelective(entity);
    }

    @Override
    public int updateByKey(JB4DSession jb4DSession,T entity) {
        return defaultBaseMapper.updateByPrimaryKey(entity);
    }


    @Override
    public int save(JB4DSession jb4DSession,String id, T entity, IAddBefore<T> addBefore) throws JBuild4DGenerallyException {
        if(getByPrimaryKey(jb4DSession,id)==null){
            autoSetEntityId(entity);
            entity=addBefore.run(jb4DSession,entity);
            return addSelective(jb4DSession,entity);
        }
        else{
            return updateByKeySelective(jb4DSession,entity);
        }
    }

    private void autoSetEntityId(T entity) throws JBuild4DGenerallyException {
        try {
            String entId= DBAnnoUtility.getIdValue(entity);
            if(entId==null||entId.equals("")){
                DBAnnoUtility.setIdValue(entity, UUIDUtility.getUUID());
            }
        } catch (Exception e) {
            throw new JBuild4DGenerallyException(e.getMessage(),e.getCause());
        }
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, T entity, IAddBefore<T> addBefore, IUpdateBefore<T> updateBefore) throws JBuild4DGenerallyException {
        if(getByPrimaryKey(jb4DSession,id)==null){
            autoSetEntityId(entity);
            entity=addBefore.run(jb4DSession,entity);
            return addSelective(jb4DSession,entity);
        }
        else{
            entity=updateBefore.run(jb4DSession,entity);
            return updateByKeySelective(jb4DSession,entity);
        }
    }

    @Override
    public List<T> getALL(JB4DSession jb4DSession) {
        return defaultBaseMapper.selectAll();
    }

    @Override
    public List<T> getALLASC(JB4DSession jb4DSession) {
        return defaultBaseMapper.selectAllASC();
    }

    @Override
    public PageInfo<T> getPage(JB4DSession jb4DSession,int pageNum, int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<T> list=defaultBaseMapper.selectAll();
        PageInfo<T> pageInfo = new PageInfo<T>(list);
        if(pageInfo.getSize()==0&&pageInfo.getPageNum()>1){
            //如果查询的结果为0,退回查询前一页的数据;
            return getPage(jb4DSession,pageNum-1,pageSize);
        }
        return pageInfo;
    }

    @Override
    public PageInfo<T> getPage(JB4DSession jb4DSession,int pageNum, int pageSize, Map<String,Object> searchItemMap){
        PageHelper.startPage(pageNum, pageSize);
        List<T> list=defaultBaseMapper.selectBySearch(searchItemMap);
        PageInfo<T> pageInfo = new PageInfo<T>(list);
        if(pageInfo.getSize()==0&&pageInfo.getPageNum()>1) {
            //如果查询的结果为0,退回查询前一页的数据;
            return getPage(jb4DSession, pageNum - 1, pageSize, searchItemMap);
        }
        return pageInfo;
    }

    @Override
    public int getNextOrderNum(JB4DSession jb4DSession){
        return defaultBaseMapper.nextOrderNum();
    }

    @Override
    public void statusChange(JB4DSession jb4DSession,String ids, String status) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("请在"+this.getClass().getSimpleName()+"中实现statusChange方法!");
    }

    @Override
    public void moveUp(JB4DSession jb4DSession,String id) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("请在"+this.getClass().getSimpleName()+"中重写moveUp方法！");
    }

    @Override
    public void moveDown(JB4DSession jb4DSession,String id) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("请在"+this.getClass().getSimpleName()+"中重写moveDown方法！");
    }
}
