package com.jbuild4d.platform.system.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dao.OperationLogMapper;
import com.jbuild4d.base.dbaccess.dbentities.OperationLogEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.IpAddressUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.system.service.IOperationLogService;
import org.mybatis.spring.SqlSessionTemplate;
import sun.net.util.IPAddressUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.UUID;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
public class OperationLogServiceImpl extends BaseServiceImpl<OperationLogEntity> implements IOperationLogService {

    OperationLogMapper operationLogMapper;

    public OperationLogServiceImpl(OperationLogMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        operationLogMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, OperationLogEntity entity) throws JBuild4DGenerallyException {
        return 0;
    }

    @Override
    public void writeUserLoginLog(JB4DSession jb4DSession,Class targetClass,HttpServletRequest request) throws JsonProcessingException, JBuild4DGenerallyException {
        OperationLogEntity logEntity=new OperationLogEntity();
        logEntity.setLogActionName("登录系统");
        logEntity.setLogClassName(targetClass.getName());
        logEntity.setLogCreateTime(new Date());
        logEntity.setLogId(UUIDUtility.getUUID());
        logEntity.setLogModuleName("基础信息");
        logEntity.setLogSystemName("应用系统");
        logEntity.setLogOrderNum(operationLogMapper.nextOrderNum());
        logEntity.setLogOrganId(jb4DSession.getOrganId());
        logEntity.setLogOrganName(jb4DSession.getOrganName());
        logEntity.setLogUserId(jb4DSession.getUserId());
        logEntity.setLogUserName(jb4DSession.getUserName());
        logEntity.setLogStatus("正常");
        logEntity.setLogText("用户["+jb4DSession.getUserName()+"]登录了系统!");
        logEntity.setLogData(JsonUtility.toObjectString(jb4DSession));
        logEntity.setLogType("登录日志");
        logEntity.setLogIp(IpAddressUtility.getIpAdrress(request));
        this.save(jb4DSession, logEntity.getLogId(), logEntity, new IAddBefore<OperationLogEntity>() {
            @Override
            public OperationLogEntity run(JB4DSession jb4DSession, OperationLogEntity sourceEntity) throws JBuild4DGenerallyException {
                return sourceEntity;
            }
        });
    }

    @Override
    public void writeUserExitLog(JB4DSession jb4DSession,Class targetClass,HttpServletRequest request) throws JsonProcessingException, JBuild4DGenerallyException {
        OperationLogEntity logEntity=new OperationLogEntity();
        logEntity.setLogActionName("退出系统");
        logEntity.setLogClassName(targetClass.getName());
        logEntity.setLogCreateTime(new Date());
        logEntity.setLogId(UUIDUtility.getUUID());
        logEntity.setLogModuleName("基础信息");
        logEntity.setLogSystemName("应用系统");
        logEntity.setLogOrderNum(operationLogMapper.nextOrderNum());
        logEntity.setLogOrganId(jb4DSession.getOrganId());
        logEntity.setLogOrganName(jb4DSession.getOrganName());
        logEntity.setLogUserId(jb4DSession.getUserId());
        logEntity.setLogUserName(jb4DSession.getUserName());
        logEntity.setLogStatus("正常");
        logEntity.setLogText("用户["+jb4DSession.getUserName()+"]退出了系统!");
        logEntity.setLogData(JsonUtility.toObjectString(jb4DSession));
        logEntity.setLogType("登录日志");
        logEntity.setLogIp(IpAddressUtility.getIpAdrress(request));
        this.save(jb4DSession, logEntity.getLogId(), logEntity, new IAddBefore<OperationLogEntity>() {
            @Override
            public OperationLogEntity run(JB4DSession jb4DSession, OperationLogEntity sourceEntity) throws JBuild4DGenerallyException {
                return sourceEntity;
            }
        });
    }
}
