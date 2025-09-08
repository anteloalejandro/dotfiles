import Vars from "../Vars";
import { Gdk, Gtk } from "ags/gtk4";
import cairo from "gi://cairo?version=1.0";
import { Accessor } from "gnim";

export function CircularLevel(props: {
  percentage: number | Accessor<number>,
  label: string,
  color?: string,
  radius?: number,
  line_width?: number,
}) {

  const color = props.color ?? Vars.accent as string;
  const background = Vars["bg-alt"];
  const r = props.radius ?? 20;
  const line_width = props.line_width ?? 5;
  const R = r + line_width;
  const size = (r + line_width) * 2;

  const drawing = new Gtk.DrawingArea({
    cssName: "rounded-level",
    hexpand: false, vexpand: false,
  });

  const c = new Gdk.RGBA();

  return <overlay
    css_name="circular-level"

  >
    <drawingarea
      hexpand={false}
      vexpand={false}
      $={self => {
        self.set_draw_func((area, cr, _width, _height) => {
          const percentage = props.percentage instanceof Accessor
            ? props.percentage.get()
            : props.percentage;
          const min = 5/6 * Math.PI;
          const max = (2 + 1/6) * Math.PI; // +2RAD to simulate 360deg
          const range = [min, ((max-min) * (percentage) + min)];

          area.set_size_request(size, size);
          cr.scale(1,1);

          // clear for transparent background
          cr.setOperator(cairo.Operator.CLEAR);
          cr.paint();
          cr.setOperator(cairo.Operator.ADD); // normal mode

          cr.setLineWidth(line_width);

          // draw background
          c.parse(background);
          cr.arc(R, R, r, min, max);
          cr.setSourceRGBA(c.red, c.green, c.blue, 1);
          cr.stroke();

          // draw foreground
          c.parse(color);
          cr.arc(R, R, r, range[0], range[1]);
          cr.setSourceRGBA(c.red, c.green, c.blue, 1);
          cr.stroke();
        })

        props.percentage instanceof Accessor && props.percentage.subscribe(() => {
          self.queue_draw();
        })
      }}
    />
    <label
      label={props.percentage instanceof Accessor
        ? props.percentage.as(p => (p * 100).toFixed(1))
        : (props.percentage * 100).toFixed(1)}
      valign={Gtk.Align.CENTER}
      $type="overlay"
    />
    <label
      label={props.label}
      valign={Gtk.Align.END}
      $type="overlay"
    />
  </overlay>
}
