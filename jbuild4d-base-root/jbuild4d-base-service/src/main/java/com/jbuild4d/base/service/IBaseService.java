package com.jbuild4d.base.service;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;
import java.util.Map;

/**
 * @Author: zhuangrb
 * @Date: 2018/4/5
 * @Description:
 * @Version 1.0.0
 */
public interface IBaseService<T> {

    void setGeneralService(IGeneralService _generalServiceImpl);

    void setSqlSessionTemplate(SqlSessionTemplate _sqlSessionTemplate);

    void setDefaultBaseMapper(BaseMapper<T> _defaultBaseMapper);

    int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException;

    int deleteByKeyNotValidate(JB4DSession jb4DSession, String id, String warningOperationCode) throws JBuild4DGenerallyException;

    int deleteAll(JB4DSession jb4DSession);

    int add(JB4DSession jb4DSession,T entity);

    int addSelective(JB4DSession jb4DSession,T entity);

    T getByPrimaryKey(JB4DSession jb4DSession,String id) throws JBuild4DGenerallyException;

    int updateByKeySelective(JB4DSession jb4DSession,T entity);

    int updateByKey(JB4DSession jb4DSession,T entity);

    int saveSimple(JB4DSession jb4DSession, String id, T entity) throws JBuild4DGenerallyException;

    int save(JB4DSession jb4DSession,String id, T entity,IAddBefore<T> addBefore) throws JBuild4DGenerallyException;

    int save(JB4DSession jb4DSession,String id, T entity,IAddBefore<T> addBefore,IUpdateBefore<T> updateBefore) throws JBuild4DGenerallyException;

    PageInfo<T> getPage(JB4DSession jb4DSession,int pageNum, int pageSize);

    PageInfo<T> getPage(JB4DSession jb4DSession,int pageNum, int pageSize, Map<String,Object> searchItemMap);

    List<T> getALL(JB4DSession jb4DSession);

    List<T> getALLASC(JB4DSession jb4DSession);

    int getNextOrderNum(JB4DSession jb4DSession);

    void statusChange(JB4DSession jb4DSession,String ids, String status) throws JBuild4DGenerallyException;

    void moveUp(JB4DSession jb4DSession,String id) throws JBuild4DGenerallyException;

    void moveDown(JB4DSession jb4DSession,String id) throws JBuild4DGenerallyException;
}
