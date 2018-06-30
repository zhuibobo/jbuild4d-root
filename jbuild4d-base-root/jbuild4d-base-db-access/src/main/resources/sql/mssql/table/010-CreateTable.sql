-----------------------------------------系统设置表-----------------------------------------
CREATE TABLE [dbo].[TB4D_SETTING] (
  [SETTING_ID]     [NVARCHAR](128) NOT NULL PRIMARY KEY,
  [SETTING_KEY]    [NVARCHAR](128) NULL,
  [SETTING_NAME]   [NVARCHAR](128) NULL,
  [SETTING_VALUE]  [NVARCHAR](500) NULL,
  [SETTING_STATUS] [NVARCHAR](10)  NULL DEFAULT '是',
  [DESCRIPTION]    [NVARCHAR](MAX) NULL,
  [CREATETIME]     [DATETIME]      NOT NULL,
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

-----------------------------------------组织机构表-----------------------------------------
