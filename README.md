# API 开放平台

## 项目简介

API 开放平台是一个提供 API 接口供开发者调用的平台，基于 Spring Boot 后端 + React 前端的全栈微服务项目。

管理员可以接入并发布接口、统计分析各接口调用情况；用户可以注册登录并开通接口调用权限、浏览接口、在线调试，还能使用客户端 SDK 轻松在代码中调用接口。

## 技术架构

### 后端技术栈
- **Spring Boot** - 主框架
- **Nacos** - 服务注册与发现
- **Spring Cloud Gateway** - API 网关
- **MyBatis-Plus** - ORM 框架
- **MySQL** - 数据库

### 前端技术栈
- **React** - 前端框架
- **Ant Design** - UI 组件库

## 项目结构
apiOpenSystem/
  ├── api-gateway/ # API 网关
  │ └── 基于 Spring Cloud Gateway，使用 Nacos 作为注册中心，负责请求路由、流量分发
  │
  ├── client-sdk/ # 客户端 SDK
  │ └── 用户签名加密模块，用于验证用户身份信息是否正确
  │
  ├── forCustomer-interface/ # 接口验证模块
  │ └── 后台验证校验数字签名的正确性
  │
  ├── shushu-common/ # 公共模块
  │ └── 公共方法、工具类、实体类，供其他模块调用
  │
  ├── shushuapi/ # 前端项目
  │ └── 基于 React 开发的用户界面
  │
  └── springboot-init-api/ # 主程序模块
  └── 核心业务逻辑，负责数据库操作、接口管理等

## 核心功能

### 用户端
- 用户注册与登录
- 查看接口列表
- 在线调试接口
- 获取调用凭证
- 使用 SDK 快速集成

### 管理员端
- 接口管理（接入、发布、下线）
- 接口统计分析
- 用户权限管理
- 查看调用日志

## 快速开始

### 环境要求
- JDK 8+
- Maven 3.6+
- Node.js 14+
- MySQL 5.7+
- Nacos 2.0+

### 启动步骤

1. **启动 Nacos 注册中心**
```bash
# 下载并启动 Nacos
sh startup.sh -m standalone
启动后端服务
# 依次启动各个模块
# 1. springboot-init-api（主程序）
# 2. api-gateway（网关）
# 3. forCustomer-interface（验证模块）
启动前端
cd shushuapi
npm install
npm run dev
