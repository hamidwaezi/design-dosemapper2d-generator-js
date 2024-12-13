class Bead {
  constructor(x, y, isHighResolution = false,) {
    this.x = x;
    this.y = y;
    this.isHighResolution = isHighResolution
  }
  connected = false;


  center(w, h) {
    return {
      x: this.x + w / 2,
      y: this.y + h / 2,
    };

  }

  distanceToBead(bead) {
    const a = bead.x - this.x;
    const b = bead.y - this.y;

    return Math.sqrt(a * a + b * b);
  }

  nearestInDirection(dir, beads) {
    var nearest = null;
    beads.forEach(b => {


      switch (dir) {
        case Directions.UP:
          if (b.x == this.x && b.y < this.y && (nearest == null || b.y > nearest.y)) nearest = b;
          break;
        case Directions.DOWN:
          if (b.x == this.x && b.y > this.y && (nearest == null || b.y < nearest.y)) nearest = b;
          break;
        case Directions.LEFT:
          if (b.y == this.y && b.x < this.x && (nearest == null || b.x > nearest.x)) nearest = b;
          break;
        case Directions.RIGHT:
          if (b.y == this.y && b.x > this.x && (nearest == null || b.x < nearest.x)) nearest = b;
          break;

        default:
          if ((nearest == null || this.distanceToBead(b) < this.distanceToBead(nearest))) nearest = b;

      }
    });

    return nearest;
  }
}

const Directions = Object.freeze({
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
});

