import { assert } from '@ember/debug';
import { isPresent, isBlank } from '@ember/utils';
import { addListener, removeListener } from '@ember/object/events';
import { registerDestructor } from '@ember/destroyable';
import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject, { get } from '@ember/object';

export default decoratorWithRequiredParams((target, key, desc, params) => {
  let _listener = null;
  let path = params[0];
  let [service, event, err] = path.split('.');
  let isValidPath = isPresent(service) && isPresent(event) && isBlank(err);
  let actualFn = desc.value;

  assert(
    `'subscribe()' expects a path with exactly one leaf, was given ${path}`,
    isValidPath
  );

  assert(
    'The @subscribe decorator must be applied to functions',
    actualFn && typeof actualFn === 'function'
  );

  assert(
    'The @subscribe decorator can only be used on EmberObjects',
    target instanceof EmberObject
  );

  let computedFn = function () {
    if (isBlank(get(this, service)) || isPresent(_listener)) {
      return;
    }

    registerDestructor(this, () => {
      get(this, service).off(event, _listener);
      removeListener(this, 'init', null, key);
      _listener = null;
      computedFn = null;
    });

    // proxy the event
    _listener = (e) => {
      actualFn.call(this, e);
    };

    // subscribe to the event
    get(this, service).on(event, this, _listener);
  };

  desc.value = computedFn;

  //eslint-disable-next-line
  addListener(target, 'init', null, key);

  return desc;
}, 'subscribe');
