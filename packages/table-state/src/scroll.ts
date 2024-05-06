import { create_event_callback, type Noop } from "./callback";

export class Scroll {
  left = 0;

  top = 0;

  callbacks = create_event_callback("scroll");

  add_callback(event: Noop) {
    this.callbacks.add(event);
  }

  remove_callback(event: Noop) {
    this.callbacks.remove(event);
  }

  run_callback() {
    this.callbacks.run();
  }

  destory() {
    this.callbacks.destory();
  }
}