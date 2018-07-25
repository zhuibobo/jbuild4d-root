package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.system.service.ICodeGenerateService;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/25
 * To change this template use File | Settings | File Templates.
 */
public class CodeGenerateServiceImpl implements ICodeGenerateService {

    ISQLBuilderService sqlBuilderService;
    public CodeGenerateServiceImpl(ISQLBuilderService _sqlBuilderService) {
        sqlBuilderService=_sqlBuilderService;
    }
}
