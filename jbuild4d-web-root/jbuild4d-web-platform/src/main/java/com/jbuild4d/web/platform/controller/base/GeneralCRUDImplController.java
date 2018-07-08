package com.jbuild4d.web.platform.controller.base;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.anno.DBAnnoUtility;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.ClassUtility;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public abstract class GeneralCRUDImplController<T> implements IGeneralCRUDController<T> {

    IBaseService<T> baseService;
    //T nullEntity;

    //得到泛型类T
    public Class getMyClass(){
        //System.out.println(this.getClass());
        //class com.dfsj.generic.UserDaoImpl因为是该类调用的该法，所以this代表它

        //返回表示此 Class 所表示的实体类的 直接父类 的 Type。注意，是直接父类
        //这里type结果是 com.dfsj.generic.GetInstanceUtil<com.dfsj.generic.User>
        Type type = getClass().getGenericSuperclass();

        // 判断 是否泛型
        if (type instanceof ParameterizedType) {
            // 返回表示此类型实际类型参数的Type对象的数组.
            // 当有多个泛型类时，数组的长度就不是1了
            Type[] ptype = ((ParameterizedType) type).getActualTypeArguments();
            return (Class) ptype[0];  //将第一个泛型T对应的类返回（这里只有一个）
        } else {
            return Object.class;//若没有给定泛型，则返回Object类
        }

    }

    public IBaseService<T> getBaseService() {
        return baseService;
    }

    public void setBaseService(IBaseService<T> baseService) {
        this.baseService = baseService;
    }

    /*public T getNullEntity() {
        return nullEntity;
    }

    public void setNullEntity(T nullEntity) {
        this.nullEntity = nullEntity;
    }*/

    @RequestMapping(value = "List", method = RequestMethod.GET)
    public ModelAndView list() {
        ModelAndView modelAndView=new ModelAndView(getListViewName());
        return modelAndView;
    }

    public abstract String getListViewName();

    @RequestMapping(value = "GetListData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String search_condition) {
        PageInfo<T> proOrganPageInfo=baseService.getPage(pageNum,pageSize);
        return JBuild4DResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "Detail", method = RequestMethod.GET)
    public ModelAndView detail(String recordId,String op) throws IllegalAccessException, InstantiationException {
        ModelAndView modelAndView=new ModelAndView(getDetailViewName());

        T entity=null;
        if(StringUtility.isEmpty(recordId)) {
            entity=(T)ClassUtility.newTclass(getMyClass());
            modelAndView.addObject("recordId", UUIDUtility.getUUID());
        }
        else {
            entity=baseService.getByPrimaryKey(recordId);
            modelAndView.addObject("recordId", recordId);
        }
        modelAndView.addObject("entity",entity);
        modelAndView.addObject("op",op);
        return modelAndView;
    }

    public abstract String getDetailViewName();

    @RequestMapping(value = "SaveEdit", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo saveEdit(@RequestBody T entity) throws Exception {
        try {
            //entity.getClass().getDeclaredFields()[0].get
            String recordID=DBAnnoUtility.getIDValue(entity);
            //return null;
            //baseService.saveBySelective(entityId(entity), entity);
            baseService.saveBySelective(recordID, entity);
            return JBuild4DResponseVo.saveSuccess();
        } catch (JBuild4DGenerallyException e) {
            return JBuild4DResponseVo.error(e.getMessage());
        }
    }

    @RequestMapping(value = "StatusChange", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo statusChange(String ids,String status) {
        //BaseService.statusChange(ids,status);
        //dictionaryGroupService.saveBySelective(dictionaryEntity.getDictGroupId(), dictionaryEntity);
        return JBuild4DResponseVo.saveSuccess();
    }

    @RequestMapping(value = "Delete", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo Delete(String recordId) {
        baseService.deleteByKey(recordId);
        return JBuild4DResponseVo.opSuccess();
    }
}
