package com.jbuild4d.platform.builder.extend;

import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.builder.vo.DataSetVo;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/7
 * To change this template use File | Settings | File Templates.
 */
public interface IDataSetAPI {
    public DataSetVo getDataSetStructure(JB4DSession session, String dsId, String op,String groupId,String paras);
}
