
-----------------------------------------开发适用DEMO-----------------------------------------
CREATE TABLE [dbo].[TB4D_DEV_DEMO_GEN_LIST] (
  [DDGL_ID]         [NVARCHAR](128) NOT NULL PRIMARY KEY,
  [DDGL_KEY]        [NVARCHAR](128) NULL,
  [DDGL_NAME]       [NVARCHAR](128) NULL,
  [DDGL_VALUE]      [NVARCHAR](500) NULL,
  [DDGL_STATUS]     [NVARCHAR](10)  NULL,
  [DDGL_DESC]       [NVARCHAR](MAX) NULL,
  [DDGL_CREATETIME] [DATETIME]      NULL,
  [DDGL_USER_ID]    [NVARCHAR](100) NULL,
  [DDGL_USER_NAME]  [NVARCHAR](100) NULL,
  [DDGL_ORGAN_ID]   [NVARCHAR](100) NULL,
  [DDGL_ORGAN_NAME] [NVARCHAR](100) NULL,
  [DDGL_API]        [NVARCHAR](100) NULL,
  [DDGL_ORDER_NUM]  [INT]        NULL
)


-----------------------------------------系统设置表-----------------------------------------
CREATE TABLE [dbo].[TB4D_SETTING] (
  [SETTING_ID]         [NVARCHAR](128) NOT NULL PRIMARY KEY,
  [SETTING_KEY]        [NVARCHAR](128) NULL,
  [SETTING_NAME]       [NVARCHAR](128) NULL,
  [SETTING_VALUE]      [NVARCHAR](500) NULL,
  [SETTING_STATUS]     [NVARCHAR](10)  NULL,
  [SETTING_DESC]       [NVARCHAR](MAX) NULL,
  [SETTING_CREATETIME] [DATETIME]      NULL,
  [SETTING_USER_ID]    [NVARCHAR](100) NULL,
  [SETTING_USER_NAME]  [NVARCHAR](100) NULL,
  [SETTING_ORGAN_ID]   [NVARCHAR](100) NULL,
  [SETTING_ORGAN_NAME] [NVARCHAR](100) NULL,
  [SETTING_API]        [NVARCHAR](100) NULL,
  [SETTING_IS_SYSTEM]  [NVARCHAR](10)  NULL
)

EXECUTE sp_addextendedproperty N'MS_Description', N'系统基础参数设置表', N'user', N'dbo', N'table', N'TB4D_SETTING', NULL, NULL;
--EXECUTE sp_updateextendedproperty 'MS_Description', '系统基础参数设置表', 'user', 'dbo', 'table', 'TB4D_SETTING', NULL, NULL;

--EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数主键', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'SETTING_ID';

-----------------------------------------操作日志-----------------------------------------

-----------------------------------------文件夹表-----------------------------------------
CREATE TABLE [dbo].[TB4D_MENU] (
  [MENU_ID]                  [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [MENU_NAME]                [NVARCHAR](100)  NULL,
  [MENU_TEXT]                [NVARCHAR](100)  NOT NULL,
  [MENU_VALUE]               [NVARCHAR](100)  NULL,
  [MENU_TYPE]                [NVARCHAR](100)  NOT NULL,
  [MENU_USER_ID]             [NVARCHAR](100)  NULL,
  [MENU_USER_NAME]           [NVARCHAR](100)  NULL,
  [MENU_ORGAN_ID]            [NVARCHAR](100)  NULL,
  [MENU_ORGAN_NAME]          [NVARCHAR](100)  NULL,
  [MENU_IS_EXPAND]           [NVARCHAR](10)   NULL,
  [MENU_IS_SYSTEM]           [NVARCHAR](10)   NULL,
  [MENU_LEFT_URL]            [NVARCHAR](600)  NULL,
  [MENU_LEFT_URL_PARA]       [NVARCHAR](600)  NULL,
  [MENU_RIGHT_URL]           [NVARCHAR](800)  NULL,
  [MENU_RIGHT_URL_PARA]      [NVARCHAR](600)  NULL,
  [MENU_ORDER_NUM]           [INT]            NULL,
  [MENU_PARENT_ID]           [NVARCHAR](100)  NOT NULL,
  [MENU_PARENT_ID_LIST]      [NVARCHAR](1200) NOT NULL,
  [MENU_TARGET]              [NVARCHAR](100)  NULL,
  [MENU_CREATOR]             [NVARCHAR](200)  NULL,
  [MENU_CREATE_TIME]         [DATETIME]       NULL,
  [MENU_UPDATER]             [NVARCHAR](200)  NULL,
  [MENU_UPDATE_TIME]         [DATETIME]       NULL,
  [MENU_USE_ORGAN_NAME]      [NVARCHAR](500)  NULL,
  [MENU_USE_ORGAN_ID]        [NVARCHAR](500)  NULL,
  [MENU_USE_ORGAN_TYPE_NAME] [NVARCHAR](500)  NULL,
  [MENU_USE_ORGAN_TYPE_ID]   [NVARCHAR](500)  NULL,
  [MENU_CLASS_NAME]          [NVARCHAR](100)  NULL,
  [MENU_CLASS_NAME_HOVER]    [NVARCHAR](100)  NULL,
  [MENU_CLASS_NAME_SELECTED] [NVARCHAR](100)  NULL,
  [MENU_MENU_CHILD_COUNT]    [INT]            NULL,
  [MENU_MENU_DESCRIPTION]    [NVARCHAR](MAX)  NULL,
  [MENU_JS_EXPRESSION]       [NVARCHAR](1000) NULL
)

EXECUTE sp_addextendedproperty N'MS_Description', N'系统导航菜单表', N'user', N'dbo', N'table', N'TB4D_MENU', NULL, NULL;

EXECUTE sp_addextendedproperty N'MS_Description', N'菜单ID', N'user', N'dbo', N'table', N'TB4D_MENU', N'column', N'MENU_ID';

-----------------------------------------组织机构表-----------------------------------------

-----------------------------------------数据字典表-----------------------------------------
CREATE TABLE TB4D_DICTIONARY_GROUP (
  [DICT_GROUP_ID]          [NVARCHAR](100) NOT NULL PRIMARY KEY,
  [DICT_GROUP_VALUE]       [NVARCHAR](200) NOT NULL,
  [DICT_GROUP_TEXT]        [NVARCHAR](200) NOT NULL,
  [DICT_GROUP_ORDER_NUM]   [INT]           NULL,
  [DICT_GROUP_CREATE_TIME] [DATETIME]      NULL,
  [DICT_GROUP_DESC]        [NVARCHAR](500) NULL,
  [DICT_GROUP_STATUS]      [NVARCHAR](10)  NULL,
  [DICT_GROUP_PARENT_ID]   [NVARCHAR](100) NULL,
  [DICT_GROUP_ISSYSTEM]    [NVARCHAR](10)  NULL,
  [DICT_GROUP_DEL_ENABLE]  [NVARCHAR](10)  NULL
)
-----------------------------------------数据字典表-----------------------------------------
CREATE TABLE TB4D_DICTIONARY (
  [DICT_ID]            [NVARCHAR](100)  NOT NULL PRIMARY KEY,
  [DICT_KEY]           [NVARCHAR](200)  NOT NULL,
  [DICT_VALUE]         [NVARCHAR](200)  NOT NULL,
  [DICT_TEXT]          [NVARCHAR](200)  NOT NULL,
  [DICT_GROUP_ID]      [NVARCHAR](100)  NOT NULL,
  [DICT_ORDER_NUM]     [INT]            NULL,
  [DICT_CREATE_TIME]   [DATETIME]       NULL,
  [DICT_PARENT_ID]     [NVARCHAR]       NULL,
  [DICT_PARENT_IDLIST] [NVARCHAR](1200) NULL,
  [DICT_ISSYSTEM]      [NVARCHAR](10)   NULL,
  [DICT_DEL_ENABLE]    [NVARCHAR](10)   NULL,
  [DICT_STATUS]        [NVARCHAR](10)   NULL,
  [DICT_IS_SELECTED]   [NVARCHAR](10)   NULL,
  [DICT_DESC]          [NVARCHAR](500)  NULL,
  [DICT_CHILD_COUNT]   [INT]            NULL,
  [DICT_EX_ATTR1]      [NVARCHAR](500)  NULL,
  [DICT_EX_ATTR2]      [NVARCHAR](500)  NULL,
  [DICT_EX_ATTR3]      [NVARCHAR](500)  NULL,
  [DICT_EX_ATTR4]      [NVARCHAR](500)  NULL,
  [DICT_USER_ID]       [NVARCHAR](100)  NULL,
  [DICT_USER_NAME]     [NVARCHAR](100)  NULL,
  [DICT_ORGAN_ID]      [NVARCHAR](100)  NULL,
  [DICT_ORGAN_NAME]    [NVARCHAR](100)  NULL
)