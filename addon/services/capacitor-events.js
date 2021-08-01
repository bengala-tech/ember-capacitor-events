import Service from '@ember/service';
import { assert } from '@ember/debug';
import { isBlank } from '@ember/utils';
import Evented from '@ember/object/evented';

export default class CapacitorEventsService extends Service.extend(Evented) {
  _registeredPlugins = null;
  _plugins = null;

  willDestroy() {
    this._teardownListeners();
    super.willDestroy(...arguments);
  }

  loadPlugins(plugins) {
    this._plugins = plugins;
    return this;
  }

  setupListeners() {
    let registeredPlugins = [];
    let plugins = this._plugins;

    assert(
      'plugins have already been set up',
      isBlank(this._registeredPlugins)
    );

    plugins.forEach((pluginObj) => {
      let { plugin: Plugin, events } = pluginObj;

      registeredPlugins.push(Plugin);
      events.forEach((name) => {
        const listener = {
          name,
          method: (e) => {
            this.trigger(name, e);
          },
        };
        Plugin.addListener(listener.name, listener.method);
      });
    });

    this._registeredPlugins = registeredPlugins;
  }

  _teardownListeners() {
    this._registeredPlugins.forEach((Plugin) => {
      Plugin.removeAllListeners();
    });
    this._registeredPlugins = null;
  }
}
