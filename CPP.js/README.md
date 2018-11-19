CPP.js
==============
#### Coverage Path Planning for Robotics. ####

Introduction
------------

The aim of this project is to demonstrate the concept of Coverage Path Planning (CPP), which is the task of determining a path that passes over all points of an area of interest while avoiding obstacles.

It comes along with an [online demo](https://gab5ter.github.io/CPP.js/visual/) to show how the algorithms execute. (The speed is slowed down in the demo)----------

Currently there is 1 CPP algorithm:

*  `Wavefront Distance Transform`


Note that `dontCrossCorners` only makes sense when `allowDiagonal` is also used.

The predefined heuristics are `PF.Heuristic.manhattan`(default), `PF.Heuristic.chebyshev`, `PF.Heuristic.euclidean` and `PF.Heuristic.octile`.

Development
------------

Layout:

    .
    |-- lib          # browser distribution
    |-- src          # source code (algorithms only)
    |-- test         # test scripts
    |-- utils        # build scripts
	|-- benchmark    # benchmarks
    `-- visual       # visualization

Make sure you have `node.js` installed, then use `npm` to install the dependencies: 

    npm install -d 

The build system uses gulp, so make sure you have it installed:

    npm install -d -g gulp

To build the browser distribution:

    gulp compile

To run the tests
(algorithms only, not including the visualization) with
[mocha](http://mochajs.org/) and [should.js](https://github.com/visionmedia/should.js)
First install mocha:

    npm install -d -g mocha

Then run the tests:

    gulp test

To run the benchmarks:

    gulp bench

Or if you are feeling lazy, the default gulp task does everything(except running the benchmarks):

    gulp

Visualization Code License
-------

[MIT License](http://www.opensource.org/licenses/mit-license.php)

&copy; 2011-2012 Xueqiao Xu &lt;xueqiaoxu@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
