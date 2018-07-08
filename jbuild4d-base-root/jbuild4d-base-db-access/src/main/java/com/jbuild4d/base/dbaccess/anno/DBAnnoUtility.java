package com.jbuild4d.base.dbaccess.anno;

import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.dbaccess.dbentities.MenuEntity;

import java.lang.reflect.Field;

public class DBAnnoUtility {
    public static String getIDValue(Object object) throws Exception {
        //class a=DictionaryGroupEntity.class.;
        Field[] fields=object.getClass().getDeclaredFields();
        //Field[] fields=DictionaryGroupEntity.class.getDeclaredFields();
        for (Field field : fields) {
            System.out.println(field.getName());
            boolean idkey=field.isAnnotationPresent(DBKeyField.class);
            if(idkey) {
                field.setAccessible(true);
                String value= (String) field.get(object);
                return value;
            }
        }
        throw new Exception("类型"+object.getClass().getName()+"中找不到标记了注解DBKeyField,设定为主键的字段！");
    }
}
