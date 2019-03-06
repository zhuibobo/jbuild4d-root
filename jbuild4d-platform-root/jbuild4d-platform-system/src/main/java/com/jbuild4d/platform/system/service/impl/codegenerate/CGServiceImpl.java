package com.jbuild4d.platform.system.service.impl.codegenerate;

import com.jbuild4d.base.tools.common.StringUtility;
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
public class CGServiceImpl {

    public static String generate(List<IntrospectedTable> introspectedTableList, String tableName, String orderFieldName, String statusFieldName,
                                  Map<CodeGenerateTypeEnum,CodeGenerateVo> codeGenerateVoMap, String xmlMapperACStr,String daoMapperName){
        StringBuilder builder=new StringBuilder();

        IntrospectedTable introspectedTable=introspectedTableList.get(0);

        String daoMapperInstanceName= StringUtility.fisrtCharLower(daoMapperName);
        String serviceImplName=introspectedTable.getFullyQualifiedTable().getDomainObjectName().replace("Entity","")+"ServiceImpl";
        String domainObjectName=introspectedTable.getFullyQualifiedTable().getDomainObjectName();

        builder.append("public class "+serviceImplName);
        builder.append(" extends BaseServiceImpl<"+domainObjectName+"> ");
        builder.append("implements I"+introspectedTable.getFullyQualifiedTable().getDomainObjectName().replace("Entity","")+"Service");
        builder.append(CGTool.newLineChar());
        builder.append("{");

        //---------------构造函数---------------
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+daoMapperName+" "+ daoMapperInstanceName+";");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"public "+ serviceImplName+"("+daoMapperName+" _defaultBaseMapper,SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(2)+"super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(2)+daoMapperInstanceName+"=_defaultBaseMapper;");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"}");
        builder.append(CGTool.newLineChar());

        //---------------保存方法---------------
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"@Override");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"public int saveSimple(JB4DSession jb4DSession, String id, "+domainObjectName+" record) throws JBuild4DGenerallyException {");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(2)+"return super.save(jb4DSession,id, record, new IAddBefore<"+domainObjectName+">() {");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(3)+"@Override");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(3)+"public "+domainObjectName+" run(JB4DSession jb4DSession,"+domainObjectName+" sourceEntity) throws JBuild4DGenerallyException {");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(4)+"//设置排序,以及其他参数--nextOrderNum()");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(4)+"return sourceEntity;");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(3)+"}");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(2)+"});");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"}");

        builder.append(CGTool.newLineChar());
        builder.append("}");
        builder.append(CGTool.newLineChar());
        return builder.toString();
    }

}
