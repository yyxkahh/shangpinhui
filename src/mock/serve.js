//通过mockjs模块实现模拟数据
import Mock from "mockjs";
//模拟的数据需要引入进来
//webpack对于一些模块：图片、json文件默认对外暴露【虽然你没有书写但是它已经暴露了】
import banner from '@/mock/banner.json'
import floor from '@/mock/floor.json'

//通过Mock对象模拟出虚拟数据
//Mock依赖包对外暴露的是一个Mock对象，这个对象提供的一个mock方法可以模拟数据
//参数:第一个参数  模块数据将来axios请求的地址   第二个参数:获取到的数据
Mock.mock('/mock/banner', { code: 200, data: banner });
Mock.mock('/mock/floor', { code: 200, data: floor });