class ReactiveEffect {
  private _fn: any

  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}

const targetMap = new Map()
// 收集依赖
export function track(target, key) {
  let depsMap = targetMap.get(target)
  // 初始化时候并没有 depsMap ，需要进行一个判断
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

// 触发依赖
export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for (const effect of dep) {
    effect.run()
  }
}

let activeEffect
export function effect(fn) {
  // 一上来需要先调用这个 fn
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
