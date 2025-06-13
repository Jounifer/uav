<script>
  import "./CollapseItem.scss"
  /**
   * @description CollapseItem
   * @param { String } name 用于指定展开项
   */
  import { mixClass, isString } from "../utils";
  import { getContext, onDestroy, onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { get } from "svelte/store";

  let _class = undefined;
  let contentVisible = false;
  let _id = 0;
  const ctx = getContext("collapse");
  const unsubscribe = ctx.state.subscribe((value) => {
    if (value !== _id) {
      contentVisible = false;
    }
  });
  _id = get(ctx.state);
  ctx.state.set(_id + 1);

  export { _class as class };
  export let name = undefined;

  const _init = () => {
    if (isString(ctx.expand)) {
      contentVisible = ctx.expand === name;
    } else {
      console.error("Collapse: the property of expand should be a string!");
    }
  };

  const clickHandler = () => {
    contentVisible = !contentVisible;
    if (ctx.accordion) {
      ctx.state.set(_id);
    }
  };

  onMount(() => _init());
  onDestroy(() => unsubscribe());
</script>

<div class={mixClass("nf-collapse-item", _class)} {_id}>
  <div class="nf-collapse-item-title" on:click={clickHandler}>
    <slot name="title">title</slot>
    <span
      class={mixClass(
        "nf-collapse-expand",
        "is-expand-" + (contentVisible ? "open" : "close")
      )}
    />
  </div>
  {#if contentVisible}
    <div
      class="nf-collapse-item-content"
      transition:slide|local={{ duration: 300, easing: quintOut }}
    >
      <slot>body</slot>
    </div>
  {/if}
</div>
