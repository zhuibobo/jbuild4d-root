package com.jbuild4d.platform.builder.htmldesign;

import com.jbuild4d.platform.builder.vo.DesignThemeVo;

import javax.xml.bind.JAXBException;
import java.util.List;

public interface IHTMLDesignThemesService {
    List<DesignThemeVo> getDesignThemeList() throws JAXBException;
}
