import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export function callbackWrapper(event, callback, bubbles) {
  if (event.cancelBubble !== true) {
    let shouldBubble = callback(event);

    if (shouldBubble === false || bubbles === false) {
      event.cancelBubble = true;
    }

    return shouldBubble;
  }
}

export default class OnCapacitorHelper extends Helper {
  @service capacitorEvents;

  @action
  doFn(event) {
    return callbackWrapper(event, this.fn, this.bubbles);
  }

  compute([event, fn], { bubbles = true }) {
    this.fn = fn;
    this.event = event;
    this.bubbles = bubbles;
    this.capacitorEvents.on(event, this, this.doFn);
  }

  willDestroy() {
    if (this.fn && this.event) {
      this.capacitorEvents.off(this.event, this, this.doFn);
    }
    super.willDestroy();
  }
}
