<script>
  import { mixClass } from "../utils";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { checkModel, check } from "./validator";

  let _class = undefined;
  const state = writable(undefined);

  export { _class as class };
  export let size = "";
  export let labelWidth = "auto";
  export let align = "right";
  export let inline = false;
  export let model = {};
  export let rules = {};

  setContext("__form", {
    size,
    labelWidth,
    align,
    inline,
    model,
    rules,
    state,
    validator(prop) {
      state.set({ prop, text: check(rules[prop], model[prop]) });
    },
  });

  export const validator = () => checkModel(model, rules, state);
</script>

<div class={mixClass("nf-form", _class)}>
  <slot />
</div>
