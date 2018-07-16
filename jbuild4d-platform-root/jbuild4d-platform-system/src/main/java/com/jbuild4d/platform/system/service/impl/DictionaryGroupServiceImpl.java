package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.DictionaryGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryGroupServiceImpl extends BaseServiceImpl<DictionaryGroupEntity> implements IDictionaryGroupService {

    DictionaryGroupMapper dictionaryGroupMapper;

    public DictionaryGroupServiceImpl(DictionaryGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        dictionaryGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveBySelective(JB4DSession jb4DSession, String id, DictionaryGroupEntity record) throws JBuild4DGenerallyException {
        return super.saveBySelective(jb4DSession,id, record, new IAddBefore<DictionaryGroupEntity>() {
            @Override
            public DictionaryGroupEntity run(JB4DSession jb4DSession1,DictionaryGroupEntity item) throws JBuild4DGenerallyException {
                item.setDictGroupOrderNum(generalService.nextOrderNum("TB4D_DICTIONARY_GROUP","DICT_GROUP_ORDER_NUM"));
                item.setDictGroupStatus(EnableTypeEnum.enable.getDisplayName());
                return item;
            }
        });
    }

    @Override
    public void statusChange(JB4DSession jb4DSession,String ids,String status) {
        String[] idArray=ids.split(";");
        for(int i=0;i<idArray.length;i++){
            DictionaryGroupEntity dictionaryGroupEntity=getByPrimaryKey(jb4DSession,idArray[i]);
            dictionaryGroupEntity.setDictGroupStatus(status);
            dictionaryGroupMapper.updateByPrimaryKeySelective(dictionaryGroupEntity);
        }
    }

    @Override
    public void moveUp(JB4DSession jb4DSession,String id){
        //String sql="select min(DICT_GROUP_ORDER_NUM) from TB4D_DICTIONARY_GROUP where DICT_GROUP_ORDER_NUM>(select DICT_GROUP_ORDER_NUM from TB4D_DICTIONARY_GROUP where DICT_GROUP_ID="+ SQLKeyWordUtility.stringWrap(id)+")";
        //Object gtMin=generalService.executeScalarSql(sql);
        //Map<String,String> value=new HashMap<>();
        //value.put("ID","1");
        //value.put("ID1","2");
        //Map<String, Object> map=sqlBuilderService.selectOne("select min(DICT_GROUP_ORDER_NUM) from TB4D_DICTIONARY_GROUP where DICT_GROUP_ORDER_NUM>(select DICT_GROUP_ORDER_NUM from TB4D_DICTIONARY_GROUP where DICT_GROUP_ID=#{ID} or DICT_GROUP_ID=#{ID1})",value);
        //System.out.println(gtMin);
        //System.out.printf(gtMin);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession,String id){

    }
}
