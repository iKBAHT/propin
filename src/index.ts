import 'reflect-metadata';

type ClassInstance = Object;

export interface Newable<T> {
  new (...args: any[]): T;
}

export interface BindCases<T> {
  toInstance: (instance: T) => void
}

const PROPERTY_TYPE_METADATA = 'design:type';
const INJECTION_INSTANCE_METADATA = typeof Symbol !== 'undefined' ? Symbol() : '__PROPIN__METADATA';
const INJECTION_INSTANCE_CLASSID = typeof Symbol !== 'undefined' ? Symbol() : '__PROPIN__CLASSID';

let kernel: Map<number, ClassInstance> = new Map();
let instanceId = 0;

export const injector = {
  bind: function <T extends Object>(classConstructor: Newable<T>): BindCases<T> {
    return {
      toInstance: (instance: T): void => {
        let classId: number;
        if (Object.prototype.hasOwnProperty.call(classConstructor, INJECTION_INSTANCE_CLASSID)) {
          classId = (classConstructor as any)[INJECTION_INSTANCE_CLASSID]
        } else {
          (classConstructor as any)[INJECTION_INSTANCE_CLASSID] = classId = ++instanceId;
        }
        const prevBind = kernel.get(classId);
        if (prevBind) {
          throw new Error(classConstructor + ' already has been binded to ' + prevBind);
        }
        kernel.set(classId, instance);
      }
    }
  },
  clean: function (): void {
    kernel.clear();
  }
};

export function inject() {
  return function (proto: any, key: string): void {
    const classConstructor: Newable<any> = Reflect.getMetadata(PROPERTY_TYPE_METADATA, proto, key);
    if (!classConstructor) {
      throw new Error('cannot find type of propperty ' + key + ' in ' + proto);
    }
    let resolve = (): ClassInstance => {
      const instance = kernel.get((classConstructor as any)[INJECTION_INSTANCE_CLASSID]);
      if (!instance) {
        throw new Error('cannot find binded instance for ' + classConstructor);
      }
      return instance;
    };

    defineProperty(proto, key, resolve);
  };
}

function defineProperty(
  proto: any,
  key: string,
  resolve: () => ClassInstance
) {

  function getter() {
    if (!Reflect.hasMetadata(INJECTION_INSTANCE_METADATA, this, key)) {
      Reflect.defineMetadata(INJECTION_INSTANCE_METADATA, resolve(), this, key);
    }
    return Reflect.getMetadata(INJECTION_INSTANCE_METADATA, this, key);
  }

  function setter(newInstance: ClassInstance) {
    Reflect.defineMetadata(INJECTION_INSTANCE_METADATA, newInstance, this, key);
  }

  Object.defineProperty(proto, key, {
    configurable: true,
    enumerable: true,
    get: getter,
    set: setter
  });
}
