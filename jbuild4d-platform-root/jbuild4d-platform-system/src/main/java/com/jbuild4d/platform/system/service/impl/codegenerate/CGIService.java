package com.jbuild4d.platform.system.service.impl.codegenerate;

import com.jbuild4d.platform.system.exenum.CodeGenerateTypeEnum;
import com.jbuild4d.platform.system.vo.CodeGenerateVo;
import org.mybatis.generatorex.api.IntrospectedTable;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
public class CGIService {
    public static String generate(List<IntrospectedTable> introspectedTableList, String tableName, String orderFieldName, String statusFieldName,
                                  Map<CodeGenerateTypeEnum,CodeGenerateVo> codeGenerateVoMap, String xmlMapperACStr){
        StringBuilder builder=new StringBuilder();

        IntrospectedTable introspectedTable=introspectedTableList.get(0);

        builder.append("public interface I"+introspectedTable.getFullyQualifiedTable().getDomainObjectName().replace("Entity","")+"Service");
        builder.append(" extends IBaseService<"+introspectedTable.getFullyQualifiedTable().getDomainObjectName()+">");
        builder.append("{");
        builder.append("}");

        return builder.toString();
    }
}
