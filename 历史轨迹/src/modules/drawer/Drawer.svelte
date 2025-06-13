<script>
    import "./Drawer.scss"
    import { mixClass } from "../utils";
    import { createEventDispatcher } from "svelte";
    import { fade, slide } from "svelte/transition";

    let _class = undefined;
    let _ref = null;
    let _emit = createEventDispatcher();
    
    const _windowClick = ({ target }) => {
        if (
        open &&
        closeOnOutsideClick &&
        !_ref.contains(target)
        ) {
            open = false;
            _emit("closed");
        }
    };

    export {_class as class}
    export let direction = 'left';
    export let modal = true;
    export let open = false;
    export let closeOnOutsideClick = true;

    $: if(open) _emit('opened');
</script>
<svelte:window on:click={_windowClick} />
{#if open}
<div class="{mixClass('nf-drawer', _class, `direct-${direction}`)}" class:is-modal={modal} on:opened on:closed transition:fade>
    <div bind:this="{_ref}" class="nf-drawer-wrapper" transition:slide>
        <div>
            <slot name="header"/>
        </div>
        <div>
            <slot/>
        </div>
    </div>
</div>
{/if}