package com.jbuild4d.base.service;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.GeneralServiceImpl;
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

    int deleteByKey(JB4DSession jb4DSession, String id);

    int deleteAll(JB4DSession jb4DSession);

    int add(JB4DSession jb4DSession,T record);

    int addSelective(JB4DSession jb4DSession,T record);

    T getByPrimaryKey(JB4DSession jb4DSession,String id);

    List<T> selectAll(JB4DSession jb4DSession);

    List<T> searchByMap(JB4DSession jb4DSession,Map<String,Object> searchItemMap);

    int updateByKeySelective(JB4DSession jb4DSession,T record);

    int updateByKey(JB4DSession jb4DSession,T record);

    int save(JB4DSession jb4DSession,String id, T record);

    int saveBySelective(JB4DSession jb4DSession,String id, T record) throws JBuild4DGenerallyException;

    int saveBySelective(JB4DSession jb4DSession,String id, T record,IAddBefore<T> addBefore) throws JBuild4DGenerallyException;

    PageInfo<T> getPage(JB4DSession jb4DSession,int pageNum, int pageSize);

    PageInfo<T> getPage(JB4DSession jb4DSession,int pageNum, int pageSize, Map<String,Object> searchItemMap);

    List<T> getALL(JB4DSession jb4DSession);

    int getNextOrderNum(JB4DSession jb4DSession);

    void statusChange(JB4DSession jb4DSession,String ids, String status) throws JBuild4DGenerallyException;

    void moveUp(String id) throws JBuild4DGenerallyException;

    void moveDown(String id) throws JBuild4DGenerallyException;
}
