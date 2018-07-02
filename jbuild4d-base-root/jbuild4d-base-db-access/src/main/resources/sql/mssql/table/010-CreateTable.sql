-----------------------------------------系统设置表-----------------------------------------
CREATE TABLE [dbo].[TB4D_SETTING] (
  [SETTING_ID]     [NVARCHAR](128) NOT NULL PRIMARY KEY,
  [SETTING_KEY]    [NVARCHAR](128) NULL,
  [SETTING_NAME]   [NVARCHAR](128) NULL,
  [SETTING_VALUE]  [NVARCHAR](500) NULL,
  [SETTING_STATUS] [NVARCHAR](10)  NULL,
  [DESCRIPTION]    [NVARCHAR](MAX) NULL,
  [CREATETIME]     [DATETIME]      NULL,
  [USER_ID]        [NVARCHAR](128) NULL,
  [ORGAN_ID]       [NVARCHAR](128) NULL
)

EXECUTE sp_addextendedproperty N'MS_Description', N'系统基础参数设置表', N'user', N'dbo', N'table', N'TB4D_SETTING', NULL, NULL;
--EXECUTE sp_updateextendedproperty 'MS_Description', '系统基础参数设置表', 'user', 'dbo', 'table', 'TB4D_SETTING', NULL, NULL;

EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数主键', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'SETTING_ID';
EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数键值', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'SETTING_KEY';
EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数名称', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'SETTING_NAME';
EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数值', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'SETTING_VALUE';
EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数状态', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'SETTING_STATUS';
EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数描述', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'DESCRIPTION';
EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数创建时间', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'CREATETIME';
EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数创建用户ID', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'USER_ID';
EXECUTE sp_addextendedproperty N'MS_Description', N'设置参数创建组织ID', N'user', N'dbo', N'table', N'TB4D_SETTING', N'column', N'ORGAN_ID';

-----------------------------------------操作日志-----------------------------------------

-----------------------------------------文件夹表-----------------------------------------
CREATE TABLE [dbo].[TB4D_MENU] (
  [MENU_ID]             [VARCHAR](100)   NOT NULL PRIMARY KEY,
  [MENU_NAME]           [VARCHAR](100)   NULL,
  [MENU_TEXT]           [VARCHAR](100)   NOT NULL,
  [MENU_VALUE]          [VARCHAR](100)   NULL,
  [MENU_TYPE]           [VARCHAR](100)   NOT NULL,
  [IS_EXPAND]           [BIGINT]         NULL,
  [IS_SYSTEM]           [BIGINT]         NULL,
  [LEFT_URL]            [VARCHAR](600)   NULL,
  [LEFT_URL_PARA]       [VARCHAR](600)   NULL,
  [RIGHT_URL]           [VARCHAR](800)   NULL,
  [RIGHT_URL_PARA]      [VARCHAR](600)   NULL,
  [ORDER_NUM]           [BIGINT]         NULL,
  [ORGAN_ID]            [VARCHAR](100)   NOT NULL,
  [PARENT_ID]           [VARCHAR](100)   NOT NULL,
  [PARENT_ID_LIST]      [VARCHAR](1200)  NOT NULL,
  [SHARE_TYPE]          [BIGINT]         NULL,
  [TAG]                 [VARCHAR](100)   NULL,
  [TARGET]              [BIGINT]         NULL,
  [UPDATER]             [VARCHAR](200)   NULL,
  [USE_ORGAN]           [VARCHAR](500)   NULL,
  [USE_ORGAN_ID]        [VARCHAR](500)   NULL,
  [USE_ORGAN_TYPE]      [VARCHAR](500)   NULL,
  [USE_ORGAN_TYPE_ID]   [VARCHAR](500)   NULL,
  [ICON_CLASS_NAME]     [VARCHAR](100)   NULL,
  [HOVER_CLASS_NAME]    [VARCHAR](100)   NULL,
  [SELECTED_CLASS_NAME] [VARCHAR](100)   NULL,
  [CHILD_COUNT]         [BIGINT]         NOT NULL,
  [CREATE_TIME]         [DATETIME]       NULL,
  [CREATOR]             [VARCHAR](200)   NULL,
  [DESCRIPTION]         [NVARCHAR](MAX)  NULL,
  [UPDATE_TIME]         [DATETIME]       NULL,
  [JS_EXPRESSION]       [NVARCHAR](1000) NULL
)

EXECUTE sp_addextendedproperty N'MS_Description', N'系统导航菜单表', N'user', N'dbo', N'table', N'TB4D_MENU', NULL, NULL;

EXECUTE sp_addextendedproperty N'MS_Description', N'菜单ID', N'user', N'dbo', N'table', N'TB4D_MENU', N'column', N'MENU_ID';

-----------------------------------------组织机构表-----------------------------------------
