package com.shushu.springbootinit.service.impl.inner;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;


import com.common.model.entity.User;
import com.common.service.InnerUserService;
import com.shushu.springbootinit.common.ErrorCode;
import com.shushu.springbootinit.exception.BusinessException;
import com.shushu.springbootinit.mapper.UserMapper;

import org.apache.commons.lang3.StringUtils;
import org.apache.dubbo.config.annotation.DubboService;

import javax.annotation.Resource;

@DubboService
public class InnerUserServiceImpl implements InnerUserService {

    @Resource
    private UserMapper userMapper;

    @Override
    public User getInvokeUser(String accessKey ) {
        if(StringUtils.isAnyBlank(accessKey)){
            throw  new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("accessKey", accessKey);


        User user = userMapper.selectOne(queryWrapper);
        return user;
    }
}
