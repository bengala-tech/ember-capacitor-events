import Controller from '@ember/controller';
import subscribe from 'ember-capacitor-events';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service capacitorEvents;

  constructor() {
    super(...arguments);
    window.cap = this.capacitorEvents;
    window.App = this;
  }

  @subscribe('capacitorEvents.batteryLow')
  onBatteryLow() {
    alert('batteryLow for application');
  }
}
