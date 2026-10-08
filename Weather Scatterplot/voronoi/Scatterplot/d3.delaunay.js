import {Delaunay} from "https://cdn.skypack.dev/d3-delaunay@6";

const points = [[0, 0], [0, 1], [1, 0], [1, 1]];
const delaunay = Delaunay.from(points);
const voronoi = delaunay.voronoi([0, 0, 960, 500]);