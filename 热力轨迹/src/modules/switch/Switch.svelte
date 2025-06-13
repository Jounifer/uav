<script>
  import "./Switch.scss"
  /**
   * @component Switch
   * @param { Boolean } checked 开关状态，开：true, 关：false
   * @param { Boolean } disabled 禁用状态,， 默认false
   * @param { String  } activate 开状态描述
   * @param { String  } inactive 关状态描述
   * @event: change
   *
   * @example
   *   disabled: <Switch disabled/>
   *   activate: <Switch activate="开" inactive="关" bind:checked={isOnOrOff}/>
   *   event:    <Switch on:change={({target}) => console.log(target.checked)}
   */

  import { mixClass } from "../utils";
  export let checked = false;
  export let disabled = false;
  export let activate = "";
  export let inactive = "";
  let _class = "";
  export { _class as class };
</script>

<label class={mixClass("nf-switch", _class)} {disabled}>
  <span
    class={mixClass("nf-switch-text", inactive ? "nf-switch-inactived" : "")}
    >{inactive}</span
  >
  <input
    bind:checked
    on:change
    {disabled}
    type="checkbox"
    class="nf-switch-checkbox"
  />
  <span class={mixClass("nf-switch-text", activate ? "nf-switch-actived" : "")}
    >{activate}</span
  >
</label>
