package com.jbuild4d.platform.system.service.impl.codegenerate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
public class CGTool {
    public static String newLineChar(){
        return "\n";
    }

    public static String tabChar(int num){
        String tab="";
        for(int i=0;i<num;i++){
            tab+="    ";
        }
        return tab;
    }
}
