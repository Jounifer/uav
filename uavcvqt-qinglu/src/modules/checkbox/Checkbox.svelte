<script>
  import "./Checkbox.scss"
  /**
   * @component Checkbox
   * @param { Boolean } disabled 禁用多选框，默认false
   * @param { Boolean } checked 是否选中
   * @param { String  } text 多选框描述
   * @event: change
   *
   * @example
   *   disabled: <Checkbox disabled/>
   *   bind:     <Checkbox bind:checked={isChecked} />
   *   event:    <Checkbox on:change={({target}) => console.log(target.checked)}
   *   class:    <Checkbox class="my-checkbox"/>
   */

  import { mixClass } from "../utils";
  let _class = undefined;
  export let disabled = false;
  export let checked = false;
  export let text = "";
  export { _class as class };
</script>

<label class={mixClass("nf-checkbox", _class)} {disabled}>
  <input
    bind:checked
    on:change
    {disabled}
    class="nf-checkbox-box"
    type="checkbox"
  />
  <span class="nf-checkbox-text">{text}</span>
</label>
