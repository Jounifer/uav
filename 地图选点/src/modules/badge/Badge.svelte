<script>
  import "./Badge.scss"
  /**
   * @component Badge
   * @param { String  } primary 类型
   * @param { String  } success 类型
   * @param { String  } info  类型
   * @param { String  } warning 类型
   * @param { String  } danger  类型
   * @param { Boolean } hidden 是否隐藏，默认false
   *
   * @example
   *   type: <Badge primary/> <Badge success/> <Badge warning/>
   *   text : <Badge text="badge" hidden/>
   */

  import { mixClass } from "../utils";

  let _class = undefined;
  export { _class as class };
  export let text = undefined;
  export let primary = true;
  export let success = undefined;
  export let info = undefined;
  export let warning = undefined;
  export let danger = undefined;
  export let hidden = false;
</script>

<div class={mixClass("nf-badge", _class)}>
  <slot />
  {#if !hidden}
    <span
      class:primary
      class:success
      class:info
      class:warning
      class:danger
      class="nf-badge-sub"
    >
      {text}
    </span>
  {/if}
</div>
