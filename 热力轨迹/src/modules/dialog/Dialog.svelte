<script>
  import "./Dialog.scss"
  /**
   * @component Dialog
   * @param { String  } mask 是否启用遮罩层
   * @param { Boolean } open 打开/关闭对话框
   * @param { Boolean } acceptButton 是否显示确认按钮，默认false
   * @param { Boolean } cancelButton 是否显示取消按钮，默认false
   * @param { String  } acceptText 确认按钮显示文本
   * @param { String  } cancelText 取消按钮显示文本
   * @param { String  } content
   * @param { Boolean } closeOnOutsideClick 点击对话框外关闭按钮，默认false
   * @event: accepted
   * @event: cancel
   * @event: close
   * @example
   *   mask: <Dialog mask closeOnOutsideClick/>
   *   slot: <Dialog mask closeOnOutsideClick><div name="header"></div><div slot="footer"></div></Dialog>
   *   text: <Dialog mask closeOnOutsideClick acceptButton acceptText="发送"/>
   */

  import { mixClass, isHTML } from "../utils";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import Button from "../button/Button.svelte";

  let _class = undefined;
  let _ref = null;
  let _emit = createEventDispatcher();

  export let mask = undefined;
  export let open = false;
  export let acceptButton = false;
  export let cancelButton = false;
  export let acceptText = "确定";
  export let cancelText = "取消";
  export let content = "";
  export let closeOnOutsideClick = false;
  export { _class as class };

  const _windowClick = ({ target }) => {
    if (
      open &&
      closeOnOutsideClick &&
      !target.contains(_ref) &&
      !_ref.contains(target)
    ) {
      _emit("close");
      open = false;
    }
  };

  const _close = () => {
    _emit("close");
    open = false;
  };
  const _accepted = () => {
    _emit("accepted");
    _close();
  };
  const _cancel = () => {
    _emit("cancel");
    _close();
  };
</script>

<svelte:window on:click={_windowClick} />

<div
  class={mixClass("nf-dialog", _class)}
  class:is-mask={mask}
  class:is-open={open}
  transition:fade={{ duration: 300 }}
/>

{#if open}
  <div
    bind:this={_ref}
    class="nf-dialog-wrapper"
    on:accepted
    on:cancel
    on:close
    transition:fade={{ duration: 300 }}
  >
    <div class="nf-dialog-header">
      <slot name="header">
        <span class="nf-dialog-title">标题</span>
      </slot>
      <span class="nf-dialog-exit" on:click={_close} />
    </div>
    <div class="nf-dialog-main">
      <slot>
        {#if isHTML(content)}
          {@html content}
        {:else}
          {content}
        {/if}
      </slot>
    </div>
    <div class="nf-dialog-footer">
      <slot name="footer">
        {#if acceptButton}
          <Button class="nf-dialog-accept" small primary on:click={_accepted}
            >{acceptText}</Button
          >
        {/if}
        {#if cancelButton}
          <span class="nf-dialog-gap" />
          <Button class="nf-dialog-cancel" small on:click={_cancel}
            >{cancelText}</Button
          >
        {/if}
      </slot>
    </div>
  </div>
{/if}
