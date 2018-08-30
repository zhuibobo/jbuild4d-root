package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.system.DictionaryMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.DictionaryEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.platform.system.service.IDictionaryService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryServiceImpl extends BaseServiceImpl<DictionaryEntity> implements IDictionaryService {

    DictionaryMapper dictionaryMapper;

    public DictionaryServiceImpl(DictionaryMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        dictionaryMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DictionaryEntity entity) throws JBuild4DGenerallyException {
        return this.save(jb4DSession, id, entity, new IAddBefore<DictionaryEntity>() {
            @Override
            public DictionaryEntity run(JB4DSession jb4DSession, DictionaryEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setDictChildCount(0);
                sourceEntity.setDictOrderNum(dictionaryMapper.nextOrderNum());
                sourceEntity.setDictCreateTime(new Date());
                String parentIdList;
                if(sourceEntity.getDictParentId().equals(sourceEntity.getDictGroupId())){
                    parentIdList=sourceEntity.getDictParentId();
                }
                else
                {
                    DictionaryEntity parentDictionEntity=dictionaryMapper.selectByPrimaryKey(sourceEntity.getDictParentId());
                    parentIdList=parentDictionEntity.getDictParentIdlist();
                    parentDictionEntity.setDictChildCount(parentDictionEntity.getDictChildCount()+1);
                    dictionaryMapper.updateByPrimaryKeySelective(parentDictionEntity);
                }
                sourceEntity.setDictParentIdlist(parentIdList+"*"+sourceEntity.getDictId());
                sourceEntity.setDictOrganId(jb4DSession.getOrganId());
                sourceEntity.setDictOrganName(jb4DSession.getOrganName());
                sourceEntity.setDictUserId(jb4DSession.getUserId());
                sourceEntity.setDictUserName(jb4DSession.getUserName());
                return sourceEntity;
            }
        });
    }

    @Override
    public List<DictionaryEntity> getListDataByGroupId(JB4DSession session, String groupId) {
        return dictionaryMapper.selectByGroupId(groupId);
    }

    @Override
    public void setSelected(JB4DSession jb4DSession, String recordId) {
        DictionaryEntity entity=getByPrimaryKey(jb4DSession,recordId);

        String parentId=entity.getDictParentId();
        List<DictionaryEntity> dictionaryEntityList=dictionaryMapper.selectByParentId(parentId);
        if(dictionaryEntityList!=null&&dictionaryEntityList.size()>0){
            for (DictionaryEntity dictionaryEntity : dictionaryEntityList) {
                dictionaryEntity.setDictIsSelected(TrueFalseEnum.False.getDisplayName());
                dictionaryMapper.updateByPrimaryKeySelective(dictionaryEntity);
            }
        }

        entity.setDictIsSelected(TrueFalseEnum.True.getDisplayName());
        dictionaryMapper.updateByPrimaryKeySelective(entity);
    }

    @Override
    public List<DictionaryEntity> getListDataByGroupValue(JB4DSession session, String groupValue) {
        return dictionaryMapper.selectByGroupValue(groupValue);
    }

    @Override
    public void statusChange(JB4DSession jb4DSession, String ids, String status) throws JBuild4DGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                DictionaryEntity entity = getByPrimaryKey(jb4DSession, idArray[i]);
                entity.setDictStatus(status);
                dictionaryMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DictionaryEntity selfEntity=dictionaryMapper.selectByPrimaryKey(id);
        DictionaryEntity ltEntity=dictionaryMapper.selectLessThanRecord(id,selfEntity.getDictParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DictionaryEntity selfEntity=dictionaryMapper.selectByPrimaryKey(id);
        DictionaryEntity ltEntity=dictionaryMapper.selectGreaterThanRecord(id,selfEntity.getDictParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DictionaryEntity toEntity,DictionaryEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDictOrderNum();
            toEntity.setDictOrderNum(selfEntity.getDictOrderNum());
            selfEntity.setDictOrderNum(newNum);
            dictionaryMapper.updateByPrimaryKeySelective(toEntity);
            dictionaryMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
