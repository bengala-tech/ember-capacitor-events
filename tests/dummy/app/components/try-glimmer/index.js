import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TryGlimmerComponent extends Component {
  @service capacitorEvents;
  @tracked something = false;

  constructor() {
    super(...arguments);
    console.log(this.args.name, this.event);
    this.capacitorEvents.on(this.event, this, 'batteryLow');
  }

  get event() {
    return this.args.event || 'batteryLow';
  }

  batteryLow = () => {
    alert(`batteryLow glimmer ${this.args.name}`);
  };

  willDestroy() {
    super.willDestroy(...arguments);
    this.capacitorEvents.off(this.event, this, 'batteryLow');
  }

  setSomething = (val) => {
    this.something = val;
  };

  modifierCalled = (s) => {
    alert(`modifier called ${s}`);
  };
}
