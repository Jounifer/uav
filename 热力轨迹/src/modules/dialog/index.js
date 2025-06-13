import Dialog from "./Dialog.svelte";

export default function dialog(props) {
  const dialog = new Dialog({
    target: document.body,
    props: { open: true, ...props },
  });

  dialog.$on("close", () => dialog.$destroy());

  return dialog;
}
