# cpp-build

**Note: this is only a goal README. Most of things described here are not implemented yet.**

Table of contents:
- [cpp-build](#cpp-build)
	- [New to build systems?](#new-to-build-systems)
	- [What cpp-build is?](#what-cpp-build-is)
	- [Minimal example code](#minimal-example-code)
		- [Building minimal example](#building-minimal-example)
	- [A simple explaination](#a-simple-explaination)
	- [Supported build tools](#supported-build-tools)
	- [Some more examples](#some-more-examples)
		- [Library and a project linked to library](#library-and-a-project-linked-to-library)
		- [Load external code](#load-external-code)
		- [Install events](#install-events)

## New to build systems?

[Checkout the simple explaination.](#a-simple-explaination)

## What cpp-build is?

An easy to use and (not yet) powerful C++ build system.
It uses JavaScript executed by [Node.js](https://nodejs.org/) to provide
powerful scripting language, so you easily setup
your project build process.

**cpp-build** provides object oriented way to represent
your applications.

## Minimal example code

Create `Project.js` in main project folder:

```js
const cb = require("cpp-build");

let app = new cb.Application("ConsoleApp");
app.settings.append(
		{
			language: "C++17",
			includeDirectories: [ "include" ],
			files: [
					"include/PrintHello.hpp",
					"src/PrintHello.cpp",
					"src/Main.cpp"
				]
		}
	);

// Export application as a target to build.
module.exports = cb.export(app);
```

Following project structure assumed:

- include/
  - PrintHello.hpp *(declarations)*
- src/
  - PrintHello.cpp *(definitions)*
  - Main.cpp *(main function)*

### Building minimal example

1. Create "build" folder inside main project folder
2. Open terminal in "build" folder.
3. Execute following command:
   ```bash
   node cpp-build ../Project.js -g -b -i
   ```

- `-g` generates project files
- `-b` builds project
- `-i` installs it to default directory


## A simple explaination

What you can do with **cpp-build**:

1. Write your code
2. Tell **cpp-build** how your project is organised
3. Build project on any platform using any tool\*

\* - compiler or tool must be supported by
**cpp-build** and be able to build your code.

**cpp-build** is a cross-platform *meta build system*.
It **generates** build files used by specific compilers or tools.

## Supported build tools

- GNU Make (generates Makefiles)
- // TODO: expand it.

## Some more examples

Use those to quickly introduce yourself.

### Library and a project linked to library

```js
let workspace = new cb.TargetGroup("GameWorkspace");

let lib = new cb.StaticLibrary("GameEngine");
let app = new cb.Application("Game");
app.addDependency(lib);
workspace.targets = [ lib, app ];

// Setup "lib"...

// Setup "app"...

// App

module.exports = cb.export(workspace);
```

### Load external code

This requires the external code to export its settings using **cpp-build**.

```js
let testApp = new cb.Application("Test");

// Setup configuration options
testApp.configuration = {
		"gtest.root": ""
	};

// To link external libraries we have
// to wait until target is configured.
testApp.on("configured", (cfg) =>
		{
			// Load google test:
			let gtestWks = require(cfg["gtest.root"] + "/workspace.js");
			let gtestProj = gtestWks.targets.find( t => t.name == "gtest" );

			// Add google test as dependency:
			if (gtestProj) {
				testApp.addDependency(googleTestProject);
			}
			else
				throw 'google test library project not found.';
		}
	);
```

### Install events

```js
let wks = new cb.TargetGroup("MyWorkspace");
let app = new cb.Application("MyApplication");
let lib = new cb.StaticLibrary("MyLibrary");
wks.targets = [ app, lib ];

app.on("install", (ctx) =>
		{
			// Context contains:
			// - build output directory
			// - install base directory
			
			// Installs (recursively) all files from:
			//   build_output_dir/bin/
			// to:
			//   install_base_dir/bin/cfgName/
			cb.install(ctx, "bin/**", `bin/${ctx.cfgName}`);
		}
	);


lib.on("install", (ctx) =>
		{
			cb.install(ctx, "include/**", "include");
			cb.install(ctx, "lib/**", `lib/${ctx.cfgName}`);
			cb.install(ctx, "bin/**", `bin/${ctx.cfgName}`);
			cb.install(ctx, "docs/**", "docs");
		}
	);

module.exports = cb.export(wks);
```
