package com.jbuild4d.platform.builder.dataset;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import com.jbuild4d.platform.builder.vo.SQLResolveToDataSetVo;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetService extends IBaseService<DatasetEntity> {
    DataSetVo getVoByPrimaryKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException, IOException;

    int saveDataSetVo(JB4DSession jb4DSession, String id, DataSetVo record) throws JBuild4DGenerallyException, IOException;

    DataSetVo resolveSQLToDataSet(JB4DSession jb4DSession, String sql) throws JBuild4DGenerallyException, SAXException, ParserConfigurationException, XPathExpressionException, IOException;

    String sqlReplaceEnvTextToEnvValue(JB4DSession jb4DSession, String sqlText) throws JBuild4DGenerallyException, XPathExpressionException, IOException, SAXException, ParserConfigurationException;

    String sqlReplaceEnvValueToRunningValue(JB4DSession jb4DSession, String sqlValue) throws JBuild4DGenerallyException;

    String sqlReplaceRunningValueToEmptyFilter(JB4DSession jb4DSession, String sqlRunValue);

    SQLResolveToDataSetVo sqlResolveToDataSetVo(JB4DSession jb4DSession, String sqlWithEnvText) throws XPathExpressionException, JBuild4DGenerallyException, IOException, SAXException, ParserConfigurationException;

    PageInfo<DatasetEntity> getPageByGroupId(JB4DSession jb4DSession, Integer pageNum, Integer pageSize, String groupId);

    DataSetVo getApiDataSetVoStructure(JB4DSession session, String recordId, String op, String groupId, String fullClassName) throws IllegalAccessException, InstantiationException;
}
