/*
  Proxy 
    对象用于创建一个对象的代理
    从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）
  语法
    const p = new Proxy(target, handler)
    
  参数
    target：要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
    handler：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。
*/

/**
 * Reflect
 *   是一个内置的对象，它提供拦截 JavaScript 操作的方法
 */

import { track, trigger } from './effect'

export function reactive(raw) {
  return new Proxy(raw, {
    /*
    target:指向的是当前的对象
    key:获取用户访问到的键 
    */
    get(target, key) {
      // 通过调用 Reflect.get 获取到值并且返回
      const res = Reflect.get(target, key)
      // TODO 依赖收集
      track(target, key)
      return res
    },

    set(target, key, value) {
      const res = Reflect.set(target, key, value)

      // 触发依赖
      trigger(target, key)
      return res
    },
  })
}
