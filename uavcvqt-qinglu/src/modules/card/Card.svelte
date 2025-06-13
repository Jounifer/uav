<script>
  import "./Card.scss"
  /**
   * @component Card
   * @param { String  } title 标题
   * @param { String  } shadow 背景阴影,always/hover/never
   * @param { String  } content 内容
   *
   * @example
   *   title : <Card title="card title"/> <Card><div slot="header">card title</div></Card>
   *   shadow: <Card shadow="hover" /> <Card shadow="never" />
   *   content: <Card content="content" /> <Card content="<span>content</span>" /> <Card>content</Card>
   */
  import { mixClass, isHTML } from "../utils";

  let _class = undefined;

  export { _class as class };
  export let title = "";
  export let content = "";
  export let shadow = "always";
</script>

<div class={mixClass("nf-card", _class, `is-shadow-${shadow}`)}>
  <div class="nf-card-header">
    <slot name="header">{title}</slot>
  </div>
  <div class="nf-card-content">
    <slot>
      {#if isHTML(content)}
        {@html content}
      {:else}
        {content}
      {/if}
    </slot>
  </div>
</div>
