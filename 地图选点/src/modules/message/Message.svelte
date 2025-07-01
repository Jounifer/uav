<script>
  import { mixClass } from "../utils";
  import { onMount, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  let _class = undefined;
  let visible = true;
  const _emit = createEventDispatcher();

  export { _class as class };
  export let content = "";
  export let timeout = 5000;
  export let type = "info";
  export let onClose = () => {};

  function _timeoutClose() {
    setTimeout(() => {
      visible = false;
      onClose();
      _emit("close");
    }, timeout);
  }
  onMount(() => _timeoutClose());
</script>

{#if visible}
  <div
    class={mixClass("nf-message", _class, type)}
    transition:fade={{ duration: 300 }}
  >
    <slot>{content}</slot>
  </div>
{/if}

<!-- <style lang="scss" src="./Message.scss"></style> -->
