<script>
  import "./Divider.scss"
  /**
   * @component Divider
   * @param { String  } left 位置
   * @param { String  } right 位置
   * @param { String  } center  位置
   * @param { String  } vertical  方向
   *
   * @example
   *   type : <Divider left/>
   */
  import { mixClass } from "../utils";

  let _class = undefined;

  export { _class as class };
  export let left = undefined;
  export let right = undefined;
  export let center = undefined;
  export let vertical = false;
</script>

{#if !vertical}
  <div
    class={mixClass("nf-divider", _class)}
    class:is-left={left}
    class:is-right={right}
    class:is-center={center}
    class:is-horizontal={!vertical}
  >
    {#if left || right || center}
      <span class="nf-divider-left" />
      <span class="nf-divider-text"><slot /></span>
      <span class="nf-divider-right" />
    {:else}
      <span class="nf-divider-inner" />
    {/if}
  </div>
{:else}
  <span class={mixClass("nf-divider", _class)} class:is-vertical={vertical} />
{/if}
