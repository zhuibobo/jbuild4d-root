package com.jbuild4d.platform.builder.service;

import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.service.IBaseService;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface ITableFieldService extends IBaseService<TableFieldEntity> {
    List<String> getFieldTemplateName();

    List<TableFieldEntity> getTemplateFieldsByName(String templateName);

    void createGeneralTemplate();

}