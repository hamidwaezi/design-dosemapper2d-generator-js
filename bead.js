class Bead {
    constructor(x, y,isHighResolution=false,) {
      this.x = x;
      this.y = y;
      this.isHighResolution=isHighResolution
    }

    center(w,h) {
      return {
        x:this.x+w/2,
        y:this.y+h/2,
      };
    }
  }