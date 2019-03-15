package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.systemsetting.Jb4dCacheMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.Jb4dCacheEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.InetAddressUtility;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.mybatis.spring.SqlSessionTemplate;

import java.net.UnknownHostException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public class Jb4dCacheServiceImpl extends BaseServiceImpl<Jb4dCacheEntity> implements IJb4dCacheService
{
    Jb4dCacheMapper jb4dCacheMapper;
    public Jb4dCacheServiceImpl(Jb4dCacheMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        jb4dCacheMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, Jb4dCacheEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<Jb4dCacheEntity>() {
            @Override
            public Jb4dCacheEntity run(JB4DSession jb4DSession,Jb4dCacheEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setCacheOrderNum(jb4dCacheMapper.nextOrderNum());
                return sourceEntity;
            }
        });
    }

    String sysRunStatusId="SysRunStatus";

    @Override
    public boolean sysRunStatusIsDebug() throws JBuild4DGenerallyException {
        try {
            if(JBuild4DProp.hostOperationSystemIsWindow()) {
                if (InetAddressUtility.getThisPCHostName().equals("DESKTOP-KRH91TA")) {
                    return true;
                }
                else if(InetAddressUtility.getThisPCHostName().equals("DESKTOP-KUAEU1Q")){
                    return true;
                }
            }
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        return getSysRunStatus().getCacheMode().toLowerCase().equals("debug");
    }

    @Override
    public Jb4dCacheEntity getSysRunStatus() throws JBuild4DGenerallyException {
        Jb4dCacheEntity jb4dCacheEntity=jb4dCacheMapper.selectByPrimaryKey(sysRunStatusId);
        if(jb4dCacheEntity==null){
            addSysRunStatusCacheKey();
            jb4dCacheEntity=jb4dCacheMapper.selectByPrimaryKey(sysRunStatusId);
        }
        return jb4dCacheEntity;
    }

    private void addSysRunStatusCacheKey() throws JBuild4DGenerallyException {
        this.deleteByKey(null,sysRunStatusId);
        Jb4dCacheEntity record=new Jb4dCacheEntity();
        record.setCacheId(sysRunStatusId);
        record.setCacheKey(sysRunStatusId);
        record.setCacheName("系统运行状态");
        record.setCacheDesc("开发状态为Debug,生产状态为Release,主要用于控制各类的XML配置文件是否使用缓存处理.");
        record.setCacheOrderNum(0);
        record.setCacheStatus(EnableTypeEnum.enable.getDisplayName());
        record.setCacheIsGlobal(TrueFalseEnum.True.getDisplayName());
        record.setCacheUserId("0");
        record.setCacheMode("Release");
        record.setCacheVersion(1);

        this.saveSimple(null,record.getCacheId(),record);
    }

    @Override
    public void initSystemData(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        //系统运行状态
        addSysRunStatusCacheKey();
    }
}