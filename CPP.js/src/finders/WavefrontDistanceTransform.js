var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Wavefront Distance Transform. Based on http://robots.engin.umich.edu/~egalcera/papers/galceran_ras2013.pdf
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching 
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */
function WavefrontDistanceTransform(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    // When diagonal movement is allowed the manhattan heuristic is not
    //admissible. It should be octile instead
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
WavefrontDistanceTransform.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = [],
        distanceList = [],
        diagonalMovement = this.diagonalMovement,
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        abs = Math.abs,
        neighbors, neighbor, node, i, l, dx, dy, distance;

    /* 
    * Use wavefront distance transform
    */

    // push the end node into the queue
    distanceList.push(endNode);
    endNode.measured = true;
    endNode.distance = 0;

    // using Breadth-First, assign distance from end node
    while (distanceList.length) {
        node = distanceList.shift();

        // get neighbors to node
        neighbors = grid.getNeighbors(node, diagonalMovement);

        // iterate through all neighbors
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            // use heuristic to calculate distance from node to neighbor
            dx = abs(node.x - neighbor.x);
            dy = abs(node.y - neighbor.y);
            distance = node.distance + heuristic(dx, dy);

            // only update distance if one hasn't been calculated
            // or a shorter distance has been found
            if (!neighbor.measured || neighbor.distance > distance) {
                neighbor.distance = distance;
                distanceList.push(neighbor);
                neighbor.measured = true;
            }
        }
    }

    // for debugging, print the grid
    gridPrettyPrint(grid);

    // with the distances calculated,
    // we can proceed with the coverage algorithm

    // push the end node into the queue
    openList.push(startNode);
    while (openList.length) {
        node = openList.shift();
        node.opened = true;

        // get neighbors to node
        neighbors = grid.getNeighbors(node, diagonalMovement);

        // initialize max and min distances
        var maxDistance = -1;
        var maxIndex = null;
        var minDistance = Infinity;
        var minIndex = null;

        // iterate through all neighbors
        for (i = 0, l = neighbors.length; i < l; ++i) {
            // update max distance from unvisited nodes
            if (!neighbors[i].visited && neighbors[i].distance > maxDistance) {
                maxDistance = neighbors[i].distance;
                maxIndex = i;
            }
            // update min distance from all nodes
            if (neighbors[i].distance <= minDistance) {
                minDistance = neighbors[i].distance;
                minIndex = i;
            }
        }
        
        // if an unvisited node was found, we push it to the queue
        // if no unvisited nodes were found we push the min instead (move closer to end node)
        if (maxIndex !== null) {
            openList.push(neighbors[maxIndex])
        }
        else {
            if (node.distance !== 0) {
                openList.push(neighbors[minIndex])
            }
        }

        // this is to keep track of how many times a node has been visited
        // visited = once
        // visited2 = twice
        // visited3 = three times
        // The UI will update the node color depending on the number of times it was visited
        if (node.visited2) {
            node.visited3 = true;
        }
        else if (node.visited) {
            node.visited2 = true;
        }
        else {
            node.visited = true;
        }
    }

    return [];
};

// function to print grid with the distances (for debugging)
function gridPrettyPrint (grid) {
    for ( var i = 0; i < grid.nodes.length; i++ ) {
        var text = "";
        for ( var j = 0; j < grid.nodes[i].length; j++ ) {
            text = grid.nodes[i][j].distance !== undefined ? text + grid.nodes[i][j].distance + "\t" : text + "###" + "\t";
        }
        console.log(text);
    }
}

module.exports = WavefrontDistanceTransform;