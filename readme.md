# Propin

A simple and lightweight inversion of control container for TypeScript apps.

## About
Propin is a lightweight (2KB) inversion of control (IoC) container for TypeScript apps.
Propin has been designed in a way that facilitates its integration with as many libraries and frameworks as possible.
Some frameworks/libraries take the control over the creation of instances. For example, React takes control over the creation of instances of a given Component.
Propin is an utility that allows you to inject into a property.

## Philosophy
Propin has been developed with 2 main goals:

1. Allow React and other developers to write code that adheres to the SOLID principles.

2. Add as little runtime overhead as possible.


## The Basics
Let’s take a look at the basic usage and APIs of Propin:

### Step 1: Declare dependencies using the injector

```ts
// file HttpService.ts

class HttpService {
  updateStatus(): void {
    // ...  
  }
}


// file index.ts

import { injector } from 'propin';
import { HttpService } from './HttpService';

injector.bind(HttpService).toInstance(new HttpService());
```

### Step 2: Resolve dependencies using the @inject
```ts
// file SomeComponent.tsx

import * as React from 'react';
import { inject } from 'propin';
import { HttpService } from './HttpService';

export class SomeComponent extends React.Component<SomeComponentProps> {
  @inject()
  httpService: HttpService;

  render(): JSX.Element {
    return (
      <div onClick={this.someAction}>
        // ....
      </div>
    );
  }

  someAction = (): void => {
    this.httpService.updateStatus();
  }
```

## License

License under the MIT License (MIT)
