# ember-capacitor-events

This is a wrapper around capacitor events, heavely based on [ember-cordova-events](http://corber.io/pages/addons/events.html).

## Compatibility

- Ember.js v3.16 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

## Installation

```
ember install ember-capacitor-events
```

## Usage

First off, since Capacitor handle events from various npm packages/plugins, `@capacitor/app` or `@capacitor/network` for example,
we need to configure the capacitorEvents service to listen for them, you must install these packages as you see fit.

```ts
import Route from '@ember/route';
import { inject as service } from '@ember/service';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';

export default class ApplicationRoute extends Route {
  @service capacitorEvents;

  beforeModel() {
    this.capacitorEvents
      .loadPlugins([
        {
          plugin: App,
          events: ['backButton'], //The events you want to lisent from this particular Plugin
        },
        {
          plugin: Network,
          events: ['networkStatus'],
        },
      ])
      .setupListeners();
  }
}
```

For Ember objects, you can use `@subscribe` decorator, it will add the listeners after `init`
and tear them when the object is destroyed via destroyables api.

```ts
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import subscribe from 'ember-capacitor-events';

export default class ApplicationController extends Controller {
  @service capacitorEvents;

  @subscribe('capacitorEvents.backButton')
  onBackButton() {
    console.log('do something with back button');
  }
}
```

For any other class, you should manage the subscription yourself.

```ts
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TryGlimmerComponent extends Component {
  @service capacitorEvents;

  constructor() {
    super(...arguments);

    this.capacitorEvents.on('backButton', this, 'backButton');
  }

  backButton() {
    alert('backButton glimmer');
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.capacitorEvents.off('backButton', this, 'backButton');
  }
}
```

## `{{on-capacitor}}` helper

Use `{{on-capacitor}}` when you want easy lifecycle on/off using templates.

```ts
type EventName = string;
type Hook = () => void | boolean;

interface OnCapacitorHelperArgs {
  positional?: [EventName, Hook]
  named?: { bubbles?: boolean }
}
```

You can optionally pass `bubbles=false` and previous helper invocations listening for the same event won't be called. 

You must ignore and/or set `event.cancelBubble` manually for other usages as `@subscribe` or direct usage with `this.capacitorEvents.on`, a practical use case for this could be modals on top of modals, or tabs without changing routes.

```hbs
 {{on-capacitor "backButton" this.back}} //Won't be called since previous bubbles false
 {{on-capacitor "backButton" this.back bubbles=false}} Second
 {{on-capacitor "backButton" this.back}} //Will be called first
```

## Note on backButton event

When you add a `backButton` listener Capacitor assumes you want to handle all of `backButton` events yourself (normal Capacitor behavior is to do history.back() or close the app if there's no history), in order to keep this behavior, you can add the following code to your application route

```ts
import { App } from '@capacitor/app';
import subscribe from 'ember-capacitor-events';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service capacitorEvents;
  
  beforeModel() {
    this.capacitorEvents
      .loadPlugins([
        {
          plugin: App,
          events: ['backButton']
        }
      ])
      .setupListeners();
  }
  
  @subscribe('capacitorEvents.backButton')
  onBackButton(event) {
    if (event.cancelBubble === true) {
      return;
    }

    if (event.canGoBack) { //Capacitor will add canGoBack if there's history
      history.back();
    } else {
      App.exitApp();
    }
  }
}

```

This would return the normal Capacitor behaivor of closing the app if there's no more history

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
