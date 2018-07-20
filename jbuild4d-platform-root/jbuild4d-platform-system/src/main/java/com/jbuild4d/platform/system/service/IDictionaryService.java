package com.jbuild4d.platform.system.service;

import com.jbuild4d.base.dbaccess.dbentities.DictionaryEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface IDictionaryService  extends IBaseService<DictionaryEntity> {
    List<DictionaryEntity> getListDataByGroupId(JB4DSession session, String groupId);
}
