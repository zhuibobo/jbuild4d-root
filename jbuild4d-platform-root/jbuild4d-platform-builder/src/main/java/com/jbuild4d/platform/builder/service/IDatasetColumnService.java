package com.jbuild4d.platform.builder.service;

import com.jbuild4d.base.service.general.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetColumnService {
    void deleteByDataSetId(JB4DSession jb4DSession, String dataSetId);
}
