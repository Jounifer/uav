<script>
  import "./Collapse.scss"
  /**
   * @description Collapse
   * @param { Boolean } accordion 是否启用手风琴效果
   * @param { String } expand 用于指定展开项，对应CollapseItem中给定的name
   */
  import { mixClass } from "../utils";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  let _class = undefined;

  export { _class as class };
  export let accordion = false;
  export let expand = undefined;

  setContext("collapse", {
    accordion,
    expand,
    state: writable(0),
  });
</script>

<div class={mixClass("nf-collapse", _class)}>
  <slot />
</div>
