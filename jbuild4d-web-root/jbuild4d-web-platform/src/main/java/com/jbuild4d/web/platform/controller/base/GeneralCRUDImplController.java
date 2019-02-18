package com.jbuild4d.web.platform.controller.base;



import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.anno.DBAnnoUtility;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.DictionaryEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.ClassUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.base.tools.common.search.GeneralSearchUtility;
import com.jbuild4d.platform.system.service.IDictionaryService;
import com.jbuild4d.platform.system.service.IOperationLogService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public abstract class GeneralCRUDImplController<T> implements IGeneralCRUDController<T> {

    @Autowired
    IDictionaryService dictionaryService;

    @Autowired
    IOperationLogService operationLogService;

    protected String jBuild4DSystemName ="应用管理系统";
    protected String moduleName="";
    protected String logTypeName="操作日志";

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

    protected abstract IBaseService<T> getBaseService();

    public abstract String getListViewName();

    public abstract String getDetailViewName();

    public abstract String getJBuild4DSystemName();

    public abstract String getModuleName();

    protected String getLogTypeName(){
        return logTypeName;
    }

    protected void writeOperationLog(String actionName,String text,String data,HttpServletRequest request) throws JsonProcessingException, JBuild4DGenerallyException {
        String systemName=this.getJBuild4DSystemName();
        if(systemName==null){
            systemName=jBuild4DSystemName;
        }
        operationLogService.writeOperationLog(JB4DSessionUtility.getSession(), systemName,getModuleName(),actionName,getLogTypeName(),text,data,this.getClass(),request);
    }

    @RequestMapping(value = "/ListView", method = RequestMethod.GET)
    public ModelAndView listView() throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView(getListViewName());
        //List<String> dictionaryGroupValueList=bindDictionaryToPage();
        //String dictionaryJsonString=getDictionaryJsonString(dictionaryGroupValueList);
        //modelAndView.addObject("dictionaryJson", dictionaryJsonString);
        return modelAndView;
    }

    protected Map<String,List<DictionaryEntity>> getDictionaryJson(List<String> groupValueList) throws JsonProcessingException {
        Map<String,List<DictionaryEntity>> dictionarysMap=new HashMap<>();

        if(groupValueList!=null&&groupValueList.size()>0){
            for (String groupValue : groupValueList) {
                List<DictionaryEntity> dictionaryEntityList=dictionaryService.getListDataByGroupValue(JB4DSessionUtility.getSession(),groupValue);
                if(dictionaryEntityList==null){
                    dictionaryEntityList=new ArrayList<>();
                }
                dictionarysMap.put(groupValue,dictionaryEntityList);
            }
        }
        return dictionarysMap;
        //return JsonUtility.toObjectString(dictionarysMap);
    }

    @RequestMapping(value = "/GetListData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String searchCondition,boolean loadDict) throws IOException, ParseException {
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<T> proOrganPageInfo=getBaseService().getPage(jb4DSession,pageNum,pageSize,searchMap);
        JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
        responseVo.setData(proOrganPageInfo);
        responseVo.setMessage("获取成功");
        responseVo.setSuccess(true);

        if(loadDict==true) {
            List<String> dictionaryGroupValueList = bindDictionaryToPage();
            if (dictionaryGroupValueList != null && dictionaryGroupValueList.size() > 0) {
                responseVo.addExKVData("dictionaryJson", getDictionaryJson(dictionaryGroupValueList));
            }
        }

        return responseVo;
        //return JBuild4DResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "/DetailView", method = RequestMethod.GET)
    public ModelAndView detailView(){
        ModelAndView modelAndView=new ModelAndView(getDetailViewName());
        return modelAndView;
    }

    @RequestMapping(value = "/GetDetailData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getDetailData(String recordId,String op) throws IllegalAccessException, InstantiationException, JsonProcessingException, JBuild4DGenerallyException {
        T entity;
        JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
        if(StringUtility.isEmpty(recordId)) {
            entity=(T)ClassUtility.newTclass(getMyClass());
            recordId=UUIDUtility.getUUID();
            responseVo.addExKVData("recordId",recordId);
            DBAnnoUtility.setIdValue(entity,recordId);
        }
        else {
            JB4DSession jb4DSession=JB4DSessionUtility.getSession();
            entity=getBaseService().getByPrimaryKey(jb4DSession,recordId);
            responseVo.addExKVData("recordId",recordId);
        }

        List<String> dictionaryGroupValueList=bindDictionaryToPage();
        //String dictionaryJsonString=getDictionaryJsonString(dictionaryGroupValueList);
        Map<String,List<DictionaryEntity>> dictionaryJson=getDictionaryJson(dictionaryGroupValueList);
        responseVo.addExKVData("dictionaryJson",dictionaryJson);

        responseVo.setData(entity);
        responseVo.addExKVData("op",op);

        Map<String,Object> bindObjectsToMVData=this.bindObjectsToMV();
        if(bindObjectsToMVData!=null){
            responseVo.addExKVData("exObjectsJson", bindObjectsToMVData);
        }
        return responseVo;
    }

    @RequestMapping(value = "/SaveEdit", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo saveEdit(@RequestBody T entity,HttpServletRequest request) throws JBuild4DGenerallyException {
        try {
            String recordID=DBAnnoUtility.getIdValue(entity);
            if(recordID.equals("")||recordID==null){
                throw new JBuild4DGenerallyException("recordID不能为空或字符串!");
            }
            JB4DSession jb4DSession=JB4DSessionUtility.getSession();
            if(getBaseService()==null){
                throw new JBuild4DGenerallyException(this.getClass().getSimpleName()+".getBaseService()返回的对象为Null");
            }
            if(getBaseService().getByPrimaryKey(jb4DSession,recordID)==null){
                this.writeOperationLog("新增数据","用户["+jb4DSession.getUserName()+"]新增了ID为"+recordID+"的数据["+getMyClass().getSimpleName()+"]",JsonUtility.toObjectString(entity),request);
            }
            else{
                this.writeOperationLog("修改数据","用户["+jb4DSession.getUserName()+"]修改了ID为"+recordID+"的数据["+getMyClass().getSimpleName()+"]",JsonUtility.toObjectString(entity),request);
            }
            getBaseService().save(jb4DSession,recordID, entity);
            return JBuild4DResponseVo.saveSuccess();
        } catch (JBuild4DGenerallyException e) {
            return JBuild4DResponseVo.error(e.getMessage());
        }
        catch (Exception e){
            return JBuild4DResponseVo.error(e.getMessage());
        }
    }

    @RequestMapping(value = "/StatusChange", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo statusChange(String ids,String status,HttpServletRequest request) throws JsonProcessingException {
        try {
            if(StringUtility.isEmpty(ids)){
                throw new JBuild4DGenerallyException("参数Ids不能为空或空串!");
            }
            if(StringUtility.isEmpty(status)){
                throw new JBuild4DGenerallyException("参数status不能为空或空串!");
            }
            JB4DSession jb4DSession=JB4DSessionUtility.getSession();
            this.writeOperationLog("修改数据","用户["+jb4DSession.getUserName()+"]修改了ID为"+ids+"的数据状态["+getMyClass().getSimpleName()+"]",status,request);
            getBaseService().statusChange(jb4DSession,ids,status);
            return JBuild4DResponseVo.opSuccess();
        } catch (JBuild4DGenerallyException e) {
            return JBuild4DResponseVo.opError(e.getMessage());
        }
        //dictionaryGroupService.saveBySelective(dictionaryEntity.getDictGroupId(), dictionaryEntity);
    }

    @RequestMapping(value = "/Delete", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo delete(String recordId,HttpServletRequest request) throws JBuild4DGenerallyException, JsonProcessingException {
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();
        T entity=getBaseService().getByPrimaryKey(jb4DSession,recordId);
        this.writeOperationLog("删除数据","用户["+jb4DSession.getUserName()+"]删除了ID为"+recordId+"的数据["+getMyClass().getSimpleName()+"]",JsonUtility.toObjectString(entity),request);
        getBaseService().deleteByKey(jb4DSession,recordId);
        return JBuild4DResponseVo.opSuccess();
    }

    @RequestMapping(value = "/Move", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo move(String recordId,String type,HttpServletRequest request) throws JBuild4DGenerallyException, JsonProcessingException {
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();
        this.writeOperationLog("修改数据","用户["+jb4DSession.getUserName()+"]移动了ID为"+recordId+"的数据["+getMyClass().getSimpleName()+"]",recordId,request);
        if(type.equals("up")) {
            getBaseService().moveUp(jb4DSession, recordId);
        }
        else {
            getBaseService().moveDown(jb4DSession,recordId);
        }
        return JBuild4DResponseVo.opSuccess();
    }

    public List<String> bindDictionaryToPage(){
        return null;
    }

    protected Map<String,Object> bindObjectsToMV(){
        return null;
    }
}
