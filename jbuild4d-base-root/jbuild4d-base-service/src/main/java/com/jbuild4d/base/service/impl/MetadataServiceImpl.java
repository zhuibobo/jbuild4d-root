package com.jbuild4d.base.service.impl;

import com.jbuild4d.base.service.IMetadataService;
import com.jbuild4d.base.service.ISQLBuilderService;

public class MetadataServiceImpl implements IMetadataService {

    ISQLBuilderService sqlBuilderService;

    public MetadataServiceImpl(ISQLBuilderService sqlBuilderService) {
        this.sqlBuilderService = sqlBuilderService;
    }


}
