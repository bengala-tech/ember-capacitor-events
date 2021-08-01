import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TryGlimmerComponent extends Component {
  @service capacitorEvents;

  constructor() {
    super(...arguments);

    this.capacitorEvents.on('batteryLow', this, 'batteryLow');
  }

  batteryLow() {
    alert('batteryLow glimmer');
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.capacitorEvents.off('batteryLow', this, 'batteryLow');
  }
}
