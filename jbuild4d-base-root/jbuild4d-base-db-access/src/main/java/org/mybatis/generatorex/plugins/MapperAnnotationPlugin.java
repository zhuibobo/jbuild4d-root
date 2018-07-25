/**
 *    Copyright 2006-2017 the original author or authors.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package org.mybatis.generatorex.plugins;

import java.util.List;

import org.mybatis.generatorex.api.IntrospectedTable;
import org.mybatis.generatorex.api.PluginAdapter;
import org.mybatis.generatorex.api.dom.java.FullyQualifiedJavaType;
import org.mybatis.generatorex.api.dom.java.Interface;
import org.mybatis.generatorex.api.dom.java.TopLevelClass;

public class MapperAnnotationPlugin extends PluginAdapter {

    @Override
    public boolean validate(List<String> warnings) {
        return true;
    }

    @Override
    public boolean clientGenerated(Interface interfaze, TopLevelClass topLevelClass,
            IntrospectedTable introspectedTable) {

        interfaze.addImportedType(new FullyQualifiedJavaType("org.apache.ibatis.annotations.Mapper")); //$NON-NLS-1$
        interfaze.addAnnotation("@Mapper"); //$NON-NLS-1$
        return true;
    }
}
