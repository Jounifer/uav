<script>
  import "./TextInput.scss"
  /**
   * @component TextInput
   * @param { String  }  type text/number/date等原生属性值
   * @param { Boolean }  mini 尺寸：最小
   * @param { Boolean }  small 尺寸：小
   * @param { Boolean }  medium 尺寸：中
   * @param { String  }  prefix 输入框前置
   * @param { String  }  suffix 输入框后置
   * @param { String  }  placeholder
   * @param { Boolean }  disabled 禁用
   * @param { Booleab }  autofocus 自动获得焦点
   * @param { Boolean }  readonly  只读
   * @param { String  }  value
   * @param { Number  }  min type=number时，输入的最小数值,
   * @param { Number  }  max type=number时，输入的最大数值,
   * @param { Number  }  minLen type=text时为输入字符的最小长度
   * @param { Number  }  maxLen type=text时为出入字符的最长长度
   * @event: focus
   * @event: blur
   * @event: change
   * @event: input
   *
   * @example
   *   size:   <TextInput mini/> <TextInput small/> <TextInput medium/>
   *   length: [0-9]: <TextInput type="number" min="0" max="9"/>, <TextInput type="text" minLen="0" maxLen="9"/> value.length >= 0 && value.length <= 9
   *   event:  <TextInput on:focus={handleFocus} on:input={handleInput}/>
   */

  // import { onMount } from 'svelte' throw error
  import { onMount, getContext } from "svelte/internal";
  import { mixClass } from "../utils";

  let _class = "";
  let _input = null;
  let focus = false;

  export let type = "text";
  export let mini = false;
  export let small = false;
  export let medium = false;
  export let prefix = undefined;
  export let suffix = undefined;
  export let placeholder = undefined;
  export let disabled = false;
  export let autofocus = false;
  export let required = false;
  export let readonly = false;
  export let value;
  export let min = undefined;
  export let max = undefined;
  export let minLen = undefined;
  export let maxLen = undefined;
  export { _class as class };

  const ctx = getContext("__form");
  const item = getContext("__form_item");

  const _onBlur = () => (focus = false);

  const _onFocus = () => (focus = true);

  const size = {
    mini: () => (mini = true),
    small: () => (small = true),
    medium: () => (medium = true),
  };

  const _init = () => {
    if (!!ctx) {
      required = item.required;
      if (!!ctx.size) {
        size[ctx.size]();
      }
    }
  };

  const _handleBlur = () => {
    if (ctx && item && item.required) {
      ctx.validator(item.prop);
    }
  };

  _init();
  onMount(() => {
    _input.type = type;
    if (autofocus) {
      _input.focus();
    }
  });
</script>

<div class={mixClass("nf-textinput", _class)} {disabled} {focus}>
  <span class="nf-textinput-prefix">
    {#if prefix}
      <i class={prefix} />
    {:else}
      <slot name="prefix" />
    {/if}
  </span>
  <input
    {min}
    {max}
    minlength={minLen}
    maxlength={maxLen}
    {placeholder}
    {disabled}
    {required}
    {readonly}
    class:mini
    class:small
    class:medium
    bind:value
    bind:this={_input}
    on:focus={_onFocus}
    on:blur={_onBlur}
    on:blur={_handleBlur}
    on:focus
    on:blur
    on:change
    on:input
    class="nf-textinput-input"
  />

  <span class="nf-textinput-suffix">
    {#if suffix}
      <i class={suffix} />
    {:else}
      <slot name="suffix" />
    {/if}
  </span>
</div>
