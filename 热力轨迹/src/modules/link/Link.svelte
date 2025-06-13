<script>
  import "./Link.scss"
  /**
   * @component Link
   * @param { String  } primary 类型
   * @param { String  } success 类型
   * @param { String  } info  类型
   * @param { String  } warning 类型
   * @param { String  } danger  类型
   * @param { String  } href 原生属性
   * @param { Boolean } disabled 禁用
   * @param { Boolean } underline 下划线
   *
   * @example
   *   type : <Link primary/> <Link success/> <Link warning underline/>
   */

  import { mixClass } from "../utils";

  let _class = undefined;

  export { _class as class };
  export let href = undefined;
  export let disabled = false;
  export let underline = false;
  export let primary = undefined;
  export let success = undefined;
  export let warning = undefined;
  export let danger = undefined;
  export let info = undefined;
</script>

<a
  {href}
  class={mixClass("nf-link", _class)}
  class:is-underline={underline}
  class:is-disabled={disabled}
  class:primary
  class:success
  class:warning
  class:danger
  class:info
  target="_blank"
>
  <slot />
</a>
