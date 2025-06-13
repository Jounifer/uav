<script>
  import "./FormItem.scss"
  import { mixClass } from "../utils";
  import { getContext, setContext, onDestroy } from "svelte";

  let _class = undefined;

  export { _class as class };
  export let required = false;
  export let label = "";
  export let prop = "";

  let tipText = "";

  setContext("__form_item", {
    prop,
    required,
  });

  const ctx = getContext("__form");

  const unsubscribe = ctx.state.subscribe((data) => {
    if (ctx && data) {
      if (data.prop === prop) {
        tipText = data.text;
      }
    }
  });

  $: style = `width: ${ctx.labelWidth}`;

  onDestroy(() => unsubscribe());
</script>

<div
  class={mixClass(
    "nf-form-item",
    `is-align-${ctx.align}`,
    `is-${ctx.inline ? "inline" : "block"}`,
    _class
  )}
>
  <span class="nf-form-item-label" class:is-required={required} {style}>
    {label}
  </span>
  <div class="nf-form-item-content">
    <slot />
    <span class="nf-form-item-tip" title={tipText}>{tipText}</span>
  </div>
</div>
