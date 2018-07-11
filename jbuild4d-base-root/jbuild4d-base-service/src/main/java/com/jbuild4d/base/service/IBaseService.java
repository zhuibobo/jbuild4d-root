package com.jbuild4d.base.service;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
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

    void setGeneralService(GeneralServiceImpl _generalServiceImpl);

    void setSqlSessionTemplate(SqlSessionTemplate _sqlSessionTemplate);

    void setDefaultBaseMapper(BaseMapper<T> _defaultBaseMapper);

    int deleteByKey(String id);

    int deleteAll();

    int add(T record);

    int addSelective(T record);

    T getByPrimaryKey(int id);

    T getByPrimaryKey(String id);

    List<T> selectAll();

    List<T> searchByMap(Map<String,Object> searchItemMap);

    int updateByKeySelective(T record);

    int updateByKey(T record);

    int save(String id, T record);

    int saveBySelective(String id, T record) throws JBuild4DGenerallyException;

    int saveBySelective(String id, T record,IAddBefore<T> addBefore) throws JBuild4DGenerallyException;

    PageInfo<T> getPage(int pageNum, int pageSize);

    PageInfo<T> getPage(int pageNum, int pageSize, Map<String,Object> searchItemMap);

    List<T> getALL();

    int getNextId();

    int getNextOrderNum();

    void statusChange(String ids, String status) throws JBuild4DGenerallyException;
}
