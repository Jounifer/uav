<script>
  import "./Tag.scss"
  /**
   * @component Tag
   * @param { Boolean } hidden 是否隐藏，默认false
   * @param { String  } primary 类型
   * @param { String  } success 类型
   * @param { String  } info  类型
   * @param { String  } warning 类型
   * @param { String  } danger  类型
   * @param { String  } dark 主题
   * @param { String  } light 主题
   * @param { String  } mini size
   * @param { String  } small size
   * @param { String  } medium size
   *
   * @example
   *   type : <Tag primary/> <Tag success/> <Tag warning/>
   *   theme: <Tag hidden dark/>
   *   size : <Tag mini/> <Tag small/> <Tag medium/>
   */

  import { mixClass } from "../utils";

  let _class = undefined;

  export { _class as class };
  export let hidden = false;
  export let primary = undefined;
  export let success = undefined;
  export let info = undefined;
  export let warning = undefined;
  export let danger = undefined;
  export let dark = undefined;
  export let light = undefined;
  export let mini = undefined;
  export let small = undefined;
  export let medium = undefined;
</script>

{#if !hidden}
  <span
    class:primary
    class:success
    class:info
    class:warning
    class:danger
    class:dark
    class:light
    class:mini
    class:small
    class:medium
    class={mixClass("nf-tag", _class)}
  >
    <slot />
  </span>
{/if}
