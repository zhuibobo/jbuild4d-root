package com.jbuild4d.platform.builder.flow;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.vo.FlowModelerConfigVo;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/11
 * To change this template use File | Settings | File Templates.
 */
public interface IFlowModelerConfigService {
    FlowModelerConfigVo getVoFromCache() throws JBuild4DGenerallyException;
}
