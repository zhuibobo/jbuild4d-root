package com.jbuild4d.platform.system.service;

import com.jbuild4d.base.service.general.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/25
 * To change this template use File | Settings | File Templates.
 */
public interface IHistoryDataService {
    void keepRecordData(JB4DSession jb4DSession, Object record);
}
