package com.jbuild4d.platform.system.service.impl.codegenerate;

import com.jbuild4d.base.tools.common.StringUtility;
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

        IntrospectedTable introspectedTable=introspectedTableList.get(0);

        String domainObjectName= StringUtility.fisrtCharLower(introspectedTable.getFullyQualifiedTable().getDomainObjectName());
        builder.append("/*Js Bean*/");
        builder.append(CGTool.newLineChar());
        builder.append(domainObjectName+":{");
        builder.append(CGTool.newLineChar());
        /*for (IntrospectedColumn primaryKeyColumn : introspectedTable.getPrimaryKeyColumns()) {

        }*/
        for (IntrospectedColumn allColumn : introspectedTable.getAllColumns()) {
            builder.append(allColumn.getJavaProperty()+":"+"\"\",");
            builder.append(CGTool.newLineChar());
        }
        builder.deleteCharAt(builder.length()-1);
        builder.append("}");
        builder.append(CGTool.newLineChar());
        return builder.toString();
    }
}
