# Solar System

Resolve front-end development of automation tools, dojo build, Independent development, Dependency management, Version management.

### Installation

Solar requires [Node.js](https://nodejs.org/) v4+ to run.

You need Solar installed globally:

```sh
$ npm solar-cli -g
```

### Apis

-- init package
> Init your package. It will generate 'package.json' like [npm init]

[npm init]: <https://docs.npmjs.com/cli/init>
#
```sh
$ solar init -n 'packageName' -d 'description' -v 'version'
```

-- install packages
> Install packages like [npm install].

[npm install]: <https://docs.npmjs.com/cli/install>
#
```sh
$ solar install -n 'packageName' [--save]
```
```sh
$ solar install -n 'packageName1' -n 'packageName2' [--save]
```

-- uninstall packages
> Uninstall packages like [npm uninstall].

[npm uninstall]:<https://docs.npmjs.com/cli/uninstall>
#
```sh
$ solar uninstall -n 'packageName' [--save]
```
```sh
$ solar uninstall -n 'packageName1' -n 'packageName2' [--save]
```

-- generate dojo profile
> Auto generate profile.js base on source code.
> it will exclude packages: system, comlib, bcomlib, app.
#
```sh
$ solar profile -n 'packageName'
```

-- dojo build
> Run dojo build base on profile.js.
#
```sh
$ solar build -n 'packageName'
```

-- add package
> Mapping source to the entire project base on the arguments.
#
```sh
$ solar add -n 'packageName' -l 'location' [-i 'identityName' -p 'modulePath']
```

-- remove package
> Remove(Restore) the mapping.
#
```sh
$ solar remove -n 'packageName' -i 'identityName'
```

-- publish package
> Publish the package to the NPM server.
#
```sh
$ solar publish -n 'packageName'
```

-- init development environment
> Build debug.html, dojoConfig.js, packagesscript.js to start the whole project locally.
#
```sh
$ solar start
```

### Tech

Solar uses a number of open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Grunt] - The JavaScript Task Runner
* [liftoff] - Launch your command line tool with ease.
* [minimist] - parse argument options
* [lodash] - Lodash modular utilities.

   [node.js]: <http://nodejs.org>
   [Grunt]: <http://gruntjs.com/>
   [liftoff]:<https://www.npmjs.com/package/liftoff>
   [minimist]:<https://www.npmjs.com/package/minimist>
   [lodash]:<https://lodash.com/>

And of course Solar itself is open source with a [public repository]
 on GitHub.
 
[public repository]:<https://github.com/qudi15/solar>

### Todos

 - Issue fix.
 - Unit Tests plugin.
 - Style Check plugin.
 - ..

License
----

MIT
