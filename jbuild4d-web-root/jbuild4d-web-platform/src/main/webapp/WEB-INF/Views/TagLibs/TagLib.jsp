<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/4/15
  Time: 16:16
  To change this template use File | Settings | File Templates.
--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt"  prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions"  prefix="fn" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="s" %>
<c:set var="ctxpath" value="${pageContext.request.contextPath}" scope="request"/>
<c:set var="urlts" value="<%= new java.util.Date().getTime()%>" scope="request"/>
<!DOCTYPE html>
