package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.MenuMapper;
import com.jbuild4d.base.dbaccess.dbentities.MenuEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.IGeneralService;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.platform.system.service.IMenuService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

public class MenuServiceImpl extends BaseServiceImpl<MenuEntity> implements IMenuService {

    MenuMapper menuMapper;

    public MenuServiceImpl(MenuMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        menuMapper = _defaultBaseMapper;
    }

    @Override
    public int saveBySelective(JB4DSession jb4DSession, String id, MenuEntity entity) throws JBuild4DGenerallyException {
        return super.saveBySelective(jb4DSession, id, entity, new IAddBefore<MenuEntity>() {
            @Override
            public MenuEntity run(JB4DSession jb4DSession, MenuEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setMenuOrganId(jb4DSession.getOrganId());
                sourceEntity.setMenuOrganName(jb4DSession.getOrganName());
                sourceEntity.setMenuUserId(jb4DSession.getUserId());
                sourceEntity.setMenuUserName(jb4DSession.getUserName());
                sourceEntity.setOrderNum(menuMapper.nextOrderNum());
                MenuEntity parentEntity=null;
                if(StringUtility.isEmpty(sourceEntity.getParentId())){
                    throw new JBuild4DGenerallyException("请在实体中设置ParentId的值!");
                }
                if(!sourceEntity.getParentId().equals("-1")){
                    parentEntity=menuMapper.selectByPrimaryKey(sourceEntity.getParentId());
                    if(parentEntity==null){
                        throw new JBuild4DGenerallyException("找不到父节点为"+sourceEntity.getParentId()+"的记录!");
                    }
                    else
                    {
                        sourceEntity.setParentIdList(parentEntity.getParentIdList()+"*"+sourceEntity.getMenuId());
                    }
                }
                else
                {
                    sourceEntity.setParentIdList("-1*"+sourceEntity.getMenuId());
                }

                sourceEntity.setCreateTime(new Date());
                sourceEntity.setCreator(jb4DSession.getUserName());
                sourceEntity.setChildCount(0);
                sourceEntity.setUpdater(jb4DSession.getUserName());
                sourceEntity.setUpdateTime(new Date());
                return sourceEntity;
            }
        });
    }
}
