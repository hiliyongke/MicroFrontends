# 项目介绍

> 基于 qiankun 框架的前端微服务项目框架<br />

### 说明

项目子应用包含了 Vue3, Angular, React 三种框架,可以给擅长不同框架的开发者提供更多参考.<br />
微服务的运用可以实现多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略 <br />

## 源码结构

qiankunapp <br />
├─ app1 <br />
├─ app2 <br />
├─ app3 <br />
└─ appbase <br />

appbase:项目主应用,Vue3 + Typescript + antv + pinia + qiankun + rxjs<br />
app1:子应用,Vue3 + Typescript + antv + pinia + qiankun<br />
app2:子应用,Angular12 + Typescript + NgZorro<br />
app3:子应用,Angular13 + Typescript + NgZorro<br />
app4:子应用,React17 + Typescript + antd + craco<br />
app5:子应用,React17 + Typescript + antd + react-scripts<br />

## 如何运行

微服务理论上各个应用都是可以独立运行的. 在实际开发中为了方便, 我们也通常在独立运行的子应用上进行调试.<br />
为了能看到整体效果,需要将全部项目运行起来,并在主应用中进行访问.<br />
项目整体运行:<br /> 1.进入主应用 appbase,执行:npm run serve / npm start<br /> 2.分别在各子应用 app1-app5 下执行:npm run serve:single-spa<br /> 3.全部启动成功后, 访问主应用地址:http://localhost:8080<br />

## 如何部署

各工程按类别整体划分为主应用(一个)与子应用(多个)两种,均可按照常规方式进行独立部署.<br />

### 问题反馈

如果你有任何问题和建议，请在 issues 里面指出，我们将根据 bug 情况不定期的发布迭代版本。<br />
