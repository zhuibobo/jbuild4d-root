package com.jbuild4d.base.dbaccess.anno;

import java.lang.annotation.*;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DBKeyField {
    String value() default "Id";
}
