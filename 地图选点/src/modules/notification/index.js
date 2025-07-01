import Notification from "./Notification.svelte";
import "./Notification.scss";

const className = "nf-notification-container";

function setParent() {
  const p = document.createElement("div");
  p.className = className;
  p.id = className;
  document.body.appendChild(p);
}

export default function create(props) {
  const _parent = document.getElementById(className);
  if (!!_parent) {
    const notify = new Notification({ target: _parent, props });
    notify.$on("close", () => notify.$destroy());
    return notify;
  } else {
    setParent();
    return create(props);
  }
}
