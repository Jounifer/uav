<script>
  import { mixClass, isHTML } from "../utils";
  import { onMount, createEventDispatcher } from "svelte";

  let _class = undefined;
  let visible = true;
  let timeId = null;
  const _emit = createEventDispatcher();

  const _timeoutClose = () => {
    if (autoClose) {
      timeId = setTimeout(() => {
        visible = false;
        onClose();
        _emit("close");
      }, timeout);
    }
  };

  const _close = () => {
    clearTimeout(timeId);
    timeId = null;
    visible = false;
    onClose();
    _emit("close");
  };

  export { _class as class };
  export let timeout = 5000;
  export let title = "";
  export let content = "";
  export let autoClose = true;
  export let onClose = () => {};

  onMount(() => _timeoutClose());
</script>

{#if visible}
  <div class={mixClass("nf-notification", _class)}>
    <div class="nf-notification-header">
      <slot name="header">{title}</slot>
      <span class="nf-notification-exit" on:click={_close} />
    </div>
    <div class="nf-notification-content">
      <slot name="content">
        {#if isHTML(content)}
          {@html content}
        {:else}
          {content}
        {/if}
      </slot>
    </div>
  </div>
{/if}
