<script>
  import "./ToolTip.scss"
  /**
   * @component ToolTip
   * @param { String  } content 提示内容
   * @param { String  } pos 显示位置，left/right/top/bottom/top-left/top-right/bottom-left/bottom-right，默认left
   * @example
   *   content: <ToolTip content="content text"><Button>button tips</Button></ToolTip>
   *   slot: <ToolTip ><Button>button tips</Button><div slot="content">content text</div></ToolTip>
   */

  import { mixClass } from "../utils";
  import { beforeUpdate } from "svelte/internal";
  import { fade } from "svelte/transition";
  import { debounce } from "debounce";

  let _class = undefined;

  export { _class as class };
  export let content = undefined;
  export let pos = "left";

  let _ele = null;
  let _tip = null;
  let hidden = true;

  const _setTooltip = () => {
    if (_ele && _tip) {
      const p = _ele.getBoundingClientRect();
      const c = _tip.getBoundingClientRect();
      toolProps.style = calculater[pos](p, c);
    }
  };

  const _gap = 10;

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

  beforeUpdate(() => _setTooltip());

  $: toolProps = {
    class: mixClass("nf-tooltip-detail", pos),
  };
</script>

<svelte:window on:scroll={debounce(_setTooltip, 200)} />
<div
  bind:this={_ele}
  class={mixClass("nf-tooltip", _class)}
  on:mouseenter={() => (hidden = false)}
  on:mouseleave={() => (hidden = true)}
>
  <slot />
  {#if !hidden}
    <div bind:this={_tip} {...toolProps} transition:fade={{ duration: 300 }}>
      {#if content}
        {content}
      {:else}
        <slot name="content" />
      {/if}
    </div>
  {/if}
</div>
