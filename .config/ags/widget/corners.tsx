import { Gdk, Gtk } from "ags/gtk4";
import cairo from "gi://cairo?version=1.0";

/** Orientation of the corner relative to the drawing area */
export enum CornerOrientation {
  TOP_LEFT = "top_left",
  TOP_RIGHT = "top_right",
  BOTTOM_LEFT = "bottom_left",
  BOTTOM_RIGHT = "bottom_right",
}

export type RoundedCornerProps = {
  radius: number;
  orientation: CornerOrientation;
  padding?: number;
}

/**
 * Draws a corner with a circle cuttof, like an inverted border-radius.
 * The total size is `radius + padding`.
 * */
export function RoundedCorner(props: RoundedCornerProps) {
  const r = props.radius; // corner radius
  const padding = props.padding ?? 0;
  let drawing = new Gtk.DrawingArea({
    cssName: "corner",
    hexpand: false, vexpand: false,
  });
  let c = new Gdk.RGBA()
  c.parse("#181818");

  drawing.set_draw_func((area, cr, _width, _height) => {
    area.set_size_request(r + padding, r + padding);
    cr.scale(1,1);

    // clear for transparent background
    cr.setOperator(cairo.Operator.CLEAR);
    cr.paint();
    cr.setOperator(cairo.Operator.ADD); // normal mode

    // NOTE: The line between the starting and ending angles form a quarter of a circumference.
    // Note that `y` axis is inverted, which affects any angle with a `y` component.

    
    switch (props.orientation) {
      case CornerOrientation.TOP_LEFT:
        cr.moveTo(0, r + padding);
        cr.lineTo(padding, r + padding);
        cr.arc(r + padding, r + padding, r, Math.PI, (3 * Math.PI)/2);
        cr.lineTo(r + padding, 0);
        cr.lineTo(0, 0);
        break;
      case CornerOrientation.TOP_RIGHT:
        cr.moveTo(0, 0);
        cr.lineTo(0, padding);
        cr.arc(0, r + padding, r, (3 * Math.PI)/2, Math.PI * 2);
        cr.lineTo(r + padding, r + padding);
        cr.lineTo(r + padding, 0);
        break;
      case CornerOrientation.BOTTOM_LEFT:
        cr.moveTo(r + padding, r + padding);
        cr.lineTo(r + padding, r);
        cr.arc(r + padding, 0, r, (3 * Math.PI)/2, Math.PI);
        cr.lineTo(0, 0);
        cr.lineTo(0, r + padding);
        break;
      case CornerOrientation.BOTTOM_RIGHT:
        cr.moveTo(r + padding, 0);
        cr.lineTo(r, 0);
        cr.arc(0, 0, r, Math.PI*2, Math.PI/2);
        cr.lineTo(0, r + padding);
        cr.lineTo(r + padding, r + padding);
        break;
    }
    cr.closePath();
    cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
    cr.fill();
  })

  return drawing;
}
