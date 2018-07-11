package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.DictionaryGroupMapper;
import com.jbuild4d.base.dbaccess.dynamic.SQLBuilderMapper;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.IGeneralService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.SQLKeyWordUtility;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryGroupServiceImplImpl extends BaseServiceImpl<DictionaryGroupEntity> implements IDictionaryGroupService {

    DictionaryGroupMapper dictionaryGroupMapper;
    SQLBuilderMapper sqlMapper;

    public DictionaryGroupServiceImplImpl(DictionaryGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, IGeneralService _generalService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _generalService);
        dictionaryGroupMapper=_defaultBaseMapper;
        sqlMapper=new SQLBuilderMapper(_sqlSessionTemplate);
    }

    @Override
    public int saveBySelective(String id, DictionaryGroupEntity record) throws JBuild4DGenerallyException {
        return super.saveBySelective(id, record, new IAddBefore<DictionaryGroupEntity>() {
            @Override
            public DictionaryGroupEntity run(DictionaryGroupEntity item) throws JBuild4DGenerallyException {
                item.setDictGroupOrderNum(generalService.nextOrderNum("TB4D_DICTIONARY_GROUP","DICT_GROUP_ORDER_NUM"));
                item.setDictGroupStatus(EnableTypeEnum.enable.getDisplayName());
                return item;
            }
        });
    }

    @Override
    public void statusChange(String ids,String status) {
        String[] idArray=ids.split(";");
        for(int i=0;i<idArray.length;i++){
            DictionaryGroupEntity dictionaryGroupEntity=getByPrimaryKey(idArray[i]);
            dictionaryGroupEntity.setDictGroupStatus(status);
            dictionaryGroupMapper.updateByPrimaryKeySelective(dictionaryGroupEntity);
        }
    }

    @Override
    public void moveUp(String id){
        String sql="select min(DICT_GROUP_ORDER_NUM) from TB4D_DICTIONARY_GROUP where DICT_GROUP_ORDER_NUM>(select DICT_GROUP_ORDER_NUM from TB4D_DICTIONARY_GROUP where DICT_GROUP_ID="+ SQLKeyWordUtility.stringWrap(id)+")";
        Object gtMin=generalService.executeScalarSql(sql);
        Map<String, Object> map=sqlMapper.selectOne("select * from TB4D_DICTIONARY_GROUP where DICT_GROUP_ID=#{ID}","21684b89-2126-4224-910e-18c90dd93489");
        System.out.println(gtMin);
        //System.out.printf(gtMin);
    }

    @Override
    public void moveDown(String id){

    }
}
