package com.jbuild4d.platform.system.service.impl.codegenerate;

import com.jbuild4d.core.base.tools.XMLDocumentUtility;
import com.jbuild4d.platform.system.exenum.CodeGenerateTypeEnum;
import com.jbuild4d.platform.system.vo.CodeGenerateVo;
import org.mybatis.generatorex.api.IntrospectedColumn;
import org.mybatis.generatorex.api.IntrospectedTable;
import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
public class CGMapperEX {

    public static String generate(String idFieldName,IntrospectedTable introspectedTable, String tableName,String orderFieldName,String statusFieldName,
                                  Map<CodeGenerateTypeEnum,CodeGenerateVo> codeGenerateVoMap,String xmlMapperACStr) throws ParserConfigurationException, SAXException, IOException, XPathExpressionException {
        StringBuilder builder=new StringBuilder();

        //String idFieldName=introspectedTableList.get(0).getPrimaryKeyColumns().get(0).getActualColumnName();

        Document document= XMLDocumentUtility.parseForDoc(xmlMapperACStr,"utf-8");
        Node mapperNode= XMLDocumentUtility.parseForNode(document.getDocumentElement(),"//mapper");
        List<Node> mapperChildNodeList= XMLDocumentUtility.parseForNodeList(document,"//mapper/*");
        for(int i=0;i<mapperChildNodeList.size();i++){
            Node node=mapperChildNodeList.get(i);
            mapperNode.removeChild(node);
        }
        for(int i=0;i<mapperNode.getChildNodes().getLength();i++){
            Node node=mapperNode.getChildNodes().item(i);
            mapperNode.removeChild(node);
        }
        mapperNode.setTextContent("");

        Element includeElem=document.createElement("include");
        includeElem.setAttribute("refid","Base_Column_List");

        //-----select all
        Element selectAllElem=document.createElement("select");
        selectAllElem.setAttribute("id","selectAll");
        selectAllElem.setAttribute("resultMap","BaseResultMap");
        selectAllElem.appendChild(document.createTextNode("select"));
        selectAllElem.appendChild(includeElem.cloneNode(true));
        selectAllElem.appendChild(document.createTextNode( " from "+tableName+" ORDER by "+orderFieldName+" DESC"));
        mapperNode.appendChild(selectAllElem);

        //-----select all
        Element selectAllASCElem=document.createElement("select");
        selectAllASCElem.setAttribute("id","selectAllASC");
        selectAllASCElem.setAttribute("resultMap","BaseResultMap");
        selectAllASCElem.appendChild(document.createTextNode("select"));
        selectAllASCElem.appendChild(includeElem.cloneNode(true));
        selectAllASCElem.appendChild(document.createTextNode( " from "+tableName+" ORDER by "+orderFieldName+" ASC"));
        mapperNode.appendChild(selectAllASCElem);

        //-----delete all
        Element deleteAllElem=document.createElement("delete");
        deleteAllElem.setAttribute("id","deleteAll");
        deleteAllElem.setTextContent("delete from "+tableName);
        mapperNode.appendChild(deleteAllElem);

        //-----nextOrderNum
        Element nextOrderNumElem=document.createElement("select");
        nextOrderNumElem.setAttribute("id","nextOrderNum");
        nextOrderNumElem.setAttribute("resultType","integer");
        nextOrderNumElem.setTextContent("select case when max("+orderFieldName+") is null then 1 else max("+orderFieldName+")+1 end ORDERNUM from "+tableName);
        mapperNode.appendChild(nextOrderNumElem);

        //-----selectBySearch
        Element selectBySearchElem=document.createElement("select");
        selectBySearchElem.setAttribute("id","selectBySearch");
        selectBySearchElem.setAttribute("parameterType","java.util.Map");
        selectBySearchElem.setAttribute("resultMap","BaseResultMap");
        selectBySearchElem.appendChild(document.createTextNode("select"));
        selectBySearchElem.appendChild(includeElem.cloneNode(true));
        selectBySearchElem.appendChild(document.createTextNode("from "+tableName));
        Element whereElem=document.createElement("where");
        //IntrospectedTable introspectedTable=introspectedTableList.get(0);
        for (IntrospectedColumn introspectedColumn : introspectedTable.getNonPrimaryKeyColumns()) {
           if(introspectedColumn.getFullyQualifiedJavaType().getShortName().toLowerCase().equals("string")) {
               Element ifElem=document.createElement("if");
               ifElem.setAttribute("test", introspectedColumn.getJavaProperty() + " !=null and " + introspectedColumn.getJavaProperty() + " !=''");
               ifElem.setTextContent( " and "+introspectedColumn.getActualColumnName()+" like #{"+introspectedColumn.getJavaProperty()+"} ");
               whereElem.appendChild(ifElem);
           }
        }
        selectBySearchElem.appendChild(whereElem);
        selectBySearchElem.appendChild(document.createTextNode("ORDER by "+orderFieldName+" DESC"));
        mapperNode.appendChild(selectBySearchElem);

        //-----selectLessThanRecord
        Element selectLessThanRecordElem=document.createElement("select");
        selectLessThanRecordElem.setAttribute("id","selectLessThanRecord");
        selectLessThanRecordElem.setAttribute("parameterType","java.lang.String");
        selectLessThanRecordElem.setAttribute("resultMap","BaseResultMap");
        String ltSqlText="select * from "+tableName;
        ltSqlText+=CGTool.newLineChar();
        ltSqlText+=" where "+orderFieldName+" = (select max("+orderFieldName+") from "+tableName+" where "+orderFieldName+"<(select "+orderFieldName+" from "+tableName+" where "+idFieldName+"=#{Id,jdbcType=NVARCHAR}))";
        CDATASection ltTextElem=document.createCDATASection(ltSqlText);
        selectLessThanRecordElem.appendChild(ltTextElem);
        mapperNode.appendChild(selectLessThanRecordElem);

        //-----selectGreaterThanRecord
        Element selectGreaterThanRecordElem=document.createElement("select");
        selectGreaterThanRecordElem.setAttribute("id","selectGreaterThanRecord");
        selectGreaterThanRecordElem.setAttribute("parameterType","java.lang.String");
        selectGreaterThanRecordElem.setAttribute("resultMap","BaseResultMap");
        String gtSqlText="select * from "+tableName;
        gtSqlText+=CGTool.newLineChar();
        gtSqlText+=" where "+orderFieldName+" = (select min("+orderFieldName+") from "+tableName+" where "+orderFieldName+">(select "+orderFieldName+" from "+tableName+" where "+idFieldName+"=#{Id,jdbcType=NVARCHAR}))";
        CDATASection gtTextElem=document.createCDATASection(gtSqlText);
        selectGreaterThanRecordElem.appendChild(gtTextElem);
        mapperNode.appendChild(selectGreaterThanRecordElem);

        builder.append(XMLDocumentUtility.documentToString(document).replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>","<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<!DOCTYPE mapper PUBLIC \"-//mybatis.org//DTD Mapper 3.0//EN\" \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">\n"));
        return builder.toString();
    }

}
