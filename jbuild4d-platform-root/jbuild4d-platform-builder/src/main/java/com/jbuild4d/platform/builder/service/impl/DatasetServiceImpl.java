package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.DatasetMapper;
import com.jbuild4d.base.dbaccess.dbentities.DatasetEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.list.IListWhereCondition;
import com.jbuild4d.base.tools.common.list.ListUtility;
import com.jbuild4d.platform.builder.datasetbuilder.SQLDataSetBuilder;
import com.jbuild4d.platform.builder.service.IBuilderConfigService;
import com.jbuild4d.platform.builder.service.IDatasetService;
import com.jbuild4d.platform.builder.vo.DataSetColumnVo;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import org.apache.ibatis.session.ResultContext;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.jdbc.core.JdbcOperations;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public class DatasetServiceImpl extends BaseServiceImpl<DatasetEntity> implements IDatasetService
{
    DatasetMapper datasetMapper;
    JdbcOperations jdbcOperations;
    IBuilderConfigService builderConfigService;

    public DatasetServiceImpl(DatasetMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService,JdbcOperations _jdbcOperations,IBuilderConfigService _builderConfigService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        datasetMapper=_defaultBaseMapper;
        jdbcOperations=_jdbcOperations;
        builderConfigService=_builderConfigService;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DatasetEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DatasetEntity>() {
            @Override
            public DatasetEntity run(JB4DSession jb4DSession,DatasetEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public DataSetVo resolveSQLToDataSet(JB4DSession jb4DSession,String sql) throws JBuild4DGenerallyException, SAXException, ParserConfigurationException, XPathExpressionException, IOException {
        if(builderConfigService.getResolveSQLEnable()) {
            SQLDataSetBuilder sqlDataSetBuilder = new SQLDataSetBuilder();
            sqlDataSetBuilder.setJdbcOperations(jdbcOperations);
            DataSetVo resultVo = sqlDataSetBuilder.resolveSQLToDataSet(jb4DSession, sql);
            //进行返回前的结果验证
            if (validateResolveResult(resultVo)) {
                return resultVo;
            } else {
                throw new JBuild4DGenerallyException("结果校验失败！");
            }
        }
        else
        {
            throw new JBuild4DGenerallyException("BuilderConfig.xml配置文件中已经禁用了DataSet相关的SQL解析的功能！");
        }
    }

    private boolean validateResolveResult(DataSetVo resultVo) throws JBuild4DGenerallyException {
        //列中不能存在多个同名列
        List<DataSetColumnVo> dataSetColumnVoList=resultVo.getColumnVoList();
        if(dataSetColumnVoList.size()==0){
            throw new JBuild4DGenerallyException("解析结果中不存在列！");
        }
        for (DataSetColumnVo columnVo : dataSetColumnVoList) {
            if(ListUtility.Where(dataSetColumnVoList, new IListWhereCondition<DataSetColumnVo>() {
                @Override
                public boolean Condition(DataSetColumnVo item) {
                    return item.getColumnName().equals(columnVo.getColumnName());
                }
            }).size()>1){
                throw new JBuild4DGenerallyException("解析的结果中存在多个同名列："+columnVo.getColumnName());
            }
        }
        return true;
    }
}

