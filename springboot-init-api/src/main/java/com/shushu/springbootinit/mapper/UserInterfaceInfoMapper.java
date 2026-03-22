package com.shushu.springbootinit.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.common.model.entity.UserInterfaceInfo;

import javax.annotation.Resource;
import java.util.List;


/**
* @author 86175
* @description 针对表【user_interface_info(用户调用接口关系)】的数据库操作Mapper
* @createDate 2026-03-10 18:33:17
* @Entity generator.domain.UserInterfaceInfo
*/
public interface UserInterfaceInfoMapper extends BaseMapper<UserInterfaceInfo> {

    /**
     * 获取调用次数最多的接口信息列表
     * @param limit 限制返回的记录数量
     * @return 返回调用次数最多的接口信息列表，列表中的元素为UserInterfaceInfo类型
     */
    List<UserInterfaceInfo> listTopInvokeInterfaceInfo(int limit);
}




