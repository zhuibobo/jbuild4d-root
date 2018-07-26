package com.jbuild4d.platform.system.vo;

import com.jbuild4d.platform.system.exenum.CodeGenerateTypeEnum;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/26
 * To change this template use File | Settings | File Templates.
 */
public class CodeGenerateVo {

    public String packageName;

    public String saveFolderName;

    public String fullSavePath;

    public CodeGenerateVo(String packageName, String saveFolderName) {
        this.packageName = packageName;
        this.saveFolderName = saveFolderName;
    }

    public String getFullSavePath() {
        return fullSavePath;
    }

    public void setFullSavePath(String fullSavePath) {
        this.fullSavePath = fullSavePath;
    }

    public static Map<String,Map<CodeGenerateTypeEnum,CodeGenerateVo>> generateTypeEnumCodeGenerateVoMap(){
        Map<String,Map<CodeGenerateTypeEnum,CodeGenerateVo>> result=new HashMap<>();

        String jBuild4DPlatFormKey="JBuild4D-PlatForm";

        Map<CodeGenerateTypeEnum,CodeGenerateVo> jBuild4DPlatFormVoMap=new HashMap<>();
        jBuild4DPlatFormVoMap.put(CodeGenerateTypeEnum.Entity,new CodeGenerateVo("com.jbuild4d.base.dbaccess.dbentities","Entity"));
        jBuild4DPlatFormVoMap.put(CodeGenerateTypeEnum.Dao,new CodeGenerateVo("com.jbuild4d.base.dbaccess.dao","Dao"));
        jBuild4DPlatFormVoMap.put(CodeGenerateTypeEnum.MapperAC,new CodeGenerateVo("mybatismappers","XMLACMapper"));
        result.put(jBuild4DPlatFormKey,jBuild4DPlatFormVoMap);


        return result;
    }
}
