import { uniqueId } from "lodash-es";

export type Noop = () => void;

const id_map_event = new Map<string, Noop>();

const event_map_id = new WeakMap<Noop, string>();

const type_map_id_set = new Map<string, Set<string>>();

// TODO: 可以考虑定时校准事件。

export function create_event_callback(type: string) {
  function get_event_id() {
    return uniqueId(type)
  }

  function add(event: Noop) {
    const event_id = get_event_id();
    id_map_event.set(event_id, event);
    event_map_id.set(event, event_id);

    const event_id_set = type_map_id_set.get(type) || new Set();
    event_id_set.add(event_id);
    type_map_id_set.set(type, event_id_set)
  }

  function remove(event: Noop) {
    const event_id = event_map_id.get(event);
    if (!event_id) return;

    id_map_event.delete(event_id);
    event_map_id.delete(event);

    const event_id_set = type_map_id_set.get(type) || new Set();
    event_id_set.delete(event_id);
    type_map_id_set.set(type, event_id_set)
  }

  function run() {
    const id_set = type_map_id_set.get(type) || new Set();
    id_set.forEach(event_id => {
      const event = id_map_event.get(event_id);
      event?.();
    })
  }

  function destory() {
    const id_set = type_map_id_set.get(type) || new Set();

    id_set.forEach(event_id => {
      const event = id_map_event.get(event_id);
      if (!event) return;

      event_map_id.delete(event);
      id_map_event.delete(event_id);
    })


    type_map_id_set.delete(type);
  }

  return { add, remove, destory, run }
}