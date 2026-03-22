package com.shushu.springbootinit.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.common.model.entity.InterfaceInfo;


/**
* @author 86175
* @description 针对表【interface_info(接口信息)】的数据库操作Service
* @createDate 2025-11-21 22:41:11
*/
public interface InterfaceInfoService extends IService<InterfaceInfo> {
    void validInterfaceInfo(InterfaceInfo interfaceInfo, boolean add);
}
