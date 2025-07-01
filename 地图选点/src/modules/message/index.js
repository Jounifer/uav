import Message from "./Message.svelte";
import "./Message.scss";

const className = "nf-message-container";

function setParent() {
  const p = document.createElement("div");
  p.className = className;
  p.id = className;
  document.body.appendChild(p);
}

export default function create(props) {
  const _parent = document.getElementById(className);
  if (!!_parent) {
    const msg = new Message({ target: _parent, props });
    msg.$on("close", () => msg.$destroy());
    return msg;
  } else {
    setParent();
    return create(props);
  }
}
