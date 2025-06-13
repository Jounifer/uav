<script>
  import "./Popover.scss"
  import { mixClass } from "../utils";
  import { beforeUpdate } from "svelte";
  import { fade } from "svelte/transition";
  import { debounce } from "debounce";

  let _class = undefined;
  let _parent = null;
  let _content = null;

  const _gap = 10;
  const setOrientation = () => {
    if (_parent && _content) {
      props.style = calculater[orientation](
        _parent.getBoundingClientRect(),
        _content.getBoundingClientRect()
      );
    }
  };

  const _windowClick = ({ target }) => {
    if (visible && !!_content) {
      visible = target.contains(_content) && _content.contains(target);
    }
  };

  const calculater = {
    left: (p, c) =>
      `left:${p.left - c.width - _gap}px;top:${
        p.top + (p.height - c.height) / 2
      }px;`,
    right: (p, c) =>
      `left:${p.left + p.width + _gap}px;top:${
        p.top + (p.height - c.height) / 2
      }px;`,
    top: (p, c) =>
      `left:${p.left + (p.width - c.width) / 2}px;top:${
        p.top - c.height - _gap
      }px;`,
    bottom: (p, c) =>
      `left:${p.left + (p.width - c.width) / 2}px;top:${
        p.top + p.height + _gap
      }px;`,
    "top-left": (p, c) =>
      `left:${p.left - p.width / 2}px;top:${p.top - c.height - _gap}px;`,
    "top-right": (p, c) =>
      `left:${p.left + p.width / 2}px;top:${p.top - c.height - _gap}px;`,
    "bottom-left": (p, c) =>
      `left:${p.left - p.width / 2}px;top:${p.top + p.height + _gap}px;`,
    "bottom-right": (p, c) =>
      `left:${p.left + p.width / 2}px;top:${p.top + p.height + _gap}px;`,
  };

  $: props = {
    class: mixClass("nf-popover-content", orientation),
  };

  export { _class as class };
  export let visible = false;
  export let orientation = "left";
  export let content = null;
  export let title = "";

  beforeUpdate(() => setOrientation());
</script>

<svelte:window
  on:scroll={debounce(setOrientation, 200)}
  on:click={_windowClick}
/>

<div bind:this={_parent} class={mixClass("nf-popover", _class)}>
  <slot />
  {#if visible}
    <div bind:this={_content} {...props} transition:fade={{ duration: 300 }}>
      <div class="nf-popover-header">
        <slot name="header">{title}</slot>
      </div>
      <slot name="content">{content}</slot>
    </div>
  {/if}
</div>
