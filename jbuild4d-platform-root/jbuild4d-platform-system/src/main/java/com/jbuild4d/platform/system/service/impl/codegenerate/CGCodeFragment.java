package com.jbuild4d.platform.system.service.impl.codegenerate;

import com.jbuild4d.core.base.tools.StringUtility;
import com.jbuild4d.platform.system.exenum.CodeGenerateTypeEnum;
import com.jbuild4d.platform.system.vo.CodeGenerateVo;
import org.mybatis.generatorex.api.IntrospectedColumn;
import org.mybatis.generatorex.api.IntrospectedTable;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/20
 * To change this template use File | Settings | File Templates.
 */
public class CGCodeFragment {
    public static String generate(List<IntrospectedTable> introspectedTableList, String tableName, String orderFieldName, String statusFieldName,
                                  Map<CodeGenerateTypeEnum,CodeGenerateVo> codeGenerateVoMap, String xmlMapperACStr, String daoMapperName){
        StringBuilder builder=new StringBuilder();
        builder.append(generateJsBean(introspectedTableList,tableName,orderFieldName,statusFieldName,codeGenerateVoMap,xmlMapperACStr,daoMapperName));
        return builder.toString();
    }

    private static String generateJsBean(List<IntrospectedTable> introspectedTableList, String tableName, String orderFieldName, String statusFieldName,
                                         Map<CodeGenerateTypeEnum,CodeGenerateVo> codeGenerateVoMap, String xmlMapperACStr, String daoMapperName){
        StringBuilder builder=new StringBuilder();

        IntrospectedTable introspectedTable=introspectedTableList.get(0);

        String domainObjectName= StringUtility.fisrtCharLower(introspectedTable.getFullyQualifiedTable().getDomainObjectName());
        builder.append("/*Js Bean*/");
        builder.append(CGTool.newLineChar());
        builder.append(domainObjectName+":{");
        builder.append(CGTool.newLineChar());
        for (IntrospectedColumn introspectedColumn : introspectedTable.getAllColumns()) {
            builder.append(introspectedColumn.getJavaProperty()+":");
            //System.out.println(introspectedColumn.getFullyQualifiedJavaType().getFullyQualifiedName());
            if(introspectedColumn.getFullyQualifiedJavaType().getFullyQualifiedName().equals("java.util.Date")){
                builder.append("DateUtility.GetCurrentData(),");
            }
            else {
                if(introspectedColumn.getJavaProperty().toLowerCase().indexOf("issystem")>0){
                    builder.append("\"否\",");
                }
                else if(introspectedColumn.getJavaProperty().toLowerCase().indexOf("status")>0){
                    builder.append("\"启用\",");
                }
                else {
                    builder.append("\"\",");
                }
            }
            builder.append(CGTool.newLineChar());
        }
        builder=builder.deleteCharAt(builder.length()-2);
        builder.append("}");
        builder.append(CGTool.newLineChar());
        return builder.toString();
    }
}
