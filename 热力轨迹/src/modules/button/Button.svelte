<script>
  import "./Button.scss"
  /**
   * @component Button
   * @param { String  } mini  size
   * @param { String  } small  size
   * @param { String  } medium size
   * @param { String  } primary 类型
   * @param { String  } success 类型
   * @param { String  } info  类型
   * @param { String  } warning 类型
   * @param { String  } danger  类型
   * @param { Boolean } plain 特殊类型
   * @param { Boolean } round 圆角
   * @param { Boolean } circle 圆形
   * @param { Boolean } disabled 禁用
   * @event: click
   * @event: mouseover
   * @event: mouseenter
   * @event: mouseleave
   *
   * @example
   *   size: <Button mini/> <Button small/> <Button medium/>
   *   rect: <Button round/> <Button circle/>
   *   type: <Button primary/> <Button success/> <Button plain warning/>
   *   mix : <Button mini primary round plain/>
   */

  import { mixClass } from "../utils";

  let _class = undefined;
  export { _class as class };
  export let mini = undefined;
  export let small = undefined;
  export let medium = undefined;
  export let primary = undefined;
  export let success = undefined;
  export let info = undefined;
  export let warning = undefined;
  export let danger = undefined;
  export let plain = undefined;
  export let round = undefined;
  export let circle = undefined;
  export let disabled = false;
</script>

<button
  class:mini
  class:small
  class:medium
  class:primary
  class:success
  class:info
  class:warning
  class:danger
  class:round
  class:circle
  class:plain
  {disabled}
  on:click|stopPropagation
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:focus
  class={mixClass("nf-button", _class)}
  type="button"
>
  <slot />
</button>
